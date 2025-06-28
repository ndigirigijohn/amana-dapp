import * as React from "react"
import { cn } from "@/lib/utils"

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    variant?: 'default' | 'glass' | 'glow'
  }
>(({ className, variant = 'default', ...props }, ref) => {
  const baseClasses = "text-card-foreground"
  
  const variantClasses = {
    default: "rounded-lg border bg-card shadow-sm",
    glass: "relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl",
    glow: "relative group bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl hover:border-emerald-500/30 transition-all duration-300"
  }

  return (
    <>
      {variant === 'glow' && (
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      )}
      <div
        ref={ref}
        className={cn(
          baseClasses,
          variantClasses[variant],
          className
        )}
        {...props}
      />
    </>
  )
})
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    variant?: 'default' | 'glass' | 'gradient'
  }
>(({ className, variant = 'default', ...props }, ref) => {
  const variantClasses = {
    default: "flex flex-col space-y-1.5 p-6",
    glass: "flex flex-col space-y-1.5 p-6 bg-white/5 backdrop-blur-sm border-b border-white/10",
    gradient: "flex flex-col space-y-1.5 p-6 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border-b border-white/10"
  }

  return (
    <div
      ref={ref}
      className={cn(variantClasses[variant], className)}
      {...props}
    />
  )
})
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement> & {
    variant?: 'default' | 'light' | 'gradient'
  }
>(({ className, variant = 'default', ...props }, ref) => {
  const variantClasses = {
    default: "text-2xl font-semibold leading-none tracking-tight",
    light: "text-2xl font-semibold leading-none tracking-tight text-white",
    gradient: "text-2xl font-semibold leading-none tracking-tight bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent"
  }

  return (
    <h3
      ref={ref}
      className={cn(variantClasses[variant], className)}
      {...props}
    />
  )
})
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement> & {
    variant?: 'default' | 'light'
  }
>(({ className, variant = 'default', ...props }, ref) => {
  const variantClasses = {
    default: "text-sm text-muted-foreground",
    light: "text-sm text-gray-300"
  }

  return (
    <p
      ref={ref}
      className={cn(variantClasses[variant], className)}
      {...props}
    />
  )
})
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

// Specialized Card Components for Dashboard

const GlassCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    glow?: boolean
  }
>(({ className, glow = false, children, ...props }, ref) => (
  <div className="relative group">
    {glow && (
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
    )}
    <div
      ref={ref}
      className={cn(
        "relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl",
        glow && "hover:border-emerald-500/30 transition-all duration-300",
        className
      )}
      {...props}
    >
      {children}
    </div>
  </div>
))
GlassCard.displayName = "GlassCard"

const MetricCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    title: string
    value: string
    icon?: React.ReactNode
    change?: string
    positive?: boolean
  }
>(({ className, title, value, icon, change, positive, ...props }, ref) => (
  <GlassCard
    ref={ref}
    className={cn("p-4", className)}
    glow
    {...props}
  >
    <div className="flex items-center justify-between mb-4">
      {icon && <div className="text-emerald-400">{icon}</div>}
      {change && (
        <div className={cn(
          "text-xs px-2 py-1 rounded-lg",
          positive 
            ? "bg-emerald-500/20 text-emerald-400" 
            : "bg-red-500/20 text-red-400"
        )}>
          {change}
        </div>
      )}
    </div>
    <div>
      <p className="text-2xl font-bold text-white mb-1">{value}</p>
      <p className="text-sm text-gray-400">{title}</p>
    </div>
  </GlassCard>
))
MetricCard.displayName = "MetricCard"

const ActionCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    title: string
    description: string
    icon?: React.ReactNode
    onClick?: () => void
    href?: string
  }
>(({ className, title, description, icon, onClick, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex items-center justify-between p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl hover:border-emerald-500/30 transition-all duration-200 group cursor-pointer",
      className
    )}
    onClick={onClick}
    {...props}
  >
    <div className="flex items-center space-x-3">
      {icon && (
        <div className="p-2 bg-emerald-500/20 rounded-xl">
          {icon}
        </div>
      )}
      <div>
        <p className="font-medium text-white">{title}</p>
        <p className="text-sm text-gray-400">{description}</p>
      </div>
    </div>
    {children}
  </div>
))
ActionCard.displayName = "ActionCard"

const StatCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    title: string
    value: string
    change: string
    icon: React.ElementType
    positive: boolean
  }
>(({ className, title, value, change, icon: Icon, positive, ...props }, ref) => (
  <GlassCard
    ref={ref}
    className={cn("p-6", className)}
    glow
    {...props}
  >
    <div className="flex items-center justify-between mb-4">
      <Icon className="h-6 w-6 text-emerald-400" />
      <div className={cn(
        "text-xs px-2 py-1 rounded-lg",
        positive 
          ? "bg-emerald-500/20 text-emerald-400" 
          : "bg-yellow-500/20 text-yellow-400"
      )}>
        {change}
      </div>
    </div>
    <div>
      <p className="text-2xl font-bold text-white mb-1">{value}</p>
      <p className="text-sm text-gray-400">{title}</p>
    </div>
  </GlassCard>
))
StatCard.displayName = "StatCard"

export { 
  Card, 
  CardHeader, 
  CardFooter, 
  CardTitle, 
  CardDescription, 
  CardContent,
  GlassCard,
  MetricCard,
  ActionCard,
  StatCard
}