"use client"

import { Heart } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <span>Created with</span>
            <Heart className="h-4 w-4 text-accent fill-accent animate-pulse" />
            <span className="font-semibold gradient-text">Salar Shah</span>
          </div>
          <div className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} AI Tutor. Empowering learning through AI.
          </div>
        </div>
      </div>
    </footer>
  )
}
