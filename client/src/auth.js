import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
          scope: "openid email profile"
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, account }) {
      console.log("JWT Callback - account:", !!account, "idToken:", !!account?.id_token);
      if (account?.id_token) {
        token.idToken = account.id_token;
        console.log("JWT Callback - ID token saved to session");
      }
      return token;
    },
    async session({ session, token }) {
      console.log("Session Callback - idToken exists:", !!token.idToken);
      if (token.idToken) {
        session.idToken = token.idToken;
      }
      return session;
    },
  },
  debug: true, // Enable debug mode
});
