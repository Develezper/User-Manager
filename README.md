# User Manager

Application built with the Next.js App Router for user authentication and management using MongoDB, Hero UI, and custom hooks.

## Environment Variables

Copy `.env.example` to `.env` and fill in your credentials:

```env
MONGODB_URI=mongodb+srv://...
MONGODB_DB=user-manager-public
SESSION_SECRET=replace_with_a_long_random_secret
GMAIL_USER=your_email@gmail.com
GMAIL_APP_PASSWORD=your_16_character_app_password
```

`GMAIL_APP_PASSWORD` must be a Gmail App Password for SMTP, not a Google/Gmail API key.
`SESSION_SECRET` is used to sign the secure session cookie that protects the API routes.

## Quick Start

```bash
bun install
bun run dev
```

The app runs at `http://localhost:3000`.
Production site: https://user-manager-opal.vercel.app/login

## Main Routes

- `/login`: access for registered users
- `/register`: public form for new users to create a normal account
- `/dashboard`: protected view for authenticated users
- `/admin/users`: protected management panel for accounts with the `admin` role

## Admin Panel Access

```bash
http://localhost:3000/admin/users
```

To access the admin panel, you must first sign in at:

```bash
http://localhost:3000/login
```

Important: the panel only allows access to users with the `admin` role.

### Access Credentials

Run the seed script to create (or reset) the admin account:

```bash
bun run seed:admin
```

Then sign in at `/login` with:

| Field    | Value              |
|----------|--------------------|
| Email    | `admin@example.com`|
| Password | `Admin123!`        |

After signing in through `/login`, you can open `/admin/users` from the dashboard.

## Scripts

```bash
bun install
bun run dev
```

## Health Check

With the app running, you can validate the Mongo Atlas connection at:

```bash
curl http://localhost:3000/api/health/db
```

In `production`, the endpoint does not expose the cluster `host` or detailed error information.

## Features

- Public registration creates users with the default `user` role
- Login validated against MongoDB
- Session persistence in `localStorage`
- Protected dashboard
- Role-protected admin view
- User CRUD with a service layer
- Custom hooks: `useAuthSession` and `useUsers`
- HeroUI components in the login, dashboard, modals, forms, and cards
- Password hashing with `bcryptjs`
- Welcome email delivery with `nodemailer`

## Deployment

Configure these variables in Vercel:

- `MONGODB_URI`
- `MONGODB_DB`
- `SESSION_SECRET`
- `GMAIL_USER`
- `GMAIL_APP_PASSWORD`
