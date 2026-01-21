import bcrypt from "bcryptjs"
import User from "@/lib/models/User"
import { connectDB } from "@/lib/db"

export async function POST(req) {
  const { name, email, password } = await req.json()

  await connectDB()

  const exists = await User.findOne({ email })
  if (exists) {
    return Response.json(
      { message: "User already exists" },
      { status: 400 }
    )
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  await User.create({
    name,
    email,
    password: hashedPassword,
  })

  return Response.json({ message: "User created" }, { status: 201 })
}
