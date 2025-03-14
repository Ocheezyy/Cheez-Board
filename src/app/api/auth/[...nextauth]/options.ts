import { NextAuthOptions } from "next-auth";
import GithubProvder from "next-auth/providers/github";
import { connectToDatabase } from "@/db/connect";

await connectToDatabase();

export const authOptions: NextAuthOptions = {
    providers: [
      GithubProvder({
        clientId: process.env.GITHUB_CLIENT_ID as string,
        clientSecret: process.env.GITHUB_SECRET as string
      }),
    //   CredentialsProvider({
    //     name: "Credentials",
    //     credentials: {
    //       email: { label: "Email", type: "email" },
    //       password: { label: "Password", type: "password" },
    //     },
    //     async authorize(credentials) {
    //       if (!credentials) return null;
  
    //       const user = await User.findOne({ email: credentials.email });
    //       if (!user) return null;
  
    //       const isValid = await bcrypt.compare(credentials.password, user.password);
    //       if (!isValid) return null;
  
    //       return {
    //         id: user._id.toString(),
    //         name: user.name,
    //         email: user.email,
    //       };
    //     },
    //   }),
    ],
    callbacks: {
      async jwt({ token, user }) {
        if (user) {
          token.id = user.id;
        }
        return token;
      },
      async session({ session, token }) {
        if (session.user) {
          session.user.id = token.id as string;
        }
        return session;
      },
    },
    secret: process.env.NEXTAUTH_SECRET,
  };