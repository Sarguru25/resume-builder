import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import User from "./models/User"
import { connectDB } from "./db"

export const authOptions = {
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        await connectDB()

        const user = await User.findOne({ email: credentials.email })
        if (!user || !user.password) return null

        const match = await bcrypt.compare(
          credentials.password,
          user.password
        )

        if (!match) return null

        return {
          id: user._id,
          email: user.email,
          name: user.name
        }
      }
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    })
  ],

  callbacks: {
    async signIn({ user, account }) {
      await connectDB()

      const exists = await User.findOne({ email: user.email })
      if (!exists) {
        await User.create({
          name: user.name,
          email: user.email,
          image: user.image,
          provider: account.provider
        })
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
    }
  },

  session: { strategy: "jwt" },
  pages: { signIn: "/login" }
}
