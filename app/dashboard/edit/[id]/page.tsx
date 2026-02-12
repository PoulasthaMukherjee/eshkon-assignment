import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { editPage } from "@/app/actions";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function EditPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) redirect('/api/auth/signin');

  // Fetch the page to edit
  const { id } = await params;
  
  const page = await prisma.page.findUnique({
    where: { id },
  });

  if (!page) {
    return <div className="p-8 text-center text-red-500">Page not found</div>;
  }

  // Security Check: Editors can only edit their OWN posts
  if (session.user.role === 'EDITOR' && page.authorId !== session.user.id) {
    return <div className="p-8 text-center text-red-500">Unauthorized: You can only edit your own posts.</div>;
  }

  // We bind the ID to the server action so it knows which page to update
  const updatePageWithId = editPage.bind(null, page.id);

  return (
    <div className="min-h-screen p-8 bg-gray-50 text-black flex justify-center">
      <div className="w-full max-w-2xl bg-white p-8 rounded shadow">
        <h1 className="text-2xl font-bold mb-6">Edit Page</h1>
        
        <form action={updatePageWithId} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input 
              name="title" 
              defaultValue={page.title}
              required 
              className="w-full border p-2 rounded" 
              placeholder="Enter title..." 
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Content</label>
            <textarea 
              name="content" 
              defaultValue={page.content}
              required 
              rows={6} 
              className="w-full border p-2 rounded" 
              placeholder="Enter content..." 
            />
          </div>

          <div className="flex gap-4 pt-4">
            <Link 
              href="/dashboard"
              className="flex-1 py-2 text-center border border-gray-300 rounded hover:bg-gray-50 text-black"
            >
              Cancel
            </Link>
            
            <button type="submit" className="flex-2 bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
              Update Page
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}