
"use client"

import { signIn } from "next-auth/react"

export default function Login() {
  const handleCredentials = async (e) => {
    e.preventDefault()

    const email = e.target.email.value
    const password = e.target.password.value

    await signIn("credentials", {
      email,
      password,
      callbackUrl: "/app"
    })
  }

  return (
    <div className="min-h-screen flex justify-center items-center">
      <form onSubmit={handleCredentials} className="space-y-4">
        <input name="email" placeholder="Email" />
        <input name="password" type="password" placeholder="Password" />
        <button type="submit">Login</button>

        <hr />

        <button onClick={() => signIn("google")}>
          Sign in with Google
        </button>
      </form>
    </div>
  )
}