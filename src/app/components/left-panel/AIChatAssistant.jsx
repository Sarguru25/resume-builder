"use client"

import { useState } from "react"
import { applyAIAction } from "@/lib/resumeUpdater"

export default function AIChatAssistant({ resumeData, setResumeData }) {

  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [chat, setChat] = useState([])

  const sendMessage = async () => {

    if (!message) return

    const userMessage = {
      role: "user",
      text: message
    }

    setChat((prev) => [...prev, userMessage])

    setLoading(true)

    try {

      const res = await fetch("/api/ai-assistant", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message,
          resumeData
        })
      })

      const action = await res.json()

      const updatedResume = applyAIAction(resumeData, action)

      setResumeData(updatedResume)

      setChat((prev) => [
        ...prev,
        {
          role: "ai",
          text: "Resume updated successfully ✅"
        }
      ])

    } catch (err) {
      console.error(err)
    }

    setMessage("")
    setLoading(false)
  }

  return (

    <div className="h-full flex flex-col border-l bg-white">

      <div className="p-4 border-b font-semibold">
        AI Resume Assistant
      </div>

      <div className="flex-1 overflow-auto p-4 space-y-2">

        {chat.map((c, i) => (

          <div
            key={i}
            className={`text-sm p-2 rounded ${c.role === "user"
                ? "bg-blue-100 text-right"
                : "bg-gray-100"
              }`}
          >
            {c.text}
          </div>

        ))}

      </div>

      <div className="p-3 border-t flex gap-2">

        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ask AI to modify your resume..."
          className="flex-1 border rounded px-3 py-2 text-sm"
        />

        <button
          onClick={sendMessage}
          disabled={loading}
          className="bg-black text-white px-4 py-2 rounded"
        >
          Send
        </button>
      </div>
    </div>
  )
}