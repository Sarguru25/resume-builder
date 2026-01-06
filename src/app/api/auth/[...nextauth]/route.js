// import NextAuth from "next-auth"
// import GoogleProvider from "next-auth/providers/google"
// import CredentialsProvider from "next-auth/providers/credentials"
// import bcrypt from "bcryptjs"

// import User from "@/../lib/models/User"
// import { connectDB } from "@/../lib/db"

// const handler = NextAuth({
//   providers: [
//     // 🔐 Email + Password (YOUR OLD LOGIN)
//     CredentialsProvider({
//       name: "Credentials",
//       credentials: {
//         email: {},
//         password: {}
//       },
//       async authorize(credentials) {
//         await connectDB()

//         const user = await User.findOne({ email: credentials.email })
//         if (!user || !user.password) return null

//         const isMatch = await bcrypt.compare(
//           credentials.password,
//           user.password
//         )

//         if (!isMatch) return null

//         return {
//           id: user._id,
//           email: user.email,
//           name: user.name
//         }
//       }
//     }),

//     // 🌍 Google Auth
//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET
//     })
//   ],

//   callbacks: {
//     async signIn({ user, account }) {
//       await connectDB()

//       const existingUser = await User.findOne({ email: user.email })

//       if (!existingUser) {
//         await User.create({
//           name: user.name,
//           email: user.email,
//           image: user.image,
//           provider: account.provider
//         })
//       }

//       return true
//     },

//     async jwt({ token }) {
//       await connectDB()
//       const dbUser = await User.findOne({ email: token.email })
//       if (dbUser) token.id = dbUser._id
//       return token
//     },

//     async session({ session, token }) {
//       session.user.id = token.id
//       return session
//     }
//   },

//   session: {
//     strategy: "jwt"
//   },

//   pages: {
//     signIn: "/login"
//   }
// })

// export { handler as GET, handler as POST }


import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import bcrypt from "bcryptjs"
import User from "@/../lib/models/User"
import { connectDB } from "@/../lib/db"

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
        if (!user) throw new Error("User not found")

        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        )

        if (!isValid) throw new Error("Invalid password")

        return {
          id: user._id,
          name: user.name,
          email: user.email,
        }
      },
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],

  pages: {
    signIn: "/login",
  },
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
