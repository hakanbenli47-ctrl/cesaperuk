"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const router = useRouter()

  const girisYap = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) return alert(error.message)

    router.push("/admin")
  }

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="bg-white p-6 rounded-xl shadow w-80 space-y-4">

        <h2 className="text-xl font-bold text-center text-black">Admin Giriş</h2>

        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-white border border-zinc-400 text-black p-3 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
        />

        <input
          type="password"
          placeholder="Şifre"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        className="w-full bg-white border border-zinc-400 text-black p-3 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
        />

        <button
          onClick={girisYap}
          className="w-full bg-blue-500 text-white py-3 rounded"
        >
          Giriş Yap
        </button>

      </div>
    </div>
  )
}