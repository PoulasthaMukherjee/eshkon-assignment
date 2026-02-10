import { auth, signOut } from "@/auth";
import { prisma } from "@/lib/prisma";
import { publishPage, deletePage } from "@/app/actions";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Prisma } from "@prisma/client";

// Define the shape of the data including the relation
// We use the manual type approach to avoid 'stale type' errors during dev
import { Page, User } from "@prisma/client";
type PageWithAuthor = Page & { author: User };

export default async function Dashboard() {
  const session = await auth();
  if (!session) redirect('/api/auth/signin');

  const role = session.user.role;
  
  // Logic: 
  // 1. Viewers: Only see PUBLISHED content.
  // 2. Editors: Only see their OWN content (Drafts & Published).
  // 3. Admins/Super: See EVERYTHING.

  let where = {};
  if (role === 'VIEWER') {
    where = { status: 'PUBLISHED' };
  } else if (role === 'EDITOR') {
    where = { authorId: session.user.id };
  }
  
  const pages = await prisma.page.findMany({ 
    where, 
    include: { author: true },
    orderBy: { updatedAt: 'desc' }
  });

  return (
    <div className="min-h-screen p-8 bg-gray-50 text-black">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold">CMS Dashboard</h1>
            <p className="text-sm text-gray-600">
              User: {session.user.email} <br/>
              Role: <span className="font-mono font-bold bg-gray-200 px-1 rounded">{role}</span>
            </p>
          </div>
          
          <div className="flex gap-4 items-center">
            {role !== 'VIEWER' && (
              <Link href="/dashboard/new" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
                + New Draft
              </Link>
            )}
            
            <form action={async () => {
              "use server";
              await signOut();
            }}>
              <button className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 transition">
                Logout
              </button>
            </form>
          </div>
        </div>

        {/* Content List */}
        <div className="space-y-4">
          {pages.map((page: PageWithAuthor) => (
            <div key={page.id} className="bg-white p-6 rounded shadow border flex justify-between items-center hover:shadow-md transition">
              {/* Text Section with Truncation */}
              <div className="flex-1 min-w-0 pr-4"> 
                <h2 className="font-bold text-lg text-gray-900 truncate">{page.title}</h2>
                
                {/* Content Preview Line */}
                <p className="text-gray-500 text-sm truncate mb-2">
                  {page.content || "No content..."}
                </p>
                
                <div className="text-xs text-gray-400 flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded border ${
                    page.status === 'PUBLISHED' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-yellow-50 border-yellow-200 text-yellow-700'
                  }`}>
                    {page.status}
                  </span>
                  <span>• Author: {page.author.email}</span>
                  <span>• Updated: {page.updatedAt.toLocaleDateString()}</span>
                </div>
              </div>

              {/* Action Buttons Section */}
              <div className="flex items-center gap-2 shrink-0">
                {['ADMIN', 'SUPER_ADMIN'].includes(role) && page.status !== 'PUBLISHED' && (
                  <form action={publishPage.bind(null, page.id)}>
                    <button className="text-sm bg-green-600 text-white px-3 py-1.5 rounded hover:bg-green-700 transition">
                      Publish
                    </button>
                  </form>
                )}

                {role === 'SUPER_ADMIN' && (
                  <form action={deletePage.bind(null, page.id)}>
                    <button className="text-sm bg-red-600 text-white px-3 py-1.5 rounded hover:bg-red-700 transition">
                      Delete
                    </button>
                  </form>
                )}
              </div>
            </div>
          ))}
          
          {pages.length === 0 && (
            <div className="text-center py-10 text-gray-500">No pages found. Create one!</div>
          )}
        </div>
      </div>
    </div>
  );
}