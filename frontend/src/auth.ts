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

                // Mode 1: Pre-verified via OTP (frontend already called verify-otp)
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

                // Mode 2: Fallback direct login (backward compat)
                if (!credentials.password) return null;
                try {
                    const backendUrl = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || 'https://gigligo-com.onrender.com';
                    const res = await fetch(backendUrl + "/api/auth/login", {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            email: credentials.email,
                            password: credentials.password
                        })
                    });
                    const data = await res.json();

                    if (res.ok && data.access_token) {
                        return {
                            id: data.user.id,
                            email: data.user.email,
                            name: data.user.profile?.fullName,
                            accessToken: data.access_token,
                            role: data.user.role,
                            kycStatus: data.user.kycStatus
                        };
                    }
                    return null;
                } catch (e) {
                    console.error("Credentials error:", e);
                    return null;
                }
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
                            email: user.email,
                            name: user.name,
                            picture: user.image,
                            googleId: account.providerAccountId
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
    secret: process.env.AUTH_SECRET || "super-secret-next-auth-key-for-gigligo-platform-123456",
});
