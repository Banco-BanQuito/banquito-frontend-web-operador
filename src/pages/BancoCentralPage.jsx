import { useState, useEffect, useMemo } from 'react';
import { getClearingFiles, getClearingFileDownloadUrl, consolidateClearingFiles } from '../api/clearingApi';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const todayKey = () => new Date().toISOString().slice(0, 10);

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

  const cycleFiles = useMemo(
    () => files.filter((f) => f.fileType !== 'CONSOLIDADO'),
    [files]
  );

  // Si quedaron duplicados de pruebas anteriores, solo mostramos el mas reciente de cada dia.
  const consolidatedFiles = useMemo(() => {
    const byDay = new Map();
    for (const file of files) {
      if (file.fileType !== 'CONSOLIDADO') continue;
      const day = (file.periodFrom || file.generatedAt || '').slice(0, 10);
      const current = byDay.get(day);
      if (!current || new Date(file.generatedAt) > new Date(current.generatedAt)) {
        byDay.set(day, file);
      }
    }
    return [...byDay.values()].sort((a, b) => new Date(b.generatedAt) - new Date(a.generatedAt));
  }, [files]);

  const todayConsolidated = consolidatedFiles.find((f) => (f.periodFrom || '').slice(0, 10) === todayKey());

  let consolidateButtonLabel = 'Generar consolidado de hoy';
  if (consolidating) {
    consolidateButtonLabel = 'Generando...';
  } else if (todayConsolidated) {
    consolidateButtonLabel = 'Actualizar consolidado de hoy';
  }

  const handleConsolidate = async () => {
    setConsolidating(true);
    setNotice('');
    setError('');
    try {
      await consolidateClearingFiles();
      setNotice(todayConsolidated ? 'Consolidado del día actualizado correctamente.' : 'Archivo consolidado del día generado correctamente.');
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
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Archivos para el Banco Central</h1>
        <p className="text-gray-500 text-sm mt-1">
          El consolidado diario es el archivo real que se envía al Banco Central (todos los movimientos de un día,
          de una hora a otra). Los ciclos individuales son solo para seguimiento operativo interno cada 30s.
        </p>
      </div>

      {notice && (
        <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg p-4">
          {notice}
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4">
          {error}
        </div>
      )}

      {/* ── Consolidado diario ── */}
      <section>
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-semibold text-indigo-900">Consolidado diario (archivo real al Banco Central)</h2>
          <button
            onClick={handleConsolidate}
            disabled={consolidating}
            title={todayConsolidated ? 'Vuelve a generarlo para incluir los movimientos mas recientes del dia' : ''}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-indigo-300"
          >
            {consolidateButtonLabel}
          </button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border-2 border-indigo-100">
          {consolidatedFiles.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-indigo-50 border-b">
                  <tr>
                    <th className="p-3">Periodo</th>
                    <th className="p-3">Generado</th>
                    <th className="p-3">Movimientos</th>
                    <th className="p-3">Monto total</th>
                    <th className="p-3">Descargar</th>
                  </tr>
                </thead>
                <tbody>
                  {consolidatedFiles.map((file) => (
                    <tr key={file.id} className="border-b hover:bg-indigo-50">
                      <td className="p-3 font-semibold">{(file.periodFrom || '').slice(0, 10) || '—'}</td>
                      <td className="p-3">{file.generatedAt ? new Date(file.generatedAt).toLocaleString('es-EC') : '—'}</td>
                      <td className="p-3">{file.offUsRecords}</td>
                      <td className="p-3">${Number(file.totalAmount || 0).toFixed(2)}</td>
                      <td className="p-3">
                        <div className="flex gap-3">
                          <a className="text-indigo-600 hover:underline" href={getClearingFileDownloadUrl(file.id, 'csv')}>CSV</a>
                          <a className="text-indigo-600 hover:underline" href={getClearingFileDownloadUrl(file.id, 'txt')}>TXT</a>
                          <a className="text-indigo-600 hover:underline" href={getClearingFileDownloadUrl(file.id, 'pdf')}>PDF</a>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-600 py-6 text-center">
              Aún no se ha generado el consolidado de hoy. Se genera automáticamente a las 20:00, o puedes generarlo
              manualmente con el botón de arriba (solo se permite uno por día).
            </p>
          )}
        </div>
      </section>

      {/* ── Ciclos individuales ── */}
      <section>
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-semibold text-gray-700">Ciclos individuales (seguimiento operativo)</h2>
          <button
            onClick={fetchFiles}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            Actualizar
          </button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          {cycleFiles.length > 0 ? (
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
                  {cycleFiles.map((file) => (
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
            <p className="text-gray-600 py-6 text-center">
              Aún no hay ciclos generados. Se generan automáticamente cada 30s cuando hay transferencias interbancarias pendientes.
            </p>
          )}
        </div>
      </section>
    </div>
  );
};

export default BancoCentralPage;
