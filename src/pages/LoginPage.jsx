import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export function LoginPage() {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth() || {};

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = 'BanQuito Operador';

    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!username.trim()) {
      setError('Ingrese su usuario.');
      return;
    }

    if (!password) {
      setError('Ingrese su contraseña.');
      return;
    }

    setLoading(true);

    try {
      if (login) {
        await login(username.trim(), password);
      }
      navigate('/dashboard', { replace: true });
    } catch (err) {
      if (import.meta.env.DEV) {
        console.error('Error en login:', err.response?.status, err.response?.data);
      }

      if (!err.response) {
        setError('No se puede conectar al servidor.');
      } else if (err.response?.status === 401 || err.response?.status === 403) {
        setError('Usuario o contraseña incorrectos.');
      } else {
        setError(err.response?.data?.message || 'Error al iniciar sesión.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50">
      <div className="hidden lg:flex lg:w-1/2 bg-[#1E40AF] items-center justify-center p-12">
        <div className="max-w-lg text-white">
          <h1 className="text-5xl font-bold mb-6">BanQuito Operador</h1>
          <p className="text-xl text-blue-100 leading-relaxed">
            Plataforma interna para la gestión de clientes y cuentas bancarias.
            Gestione la información de manera segura y eficiente.
          </p>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="mb-10">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">Bienvenido</h2>
            <p className="text-slate-600">Ingrese sus credenciales para acceder al sistema.</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Usuario</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#1E40AF] focus:border-transparent transition-all"
                placeholder="nombre.apellido"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#1E40AF] focus:border-transparent transition-all"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-[#1E40AF] hover:bg-[#1e3a8a] text-white font-bold rounded-lg shadow-lg shadow-blue-200 transition-all disabled:opacity-50"
            >
              {loading ? 'Verificando...' : 'Iniciar Sesión'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
