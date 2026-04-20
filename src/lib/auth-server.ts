import { SignJWT, jwtVerify, type JWTPayload } from 'jose';


const secret = new TextEncoder().encode(
  process.env.AUTH_SECRET || 'a-very-long-and-secure-random-secret-key-for-sk-crown'
);

export async function encrypt(payload: JWTPayload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(secret);
}

export async function decrypt(input: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(input, secret, {
      algorithms: ['HS256'],
    });
    return payload;
  } catch {
    return null;
  }
}

