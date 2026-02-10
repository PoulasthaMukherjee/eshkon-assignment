import { createPage } from "@/app/actions";

export default function NewPage() {
  return (
    <div className="min-h-screen p-8 bg-gray-50 text-black flex justify-center">
      <div className="w-full max-w-2xl bg-white p-8 rounded shadow">
        <h1 className="text-2xl font-bold mb-6">Create New Page</h1>
        
        <form action={createPage} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input name="title" required className="w-full border p-2 rounded" placeholder="Enter title..." />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Content</label>
            <textarea name="content" required rows={6} className="w-full border p-2 rounded" placeholder="Enter content..." />
          </div>

          <button type="submit" className="w-full bg-black text-white py-2 rounded hover:bg-gray-800">
            Save Draft
          </button>
        </form>
      </div>
    </div>
  );
}