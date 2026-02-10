import { auth } from "@/auth";
import { redirect } from "next/navigation";

export type Role = 'VIEWER' | 'EDITOR' | 'ADMIN' | 'SUPER_ADMIN';

const ROLE_HIERARCHY: Record<Role, number> = {
  VIEWER: 1,
  EDITOR: 2,
  ADMIN: 3,
  SUPER_ADMIN: 4,
};

export async function assertRole(requiredRole: Role) {
  const session = await auth();
  
  if (!session?.user) {
    redirect('/api/auth/signin');
  }

  const userRole = session.user.role as Role;
  const userLevel = ROLE_HIERARCHY[userRole] || 0;
  const requiredLevel = ROLE_HIERARCHY[requiredRole];

  if (userLevel < requiredLevel) {
    throw new Error(`Unauthorized: Role ${requiredRole} required.`);
  }

  return session.user;
}