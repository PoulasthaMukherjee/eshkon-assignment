import { assertRole } from "@/lib/rbac";

// Mock the auth function so we don't need a real database or running server
jest.mock("@/auth", () => ({
  auth: jest.fn(),
}));

import { auth } from "@/auth";

describe("RBAC Security Logic", () => {
  
  it("should allow ADMIN to access ADMIN routes", async () => {
    // Mock a logged-in Admin session
    (auth as jest.Mock).mockResolvedValue({ 
      user: { role: 'ADMIN', id: '123' } 
    });

    const user = await assertRole('ADMIN');
    expect(user).toBeDefined();
    expect(user.role).toBe('ADMIN');
  });

  it("should allow SUPER_ADMIN to access EDITOR routes", async () => {
    // Higher role should access lower role requirements
    (auth as jest.Mock).mockResolvedValue({ 
      user: { role: 'SUPER_ADMIN', id: '999' } 
    });

    const user = await assertRole('EDITOR');
    expect(user).toBeDefined();
  });

  it("should BLOCK a VIEWER from accessing EDITOR routes", async () => {
    // Mock a Viewer session
    (auth as jest.Mock).mockResolvedValue({ 
      user: { role: 'VIEWER', id: '000' } 
    });

    // Expect the function to throw an error
    await expect(assertRole('EDITOR')).rejects.toThrow();
  });

  it("should redirect if user is NOT logged in", async () => {
    (auth as jest.Mock).mockResolvedValue(null);

    // assertRole calls redirect(), which in Next.js throws an error 'NEXT_REDIRECT'.
    // We expect it to throw.
    await expect(assertRole('EDITOR')).rejects.toThrow();
  });
});