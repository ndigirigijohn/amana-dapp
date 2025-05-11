// "use client"

// import type React from "react"

// import { useEffect } from "react"
// import { useRouter, usePathname } from "next/navigation"
// import { useAuth, type UserRole } from "@/contexts/auth-context"

// interface ProtectedRouteProps {
//   children: React.ReactNode
//   allowedRoles?: UserRole[]
// }

// export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
//   const { user, isLoading } = useAuth()
//   const router = useRouter()
//   const pathname = usePathname()
//   useEffect(() => {


//   },[]);

//   useEffect(() => {
//     if (!isLoading) {
//       // If not authenticated, redirect to sign in
//       if (!user) {
//         router.push(`/auth/signin?redirect=${encodeURIComponent(pathname)}`)
//         return
//       }

//       // If role-based access control is enabled
//       if (allowedRoles && !allowedRoles.includes(user.role)) {
//         router.push("/unauthorized")
//         return
//       }
//     }
//   }, [user, isLoading, router, pathname, allowedRoles])

//   // Show loading state
//   if (isLoading || !user) {
//     return (
//       <div className="flex min-h-screen items-center justify-center">
//         <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
//       </div>
//     )
//   }

//   // If authenticated and authorized, render children
//   return <>{children}</>
// }
