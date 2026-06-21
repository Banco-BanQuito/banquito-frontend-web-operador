import { useState, useEffect } from 'react';
import { Calendar, Trash2, Plus, AlertCircle } from 'lucide-react';
import { getAllHolidays } from '../api/holidayApi';

export const HolidayManagement = () => {
  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchHolidays();
  }, []);

  const fetchHolidays = async () => {
    try {
      setLoading(true);
      const response = await getAllHolidays();
      setHolidays(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching holidays:', err);
      setError('No se pudieron cargar los feriados. Verifique la conexión con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  let holidaysContent;
  if (loading) {
    holidaysContent = (
      <div className="p-12 flex justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700"></div>
      </div>
    );
  } else if (holidays.length === 0) {
    holidaysContent = (
      <div className="p-12 text-center">
        <Calendar size={48} className="mx-auto text-slate-300 mb-4" />
        <p className="text-slate-500">No hay feriados registrados en la nube (MySQL).</p>
      </div>
    );
  } else {
    holidaysContent = (
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-200">
            <th className="px-6 py-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Fecha</th>
            <th className="px-6 py-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Nombre</th>
            <th className="px-6 py-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Tipo</th>
            <th className="px-6 py-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {holidays.map((holiday) => (
            <tr key={holiday.id} className="hover:bg-slate-50 transition-colors">
              <td className="px-6 py-4 text-sm text-slate-800 font-medium">
                {new Date(holiday.holidayDate).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 text-sm text-slate-600">{holiday.name}</td>
              <td className="px-6 py-4">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-700">
                  NACIONAL
                </span>
              </td>
              <td className="px-6 py-4">
                <button className="text-red-500 hover:text-red-700 transition-colors">
                  <Trash2 size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Gestión de Feriados</h1>
          <p className="text-sm text-slate-500 mt-0.5">Administre los días no laborables del sistema bancario</p>
        </div>
        <button className="bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800 font-medium text-sm transition-colors flex items-center gap-2">
          <Plus size={18} />
          Nuevo Feriado
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md flex items-start gap-3">
          <AlertCircle className="text-red-500 mt-0.5" size={18} />
          <div>
            <p className="text-sm text-red-700 font-medium">{error}</p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-md border border-slate-100 overflow-hidden">
        {holidaysContent}
      </div>
    </div>
  );
};

export default HolidayManagement;
