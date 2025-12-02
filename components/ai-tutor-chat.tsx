"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { groqApi } from "@/lib/groq-client"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Mic,
  MicOff,
  Send,
  Volume2,
  VolumeX,
  Loader2,
  Bot,
  User,
  Sparkles,
  GraduationCap,
  BookOpen,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { JSX } from "react/jsx-runtime"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  audioUrl?: string
  useBrowserTTS?: boolean
}

const DOMAINS = [
  { value: "general", label: "General Learning" },
  { value: "mathematics", label: "Mathematics" },
  { value: "science", label: "Science" },
  { value: "computer", label: "Computer Basics" },
  { value: "programming", label: "Programming" },
  { value: "web-development", label: "Web Development" },
  { value: "app-development", label: "App Development" },
  { value: "game-development", label: "Game Development" },
  { value: "data-science", label: "Data Science" },
  { value: "artificial-intelligence", label: "Artificial Intelligence" },
  { value: "cyber-security", label: "Cyber Security" },
  { value: "english", label: "English" },
  { value: "trading", label: "Trading" },
  { value: "financial-education", label: "Financial Education" },
  { value: "physics", label: "Physics" },
  { value: "chemistry", label: "Chemistry" },
  { value: "biology", label: "Biology" },
  { value: "history", label: "History" },
  { value: "geography", label: "Geography" },
  { value: "psychology", label: "Psychology" },
  { value: "business", label: "Business" },
  { value: "marketing", label: "Marketing" },
  { value: "design", label: "Design" },
  { value: "music", label: "Music" },
]

const LEVELS = [
  { value: "beginner", label: "Beginner", description: "New to the subject" },
  { value: "intermediate", label: "Intermediate", description: "Some experience" },
  { value: "advanced", label: "Advanced", description: "Deep knowledge" },
]

