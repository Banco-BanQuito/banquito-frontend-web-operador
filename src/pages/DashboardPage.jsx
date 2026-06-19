import { Link } from 'react-router-dom';
import { Users, Repeat, Building2, UserPlus, ArrowRight, ShieldCheck, Globe, Database } from 'lucide-react';

const ICON_COLOR = '#4B5563';

const modules = [
  {
    title: 'Buscar Clientes',
    description: 'Búsqueda de clientes por identificación',
    path: '/clientes',
    Icon: Users,
  },
  {
    title: 'Nueva Transacción',
    description: 'Realizar débito, crédito o transferencia',
    path: '/transacciones/nueva',
    Icon: Repeat,
  },
  {
    title: 'Gestionar Sucursales',
    description: 'Ver y crear sucursales',
    path: '/sucursales',
    Icon: Building2,
  },
  {
    title: 'Nueva Cuenta',
    description: 'Crear nueva cuenta de cliente',
    path: '/cuentas/nueva',
    Icon: UserPlus,
  },
];

export function DashboardPage() {
  return (
    <div className="space-y-8">
      <div className="page-header">
        <h1 className="page-title">
          Panel de operador
        </h1>
        <p className="page-description">
          Panel de control de la Intranet Banquito
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-[#0052a3] to-[#001f3f] p-6 rounded-2xl shadow-lg text-white">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-white/10 rounded-lg">
              <ShieldCheck size={24} />
            </div>
            <span className="text-xs font-bold bg-green-500/20 text-green-300 px-2 py-1 rounded-full border border-green-500/30">
              CONECTADO
            </span>
          </div>
          <h3 className="text-sm font-medium opacity-80">Estado del Sistema</h3>
          <p className="text-2xl font-bold mt-1">Nube Activa</p>
          <div className="mt-4 flex items-center gap-2 text-xs opacity-60">
            <Database size={12} />
            <span>PostgreSQL & MySQL Synced</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
              <Building2 size={24} />
            </div>
          </div>
          <h3 className="text-sm font-medium text-gray-500">Sucursal Matriz</h3>
          <p className="text-2xl font-bold text-gray-900 mt-1">BanQuito - Quito</p>
          <p className="text-xs text-blue-600 font-semibold mt-4">Pichincha, EC</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
              <Users size={24} />
            </div>
          </div>
          <h3 className="text-sm font-medium text-gray-500">Perfil Operativo</h3>
          <p className="text-2xl font-bold text-gray-900 mt-1">Gestión Staff</p>
          <p className="text-xs text-purple-600 font-semibold mt-4">Nivel 2 Autorizado</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-orange-50 rounded-lg text-orange-600">
              <Globe size={24} />
            </div>
          </div>
          <h3 className="text-sm font-medium text-gray-500">Infraestructura</h3>
          <p className="text-2xl font-bold text-gray-900 mt-1">Multi-Cloud</p>
          <p className="text-xs text-orange-600 font-semibold mt-4">136.112.87.173</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map(({ path, title, description, Icon }) => (
          <div key={path} className="module-card">
            <div className="module-card-icon">
              <Icon size={22} strokeWidth={1.5} color={ICON_COLOR} />
            </div>
            <div className="flex-1">
              <h3 className="module-card-title">{title}</h3>
              <p className="module-card-description">{description}</p>
            </div>
            <Link
              to={path}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#1E40AF] hover:text-[#001f3f] transition-colors mt-auto"
            >
              Acceder
              <ArrowRight size={14} strokeWidth={2} />
            </Link>
          </div>
        ))}
      </div>

      <div className="dashboard-card">
        <h2 className="text-xl font-bold text-gray-900 mb-6" style={{ color: '#001f3f' }}>
          Información del Usuario
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="stat-box">
            <p className="stat-box-label">Acceso</p>
            <p className="stat-box-value">Directo</p>
          </div>
          <div className="stat-box">
            <p className="stat-box-label">Rol</p>
            <p className="stat-box-value">OPERADOR</p>
          </div>
          <div className="stat-box">
            <p className="stat-box-label">Estado</p>
            <p className="stat-box-value" style={{ color: '#10b981' }}>
              ACTIVO
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}

export default DashboardPage;
