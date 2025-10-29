"use client"

import type React from "react"

import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, Loader2 } from "lucide-react"
import { useRef, useEffect } from "react"

export function ChatInterface() {
  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  })

  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const input = inputRef.current?.value
    if (input?.trim()) {
      sendMessage({ text: input })
      if (inputRef.current) {
        inputRef.current.value = ""
      }
    }
  }

  return (
    <div className="flex flex-col h-full gap-4">
      {/* Messages Container */}
      <ScrollArea className="flex-1 pr-4">
        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-center py-12">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Welcome to Real Estate AI Assistant</h3>
                <p className="text-sm text-muted-foreground">
                  Ask me about property investments, market trends, or platform features
                </p>
              </div>
            </div>
          ) : (
            messages.map((message) => (
              <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <Card
                  className={`max-w-xs lg:max-w-md px-4 py-2 ${
                    message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
                  }`}
                >
                  <div className="text-sm">
                    {message.parts.map((part, idx) => {
                      if (part.type === "text") {
                        return <p key={idx}>{part.text}</p>
                      }
                      return null
                    })}
                  </div>
                </Card>
              </div>
            ))
          )}
          {status === "in_progress" && (
            <div className="flex justify-start">
              <Card className="bg-muted text-foreground px-4 py-2">
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm">Thinking...</span>
                </div>
              </Card>
            </div>
          )}
          <div ref={scrollRef} />
        </div>
      </ScrollArea>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          ref={inputRef}
          placeholder="Ask about properties, investments, or market trends..."
          disabled={status === "in_progress"}
          className="flex-1"
        />
        <Button
          type="submit"
          disabled={status === "in_progress"}
          size="icon"
          className="bg-primary hover:bg-primary/90"
        >
          {status === "in_progress" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        </Button>
      </form>
    </div>
  )
}
