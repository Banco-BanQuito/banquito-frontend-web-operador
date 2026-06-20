import { useState, useEffect } from 'react';
import { getClearingFiles, getClearingFileDownloadUrl } from '../api/clearingApi';
import LoadingSpinner from '../components/ui/LoadingSpinner';

export const BancoCentralPage = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

  if (loading) {
    return <LoadingSpinner fullPage />;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Archivos para el Banco Central</h1>
          <p className="text-gray-500 text-sm mt-1">
            Archivos generados por ciclo para liquidar las transferencias interbancarias (OFF-US) vía Banco Central.
          </p>
        </div>
        <button
          onClick={fetchFiles}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Actualizar
        </button>
      </div>

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
                  <th className="p-3">Ciclo generado</th>
                  <th className="p-3">Registros OFF-US</th>
                  <th className="p-3">Monto total</th>
                  <th className="p-3">Estado</th>
                  <th className="p-3">Descargar</th>
                </tr>
              </thead>
              <tbody>
                {files.map((file) => (
                  <tr key={file.id} className="border-b hover:bg-gray-50">
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
            Aún no se ha generado ningún archivo. Se genera automáticamente cada vez que hay transferencias interbancarias pendientes.
          </p>
        )}
      </div>
    </div>
  );
};

export default BancoCentralPage;
