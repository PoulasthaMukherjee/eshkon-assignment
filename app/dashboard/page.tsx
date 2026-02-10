import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { publishPage, deletePage } from "@/app/actions";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const session = await auth();
  if (!session) redirect('/api/auth/signin');

  const role = session.user.role;
  
  // Logic: Viewers see nothing here. Editors see own posts. Admins see all.
  const where = role === 'EDITOR' ? { authorId: session.user.id } : {};
  
  // Fetch data
  const pages = await prisma.page.findMany({ 
    where, 
    include: { author: true },
    orderBy: { updatedAt: 'desc' }
  });

  return (
    <div className="min-h-screen p-8 bg-gray-50 text-black">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold">CMS Dashboard</h1>
            <p className="text-sm text-gray-600">
              User: {session.user.email} <br/>
              Role: <span className="font-mono font-bold bg-gray-200 px-1 rounded">{role}</span>
            </p>
          </div>
          
          {role !== 'VIEWER' && (
            <Link href="/dashboard/new" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              + New Draft
            </Link>
          )}
        </div>

        <div className="space-y-4">
          {pages.map((page) => (
            <div key={page.id} className="bg-white p-6 rounded shadow border flex justify-between items-center">
              <div>
                <h2 className="font-bold text-lg">{page.title}</h2>
                <div className="text-sm text-gray-500 mt-1 space-x-2">
                  <span className={`px-2 py-0.5 rounded text-xs border ${
                    page.status === 'PUBLISHED' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-yellow-50 border-yellow-200 text-yellow-700'
                  }`}>
                    {page.status}
                  </span>
                  <span>Author: {page.author.email}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Admin Action */}
                {['ADMIN', 'SUPER_ADMIN'].includes(role) && page.status !== 'PUBLISHED' && (
                  <form action={publishPage.bind(null, page.id)}>
                    <button className="text-sm bg-green-600 text-white px-3 py-1 rounded">Publish</button>
                  </form>
                )}

                {/* Super Admin Action */}
                {role === 'SUPER_ADMIN' && (
                  <form action={deletePage.bind(null, page.id)}>
                    <button className="text-sm bg-red-600 text-white px-3 py-1 rounded">Delete</button>
                  </form>
                )}
              </div>
            </div>
          ))}
          
          {pages.length === 0 && (
            <div className="text-center py-10 text-gray-500">No pages found.</div>
          )}
        </div>
      </div>
    </div>
  );
}