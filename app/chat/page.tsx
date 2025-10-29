import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { ChatInterface } from "@/components/chat/chat-interface"
import { Card } from "@/components/ui/card"

export default function ChatPage() {
  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground mb-2">AI Real Estate Assistant</h1>
          <p className="text-muted-foreground">
            Get expert insights on property investments, market trends, and platform guidance
          </p>
        </div>

        <Card className="h-[600px] flex flex-col p-6 bg-card border-border">
          <ChatInterface />
        </Card>
      </div>
    </DashboardLayout>
  )
}
