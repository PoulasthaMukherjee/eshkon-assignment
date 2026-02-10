# Eshkon Assignment - CMS with RBAC

A modern Content Management System (CMS) prototype built with Next.js 15, featuring Role-Based Access Control (RBAC), Prisma ORM with SQLite, and NextAuth.js for authentication.

## 🚀 Tech Stack

- **Framework:** [Next.js 15](https://nextjs.org/) (App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Database:** [SQLite](https://www.sqlite.org/) with [Prisma ORM](https://www.prisma.io/)
- **Authentication:** [NextAuth.js v5 (Beta)](https://authjs.dev/)
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com/)
- **Testing:** [Jest](https://jestjs.io/) & [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)

## ✨ Features

- **Authentication:** Secure login/logout using NextAuth.js.
- **Role-Based Access Control (RBAC):** Hierarchical permission system.
- **Content Management:** Create and view pages based on user roles.
- **Database Seeding:** Pre-configured demo users for different roles.
- **CI/CD:** GitHub Actions workflow for automated linting and testing.

## 🔑 Role Hierarchy

The application implements a hierarchical RBAC system:
1. **VIEWER:** Can view published content.
2. **EDITOR:** Can create and edit content (includes Viewer permissions).
3. **ADMIN:** Full access to manage content and users (includes Editor permissions).
4. **SUPER_ADMIN:** Absolute control over the system.

## 🛠️ Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd eshkon-assignment
```

### 2. Install dependencies

```bash
npm install
```

### 3. Environment Variables

Create a `.env` file in the root directory:

```env
DATABASE_URL="file:./dev.db"
AUTH_SECRET="your-secret-here" # Generate with `npx auth secret`
```

### 4. Database Setup

Initialize the SQLite database, run migrations, and seed demo users:

```bash
npx prisma migrate dev --name init
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