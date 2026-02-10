import Link from "next/link";
import { auth } from "@/auth";

export default async function Home() {
  const session = await auth();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24 bg-white text-black">
      <h1 className="text-4xl font-bold mb-4">RBAC CMS Demo</h1>
      <p className="text-xl mb-8">A secure, role-based content management system.</p>
      
      <div className="flex gap-4">
        {session ? (
          <Link 
            href="/dashboard" 
            className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Go to Dashboard
          </Link>
        ) : (
          <Link 
            href="/api/auth/signin" 
            className="px-6 py-3 bg-black text-white rounded hover:bg-gray-800 transition"
          >
            Sign In
          </Link>
        )}
      </div>
    </div>
  );
}