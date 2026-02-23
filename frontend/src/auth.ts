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
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
                webauthnResponse: { label: "WebAuthn", type: "text" }
            },
            async authorize(credentials: any) {
                try {
                    let endpoint = "/api/auth/login";
                    let payload = credentials;

                    if (credentials?.webauthnResponse) {
                        endpoint = "/api/auth/webauthn/login/verify";
                        payload = {
                            email: credentials.email,
                            response: JSON.parse(credentials.webauthnResponse)
                        };
                    }

                    const backendUrl = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || 'https://gigligo-com.onrender.com';
                    const res = await fetch(backendUrl + endpoint, {
                        method: 'POST',
                        body: JSON.stringify(payload),
                        headers: { "Content-Type": "application/json" }
                    });

                    const data = await res.json();

                    if (res.ok && (data.user || data.verified)) {
                        // WebAuthn endpoint returns `{ verified: true, user: ... }` or similar
                        // Standard login returns `{ access_token: ..., user: ... }`
                        const userObj = data.user || data;

                        return {
                            id: userObj.id,
                            email: userObj.email,
                            name: userObj.profile?.fullName || 'User',
                            role: userObj.role,
                            accessToken: data.access_token || userObj.access_token,
                            kycStatus: userObj.kycStatus,
                        };
                    }
                    return null;
                } catch (e) {
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
                        // Mutate user object so `jwt` callback can pick up the backend data
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
            return true; // For credentials provider
        },
        async jwt({ token, user, trigger, session }) {
            if (trigger === "update" && session) {
                // Allows us to patch kycStatus or role manually from client-side via update()
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
