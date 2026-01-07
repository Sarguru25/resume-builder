import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import bcrypt from "bcryptjs"
import { connectDB } from "@/../lib/db"
import User from "@/../lib/models/User"

export const authOptions = {
  session: {
    strategy: "jwt",
  },

  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: {},
        password: {},
      },

      async authorize(credentials) {
        await connectDB()

        const user = await User.findOne({ email: credentials.email })
        if (!user || !user.password) return null

        const valid = await bcrypt.compare(
          credentials.password,
          user.password
        )

        if (!valid) return null

        return {
          id: user._id,
          email: user.email,
          name: user.name,
        }
      },
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],

  callbacks: {
    async signIn({ user, account }) {
      if (account.provider === "google") {
        await connectDB()

        const exists = await User.findOne({ email: user.email })
        if (!exists) {
          await User.create({
            name: user.name,
            email: user.email,
            image: user.image,
            provider: "google",
          })
        }
      }
      return true
    },

    async jwt({ token }) {
      await connectDB()
      const dbUser = await User.findOne({ email: token.email })
      if (dbUser) token.id = dbUser._id
      return token
    },

    async session({ session, token }) {
      session.user.id = token.id
      return session
    },
  },

  pages: {
    signIn: "/login",
  },
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
