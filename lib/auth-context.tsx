"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export type UserRole = "student" | "tutor"

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  avatar?: string
  bio?: string
  subjects?: string[]
  createdAt: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  signup: (name: string, email: string, password: string, role: UserRole) => Promise<boolean>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const DEMO_USERS: User[] = [
  {
    id: "1",
    name: "Dr. Sarah Johnson",
    email: "sarah@tutor.com",
    role: "tutor",
    avatar: "/female-professor-avatar.png",
    bio: "PhD in Computer Science with 10+ years teaching experience",
    subjects: ["Machine Learning", "Data Science", "Python"],
    createdAt: "2023-01-15",
  },
  {
    id: "2",
    name: "Alex Chen",
    email: "alex@student.com",
    role: "student",
    avatar: "/male-student-avatar.png",
    bio: "Computer Science undergraduate passionate about AI",
    subjects: ["AI", "Web Development"],
    createdAt: "2024-02-20",
  },
]

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem("ai-tutor-user")
    if (stored) {
      setUser(JSON.parse(stored))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    const foundUser = DEMO_USERS.find((u) => u.email === email)
    if (foundUser && password.length >= 6) {
      setUser(foundUser)
      localStorage.setItem("ai-tutor-user", JSON.stringify(foundUser))
      return true
    }
    return false
  }

  const signup = async (name: string, email: string, password: string, role: UserRole): Promise<boolean> => {
    if (password.length < 6) return false

    const newUser: User = {
      id: Date.now().toString(),
      name,
      email,
      role,
      createdAt: new Date().toISOString(),
      bio: role === "tutor" ? "Experienced educator" : "Eager learner",
      subjects: [],
    }

    setUser(newUser)
    localStorage.setItem("ai-tutor-user", JSON.stringify(newUser))
    return true
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("ai-tutor-user")
  }

  return <AuthContext.Provider value={{ user, isLoading, login, signup, logout }}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth must be used within AuthProvider")
  return context
}

export const getAllUsers = (): User[] => DEMO_USERS
