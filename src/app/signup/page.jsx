"use client"

export default function Signup() {
  const handleSignup = async (e) => {
    e.preventDefault()

    const res = await fetch("/api/users/register", {
      method: "POST",
      body: JSON.stringify({
        name: e.target.name.value,
        email: e.target.email.value,
        password: e.target.password.value,
      }),
    })

    if (res.ok) window.location.href = "/login"
  }

  return (
    <form onSubmit={handleSignup}>
      <input name="name" placeholder="Name" required />
      <input name="email" placeholder="Email" required />
      <input name="password" type="password" required />

      <button>Create Account</button>
    </form>
  )
}
