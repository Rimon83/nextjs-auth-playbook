"use client"
import { Check, Database, Key, Lock, Shield, User } from 'lucide-react';
import React, { useState } from 'react'

const page = () => {
    const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: "Auth.js V5 Complete Tutorial",
      subtitle: "Production-Ready Authentication in Next.js",
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <Shield className="w-24 h-24 mx-auto text-blue-500 mb-4" />
            <p className="text-xl text-gray-700">
              A Deep Dive into Modern Authentication
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-8">
            <div className="bg-blue-50 p-4 rounded-lg">
              <Key className="w-8 h-8 text-blue-600 mb-2" />
              <h3 className="font-semibold">JWT & Sessions</h3>
              <p className="text-sm text-gray-600">Token management</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <Database className="w-8 h-8 text-green-600 mb-2" />
              <h3 className="font-semibold">Database Integration</h3>
              <p className="text-sm text-gray-600">Prisma & adapters</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <User className="w-8 h-8 text-purple-600 mb-2" />
              <h3 className="font-semibold">OAuth Providers</h3>
              <p className="text-sm text-gray-600">Google, GitHub, etc.</p>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg">
              <Lock className="w-8 h-8 text-orange-600 mb-2" />
              <h3 className="font-semibold">Security Best Practices</h3>
              <p className="text-sm text-gray-600">Production ready</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Step 1: Project Setup",
      subtitle: "Installing Dependencies",
      content: (
        <div className="space-y-4">
          <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm">
            <div className="text-green-400"># Create Next.js project</div>
            <div>npx create-next-app@latest my-auth-app</div>
            <div className="mt-2 text-green-400"># Install Auth.js V5</div>
            <div>npm install next-auth@beta</div>
            <div className="mt-2 text-green-400"># Install database tools</div>
            <div>npm install @prisma/client @auth/prisma-adapter</div>
            <div>npm install -D prisma</div>
            <div className="mt-2 text-green-400">
              # Install bcrypt for passwords
            </div>
            <div>npm install bcryptjs</div>
            <div>npm install -D @types/bcryptjs</div>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm">
              <strong>Important:</strong> Auth.js V5 is currently in beta. Use{" "}
              <code className="bg-white px-2 py-1 rounded">next-auth@beta</code>
            </p>
          </div>
        </div>
      ),
    },
    {
      title: "Step 2: Environment Variables",
      subtitle: ".env.local Configuration",
      content: (
        <div className="space-y-4">
          <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm">
            <div className="text-yellow-400"># Authentication Secret</div>
            <div>AUTH_SECRET=your-secret-key-min-32-chars</div>
            <div className="mt-2 text-yellow-400"># Database URL</div>
            <div>DATABASE_URL="postgresql://user:pass@localhost:5432/mydb"</div>
            <div className="mt-2 text-yellow-400"># OAuth Providers</div>
            <div>GOOGLE_CLIENT_ID=your-google-client-id</div>
            <div>GOOGLE_CLIENT_SECRET=your-google-secret</div>
            <div>GITHUB_ID=your-github-id</div>
            <div>GITHUB_SECRET=your-github-secret</div>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <p className="text-sm font-semibold">🔐 Generate AUTH_SECRET:</p>
            <code className="text-xs bg-white px-2 py-1 rounded block mt-2">
              openssl rand -base64 32
            </code>
          </div>
        </div>
      ),
    },
    {
      title: "Step 3: Database Schema",
      subtitle: "Prisma Schema for Auth",
      content: (
        <div className="space-y-4">
          <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-xs overflow-auto max-h-96">
            <div className="text-purple-400">// prisma/schema.prisma</div>
            <pre className="mt-2 whitespace-pre-wrap">
              {`datasource db {
  provider = "postgresql"
  url = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

// User model - stores user information
model User {
  id            String    @id @default(cuid())
  name          String?
  email         String    @unique
  emailVerified DateTime?
  image         String?
  password      String?   // For credentials
  role          String    @default("user")
  accounts      Account[]
  sessions      Session[]
  createdAt     DateTime  @default(now())
}`}
            </pre>
          </div>
        </div>
      ),
    },
    {
      title: "Step 3: Database Schema (cont.)",
      subtitle: "Related Models",
      content: (
        <div className="space-y-4">
          <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-xs overflow-auto max-h-96">
            <div className="text-green-400">
              // OAuth accounts (Google, GitHub, etc.)
            </div>
            <pre className="whitespace-pre-wrap">
              {`model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String?
  access_token      String?
  expires_at        Int?
  token_type        String?
  scope             String?
  user              User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  @@unique([provider, providerAccountId])
}

// Session tracking
model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}`}
            </pre>
          </div>
        </div>
      ),
    },
    {
      title: "Step 4: Auth Configuration",
      subtitle: "auth.ts - Core Configuration",
      content: (
        <div className="space-y-4">
          <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-xs overflow-auto max-h-96">
            <div className="text-purple-400">// auth.ts</div>
            <pre className="mt-2 whitespace-pre-wrap">
              {`import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import GitHub from "next-auth/providers/github"
import Credentials from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  providers: [
    Google,
    GitHub,
    Credentials({ /* see next slide */ })
  ],
  callbacks: { /* see upcoming slides */ }
})`}
            </pre>
          </div>
        </div>
      ),
    },
    {
      title: "Step 5: Credentials Provider",
      subtitle: "Email & Password Authentication",
      content: (
        <div className="space-y-4">
          <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-xs overflow-auto max-h-96">
            <pre className="whitespace-pre-wrap">
              {`Credentials({
  credentials: {
    email: { label: "Email", type: "email" },
    password: { label: "Password", type: "password" }
  },
  async authorize(credentials) {
    if (!credentials?.email || !credentials?.password) {
      throw new Error("Missing credentials")
    }

    const user = await prisma.user.findUnique({
      where: { email: credentials.email as string }
    });

    if (!user || !user.password) {
      throw new Error("Invalid credentials")
    }

    const valid = await bcrypt.compare(
      credentials.password as string,
      user.password
    );

    if (!valid) throw new Error("Invalid credentials")
    return user;
  }
})`}
            </pre>
          </div>
        </div>
      ),
    },
    {
      title: "Step 6: JWT vs Database Sessions",
      subtitle: "Understanding Session Strategies",
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">JWT Strategy</h3>
              <div className="text-sm space-y-2">
                <div className="flex items-start gap-2 text-black">
                  <Check className="w-4 h-4 text-green-600 mt-0.5" />
                  <span>Stateless - no DB queries</span>
                </div>
                <div className="flex items-start gap-2 text-black">
                  <Check className="w-4 h-4 text-green-600 mt-0.5 " />
                  <span>Scales horizontally</span>
                </div>
                <div className="flex items-start gap-2 text-black">
                  <Check className="w-4 h-4 text-green-600 mt-0.5 " />
                  <span>Fast performance</span>
                </div>
                <div className="text-red-600 mt-2">
                  ⚠️ Can't revoke immediately
                </div>
              </div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-900 mb-2">
                Database Strategy
              </h3>
              <div className="text-sm space-y-2">
                <div className="flex items-start gap-2 text-black">
                  <Check className="w-4 h-4 text-green-600 mt-0.5" />
                  <span>Instant revocation</span>
                </div>
                <div className="flex items-start gap-2 text-black">
                  <Check className="w-4 h-4 text-green-600 mt-0.5" />
                  <span>Better for sensitive apps</span>
                </div>
                <div className="flex items-start gap-2 text-black">
                  <Check className="w-4 h-4 text-green-600 mt-0.5 " />
                  <span>Track active sessions</span>
                </div>
                <div className="text-red-600 mt-2">⚠️ DB query per request</div>
              </div>
            </div>
          </div>
          <div className="bg-gray-900 text-gray-100 p-3 rounded-lg font-mono text-xs">
            <pre className="whitespace-pre-wrap">
              {`// Choose your strategy:
session: { strategy: "jwt" } // or "database"`}
            </pre>
          </div>
        </div>
      ),
    },
    {
      title: "Step 7: Callbacks - JWT",
      subtitle: "Customizing JWT Token Content",
      content: (
        <div className="space-y-4">
          <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-xs overflow-auto max-h-96">
            <pre className="whitespace-pre-wrap">
              {`callbacks: {
  // Called when JWT is created or updated
  async jwt({ token, user, trigger, session }) {
    // Initial sign in - add user data to token
    if (user) {
      token.id = user.id;
      token.role = user.role;
      token.email = user.email;
    }

    // Handle session updates from client
    if (trigger === "update" && session) {
      token.name = session.name;
    }

    return token;
  },
}`}
            </pre>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm">
              <strong>💡 Best Practice:</strong> Only store essential data in
              JWT (IDs, roles). Never store sensitive data like passwords or
              credit cards.
            </p>
          </div>
        </div>
      ),
    },
    {
      title: "Step 8: Callbacks - Session",
      subtitle: "Exposing Data to Client",
      content: (
        <div className="space-y-4">
          <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-xs overflow-auto max-h-96">
            <pre className="whitespace-pre-wrap">
              {`callbacks: {
  // Called whenever session is checked
  async session({ session, token }) {
    // Add token data to session object
    if (token) {
      session.user.id = token.id;
      session.user.role = token.role;
      session.user.email = token.email;
    }

    return session;
  },
}`}
            </pre>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <p className="text-sm">
              <strong>⚡ Flow:</strong>
            </p>
            <p className="text-xs mt-2">
              User Signs In → jwt() callback → Data in token → session()
              callback → Data available to client
            </p>
          </div>
        </div>
      ),
    },
    {
      title: "Step 9: API Route Handler",
      subtitle: "app/api/auth/[...nextauth]/route.ts",
      content: (
        <div className="space-y-4">
          <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm">
            <div className="text-purple-400">
              // Export GET and POST handlers
            </div>
            <pre className="mt-2 whitespace-pre-wrap">
              {`import { handlers } from "@/auth"

export const { GET, POST } = handlers`}
            </pre>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm">
              <strong>✅ This creates all auth endpoints:</strong>
            </p>
            <ul className="text-xs mt-2 space-y-1 ml-4">
              <li>• /api/auth/signin - Sign in page</li>
              <li>• /api/auth/signout - Sign out</li>
              <li>• /api/auth/callback/* - OAuth callbacks</li>
              <li>• /api/auth/session - Get session</li>
              <li>• /api/auth/csrf - CSRF token</li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      title: "Step 10: Sign Up API Route",
      subtitle: "Creating New Users",
      content: (
        <div className="space-y-4">
          <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-xs overflow-auto max-h-96">
            <div className="text-purple-400">
              // app/api/auth/signup/route.ts
            </div>
            <pre className="mt-2 whitespace-pre-wrap">
              {`import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const { email, password, name } = await req.json();

  // Validate input
  if (!email || !password) {
    return NextResponse.json(
      { error: "Missing fields" },
      { status: 400 }
    );
  }

  // Check if user exists
  const exists = await prisma.user.findUnique({
    where: { email }
  });

  if (exists) {
    return NextResponse.json(
      { error: "User exists" },
      { status: 400 }
    );
  }`}
            </pre>
          </div>
        </div>
      ),
    },
    {
      title: "Step 10: Sign Up (cont.)",
      subtitle: "Hash Password & Create User",
      content: (
        <div className="space-y-4">
          <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-xs overflow-auto max-h-96">
            <pre className="whitespace-pre-wrap">
              {`  // Hash password (cost factor 10)
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user in database
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
      role: "user"
    }
  });

  return NextResponse.json({
    user: {
      id: user.id,
      email: user.email,
      name: user.name
    }
  });
}`}
            </pre>
          </div>
          <div className="bg-red-50 p-4 rounded-lg">
            <p className="text-sm">
              <strong>🔒 Security Note:</strong> Never return the hashed
              password to client!
            </p>
          </div>
        </div>
      ),
    },
    {
      title: "Step 11: Sign In Page",
      subtitle: "Client Component for Authentication",
      content: (
        <div className="space-y-4">
          <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-xs overflow-auto max-h-96">
            <div className="text-purple-400">// app/signin/page.tsx</div>
            <pre className="mt-2 whitespace-pre-wrap">
              {`"use client"
import { signIn } from "next-auth/react"
import { useState } from "react"

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Sign in with credentials
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false
    });

    if (result?.error) {
      alert("Invalid credentials");
    } else {
      window.location.href = "/dashboard";
    }
  };`}
            </pre>
          </div>
        </div>
      ),
    },
    {
      title: "Step 12: OAuth Sign In",
      subtitle: "Social Login Buttons",
      content: (
        <div className="space-y-4">
          <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-xs overflow-auto max-h-96">
            <div className="text-green-400">
              // Add OAuth buttons in your sign in form
            </div>
            <pre className="mt-2 whitespace-pre-wrap">
              {`const handleOAuthSignIn = (provider) => {
  signIn(provider, { callbackUrl: "/dashboard" });
}

return (
  <div>
    {/* Email/Password Form */}
    <form onSubmit={handleSubmit}>...</form>

    {/* OAuth Buttons */}
    <button onClick={() => handleOAuthSignIn("google")}>
      Sign in with Google
    </button>

    <button onClick={() => handleOAuthSignIn("github")}>
      Sign in with GitHub
    </button>
  </div>
);`}
            </pre>
          </div>
        </div>
      ),
    },
    {
      title: "Step 13: Protected Routes (Server)",
      subtitle: "Server-Side Protection",
      content: (
        <div className="space-y-4">
          <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-xs overflow-auto max-h-96">
            <div className="text-purple-400">
              // app/dashboard/page.tsx (Server Component)
            </div>
            <pre className="mt-2 whitespace-pre-wrap">
              {`import { auth } from "@/auth"
