import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

// 1. Extend session types to include our custom Role
declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role: string;
    } & import("next-auth").DefaultSession["user"]
  }
}

// 2. Configure Auth Logic
export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const parsed = z.object({ email: z.string().email(), password: z.string() }).safeParse(credentials);
        
        if (parsed.success) {
          const user = await prisma.user.findUnique({ where: { email: parsed.data.email } });
          if (!user) return null;
          
          const passwordsMatch = await bcrypt.compare(parsed.data.password, user.password);
          if (passwordsMatch) return user;
        }
        return null;
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.role = (user as { role: string }).role;
        token.id = user.id;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user && token) {
        session.user.role = token.role as string;
        session.user.id = token.id as string;
      }
      return session;
    },
  },
});