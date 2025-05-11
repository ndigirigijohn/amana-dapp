// "use client"

// import type React from "react"

// import { createContext, useContext, useEffect, useState } from "react"

// export type UserRole = "admin" | "member"

// export interface User {
//   id: string
//   name: string
//   email: string
//   role: UserRole
// }

// interface AuthContextType {
//   user: User | null
//   isLoading: boolean
//   signIn: (email: string, password: string) => Promise<void>
//   signUp: (name: string, email: string, password: string, role: UserRole) => Promise<void>
//   signOut: () => void
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined)

// export function AuthProvider({ children }: { children: React.ReactNode }) {
//   const [user, setUser] = useState<User | null>(null)
//   const [isLoading, setIsLoading] = useState(true)

//   useEffect(() => {
//     // Check if user is stored in localStorage
//     const storedUser = localStorage.getItem("amana-user")
//     if (storedUser) {
//       setUser(JSON.parse(storedUser))
//     }
//     setIsLoading(false)
//   }, [])

//   const signIn = async (email: string, password: string) => {
//     setIsLoading(true)
//     try {
//       // In a real app, this would be an API call to your backend
//       // For demo purposes, we'll simulate a successful login with a mock user
//       await new Promise((resolve) => setTimeout(resolve, 1000))

//       // Check if email exists in our mock database
//       const mockUsers = JSON.parse(localStorage.getItem("amana-users") || "[]")
//       const foundUser = mockUsers.find((u: any) => u.email === email)

//       if (!foundUser || foundUser.password !== password) {
//         throw new Error("Invalid email or password")
//       }

//       const authenticatedUser: User = {
//         id: foundUser.id,
//         name: foundUser.name,
//         email: foundUser.email,
//         role: foundUser.role,
//       }

//       setUser(authenticatedUser)
//       localStorage.setItem("amana-user", JSON.stringify(authenticatedUser))
//     } catch (error) {
//       console.error("Authentication error:", error)
//       throw error
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const signUp = async (name: string, email: string, password: string, role: UserRole) => {
//     setIsLoading(true)
//     try {
//       // In a real app, this would be an API call to your backend
//       // For demo purposes, we'll simulate a successful registration
//       await new Promise((resolve) => setTimeout(resolve, 1000))

//       // Check if email already exists in our mock database
//       const mockUsers = JSON.parse(localStorage.getItem("amana-users") || "[]")
//       if (mockUsers.some((u: any) => u.email === email)) {
//         throw new Error("Email already in use")
//       }

//       // Create new user
//       const newUser = {
//         id: `user-${Date.now()}`,
//         name,
//         email,
//         password, // In a real app, this would be hashed
//         role,
//       }

//       // Add to mock database
//       mockUsers.push(newUser)
//       localStorage.setItem("amana-users", JSON.stringify(mockUsers))

//       // Auto sign in after registration
//       const authenticatedUser: User = {
//         id: newUser.id,
//         name: newUser.name,
//         email: newUser.email,
//         role: newUser.role,
//       }

//       setUser(authenticatedUser)
//       localStorage.setItem("amana-user", JSON.stringify(authenticatedUser))
//     } catch (error) {
//       console.error("Registration error:", error)
//       throw error
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const signOut = () => {
//     setUser(null)
//     localStorage.removeItem("amana-user")
//   }

//   return <AuthContext.Provider value={{ user, isLoading, signIn, signUp, signOut }}>{children}</AuthContext.Provider>
// }

// export function useAuth() {
//   const context = useContext(AuthContext)
//   if (context === undefined) {
//     throw new Error("useAuth must be used within an AuthProvider")
//   }
//   return context
// }
