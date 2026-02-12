# Eshkon Assignment - CMS with RBAC

A modern Content Management System (CMS) prototype built with Next.js 15, featuring Role-Based Access Control (RBAC), Prisma ORM with PostgreSQL, and NextAuth.js for authentication.

## 🚀 Tech Stack

- **Framework:** [Next.js 15](https://nextjs.org/) (App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Database:** [PostgreSQL](https://www.postgresql.org/) with [Prisma ORM](https://www.prisma.io/)
- **Authentication:** [NextAuth.js v5 (Beta)](https://authjs.dev/)
- **Styling:** [Tailwind CSS 3](https://tailwindcss.com/)
- **Testing:** [Jest](https://jestjs.io/) & [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)

## ✨ Features

- **Authentication:** Secure login/logout using NextAuth.js.
- **Role-Based Access Control (RBAC):** Hierarchical permission system.
- **Content Management:** Create and view pages based on user roles.
- **Database Seeding:** Pre-configured demo users for different roles.
- **CI/CD:** GitHub Actions workflow for automated linting and testing.

## 🔑 Role Hierarchy

The application implements a hierarchical RBAC system:
1. **VIEWER:** Can view **Published** content only.
2. **EDITOR:** Can **Create/Edit Drafts** and view their **own** drafts.
3. **ADMIN:** Can **Create/Edit/Publish** drafts to the public.
4. **SUPER_ADMIN:** Can **Create/Edit/Publish/Delete** content permanently.

## 🛠️ Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/PoulasthaMukherjee/eshkon-assignment.git
cd eshkon-assignment
```

### 2. Install dependencies

```bash
npm install
```

### 3. Environment Variables

Create a `.env` file in the root directory:

```env
# Connect to a PostgreSQL database (e.g. Neon, Supabase, or Local)
POSTGRES_URL="postgresql://user:password@host:5432/dbname"
AUTH_SECRET="your-secret-here" # Generate with `npx auth secret`
```

### 4. Database Setup

Initialize the PostgreSQL database, run migrations, and seed demo users:

```bash
npx prisma migrate dev
npx prisma db seed
```

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## 👥 Demo Accounts

You can use the following accounts to test different roles (Password: `password123`):

- **Viewer:** `viewer@demo.com`
- **Editor:** `editor@demo.com`
- **Admin:** `admin@demo.com`
- **Super Admin:** `super@demo.com`

## 🧪 Running Tests

The project uses Jest for unit testing RBAC logic and component testing.

```bash
npm test
```

## 📝 Project Structure

- `app/`: Next.js App Router pages and API routes.
- `components/`: Reusable UI components.
- `lib/`: Core logic, including RBAC and Prisma client.
- `prisma/`: Database schema, migrations, and seed scripts.
- `__tests__/`: Test suites.

## 🚀 Deployment

The project is deployed on **Vercel** with a **Neon (Serverless Postgres)** database.

- **Live Demo:** [https://eshkon-assignment-three.vercel.app](https://eshkon-assignment-three.vercel.app)
