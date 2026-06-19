# banquito-web-operador-frontend

Micro frontend para el portal de operador de Banco BanQuito. Permite consultar clientes, revisar informacion operativa y navegar hacia flujos de clientes, cuentas, transacciones, sucursales y calendario usando los microservicios reales del ecosistema BanQuito.

Este frontend no contiene datos quemados, usuarios locales, contrasenas, respuestas mock ni exitos simulados. Si un endpoint backend no existe o falla, el sistema muestra el error real recibido.

## Funcionamiento

La aplicacion se abre directamente en el panel de operador, sin pantalla de login. Desde ahi el usuario puede:

- Buscar clientes por identificacion.
- Ver el detalle de un cliente.
- Consultar cuentas asociadas a un cliente.
- Navegar al formulario de nuevo cliente.
- Navegar al formulario de nueva cuenta.
- Consultar sucursales.
- Consultar calendario/feriados.
- Ejecutar o consultar operaciones cuando el backend correspondiente las exponga.

El frontend se comunica con los microservicios por HTTP usando rutas `/api/v2`. En desarrollo puede apuntar a URLs configuradas con variables de entorno. En Docker, Nginx sirve la aplicacion y actua como proxy interno hacia los servicios `party-service` y `account-core-service`.

## Requisitos

- Node.js 20 o superior.
- npm.
- Docker opcional para despliegue en contenedor.
- Microservicios backend levantados:
  - `party-service`
  - `account-core-service`

Para Docker, el contenedor debe estar conectado a la misma red que los microservicios backend.

## Instalacion Local

```bash
npm install
cp .env.example .env
npm run dev
```

URL local:

```text
http://localhost:3004
```

## Variables De Entorno

Archivo base: `.env.example`

```env
VITE_CORE_API_BASE_URL=http://localhost:8000/api/v2
VITE_ACCOUNT_CORE_BASE_URL=http://localhost:8081/api/v2
VITE_API_TIMEOUT=10000
VITE_APP_NAME=BanQuito Operador
VITE_ENVIRONMENT=development
VITE_DEBUG_MODE=false
VITE_ENABLE_ANALYTICS=false
```

### Variables

| Variable | Descripcion | Valor por defecto |
| --- | --- | --- |
| `VITE_CORE_API_BASE_URL` | Base URL para endpoints Core expuestos por gateway o proxy. | `http://localhost:8000/api/v2` |
| `VITE_ACCOUNT_CORE_BASE_URL` | Base URL directa para `account-core-service` cuando se requiere. | `http://localhost:8081/api/v2` |
| `VITE_API_TIMEOUT` | Timeout HTTP en milisegundos. | `10000` |
| `VITE_APP_NAME` | Nombre visible/configurable de la app. | `BanQuito Operador` |
| `VITE_ENVIRONMENT` | Ambiente de ejecucion. | `development` |
| `VITE_DEBUG_MODE` | Activa logs de depuracion si aplica. | `false` |
| `VITE_ENABLE_ANALYTICS` | Reservado para analitica. | `false` |

## Despliegue Con Docker

Construir imagen:

```bash
docker build -t banquito-web-operador-frontend:local .
```

Levantar contenedor conectado a la red de BanQuito:

```bash
docker run --rm \
  --name web-operador-frontend \
  --network banquito-core-net \
  -p 3004:80 \
  banquito-web-operador-frontend:local
```

Abrir:

```text
http://localhost:3004
```

## Proxy Nginx En Docker

En Docker, el build usa rutas relativas `/api/v2`. Nginx enruta internamente:

| Ruta frontend | Microservicio destino |
| --- | --- |
| `/api/v2/customers` | `party-service:8083` |
| `/api/v2/customers/*` | `party-service:8083` |
| `/api/v2/customer-subtypes` | `party-service:8083` |
| `/api/v2/branches` | `party-service:8083` |
| `/api/v2/accounts` | `account-core-service:8081` |
| `/api/v2/accounts/*` | `account-core-service:8081` |
| `/api/v2/account-subtypes` | `account-core-service:8081` |
| `/api/v2/calendar/*` | `account-core-service:8081` |

## Endpoints Consumidos

### Party Service

