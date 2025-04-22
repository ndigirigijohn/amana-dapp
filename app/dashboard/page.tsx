"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/contexts/auth-context"
import { BarChart3, Users, CreditCard, ArrowUpRight } from "lucide-react"

export default function DashboardPage() {
  const { user } = useAuth()
  const isAdmin = user?.role === "admin"

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {user?.name}! Here's an overview of your {isAdmin ? "SACCO" : "account"}.
        </p>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics" disabled={!isAdmin}>
            Analytics
          </TabsTrigger>
          <TabsTrigger value="reports" disabled={!isAdmin}>
            Reports
          </TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{isAdmin ? "Total Members" : "Account Balance"}</CardTitle>
                <div className="h-4 w-4 text-muted-foreground">{isAdmin ? <Users /> : <CreditCard />}</div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{isAdmin ? "1,284" : "$2,850.00"}</div>
                <p className="text-xs text-muted-foreground">
                  {isAdmin ? "+12% from last month" : "Available for withdrawal"}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{isAdmin ? "Active Loans" : "Savings"}</CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{isAdmin ? "342" : "$12,580.00"}</div>
                <p className="text-xs text-muted-foreground">
                  {isAdmin ? "23 approved this week" : "+5.2% from last month"}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{isAdmin ? "Total Assets" : "Loans"}</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{isAdmin ? "$4.2M" : "$8,400.00"}</div>
                <p className="text-xs text-muted-foreground">
                  {isAdmin ? "+18% from last year" : "Outstanding balance"}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{isAdmin ? "New Applications" : "Dividends"}</CardTitle>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{isAdmin ? "57" : "$320.00"}</div>
                <p className="text-xs text-muted-foreground">{isAdmin ? "12 pending review" : "Last distribution"}</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>{isAdmin ? "Recent Transactions" : "Transaction History"}</CardTitle>
                <CardDescription>
                  {isAdmin ? "Overview of recent SACCO transactions" : "Your recent account activity"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex items-center gap-4">
                      <div
                        className={`h-9 w-9 rounded-full flex items-center justify-center ${i % 2 === 0 ? "bg-green-100" : "bg-red-100"}`}
                      >
                        <ArrowUpRight
                          className={`h-5 w-5 ${i % 2 === 0 ? "text-green-600 rotate-180" : "text-red-600"}`}
                        />
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {isAdmin
                            ? i % 2 === 0
                              ? "Loan Disbursement"
                              : "Deposit"
                            : i % 2 === 0
                              ? "Withdrawal"
                              : "Deposit"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(Date.now() - i * 86400000).toLocaleDateString()}
                        </p>
                      </div>
                      <div className={`text-sm font-medium ${i % 2 === 0 ? "text-red-600" : "text-green-600"}`}>
                        {i % 2 === 0 ? "-" : "+"} ${(Math.random() * 1000).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>{isAdmin ? "Member Activity" : "Account Summary"}</CardTitle>
                <CardDescription>{isAdmin ? "Recent member interactions" : "Your account status"}</CardDescription>
              </CardHeader>
              <CardContent>
                {isAdmin ? (
                  <div className="space-y-4">
                    {["John D.", "Sarah M.", "Robert K.", "Emily L."].map((name, i) => (
                      <div key={i} className="flex items-center gap-4">
                        <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                          <Users className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-medium leading-none">{name}</p>
                          <p className="text-xs text-muted-foreground">
                            {["Loan application", "Updated profile", "New deposit", "Withdrawal request"][i]}
                          </p>
                        </div>
                        <div className="text-xs text-muted-foreground">{["2h", "5h", "1d", "2d"][i]} ago</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Membership Status</span>
                      <span className="text-sm font-medium">Active</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Member Since</span>
                      <span className="text-sm font-medium">Jan 2023</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Next Dividend Date</span>
                      <span className="text-sm font-medium">Dec 15, 2023</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Loan Eligibility</span>
                      <span className="text-sm font-medium text-green-600">Eligible</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Credit Score</span>
                      <span className="text-sm font-medium">Excellent</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Analytics Dashboard</CardTitle>
              <CardDescription>Detailed analytics for SACCO administrators</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Analytics content will be displayed here. This section is only available for administrators.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Reports</CardTitle>
              <CardDescription>Generate and view reports for your SACCO</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Reports content will be displayed here. This section is only available for administrators.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>Your recent notifications and alerts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex gap-4 items-start border-b pb-4 last:border-0 last:pb-0">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Bell className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        {
                          [
                            "Your loan application has been approved",
                            "Upcoming dividend distribution",
                            "New security feature added to your account",
                          ][i - 1]
                        }
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(Date.now() - i * 86400000).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Missing import for Bell icon
import { Bell } from "lucide-react"
