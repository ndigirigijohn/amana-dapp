"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/common/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/common/tabs"

export default function HackathonForm() {
  const [activeTab, setActiveTab] = useState("basic")

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Amana CE Hackathon Submission</CardTitle>
        <CardDescription>Our project submission for the Cardano Hackathon</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="basic" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="problem">Problem</TabsTrigger>
            <TabsTrigger value="solution">Solution</TabsTrigger>
            <TabsTrigger value="business">Business</TabsTrigger>
          </TabsList>
          <TabsContent value="basic" className="space-y-4 mt-4">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Project name</h3>
              <p>Amana Chain Entities (Amana CE)</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Project main contact person</h3>
              <p>John Ndigirigi</p>
              <p className="text-sm text-muted-foreground">johnndigirigi01@gmail.com</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Primary Country Affiliation of the Team</h3>
              <p>Kenya</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Which venue did you intend to attend in-person?</h3>
              <p>Kenyatta University</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Describe your idea in 50 characters or less</h3>
              <p>Borderless DeFi and governance platform for SACCOS</p>
            </div>
          </TabsContent>
          <TabsContent value="problem" className="space-y-4 mt-4">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">What stakeholders are you solving a problem for?</h3>
              <p>Our solution addresses two key groups:</p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li>
                  <span className="font-medium">SACCO Members:</span> 30+ million Africans with limited banking access
                  who depend on SACCOs for financial services
                </li>
                <li>
                  <span className="font-medium">SACCO Administrators:</span> 40,000 organizations facing challenges in
                  transparency, governance, and operational efficiency
                </li>
              </ul>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Please quantify the problem as much as you can</h3>
              <p>
                SACCOs serve over 23 million members across Africa, managing approximately $12 billion in assets and
                providing essential financial services to communities underserved by traditional banks. In Kenya alone,
                SACCOs serve more than 5 million members with assets exceeding $5 billion, accounting for nearly 30% of
                national savings.
              </p>
              <p className="mt-2">
                Despite this critical economic role, according to secondary research from multiple sources including the
                World Council of Credit Unions (WOCCU), African Confederation of Cooperative Savings and Credit
                Associations (ACCOSCA), and published academic studies:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li>
                  70% of SACCOs across Africa face significant challenges with financial transparency and reporting
                </li>
                <li>65% struggle with governance and decision-making processes due to centralized structures</li>
                <li>Over 40% report inability to serve potential members due to geographical limitations</li>
                <li>
                  Studies estimate that 10-25% of cooperative funds are at risk due to inadequate oversight systems
                </li>
                <li>Trust issues affect 75% of cooperative financial institutions according to FinAccess surveys</li>
              </ul>
              <p className="mt-2">
                The Alliance for Financial Inclusion reports that improving SACCO governance and transparency could
                increase financial inclusion by up to 30% in underserved communities across Africa.
              </p>
            </div>
          </TabsContent>
          <TabsContent value="solution" className="space-y-4 mt-4">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Please describe your solution</h3>
              <p>
                Amana Chain Entities (Amana CE) is a blockchain-based platform built on Cardano that transforms how
                SACCOs operate through innovative features that address their core challenges:
              </p>
              <ol className="list-decimal pl-6 space-y-2 mt-2">
                <li>
                  <span className="font-medium">Modular Architecture:</span> Our platform's distinctive design allows
                  existing SACCOs to adopt blockchain features incrementally, choosing specific components that address
                  their most pressing needs without requiring a complete system overhaul. This graduated approach
                  significantly lowers adoption barriers and implementation risks.
                </li>
                <li>
                  <span className="font-medium">Platform Independence:</span> SACCOs maintain ownership of their data
                  and operations, avoiding vendor lock-in and ensuring continuity regardless of platform changes.
                </li>
                <li>
                  <span className="font-medium">Transparent Treasury Management:</span> Every financial transaction is
                  recorded immutably on the blockchain with multi-signature approval for fund disbursements, real-time
                  treasury visibility, and complete audit trails.
                </li>
                <li>
                  <span className="font-medium">Programmable Governance:</span> Smart contracts automatically enforce
                  rules, eliminating the need for trusted intermediaries and reducing administrative overhead while
                  ensuring transparent decision-making.
                </li>
                <li>
                  <span className="font-medium">Borderless Operation:</span> By operating on blockchain, SACCOs extend
                  membership beyond geographical limitations, serving diaspora communities and broader populations.
                </li>
                <li>
                  <span className="font-medium">Ecosystem Integration:</span> Built on Cardano, the platform enables
                  SACCOs to seamlessly connect with the broader DeFi ecosystem while maintaining regulatory compliance.
                </li>
              </ol>
              <p className="mt-2">
                Our MVP demonstrates the creation of a digital SACCO ("Chain Entity"), member enrollment, transparent
                financial transactions, and blockchain-based governance in action—showcasing how blockchain technology
                can address the core challenges facing SACCOs while maintaining the community-oriented nature that makes
                these organizations valuable. These capabilities also support UNDP's financial inclusion and governance
                goals by enhancing accessibility to transparent financial services.
              </p>
            </div>
          </TabsContent>
          <TabsContent value="business" className="space-y-4 mt-4">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">How could you make money on this?</h3>
              <p>Our monetization strategy includes multiple revenue streams:</p>
              <ol className="list-decimal pl-6 space-y-4 mt-2">
                <li>
                  <span className="font-medium">Tiered Subscription Model:</span>
                  <ul className="list-disc pl-6 space-y-1 mt-1">
                    <li>Free tier for basic functionalities and small SACCOs</li>
                    <li>Premium tier ($50-200/month) for advanced features based on member count</li>
                    <li>Enterprise tier (custom pricing) for large organizations needing tailored solutions</li>
                  </ul>
                </li>
                <li>
                  <span className="font-medium">Transaction Fees:</span>
                  <ul className="list-disc pl-6 space-y-1 mt-1">
                    <li>0.5% fee on loan disbursements processed through the platform</li>
                    <li>Small percentage fee (0.1-0.3%) on specific financial transactions</li>
                  </ul>
                </li>
                <li>
                  <span className="font-medium">Integration Services:</span>
                  <ul className="list-disc pl-6 space-y-1 mt-1">
                    <li>One-time setup fee ($200-500) for existing SACCOs migrating to our platform</li>
                    <li>Custom integration services for organizations with specific requirements</li>
                  </ul>
                </li>
                <li>
                  <span className="font-medium">Value-Added Services:</span>
                  <ul className="list-disc pl-6 space-y-1 mt-1">
                    <li>Analytics and reporting tools</li>
                    <li>Advanced compliance modules</li>
                    <li>Training and certification programs</li>
                  </ul>
                </li>
              </ol>
              <p className="mt-2">
                We project reaching 100 SACCOs in the first year with an average revenue of $1,200 per SACCO annually,
                growing to 500 SACCOs by year three.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Which Bounty Prize/Prizes are you going for?</h3>
              <ul className="list-disc pl-6 space-y-1 mt-1">
                <li>Cardano Main</li>
                <li>Cardano Pool</li>
              </ul>
              <p className="mt-2">
                Our solution also directly addresses the UNDP AltFinLab challenge: "Accessing financial services"
                (Kenya), supporting SDG 10 (Reduced Inequalities) and SDG 8 (Economic Growth) through
                blockchain-enhanced financial inclusion.
              </p>
            </div>
          </TabsContent>
        </Tabs>
        <div className="flex justify-between mt-6">
          <button
            className="px-4 py-2 rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground"
            onClick={() => {
              const tabs = ["basic", "problem", "solution", "business"]
              const currentIndex = tabs.indexOf(activeTab)
              if (currentIndex > 0) {
                setActiveTab(tabs[currentIndex - 1])
              }
            }}
            disabled={activeTab === "basic"}
          >
            Previous
          </button>
          <button
            className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={() => {
              const tabs = ["basic", "problem", "solution", "business"]
              const currentIndex = tabs.indexOf(activeTab)
              if (currentIndex < tabs.length - 1) {
                setActiveTab(tabs[currentIndex + 1])
              }
            }}
            disabled={activeTab === "business"}
          >
            Next
          </button>
        </div>
      </CardContent>
    </Card>
  )
}
