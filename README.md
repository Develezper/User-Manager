# User Manager

Aplicacion construida con Next.js App Router para autenticacion y administracion de usuarios con MongoDB, Hero UI y custom hooks.

## Variables de entorno

Crea un archivo `.env.local` con:

```env
MONGODB_URI=mongodb+srv://...
GMAIL_USER=tu_correo@gmail.com
GMAIL_APP_PASSWORD=tu_app_password
```

## Scripts

```bash
npm install
npm run dev
```

## Funcionalidades

- Login con validacion contra MongoDB
- Persistencia de sesion en `localStorage`
- Dashboard protegido
- Vista admin protegida por rol
- CRUD de usuarios con capa de servicios
- Passwords hasheadas con `bcryptjs`
- Email de bienvenida con `nodemailer`
- Componentes Hero UI
- Custom hooks `useAuthSession` y `useUsers`
