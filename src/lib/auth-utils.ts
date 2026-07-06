import crypto from "crypto";
import { prisma } from "./prisma";

// We import cookies from next/headers
import { cookies as getCookies } from "next/headers";

const SESSION_COOKIE_NAME = "combat_cms_session";

export const ROLES = {
  ADMIN: "ADMIN",
  EDITOR: "EDITOR",
} as const;

export type UserRole = (typeof ROLES)[keyof typeof ROLES];

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  avatarUrl: string | null;
  bio: string | null;
};

export type AuthSession = {
  id: string;
  userId: string;
  user: SessionUser;
  expiresAt: Date;
};

export function isAdmin(role: string): boolean {
  return role === ROLES.ADMIN;
}

export function requireSession(session: AuthSession | null): AuthSession {
  if (!session) {
    throw new Error("UNAUTHORIZED");
  }
  return session;
}

export function requireAdmin(session: AuthSession | null): AuthSession {
  const s = requireSession(session);
  if (!isAdmin(s.user.role)) {
    throw new Error("FORBIDDEN");
  }
  return s;
}

export function authErrorResponse(error: unknown) {
  if (error instanceof Error) {
    if (error.message === "UNAUTHORIZED") {
      return { body: { error: "Niste prijavljeni" }, status: 401 as const };
    }
    if (error.message === "FORBIDDEN") {
      return { body: { error: "Nemate ovlasti za ovu radnju" }, status: 403 as const };
    }
  }
  return null;
}

// Hash password using PBKDF2
export function hashPassword(password: string, salt: string): string {
  // 10000 iterations, 64 bytes key length, sha512 digest
  const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, "sha512");
  return hash.toString("hex");
}

// Generate random salt
export function generateSalt(): string {
  return crypto.randomBytes(16).toString("hex");
}

// Verify password
export function verifyPassword(password: string, saltAndHash: string): boolean {
  // We store as "salt:hash"
  const parts = saltAndHash.split(":");
  if (parts.length !== 2) return false;
  const [salt, hash] = parts;
  const computedHash = hashPassword(password, salt);
  return computedHash === hash;
}

// Helper to create salt and hash string
export function saltAndHashPassword(password: string): string {
  const salt = generateSalt();
  const hash = hashPassword(password, salt);
  return `${salt}:${hash}`;
}

// Session management
export async function createSession(userId: string) {
  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

  const session = await prisma.session.create({
    data: {
      token,
      userId,
      expiresAt,
    },
    include: {
      user: true,
    },
  });

  const cookieStore = await getCookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: expiresAt,
    path: "/",
  });

  return session;
}

export async function getSession() {
  const cookieStore = await getCookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!token) return null;

  const session = await prisma.session.findUnique({
    where: { token },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          avatarUrl: true,
          bio: true,
        },
      },
    },
  });

  if (!session) return null;

  // Check expiration
  if (session.expiresAt < new Date()) {
    await prisma.session.delete({ where: { id: session.id } });
    return null;
  }

  return session;
}

export async function destroySession() {
  const cookieStore = await getCookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (token) {
    try {
      await prisma.session.delete({ where: { token } });
    } catch {
      // Ignore if session not in DB
    }
  }

  cookieStore.delete(SESSION_COOKIE_NAME);
}
