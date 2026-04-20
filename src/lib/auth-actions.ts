'use server';

import { cookies } from 'next/headers';
import { encrypt } from './auth-server';
import { redirect } from 'next/navigation';

const SESSION_COOKIE = 'sk_crown_admin_session';

export async function loginAction(prevState: { error: string } | null, formData: FormData) {

  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (email !== adminEmail || password !== adminPassword) {
    return { error: 'Invalid credentials' };
  }

  // Create the session
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
  const session = await encrypt({ email, expires });

  // Save the session in a cookie
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, session, { 
    expires, 
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/'
  });

  redirect('/dashboard');
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
  redirect('/login');
}