import { redirect } from "next/navigation"

export default async function Dashboard() {
  // Get session on server
  const session = await auth();

  // Redirect if not authenticated
  if (!session) {
    redirect("/signin");
  }

  // Optionally check role
  if (session.user.role !== "admin") {
    redirect("/unauthorized");
  }

  return (
    <div>
      <h1>Welcome {session.user.name}</h1>
      <p>Role: {session.user.role}</p>
    </div>
  );
}`}
            </pre>
          </div>
        </div>
      ),
    },
    {
      title: "Step 14: Protected Routes (Client)",
      subtitle: "Client-Side Protection with useSession",
      content: (
        <div className="space-y-4">
          <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-xs overflow-auto max-h-96">
            <div className="text-purple-400">
              // Client component protection
            </div>
            <pre className="mt-2 whitespace-pre-wrap">
              {`"use client"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function ClientDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/signin");
    }
  }, [status, router]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Welcome {session?.user?.name}</h1>
    </div>
  );
}`}
            </pre>
          </div>
        </div>
      ),
    },
    {
      title: "Step 15: Middleware Protection",
      subtitle: "Protecting Multiple Routes at Once",
      content: (
        <div className="space-y-4">
          <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-xs overflow-auto max-h-96">
            <div className="text-purple-400">
              // middleware.ts (root directory)
            </div>
            <pre className="mt-2 whitespace-pre-wrap">
              {`export { auth as middleware } from "@/auth"

