import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { connectDB } from "@/lib/db"
import User from "@/lib/models/User"

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) {
    return Response.json({ message: "Unauthorized" }, { status: 401 })
  }

  await connectDB()

  const user = await User.findById(session.user.id).select("-password")
  return Response.json(user)
}
