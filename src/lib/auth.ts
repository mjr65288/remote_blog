import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from '$lib/server/db';
//import * as schema from '$lib/server/db/schema';
import { admin } from 'better-auth/plugins';

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
  },
  database: drizzleAdapter(db, {
    provider:'pg',
    //schema
  }),
  plugins: [admin()],
});