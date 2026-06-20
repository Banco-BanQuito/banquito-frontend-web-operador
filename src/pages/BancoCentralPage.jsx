import { useState, useEffect } from 'react';
import { getClearingFiles, getClearingFileDownloadUrl, consolidateClearingFiles } from '../api/clearingApi';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const fileTypeLabels = {
  CICLO: 'Ciclo (30s)',
  LOTE: 'Lote',
  CONSOLIDADO: 'Consolidado diario',
};

export const BancoCentralPage = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [consolidating, setConsolidating] = useState(false);

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    setLoading(true);
    try {
      const response = await getClearingFiles();
      setFiles(response.data || []);
      setError('');
    } catch (err) {
      setError(
        err.response
          ? err.response?.data?.message || 'No se pudieron cargar los archivos.'
          : 'No se puede conectar al clearinghouse-adapter. Verifique que esté encendido.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleConsolidate = async () => {
    setConsolidating(true);
    setNotice('');
    setError('');
    try {
      await consolidateClearingFiles();
      setNotice('Archivo consolidado del día generado correctamente.');
      await fetchFiles();
    } catch (err) {
      setError(
        err.response
          ? err.response?.data || err.response?.data?.message || 'No se pudo generar el consolidado.'
          : 'No se puede conectar al clearinghouse-adapter. Verifique que esté encendido.'
      );
    } finally {
      setConsolidating(false);
    }
  };

  if (loading) {
    return <LoadingSpinner fullPage />;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Archivos para el Banco Central</h1>
          <p className="text-gray-500 text-sm mt-1">
            Ciclos individuales (cada 30s, para seguimiento operativo) y el archivo consolidado diario
            que agrupa todos los movimientos interbancarios de una hora a otra, tal como se envía al Banco Central.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleConsolidate}
            disabled={consolidating}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-indigo-300"
          >
            {consolidating ? 'Generando...' : 'Generar consolidado de hoy'}
          </button>
          <button
            onClick={fetchFiles}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Actualizar
          </button>
        </div>
      </div>

      {notice && (
        <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg p-4 mb-4">
          {notice}
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 mb-4">
          {error}
        </div>
      )}

      <div className="bg-white p-6 rounded-lg shadow">
        {files.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="p-3">Tipo</th>
                  <th className="p-3">Generado</th>
                  <th className="p-3">Registros OFF-US</th>
                  <th className="p-3">Monto total</th>
                  <th className="p-3">Estado</th>
                  <th className="p-3">Descargar</th>
                </tr>
              </thead>
              <tbody>
                {files.map((file) => (
                  <tr key={file.id} className={`border-b hover:bg-gray-50 ${file.fileType === 'CONSOLIDADO' ? 'bg-indigo-50' : ''}`}>
                    <td className="p-3">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${
                        file.fileType === 'CONSOLIDADO' ? 'bg-indigo-100 text-indigo-800' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {fileTypeLabels[file.fileType] || file.fileType || 'Ciclo (30s)'}
                      </span>
                    </td>
                    <td className="p-3">{file.generatedAt ? new Date(file.generatedAt).toLocaleString('es-EC') : '—'}</td>
                    <td className="p-3 font-semibold">{file.offUsRecords}</td>
                    <td className="p-3">${Number(file.totalAmount || 0).toFixed(2)}</td>
                    <td className="p-3">
                      <span className="inline-block px-2 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                        {file.status}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="flex gap-3">
                        <a className="text-blue-600 hover:underline" href={getClearingFileDownloadUrl(file.id, 'csv')}>CSV</a>
                        <a className="text-blue-600 hover:underline" href={getClearingFileDownloadUrl(file.id, 'txt')}>TXT</a>
                        <a className="text-blue-600 hover:underline" href={getClearingFileDownloadUrl(file.id, 'pdf')}>PDF</a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-600 py-8 text-center">
            Aún no se ha generado ningún archivo. Los ciclos se generan automáticamente cuando hay transferencias
            interbancarias pendientes; el consolidado diario se genera automáticamente a las 20:00 o puedes generarlo manualmente arriba.
          </p>
        )}
      </div>
    </div>
  );
};

export default BancoCentralPage;
