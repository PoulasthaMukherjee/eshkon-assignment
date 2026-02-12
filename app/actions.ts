'use server';

import { prisma } from "@/lib/prisma";
import { assertRole } from "@/lib/rbac";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// 1. Create Page (EDITOR+)
export async function createPage(formData: FormData) {
  // Security Check
  const user = await assertRole('EDITOR');
  
  const title = formData.get('title') as string;
  const content = formData.get('content') as string;
  // Simple slug generator
  const slug = title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');

  await prisma.page.create({
    data: {
      title,
      slug,
      content,
      authorId: user.id,
      status: 'DRAFT'
    }
  });

  revalidatePath('/dashboard');
  redirect('/dashboard');
}

// 2. Edit Page (EDITOR+)
export async function editPage(pageId: string, formData: FormData) {
  // Security Check
  const user = await assertRole('EDITOR');

  const title = formData.get('title') as string;
  const content = formData.get('content') as string;
  // Simple slug generator
  const slug = title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');

  await prisma.page.update({
    where: { id: pageId },
    data: {
      title,
      slug,
      content,
      authorId: user.id
    }
  });

  revalidatePath('/dashboard');
  redirect('/dashboard');
}

// 3. Publish Page (ADMIN+)
export async function publishPage(pageId: string) {
  // Security Check
  await assertRole('ADMIN');
  
  await prisma.page.update({
    where: { id: pageId },
    data: { status: 'PUBLISHED' }
  });
  revalidatePath('/dashboard');
}

// 4. Delete Page (SUPER_ADMIN only)
export async function deletePage(pageId: string) {
  // Security Check
  await assertRole('SUPER_ADMIN');
  
  await prisma.page.delete({ where: { id: pageId } });
  revalidatePath('/dashboard');
}