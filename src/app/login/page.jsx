"use client"

import React, { useState } from "react"
import { User2Icon, Mail, Lock } from "lucide-react"
import { signIn } from "next-auth/react"
import toast, { Toaster } from "react-hot-toast"

export default function AuthPage() {
  const [state, setState] = useState("login")
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // LOGIN
  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)

    const res = await signIn("credentials", {
      email: formData.email,
      password: formData.password,
      redirect: false,
    })

    setLoading(false)

    if (res?.error) {
      toast.error(res.error)
    } else {
      toast.success("Login successful")
      window.location.href = "/app"
    }
  }

  // SIGNUP
  const handleSignup = async (e) => {
    e.preventDefault()
    setLoading(true)

    const res = await fetch("/api/users/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })

    setLoading(false)

    if (!res.ok) {
      const data = await res.json()
      toast.error(data.message || "Signup failed")
      return
    }

    toast.success("Account created successfully")
    setState("login")
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Toaster />
      <form
        onSubmit={state === "login" ? handleLogin : handleSignup}
        className="sm:w-[350px] w-full text-center border border-gray-300/60 rounded-2xl px-8 bg-white"
      >
        <h1 className="text-gray-900 text-3xl mt-10 font-medium">
          {state === "login" ? "Login" : "Sign up"}
        </h1>

        <p className="text-gray-500 text-sm mt-2">
          Please {state} to continue
        </p>

        {/* NAME (Signup only) */}
        {state !== "login" && (
          <div className="flex items-center mt-6 w-full border border-gray-300/80 h-12 rounded-full pl-6 gap-2">
            <User2Icon size={16} className="text-gray-500" />
            <input
              type="text"
              name="name"
              placeholder="Name"
              className="w-full border-none outline-none focus:outline-none focus:ring-0 focus:shadow-none"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
        )}

        {/* EMAIL */}
        <div className="flex items-center w-full mt-4 border border-gray-300/80 h-12 rounded-full pl-6 gap-2">
          <Mail size={16} className="text-gray-500" />
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full border-none outline-none focus:outline-none focus:ring-0 focus:shadow-none"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        {/* PASSWORD */}
        <div className="flex items-center mt-4 w-full border border-gray-300/80 h-12 rounded-full pl-6 gap-2">
          <Lock size={16} className="text-gray-500" />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full border-none outline-none focus:outline-none focus:ring-0 focus:shadow-none"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full h-11 rounded-full text-white bg-green-500 hover:opacity-90 transition-opacity"
        >
          {loading
            ? "Please wait..."
            : state === "login"
            ? "Login"
            : "Sign up"}
        </button>

        {/* TOGGLE */}
        <p
          onClick={() =>
            setState((prev) => (prev === "login" ? "register" : "login"))
          }
          className="cursor-pointer text-gray-500 text-sm mt-3 mb-10"
        >
          {state === "login"
            ? "Don't have an account?"
            : "Already have an account?"}{" "}
          <span className="text-green-500 hover:underline">
            Click here
          </span>
        </p>

        {/* GOOGLE LOGIN */}
        {state === "login" && (
          <>
            <hr className="mb-4" />
            <button
              type="button"
              // onClick={() => signIn("google")}
              onClick={() => signIn("google", { callbackUrl: "/app" })}

              className="w-full mb-4 h-11 rounded-full border border-gray-300 hover:bg-gray-100"
            >
              Sign in with Google
            </button>
          </>
        )}
      </form>
    </div>
  )
}
