// src/app/api/user/route.js
import { getServerSession } from "next-auth"
import { authOptions } from "@/../lib/auth"
import User from "@/../lib/models/User"
import { connectDB } from "@/../lib/db"

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) {
    return Response.json({ message: "Unauthorized" }, { status: 401 })
  }

  await connectDB()

  const user = await User.findById(session.user.id).select("-password")
  return Response.json(user)
}
