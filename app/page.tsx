import type React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  CheckCircle,
  ArrowRight,
  Shield,
  Users,
  BarChart3,
  Globe,
  Layers,
  FileText,
} from "lucide-react";
import NavBar from "@/components/NavBar";
import MobileNav from "@/components/mobile-nav";


export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">

      <NavBar />

       <MobileNav />
       </header>
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-b from-background to-muted">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Transforming SACCO Operations with Blockchain
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Amana Chain Entities (Amana CE) is a blockchain-based
                    platform built on Cardano that transforms how SACCOs operate
                    through innovative features that address their core
                    challenges.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button size="lg" className="px-8" asChild>
                    <Link href="/entity-registry">
                      Get Started
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" className="px-8">
                    Request a Demo
                  </Button>
                </div>
              </div>
              <Image
                src="/Amana_Hero.jpeg"
                width={550}
                height={416}
                alt="Amana CE Platform"
                className="mx-auto aspect-square overflow-hidden rounded-xl object-cover object-center sm:w-full lg:order-last"
              />
            </div>
          </div>
        </section>

        {/* Key Features Section */}
        <section
          id="features"
          className="w-full py-12 md:py-24 lg:py-32 bg-background"
        >
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary">
                  Key Features
                </div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                  Innovative Features for Modern SACCOs
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our platform addresses the core challenges facing SACCOs with
                  blockchain-powered solutions
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-2 lg:gap-12">
              <FeatureList />
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section
          id="benefits"
          className="w-full py-12 md:py-24 lg:py-32 bg-muted"
        >
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary">
                  Benefits
                </div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                  Advantages for SACCOs and Members
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Discover how Amana CE transforms financial cooperatives and
                  empowers communities
                </p>
              </div>
            </div>
            <div className="grid gap-6 pt-12 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>For SACCOs</CardTitle>
                  <CardDescription>Organizational benefits</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <BenefitItem title="Increased Transparency">
                    Complete visibility into all financial transactions and
                    decisions
                  </BenefitItem>
                  <BenefitItem title="Reduced Operational Costs">
                    Automation of key processes reduces administrative overhead
                  </BenefitItem>
                  <BenefitItem title="Improved Governance">
                    Smart contracts ensure rules are followed consistently
                  </BenefitItem>
                  <BenefitItem title="Expanded Reach">
                    Serve members regardless of geographical location
                  </BenefitItem>
                  <BenefitItem title="Enhanced Security">
                    Blockchain technology provides immutable records and
                    multi-signature protection
                  </BenefitItem>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>For Members</CardTitle>
                  <CardDescription>Individual benefits</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <BenefitItem title="Greater Trust">
                    Verify all transactions and decisions on the blockchain
                  </BenefitItem>
                  <BenefitItem title="Improved Access">
                    Access financial services from anywhere, anytime
                  </BenefitItem>
                  <BenefitItem title="Direct Participation">
                    Vote on proposals and participate in governance directly
                  </BenefitItem>
                  <BenefitItem title="Financial Inclusion">
                    Access DeFi services previously unavailable to SACCO members
                  </BenefitItem>
                  <BenefitItem title="Faster Services">
                    Automated processes reduce waiting times for loans and other
                    services
                  </BenefitItem>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section
          id="how-it-works"
          className="w-full py-12 md:py-24 lg:py-32 bg-background"
        >
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary">
                  Process
                </div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                  How Amana CE Works
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  A simple process to transform your SACCO operations
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl gap-6 py-12">
              <div className="grid gap-6 md:grid-cols-3">
                <StepCard
                  number={1}
                  title="Create Your Chain Entity"
                  description="Set up your digital SACCO on the blockchain with customized rules and governance structure"
                />
                <StepCard
                  number={2}
                  title="Enroll Members"
                  description="Onboard existing members and expand your reach to new communities"
                />
                <StepCard
                  number={3}
                  title="Manage Operations"
                  description="Handle treasury, loans, and governance with transparent blockchain-based processes"
                />
              </div>
              <div className="mt-8 flex justify-center">
                <Button size="lg" className="px-8">
                  Schedule a Walkthrough
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section
          id="pricing"
          className="w-full py-12 md:py-24 lg:py-32 bg-muted"
        >
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary">
                  Pricing
                </div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                  Flexible Plans for Every SACCO
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Choose the plan that fits your organization's needs and scale
                  as you grow
                </p>
              </div>
            </div>
            <div className="grid gap-6 pt-12 lg:grid-cols-3">
              <PricingCard
                title="Free"
                price="$0"
                description="For small SACCOs just getting started"
                features={[
                  "Basic Chain Entity creation",
                  "Up to 100 members",
                  "Basic treasury management",
                  "Community support",
                ]}
                buttonText="Get Started"
                buttonVariant="outline"
              />
              <PricingCard
                title="Premium"
                price="$50-200"
                period="/month"
                description="For growing SACCOs with advanced needs"
                features={[
                  "Advanced governance features",
                  "Unlimited members",
                  "Multi-signature treasury",
                  "Priority support",
                  "Custom branding",
                ]}
                buttonText="Choose Plan"
                buttonVariant="default"
                highlighted={true}
              />
              <PricingCard
                title="Enterprise"
                price="Custom"
                description="For large organizations with specific requirements"
                features={[
                  "Tailored solutions",
                  "Dedicated account manager",
                  "Custom integrations",
                  "Advanced analytics",
                  "Training and onboarding",
                ]}
                buttonText="Contact Sales"
                buttonVariant="outline"
              />
            </div>
            <div className="mt-12 text-center">
              <p className="text-muted-foreground">
                All plans include a 0.5% fee on loan disbursements and 0.1-0.3%
                on specific financial transactions.
              </p>
            </div>
          </div>
        </section>

        {/* Partners Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary">
                  Ecosystem
                </div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                  Partners and Integrations
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Built on Cardano with connections to the broader DeFi
                  ecosystem
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12">
              <div className="flex flex-wrap justify-center gap-8">
                <a
                  href="https://www.africanblockchamp.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div className="flex h-20 w-40 items-center justify-center rounded-lg border-l-2 bg-background p-4">
                    <Image
                      src="/Africa_BlockChain_Championship.png"
                      width={180}
                      height={100}
                      alt="African Blockchain Championship"
                      className="h-12"
                    />
                  </div>
                </a>

                <a
                  href="https://www.directed.dev/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                <div className="flex h-20 w-40 items-center justify-center rounded-lg border-l-2 bg-background p-4">
                  <Image
                    src="/DirectEd.png"
                    width={180}
                    height={100}
                    alt="Directed"
                    className="h-12"
                  />
                </div>
                </a>

                <a
                  href="https://cardano.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                <div className="flex h-20 w-40 items-center justify-center rounded-lg border-l-2 bg-background p-4">
                  <Image
                    src="/Cardano.png"
                    width={120}
                    height={60}
                    alt="Cardano"
                    className="h-12"
                  />
                </div>
                </a>
              </div>
            </div>
          </div>
        </section>


        {/* Contact Section */}
        <section
          id="contact"
          className="w-full py-12 md:py-24 lg:py-32 bg-muted"
        >
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary">
                  Contact
                </div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                  Get in Touch
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Have questions or interested in learning more? Reach out to
                  our team.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center">
                    <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">John Ndigirigi</p>
                      <p className="text-sm text-muted-foreground">
                        Project Lead
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-5 w-5 text-primary"
                      >
                        <rect width="20" height="16" x="2" y="4" rx="2" />
                        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium">Email</p>
                      <p className="text-sm text-muted-foreground">
                        johnndigirigi01@gmail.com
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-5 w-5 text-primary"
                      >
                        <path d="M12 2a10 10 0 1 0 10 10H12V2Z" />
                        <path d="M21.18 8.02A10 10 0 0 0 12 2v10h10a10.01 10.01 0 0 0-.82-3.98Z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium">Location</p>
                      <p className="text-sm text-muted-foreground">Kenya</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Send us a Message</CardTitle>
                </CardHeader>
                <CardContent>
                  <form className="space-y-4">
                    <div className="grid gap-2">
                      <label
                        htmlFor="name"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Name
                      </label>
                      <input
                        id="name"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Your name"
                      />
                    </div>
                    <div className="grid gap-2">
                      <label
                        htmlFor="email"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Email
                      </label>
                      <input
                        id="email"
                        type="email"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Your email"
                      />
                    </div>
                    <div className="grid gap-2">
                      <label
                        htmlFor="message"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Message
                      </label>
                      <textarea
                        id="message"
                        className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Your message"
                      />
                    </div>
                    <Button type="submit" className="w-full">
                      Send Message
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full border-t bg-background py-6">
        <div className="container px-4 md:px-6">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-4">
              <Link href="/" className="flex items-center space-x-2">
                <Image
                  src="/Amana_logo.png?height=32&width=32"
                  width={32}
                  height={32}
                  alt="Amana CE Logo"
                />
                <span className="inline-block font-bold">Amana CE</span>
              </Link>
              <p className="text-sm text-muted-foreground">
                Transforming SACCO operations with blockchain technology on the
                Cardano platform.
              </p>
            </div>
            <div className="space-y-4">
              <h4 className="text-sm font-medium">Platform</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="#features"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Features
                  </Link>
                </li>
                <li>
                  <Link
                    href="#benefits"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Benefits
                  </Link>
                </li>
                <li>
                  <Link
                    href="#how-it-works"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    How It Works
                  </Link>
                </li>
                <li>
                  <Link
                    href="#pricing"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Pricing
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-sm font-medium">Company</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/about"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/blog"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Blog
                  </Link>
                </li>
                <li>
                  <Link
                    href="/careers"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Careers
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-sm font-medium">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/terms"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/cookies"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Cookie Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-xs text-muted-foreground mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} Amana CE. All rights reserved.
            </p>
            <div className="flex space-x-4">
              <Link
                href="#"
                className="text-muted-foreground hover:text-foreground"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                </svg>
              </Link>
              <Link
                href="#"
                className="text-muted-foreground hover:text-foreground"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect width="4" height="12" x="2" y="9" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </Link>
              <Link
                href="#"
                className="text-muted-foreground hover:text-foreground"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureList() {
  return (
    <>
      <div className="space-y-6">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
            <Layers className="h-5 w-5 text-primary" />
          </div>
          <div className="space-y-1">
            <h3 className="text-xl font-bold">Modular Architecture</h3>
            <p className="text-muted-foreground">
              Adopt blockchain features incrementally, choosing specific
              components that address your most pressing needs without requiring
              a complete system overhaul.
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
            <Shield className="h-5 w-5 text-primary" />
          </div>
          <div className="space-y-1">
            <h3 className="text-xl font-bold">Platform Independence</h3>
            <p className="text-muted-foreground">
              Maintain ownership of your data and operations, avoiding vendor
              lock-in and ensuring continuity regardless of platform changes.
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
            <BarChart3 className="h-5 w-5 text-primary" />
          </div>
          <div className="space-y-1">
            <h3 className="text-xl font-bold">Transparent Treasury</h3>
            <p className="text-muted-foreground">
              Every financial transaction is recorded immutably on the
              blockchain with multi-signature approval for fund disbursements
              and complete audit trails.
            </p>
          </div>
        </div>
      </div>
      <div className="space-y-6">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
            <FileText className="h-5 w-5 text-primary" />
          </div>
          <div className="space-y-1">
            <h3 className="text-xl font-bold">Programmable Governance</h3>
            <p className="text-muted-foreground">
              Smart contracts automatically enforce rules, eliminating the need
              for trusted intermediaries and reducing administrative overhead.
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
            <Globe className="h-5 w-5 text-primary" />
          </div>
          <div className="space-y-1">
            <h3 className="text-xl font-bold">Borderless Operation</h3>
            <p className="text-muted-foreground">
              By operating on blockchain, SACCOs extend membership beyond
              geographical limitations, serving diaspora communities and broader
              populations.
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5 text-primary"
            >
              <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
            </svg>
          </div>
          <div className="space-y-1">
            <h3 className="text-xl font-bold">Ecosystem Integration</h3>
            <p className="text-muted-foreground">
              Built on Cardano, the platform enables SACCOs to seamlessly
              connect with the broader DeFi ecosystem while maintaining
              regulatory compliance.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

function BenefitItem({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-2">
      <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
      <div>
        <h4 className="font-medium">{title}</h4>
        <p className="text-sm text-muted-foreground">{children}</p>
      </div>
    </div>
  );
}

function StepCard({
  number,
  title,
  description,
}: {
  number: number;
  title: string;
  description: string;
}) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col items-center text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground text-xl font-bold mb-4">
            {number}
          </div>
          <h3 className="text-xl font-bold mb-2">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function PricingCard({
  title,
  price,
  period = "",
  description,
  features,
  buttonText,
  buttonVariant = "default",
  highlighted = false,
}: {
  title: string;
  price: string;
  period?: string;
  description: string;
  features: string[];
  buttonText: string;
  buttonVariant?: "default" | "outline";
  highlighted?: boolean;
}) {
  return (
    <Card
      className={`flex flex-col ${
        highlighted ? "border-primary shadow-lg" : ""
      }`}
    >
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-bold">{price}</span>
          <span className="text-sm text-muted-foreground">{period}</span>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <ul className="space-y-2">
          {features.map((feature, i) => (
            <li key={i} className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-primary" />
              <span className="text-sm">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <div className="p-6 pt-0 mt-auto">
        <Button variant={buttonVariant} className="w-full">
          {buttonText}
        </Button>
      </div>
    </Card>
  );
}
