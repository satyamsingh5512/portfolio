import { DefaultSession } from 'next-auth';

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'admin' | 'author';
  social?: {
    instagram?: string;
    twitter?: string;
    github?: string;
    linkedin?: string;
    website?: string;
  };
  bio?: string;
  createdAt: string;
}

declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: {
      id: string;
      role: 'admin' | 'author';
    } & DefaultSession['user'];
  }

  interface User {
    id: string;
    role: 'admin' | 'author';
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: 'admin' | 'author';
  }
}
