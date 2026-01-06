import mongoose from "mongoose"

const UserSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },
    password: String, // only for credentials login
    provider: { type: String, default: "credentials" },
    image: String,
  },
  { timestamps: true }
)

export default mongoose.models.User ||
  mongoose.model("User", UserSchema)
