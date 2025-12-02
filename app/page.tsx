import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { AiTutorChat } from "@/components/ai-tutor-chat"

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <AiTutorChat />
      </main>
      <Footer />
    </div>
  )
}
