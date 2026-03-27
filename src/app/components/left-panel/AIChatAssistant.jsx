"use client"

import { useState, useRef, useEffect } from "react"
import { applyAIAction } from "@/lib/resumeUpdater"
import { Bot, User, Send, Sparkles, Loader2 } from "lucide-react"

export default function AIChatAssistant({ resumeData, setResumeData }) {

  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [chat, setChat] = useState(() => [
    {
      role: "ai",
      text: "Hi there! I'm your AI assistant. How can I help improve your resume today?"
    }
  ])
  
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chat, loading])

  const sendMessage = async () => {
    if (!message.trim()) return

    const userMessage = {
      role: "user",
      text: message
    }

    setChat((prev) => [...prev, userMessage])
    setMessage("")
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
          text: "Resume updated successfully ✨"
        }
      ])

    } catch (err) {
      console.error(err)
      setChat((prev) => [
        ...prev,
        {
          role: "ai",
          text: "Oops, something went wrong while updating your resume."
        }
      ])
    }

    setLoading(false)
  }

  return (
    <div className="h-full flex flex-col bg-slate-50 relative rounded-2xl overflow-hidden border border-slate-200/60 shadow-inner">
      
      {/* HEADER */}
      <div className="p-4 bg-white/80 backdrop-blur-md border-b border-slate-200/50 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-green-500 to-green-600 p-2 rounded-xl shadow-lg shadow-green-500/20">
            <Sparkles className="size-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-800 tracking-tight leading-none">AI Assistant</h3>
            <p className="text-[11px] text-slate-500 mt-1 font-medium">Powered by ultra-smart models</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
           <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
          </span>
          <span className="text-[10px] text-green-600 font-semibold uppercase tracking-wider">Online</span>
        </div>
      </div>

      {/* CHAT MESSAGES */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5 scroll-smooth">
        {chat.map((c, i) => (
          <div
            key={i}
            className={`flex items-end gap-2 ${c.role === "user" ? "flex-row-reverse" : "flex-row"}`}
          >
            {/* AVATAR */}
            <div className={`flex items-center justify-center size-8 rounded-full shrink-0 shadow-sm ${
              c.role === "user" ? "bg-green-500" : "bg-white border border-slate-200"
            }`}>
              {c.role === "user" ? (
                <User className="size-4 text-white" />
              ) : (
                <Bot className="size-4 text-green-500" />
              )}
            </div>

            {/* BUBBLE */}
            <div
              className={`text-[13px] px-4 py-3 max-w-[80%] leading-relaxed ${
                c.role === "user"
                  ? "bg-green-500 text-white rounded-2xl rounded-br-sm shadow-md shadow-green-500/10"
                  : "bg-white text-slate-700 rounded-2xl rounded-bl-sm border border-slate-200 shadow-sm"
              }`}
            >
              {c.text}
            </div>
          </div>
        ))}
        
        {/* LOADING INDICATOR */}
        {loading && (
          <div className="flex items-end gap-2 flex-row">
            <div className="flex items-center justify-center size-8 rounded-full shrink-0 shadow-sm bg-white border border-slate-200">
               <Bot className="size-4 text-green-500" />
            </div>
            <div className="border border-slate-200 bg-white text-slate-700 rounded-2xl rounded-bl-sm shadow-sm px-4 py-3 flex items-center gap-2">
               <span className="flex space-x-1">
                 <span className="h-1.5 w-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                 <span className="h-1.5 w-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                 <span className="h-1.5 w-1.5 bg-slate-300 rounded-full animate-bounce"></span>
               </span>
            </div>
          </div>
        )}
        
        <div ref={bottomRef} className="h-1" />
      </div>

      {/* INPUT AREA */}
      <div className="p-4 bg-white/80 backdrop-blur-md border-t border-slate-200/50">
        <form 
          onSubmit={(e) => { e.preventDefault(); sendMessage(); }}
          className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-full border border-slate-200/60 shadow-inner"
        >
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ask AI to improve..."
            className="flex-1 bg-transparent border-none px-4 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-0"
            disabled={loading}
          />

          <button
            type="submit"
            disabled={loading || !message.trim()}
            className="flex items-center justify-center p-2.5 bg-green-500 hover:bg-green-600 text-white rounded-full transition-all disabled:opacity-50 disabled:hover:bg-green-500 shadow-md shadow-green-600/20"
          >
            {loading ? <Loader2 className="size-4 text-white animate-spin" /> : <Send className="size-4" />}
          </button>
        </form>
      </div>
    </div>
  )
}