function FormattedContent({ content }: { content: string }) {
  const formatText = (text: string) => {
    const lines = text.split("\n")
    const elements: JSX.Element[] = []
    let listItems: string[] = []
    let listType: "ul" | "ol" | null = null
    let currentIndex = 0

    const flushList = () => {
      if (listItems.length > 0 && listType) {
        const ListTag = listType === "ol" ? "ol" : "ul"
        elements.push(
          <ListTag
            key={`list-${currentIndex}`}
            className={cn("my-2 space-y-1", listType === "ol" ? "list-decimal list-inside" : "list-disc list-inside")}
          >
            {listItems.map((item, i) => (
              <li key={i} className="text-sm leading-relaxed">
                {cleanInlineFormatting(item)}
              </li>
            ))}
          </ListTag>,
        )
        listItems = []
        listType = null
        currentIndex++
      }
    }

    const cleanInlineFormatting = (text: string): React.ReactNode => {
      const cleaned = text
        .replace(/\*\*\*/g, "")
        .replace(/\*\*/g, "")
        .replace(/\*/g, "")
        .replace(/`/g, "")
        .replace(/---/g, "")
        .replace(/--/g, "")
        .replace(/__/g, "")
        .replace(/_/g, "")
        .trim()
      return cleaned
    }

    lines.forEach((line, idx) => {
      const trimmedLine = line.trim()

      if (trimmedLine.match(/^[-*_]{3,}$/)) {
        flushList()
        return
      }

      if (trimmedLine.startsWith("### ")) {
        flushList()
        elements.push(
          <h4 key={`h4-${idx}`} className="font-semibold text-sm mt-3 mb-1 text-primary">
            {cleanInlineFormatting(trimmedLine.replace("### ", ""))}
          </h4>,
        )
      } else if (trimmedLine.startsWith("## ")) {
        flushList()
        elements.push(
          <h3 key={`h3-${idx}`} className="font-bold text-base mt-4 mb-2 text-primary">
            {cleanInlineFormatting(trimmedLine.replace("## ", ""))}
          </h3>,
        )
      } else if (trimmedLine.startsWith("# ")) {
        flushList()
        elements.push(
          <h2 key={`h2-${idx}`} className="font-bold text-lg mt-4 mb-2 gradient-text">
            {cleanInlineFormatting(trimmedLine.replace("# ", ""))}
          </h2>,
        )
      } else if (trimmedLine.match(/^[-•*]\s/)) {
        if (listType !== "ul") {
          flushList()
          listType = "ul"
        }
        listItems.push(trimmedLine.replace(/^[-•*]\s/, ""))
      } else if (trimmedLine.match(/^\d+[.)]\s/)) {
        if (listType !== "ol") {
          flushList()
          listType = "ol"
        }
        listItems.push(trimmedLine.replace(/^\d+[.)]\s/, ""))
      } else if (trimmedLine.match(/^\*\*[^*]+\*\*:?$/)) {
        flushList()
        const boldText = trimmedLine.replace(/\*\*/g, "").replace(/:$/, "")
        elements.push(
          <p key={`bold-${idx}`} className="font-semibold text-sm mt-3 mb-1">
            {boldText}
          </p>,
        )
      } else if (trimmedLine) {
        flushList()
        elements.push(
          <p key={`p-${idx}`} className="text-sm leading-relaxed my-1">
            {cleanInlineFormatting(trimmedLine)}
          </p>,
        )
      } else if (!trimmedLine && elements.length > 0) {
        flushList()
      }
    })

    flushList()
    return elements
  }

  return <div className="space-y-1">{formatText(content)}</div>
}

export function AiTutorChat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [autoPlay, setAutoPlay] = useState(true)
  const [ttsAvailable, setTtsAvailable] = useState(true)
  const [selectedDomain, setSelectedDomain] = useState("general")
  const [selectedLevel, setSelectedLevel] = useState("beginner")

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const synthRef = useRef<SpeechSynthesisUtterance | null>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data)
      }

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" })
        stream.getTracks().forEach((track) => track.stop())
        await processAudio(audioBlob)
      }

      mediaRecorder.start()
      setIsRecording(true)
    } catch (error) {
      console.error("Failed to start recording:", error)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }

  const processAudio = async (audioBlob: Blob) => {
    setIsProcessing(true)
    try {
      const transcription = await groqApi.speechToText(audioBlob)
      if (transcription) {
        await handleSendMessage(transcription)
      }
    } catch (error) {
      console.error("Transcription error:", error)
    } finally {
      setIsProcessing(false)
    }
  }

  const generateResponse = async (userMessage: string): Promise<string> => {
    try {
      const domainLabel = DOMAINS.find((d) => d.value === selectedDomain)?.label || "General Learning"
      const levelLabel = LEVELS.find((l) => l.value === selectedLevel)?.label || "Beginner"

      const levelInstructions = {
        beginner:
          "Use simple language and avoid jargon. Explain concepts from the ground up with basic examples. Be very patient and encouraging. Break down complex ideas into small, digestible steps.",
        intermediate:
          "Assume foundational knowledge exists. Use moderate technical language with explanations for advanced terms. Provide practical examples and connect concepts together.",
        advanced:
          "Use professional and technical language freely. Dive deep into complex topics. Discuss nuances, edge cases, and advanced techniques. Challenge the student with thought-provoking questions.",
      }

      const chatMessages = [
        {
          role: "system",
          content: `You are an expert AI tutor specializing in ${domainLabel}. You are teaching at the ${levelLabel} level.

SUBJECT FOCUS:
- You ONLY answer questions related to ${domainLabel}
- If the question is not related to ${domainLabel}, politely redirect the student to ask about ${domainLabel} topics
- Provide examples and explanations specific to ${domainLabel}

TEACHING LEVEL - ${levelLabel.toUpperCase()}:
${levelInstructions[selectedLevel as keyof typeof levelInstructions]}

PERSONALITY:
- Be patient, encouraging, and supportive
- Celebrate progress and correct mistakes gently
- Use analogies and real-world examples when helpful

FORMATTING RULES - You MUST follow these:
- Use ## for main section headings
- Use ### for sub-headings
- Use numbered lists (1. 2. 3.) for step-by-step instructions or sequential items
- Use bullet points (- ) for non-sequential lists
- Keep paragraphs short and scannable
- Add blank lines between sections for readability

Always structure your responses with clear headings, organized lists, and highlighted key concepts to make learning easier.`,
        },
        ...messages.map((m) => ({
          role: m.role,
          content: m.content,
        })),
        {
          role: "user",
          content: userMessage,
        },
      ]

      const responseContent = await groqApi.chatCompletion(chatMessages)
      return responseContent || "I'm sorry, I couldn't generate a response. Please try again."
    } catch (error) {
      console.error("Generation error:", error)
      return "I'm sorry, there was an error generating a response. Please try again."
    }
  }

  const generateSpeech = async (text: string): Promise<{ audioUrl?: string; useBrowserTTS?: boolean }> => {
    if (!text || text.trim() === "" || !ttsAvailable) {
      return { useBrowserTTS: true }
    }

    try {
      const cleanText = text
        .replace(/#{1,3}\s/g, "")
        .replace(/\*\*/g, "")
        .replace(/\*/g, "")
        .replace(/`/g, "")
        .replace(/^\d+\.\s/gm, "")
        .replace(/^[-•]\s/gm, "")
        .trim()

      const buffer = await groqApi.textToSpeech(cleanText)
      const blob = new Blob([buffer], { type: "audio/wav" })
      const url = URL.createObjectURL(blob)
      return { audioUrl: url }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      if (
        errorMessage.includes("rate_limit") ||
        errorMessage.includes("Rate limit") ||
        errorMessage.includes("rate limit") ||
        errorMessage.includes("too many requests") ||
        errorMessage.includes("TPD") ||
        errorMessage.includes("TPM")
      ) {
        setTtsAvailable(false)
      }
      return { useBrowserTTS: true }
    }
  }

  const playAudio = (url: string) => {
    if (audioRef.current) {
      audioRef.current.pause()
    }

    const audio = new Audio(url)
    audioRef.current = audio
    setIsSpeaking(true)

    audio.onended = () => setIsSpeaking(false)
    audio.onerror = () => setIsSpeaking(false)
    audio.play()
  }

  const speakWithBrowserTTS = (text: string) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel()

      const cleanText = text
        .replace(/#{1,3}\s/g, "")
        .replace(/\*\*/g, "")
        .replace(/\*/g, "")
        .replace(/`/g, "")
        .replace(/^\d+\.\s/gm, "")
        .replace(/^[-•]\s/gm, "")
        .trim()

      const utterance = new SpeechSynthesisUtterance(cleanText)
      utterance.rate = 1.0
      utterance.pitch = 1.0
      utterance.volume = 1.0

      utterance.onstart = () => setIsSpeaking(true)
      utterance.onend = () => setIsSpeaking(false)
      utterance.onerror = () => setIsSpeaking(false)

      synthRef.current = utterance
      window.speechSynthesis.speak(utterance)
    }
  }

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel()
    }
    setIsSpeaking(false)
  }

  const handleSendMessage = async (text: string) => {
    if (!text || typeof text !== "string") return
    const trimmedText = text.trim()
    if (!trimmedText) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: trimmedText,
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsGenerating(true)

    try {
      const responseText = await generateResponse(trimmedText)
      const { audioUrl, useBrowserTTS } = await generateSpeech(responseText)

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: responseText,
        audioUrl,
        useBrowserTTS,
      }

      setMessages((prev) => [...prev, assistantMessage])

      if (autoPlay) {
        if (audioUrl) {
          playAudio(audioUrl)
        } else if (useBrowserTTS) {
          speakWithBrowserTTS(responseText)
        }
      }
    } catch (error) {
      console.error("Error in handleSendMessage:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-4 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="gradient-bg p-3 rounded-xl">
              <Sparkles className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h2 className="text-xl font-bold">AI Tutor Assistant</h2>
              <p className="text-sm text-muted-foreground">
                Ask me anything about your studies
                {!ttsAvailable && " (using browser voice)"}
              </p>
            </div>
          </div>
          <Button
            variant={autoPlay ? "default" : "outline"}
            size="sm"
            onClick={() => setAutoPlay(!autoPlay)}
            className={autoPlay ? "gradient-bg" : ""}
          >
            {autoPlay ? <Volume2 className="h-4 w-4 mr-2" /> : <VolumeX className="h-4 w-4 mr-2" />}
            Auto-play
          </Button>
        </div>

        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2 flex-1 min-w-[200px]">
            <BookOpen className="h-4 w-4 text-muted-foreground shrink-0" />
            <Select value={selectedDomain} onValueChange={setSelectedDomain}>
              <SelectTrigger className="w-full bg-card/50 backdrop-blur border-primary/20">
                <SelectValue placeholder="Select Subject" />
              </SelectTrigger>
              <SelectContent className="max-h-[300px]">
                {DOMAINS.map((domain) => (
                  <SelectItem key={domain.value} value={domain.value}>
                    {domain.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2 flex-1 min-w-[200px]">
            <GraduationCap className="h-4 w-4 text-muted-foreground shrink-0" />
            <Select value={selectedLevel} onValueChange={setSelectedLevel}>
              <SelectTrigger className="w-full bg-card/50 backdrop-blur border-primary/20">
                <SelectValue placeholder="Select Level" />
              </SelectTrigger>
              <SelectContent>
                {LEVELS.map((level) => (
                  <SelectItem key={level.value} value={level.value}>
                    <div className="flex flex-col">
                      <span>{level.label}</span>
                      <span className="text-xs text-muted-foreground">{level.description}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Messages */}
      <Card className="flex-1 overflow-y-auto p-4 space-y-4 bg-card/50 backdrop-blur">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
            <div className="gradient-bg p-6 rounded-full mb-4">
              <Bot className="h-12 w-12 text-primary-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Welcome to AI Tutor!</h3>
            <p className="max-w-md mb-4">
              I'm here to help you learn. Select your subject and level above, then type a message or click the
              microphone to speak!
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm">
                {DOMAINS.find((d) => d.value === selectedDomain)?.label}
              </span>
              <span className="px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-sm">
                {LEVELS.find((l) => l.value === selectedLevel)?.label} Level
              </span>
            </div>
          </div>
        )}

        {messages.map((message) => (
          <div key={message.id} className={cn("flex gap-3", message.role === "user" ? "justify-end" : "justify-start")}>
            {message.role === "assistant" && (
              <div className="gradient-bg p-2 rounded-lg h-fit shrink-0">
                <Bot className="h-5 w-5 text-primary-foreground" />
              </div>
            )}

            <div
              className={cn(
                "max-w-[80%] rounded-2xl px-4 py-3",
                message.role === "user"
                  ? "gradient-bg text-primary-foreground"
                  : "bg-secondary text-secondary-foreground",
              )}
            >
              {message.role === "assistant" ? (
                <FormattedContent content={message.content} />
              ) : (
                <p className="whitespace-pre-wrap">{message.content}</p>
              )}

              {message.role === "assistant" && (message.audioUrl || message.useBrowserTTS) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    if (isSpeaking) {
                      stopAudio()
                    } else if (message.audioUrl) {
                      playAudio(message.audioUrl)
                    } else {
                      speakWithBrowserTTS(message.content)
                    }
                  }}
                  className="mt-2 -ml-2"
                >
                  {isSpeaking ? (
                    <>
                      <VolumeX className="h-4 w-4 mr-1" />
                      Stop
                    </>
                  ) : (
                    <>
                      <Volume2 className="h-4 w-4 mr-1" />
                      Play
                    </>
                  )}
                </Button>
              )}
            </div>

            {message.role === "user" && (
              <div className="bg-secondary p-2 rounded-lg h-fit shrink-0">
                <User className="h-5 w-5 text-secondary-foreground" />
              </div>
            )}
          </div>
        ))}

        {(isProcessing || isGenerating) && (
          <div className="flex gap-3 justify-start">
            <div className="gradient-bg p-2 rounded-lg h-fit">
              <Bot className="h-5 w-5 text-primary-foreground" />
            </div>
            <div className="bg-secondary rounded-2xl px-4 py-3 flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              {isProcessing ? "Processing your speech..." : "Thinking..."}
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </Card>

      {/* Input Area */}
      <div className="mt-4 flex gap-3">
        <Button
          variant={isRecording ? "destructive" : "outline"}
          size="icon"
          onClick={isRecording ? stopRecording : startRecording}
          disabled={isProcessing || isGenerating}
          className={cn("h-12 w-12 rounded-xl shrink-0", isRecording && "recording-pulse")}
        >
          {isRecording ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
        </Button>

        <div className="flex-1 relative">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your question here..."
            className="min-h-12 resize-none pr-12 rounded-xl"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                handleSendMessage(input)
              }
            }}
          />
          <Button
            size="icon"
            onClick={() => handleSendMessage(input)}
            disabled={!input.trim() || isGenerating}
            className="absolute right-2 bottom-2 h-8 w-8 rounded-lg gradient-bg"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