// Or with custom logic:
import { auth } from "@/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isOnDashboard = req.nextUrl.pathname.startsWith("/dashboard");

  if (isOnDashboard && !isLoggedIn) {
    return NextResponse.redirect(new URL("/signin", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"]
}`}
            </pre>
          </div>
        </div>
      ),
    },
    {
      title: "Step 16: What to Store Where",
      subtitle: "Database vs JWT vs Session Best Practices",
      content: (
        <div className="space-y-4">
          <div className="grid gap-3">
            <div className="bg-blue-50 p-3 rounded-lg text-black">
              <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                <Database className="w-5 h-5" />
                Database (User table)
              </h3>
              <ul className="text-xs space-y-1 ml-6 list-disc text-black">
                <li>Email, hashed password</li>
                <li>Profile info (name, image)</li>
                <li>User role, permissions</li>
                <li>Account settings, preferences</li>
                <li>Created/updated timestamps</li>
              </ul>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <h3 className="font-semibold text-green-900 mb-2 flex items-center gap-2">
                <Key className="w-5 h-5" />
                JWT Token (stateless)
              </h3>
              <ul className="text-xs space-y-1 ml-6 list-disc text-black">
                <li>User ID (essential)</li>
                <li>Email (for display)</li>
                <li>Role (for authorization)</li>
                <li>Session expiry time</li>
                <li>❌ Never: passwords, credit cards, PII</li>
              </ul>
            </div>
            <div className="bg-purple-50 p-3 rounded-lg">
              <h3 className="font-semibold text-purple-900 mb-2 flex items-center gap-2">
                <User className="w-5 h-5" />
                Session Object (client access)
              </h3>
              <ul className="text-xs space-y-1 ml-6 list-disc text-black">
                <li>User display data (name, email, image)</li>
                <li>User ID and role</li>
                <li>Any data needed in UI</li>
                <li>Keep minimal for performance</li>
              </ul>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Security Best Practices",
      subtitle: "Production-Ready Checklist",
      content: (
        <div className="space-y-3">
          <div className="grid gap-2">
            <div className="flex items-start gap-2 text-sm">
              <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <span>
                <strong>Use HTTPS</strong> in production always
              </span>
            </div>
            <div className="flex items-start gap-2 text-sm">
              <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <span>
                <strong>Bcrypt cost factor 10+</strong> for password hashing
              </span>
            </div>
            <div className="flex items-start gap-2 text-sm">
              <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <span>
                <strong>Strong AUTH_SECRET</strong> (32+ random chars)
              </span>
            </div>
            <div className="flex items-start gap-2 text-sm">
              <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <span>
                <strong>Environment variables</strong> never in code
              </span>
            </div>
            <div className="flex items-start gap-2 text-sm">
              <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <span>
                <strong>CSRF protection</strong> (built-in with Auth.js)
              </span>
            </div>
            <div className="flex items-start gap-2 text-sm">
              <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <span>
                <strong>Rate limiting</strong> on login/signup endpoints
              </span>
            </div>
            <div className="flex items-start gap-2 text-sm">
              <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <span>
                <strong>Email verification</strong> for new accounts
              </span>
            </div>
            <div className="flex items-start gap-2 text-sm">
              <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <span>
                <strong>Session expiry</strong> and rotation
              </span>
            </div>
            <div className="flex items-start gap-2 text-sm">
              <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <span>
                <strong>Input validation</strong> on all forms
              </span>
            </div>
            <div className="flex items-start gap-2 text-sm">
              <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <span>
                <strong>SQL injection protection</strong> (Prisma handles this)
              </span>
            </div>
          </div>
        </div>
      ),
    },
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };
  return (
     <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 p-8 w-full">
      <div >
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-linear-to-r from-blue-600 to-indigo-600 text-white p-6">
            <h1 className="text-3xl font-bold mb-2">{slides[currentSlide].title}</h1>
            <p className="text-blue-100">{slides[currentSlide].subtitle}</p>
            <div>
              {slides[currentSlide].content}
            </div>
            </div>
            </div>
            </div>
            <div className='flex justify-center items-center gap-4'>
              <button onClick={() => nextSlide()}>Next</button>
              <button onClick={() => prevSlide()}>Previous</button>

            </div>
            </div>
  )
}

export default page