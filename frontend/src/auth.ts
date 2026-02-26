import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

export const { handlers, signIn, signOut, auth } = NextAuth({
    trustHost: true,
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "MOCK_CLIENT_ID",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "MOCK_CLIENT_SECRET"
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" },
                accessToken: { label: "AccessToken", type: "text" },
                userId: { label: "UserId", type: "text" },
                role: { label: "Role", type: "text" },
                kycStatus: { label: "KYCStatus", type: "text" },
                name: { label: "Name", type: "text" },
            },
            async authorize(credentials) {
                if (!credentials?.email) return null;

                // Only pre-verified mode (frontend already called verify-otp)
                if (credentials.accessToken && credentials.userId) {
                    return {
                        id: credentials.userId as string,
                        email: credentials.email as string,
                        name: (credentials.name as string) || undefined,
                        accessToken: credentials.accessToken as string,
                        role: (credentials.role as string) || 'FREE',
                        kycStatus: (credentials.kycStatus as string) || 'UNVERIFIED',
                    };
                }

                // No fallback — login must go through OTP flow
                return null;
            }
        })
    ],
    callbacks: {
        async signIn({ user, account, profile }) {
            if (account?.provider === 'google') {
                try {
                    const backendUrl = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || 'https://gigligo-com.onrender.com';
                    const res = await fetch(backendUrl + "/api/auth/google/callback", {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            credential: account.id_token || account.access_token,
                        })
                    });
                    const data = await res.json();
                    if (res.ok && data.user) {
                        (user as any).accessToken = data.access_token;
                        (user as any).role = data.user.role;
                        (user as any).kycStatus = data.user.kycStatus;
                        (user as any).id = data.user.id;
                        (user as any).isNewGoogleUser = data.user.isNewGoogleUser;
                        return true;
                    }
                    return false;
                } catch (e) {
                    console.error("Google verify error:", e);
                    return false;
                }
            }
            return true;
        },
        async jwt({ token, user, trigger, session }) {
            if (trigger === "update" && session) {
                if (session.kycStatus) token.kycStatus = session.kycStatus;
                if (session.role) token.role = session.role;
                if (session.isNewGoogleUser !== undefined) token.isNewGoogleUser = session.isNewGoogleUser;
            }
            if (user) {
                token.accessToken = (user as any).accessToken;
                token.id = user.id || (user as any).id;
                token.role = (user as any).role;
                token.kycStatus = (user as any).kycStatus;
                if ((user as any).isNewGoogleUser) {
                    token.isNewGoogleUser = true;
                }
            }
            return token;
        },
        async session({ session, token }) {
            if (session?.user) {
                session.user.id = token.id as string;
                (session as any).accessToken = token.accessToken;
                (session as any).role = token.role;
                (session as any).kycStatus = token.kycStatus;
                if (token.isNewGoogleUser) {
                    (session as any).isNewGoogleUser = true;
                }
            }
            return session;
        }
    },
    session: { strategy: 'jwt' },
    secret: (() => {
        const secret = process.env.AUTH_SECRET;
        if (!secret) throw new Error('FATAL: AUTH_SECRET environment variable is required');
        return secret;
    })(),
});