| Funcion | Metodo | Endpoint | Estado esperado |
| --- | --- | --- | --- |
| Buscar cliente por ID o identificacion | `GET` | `/api/v2/customers/{id}` | Disponible |
| Buscar cliente por numero de cuenta | `GET` | `/api/v2/customers/by-account/{accountNumber}` | Disponible |
| Listar subtipos de cliente | `GET` | `/api/v2/customer-subtypes` | Disponible |
| Listar sucursales | `GET` | `/api/v2/branches` | Disponible |
| Obtener sucursal | `GET` | `/api/v2/branches/{code}` | Segun backend |
| Crear cliente | `POST` | `/api/v2/customers` | Requiere backend |
| Actualizar cliente | `PATCH` | `/api/v2/customers/{id}` | Requiere backend |
| Cambiar estado de cliente | `PATCH` | `/api/v2/customers/{id}/status/{status}` | Requiere backend |

### Account Core Service

| Funcion | Metodo | Endpoint | Estado esperado |
| --- | --- | --- | --- |
| Listar cuentas por cliente | `GET` | `/api/v2/accounts/customer/{customerId}` | Disponible |
| Obtener cuenta favorita | `GET` | `/api/v2/accounts/customer/{customerId}/favorite` | Disponible |
| Consultar saldo | `GET` | `/api/v2/accounts/{accountId}/balance` | Disponible |
| Historial de transacciones | `GET` | `/api/v2/accounts/{accountId}/transactions` | Disponible |
| Deposito por ventanilla | `POST` | `/api/v2/accounts/teller/deposit` | Disponible |
| Retiro por ventanilla | `POST` | `/api/v2/accounts/teller/withdrawal` | Disponible |
| Transferencia interna | `POST` | `/api/v2/accounts/transfer/p2p` | Disponible |
| Health de cuentas | `GET` | `/api/v2/accounts/health` | Disponible |
| Validar feriado/calendario | `GET` | `/api/v2/calendar/holidays/check?date=YYYY-MM-DD` | Disponible |
| Listar subtipos de cuenta | `GET` | `/api/v2/account-subtypes` | Requiere backend |
| Crear cuenta | `POST` | `/api/v2/accounts` | Requiere backend |
| Activar cuenta | `PATCH` | `/api/v2/accounts/{accountNumber}/activate` | Requiere backend |
| Inactivar cuenta | `PATCH` | `/api/v2/accounts/{accountNumber}/inactivate` | Requiere backend |
| Bloquear cuenta | `PATCH` | `/api/v2/accounts/{accountNumber}/block` | Requiere backend |
| Suspender cuenta | `PATCH` | `/api/v2/accounts/{accountNumber}/suspend` | Requiere backend |

## Estructura Principal

```text
src/
  api/                Clientes HTTP por dominio
  components/         Layout, UI y componentes reutilizables
  config/             Variables y mapa de endpoints
  context/            Contexto ligero del portal operador
  helpers/            Validaciones y formateadores
  pages/
    accounts/         Vistas de cuentas
    customers/        Vistas de clientes
    transactions/     Vistas de transacciones
```

## Scripts

| Comando | Descripcion |
| --- | --- |
| `npm run dev` | Levanta Vite en modo desarrollo. |
| `npm run build` | Compila la aplicacion para produccion. |
| `npm run preview` | Sirve el build localmente para validacion. |
| `npm run lint` | Ejecuta ESLint. |

## Validacion Rapida

Con backend levantado:

```bash
npm run build
curl http://localhost:3004/api/v2/customer-subtypes
```

Respuesta esperada para subtipos:

```json
[
  {
    "id": 1,
    "customerType": "NATURAL",
    "name": "Persona Natural",
    "status": "ACTIVO"
  }
]
```

Los valores exactos dependen de la base de datos conectada al backend.

## Notas Importantes

- El frontend no escribe directamente en base de datos.
- El frontend no contiene datos de clientes precargados.
- El frontend no crea usuarios ni credenciales.
- La creacion de clientes y cuentas depende de endpoints reales en `party-service` y `account-core-service`.
- Para despliegues fuera de Docker, configurar correctamente las variables `VITE_*`.
