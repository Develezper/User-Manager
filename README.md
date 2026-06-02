# User Manager

Aplicacion construida con Next.js App Router para autenticacion y administracion de usuarios con MongoDB, Hero UI y custom hooks.

## Variables de entorno

Copia `.env.example` a `.env` y completa tus credenciales:

```env
MONGODB_URI=mongodb+srv://...
MONGODB_DB=user-manager-public
GMAIL_USER=tu_correo@gmail.com
GMAIL_APP_PASSWORD=tu_app_password_de_16_caracteres
```

`GMAIL_APP_PASSWORD` debe ser una App Password de Gmail para SMTP, no una API key de Google/Gmail.

## Rutas principales

- `/login`: acceso de usuarios registrados
- `/dashboard`: vista protegida para usuarios autenticados
- `/admin/users`: administracion protegida para cuentas con rol `admin`

## Scripts

```bash
bun install
bun run dev
```

## Health Check

Con la app corriendo puedes validar Mongo Atlas en:

```bash
curl http://localhost:3000/api/health/db
```

En `production` el endpoint no expone el `host` del cluster ni el detalle del error.

## Funcionalidades

- Login con validacion contra MongoDB
- Persistencia de sesion en `localStorage`
- Dashboard protegido
- Vista admin protegida por rol
- CRUD de usuarios con capa de servicios
- Custom hooks `useAuthSession` y `useUsers`
- Componentes de HeroUI en login, dashboard, modales, formularios y tarjetas
- Passwords hasheadas con `bcryptjs`
- Email de bienvenida con `nodemailer`

## Despliegue

Configura en Vercel estas variables:

- `MONGODB_URI`
- `MONGODB_DB`
- `GMAIL_USER`
- `GMAIL_APP_PASSWORD`
