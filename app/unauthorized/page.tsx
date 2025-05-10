import Link from "next/link"
import { Button } from "@/components/common/button"
import { ShieldAlert } from "lucide-react"

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background">
      <div className="flex flex-col items-center justify-center space-y-4 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
          <ShieldAlert className="h-10 w-10 text-muted-foreground" />
        </div>
        <h1 className="text-4xl font-bold tracking-tighter">Unauthorized Access</h1>
        <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed">
          You don't have permission to access this page. Please contact your administrator if you believe this is an
          error.
        </p>
        <div className="flex flex-col gap-2 min-[400px]:flex-row">
          <Button asChild size="lg">
            <Link href="/dashboard">Go to Dashboard</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/">Return to Home</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
