import type { NextAuthConfig } from 'next-auth';
import NextAuth from 'next-auth';
import { prisma } from '@/db/prisma';
import { PrismaAdapter } from "@auth/prisma-adapter"
import CredentialsProvider from 'next-auth/providers/credentials';
import { compareSync } from 'bcrypt-ts-edge';
import macAddr from "macaddress-local-machine";

export const config = {
  
  // 1
  pages: {
    signIn: '/sign-in',
    error: '/sign-in',
  },

  // 2
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  // 3
  adapter: PrismaAdapter(prisma) ,
  
  // 4
  providers: [CredentialsProvider({
      credentials: {
        email: { type: "email" },
        password: { type: "password" },
      },
      async authorize(credentials) {
        if (credentials == null) return null
        const user = await prisma.user.findFirst({
          where: {
            email: credentials.email as string,
          },
        });

        if (user && user.password) {
          const isMatch = compareSync(credentials.password as string, user.password)
          if (isMatch) {
            return {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
              currentToken: user.currentToken ?? undefined
            };
          }
        };

        return null;
      },
    }),
  ],

  // 5
  callbacks: {
    // ** 
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async session ({ session, user, trigger, token }: any) {
      session.user.id = token.sub;                                       // Set the user id on the session from the token
      session.user.role = token.role; 
      session.user.name = token.name; 
      session.user.currentToken = token.currentToken; 
      if (trigger === 'update') session.user.name = user.name;           // If there is an update, set the name on the session, session is come from JWT        
      return session;
    },

    // ** 
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async jwt({ token, user, trigger, session }: any) {
      if (user) {      
        const macAddress = macAddr.first();
        if (macAddress.macAddr == '') return '000'
        token.id = user.id;     
        token.role = user.role;                            // Assign user fields to token
        token.currentToken = macAddress.macAddr
        await prisma.user.update({
          where: { 
            id: user.id 
          },                        
          data: { 
            currentToken: token.currentToken
          },
        });
      }

      if (session?.user.name && trigger === 'update') {
        token.name = session.user.name;                     // Handle session updates (e.g., name change), ch92, /user/profile
      } 

      return token;
    },

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    authorized({ request, auth }: any) {          // invoked when a user is authorized, using middleware, https://next-auth.js.org/configuration/nextjs#middleware
      const protectedPaths = [                    // Array of regex patterns of protected paths
        /\/shipping-address/,
        /\/payment-method/,
        /\/place-order/,
        /\/profile/,
        /\/user\/(.*)/,
        /\/project\/(.*)/,
        /\/admin/,
      ];
      const { pathname } = request.nextUrl;                                                 // Get pathname from the req URL object
      if (!auth && protectedPaths.some((p) => p.test(pathname))) return false;   
      return true
    }
  },
} satisfies NextAuthConfig;

export const { 
  handlers, 
  signIn, 
  signOut, 
  auth 
} = NextAuth(config)

