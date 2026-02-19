# 🔐 Complete Authentication & Authorization Guide for Next.js
# Auth.JS V5
# 🔐 Introduction to Authentication in Next.js (NextAuth.js)

- 🛡️ Authentication Basics
        Securely verify user identity in web applications
- ⚡ What is NextAuth.js (Auth.js)?
        A complete authentication solution built specifically for Next.js
- 🔑 Multiple Login Methods
        Supports credentials, OAuth (Google, GitHub, etc.), and email login
- 🔄 Session & Token Management
        Handles JWTs and database sessions automatically
- 🧩 Easy Integration
        Works seamlessly with Next.js App Router and Pages Router
- 🚀 Production-Ready & Secure
             Built with security best practices and scalable architecture

## 📸 Project Showcase
![Signin Page](/images/auth-signin.png)
![Signup Page](/images/auth-signup.png)
![Dashboard Page](/images/auth-dashboard.png)
![Profile Page](/images/auth-profile.png)
![Settings Page](/images/auth-settings.png)


# 🧑‍💻 Getting Started with NextAuth.js (Installation & Setup)
```
npm install next-auth@beta

```
# 🗂️ Create Authentication Route
```
 Folder Structure
app
 ├── api
      └── auth
         └── [...nextauth]
            └── route.ts
 ├── auth.ts
 ├── auth.config.ts
 ```
 🔄 Configure Shared Session State (SessionProvider)

- Allows authentication data to be accessible across the entire app
- useSession() only works when the app is wrapped with SessionProvider
- Exposes the session context to all child components

🧩 Step 1: Create a Provider Component: 
📁 app/providers.tsx
```
"use client"
import { SessionProvider } from "next-auth/react";
import React from "react";

const Providers = ({ children }: { children: React.ReactNode }) => {
  return <SessionProvider>{children}</SessionProvider>;
};

export default Providers;
```
🏗️ Step 2: Wrap the Root Layout Component: 
📁 app/layout.tsx
```
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
// @ts-ignore
import "./globals.css";
import Providers from "./_components/Providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Sign in and sign up with NextAuth.js and Google OAuth",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

# Setup Environment Variables
- The environment variable that is mandatory is the AUTH_SECRET. This is a random value used by the library to encrypt tokens.
- To generate the NEXTAUTH_SECRET:
1. Open terminal or command prompt (Git Bash on Windows works well) and run this command: 
```
  openssl rand -base64 32
```
2. You can run ```npx auth secret``` in terminal in your project's root, and it will autogenerate a random value and put it in your .env.local file.
```
AUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000
```
# ⚙️ Configure Auth.js (auth.ts)
📁  Step 1: Create an auth.config.ts file which exports an object containing your Auth.js configuration options. 
```
import { NextAuthConfig } from "next-auth";

export default {
  providers: [],
} satisfies NextAuthConfig;
```

📁  Step 2: Create an auth.ts file and add auth configuration object. This is the auth.ts configuration file you will import from in the rest of your application
```
import NextAuth from "next-auth";
import authConfig from "./auth.config";


export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig
});
```
🧩 Step 3:  Use handlers in Route Handler
After setup the API route, if we type http://localhost:3000/api/auth/providers in browser, we will list all providers

📁 app/api/auth/[...nextauth]/route.ts
```
import { handlers } from "@/auth";
export const { GET, POST } = handle
```

# 🛡️ Protecting Routes
Protect a Single Page with auth()
Key Idea
- 🔐 Use the auth() helper exported from auth.ts
- ⚡ Works on server and client components
- 🚫 If no session → block access
- ✅ If session exists → render content
```
import {auth} from "@/auth"
import {redirect} from "next/navigation"
export default async function DashboardPage (){
 const session = await auth()
 if (!session){
  redirect("/auth/signin")
 }
 return(
  <div>
  <pre>{JSON.stringfy(session, null, 2 )}</pre>
  </div>
 )
}
```
🔐 Protecting API Routes with auth()
- 🧠 Main Idea
- 🛡️ Secure backend APIs using Auth.js
- 🔁 Automatically attach session data to requests
- 🚫 Block unauthenticated access
- ✅ Allow only logged-in users to access data
- ⚙️ How auth() Works for APIs
- 📨 Wraps your API route handler
- 🔑 Adds an auth object to the request
- 📌 req.auth contains the session (or null)

📁 app/api/profile/route.ts
```
export const PUT = auth(async function PUT(req) {
  console.log("request auth" + JSON.stringify(req.auth))
  if (!req.auth) {
  return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
})
```
Protecting Pages with Middleware/proxy
- 🧠 Main Idea
- 🔐 Protect multiple pages at once
- ⚡ Runs before the page loads
- 🧱 Centralized authentication logic
- 🔁 Clean redirect flow using a custom sign-in page

📁 /proxy.ts
When redirect to any route in matcher array,  it will invoke the proxy function.
```
import NextAuth from "next-auth";
import authConfig from "./auth.config";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);
const publicRoutes = ['/', '/auth/signin', '/auth/signup', "/auth/error"]
const protectedRoutes = ['/dashboard', '/profile']
const DEFAULT_REDIRECT = '/dashboard'
export default auth(async function proxy(req) {
  const {nextUrl} = req
  const {pathname} = req.nextUrl
  const isLoggedIn = !!req.auth
  const isPublicRoute = publicRoutes.includes(pathname);
  const isProtectedRoute = protectedRoutes.includes(pathname);

  // If user is logged in and trying to access public route, redirect to dashboard
  if (isLoggedIn && isPublicRoute) {
    return Response.redirect(new URL(DEFAULT_REDIRECT, nextUrl));
  }
  // If user is not logged in and trying to access protected route, redirect to signin
  if (!isLoggedIn && isProtectedRoute) {
    return Response.redirect(new URL('/auth/signin', nextUrl));
  }
  return NextResponse.next();

});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
```
🗂️ Folder-Based Page Protection 
🧠 Main Idea
- 🧱 Separate public and protected pages
- 🧠 Use layout.tsx to enforce auth rules
- 🔐 Check session once per section
- 🧼 Clean, scalable, and easy to maintain
📁 Project Structure
```
app/
├─ (public)/
│  ├─ layout.tsx
│  └─ auth/
│     └─ signin/
│
├─ (protected)/
│  ├─ layout.tsx
│  ├─ dashboard/
│  └─ profile/
```
layout.tsx
```
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import React from 'react'
import DashboardHeader from '../_components/Header';
type props = {
  children: React.ReactNode
}

const AuthenticatedLayout = async ({ children }: props) => {
 const session = await auth();
 
   if (!session?.user) {
     redirect("/auth/signin");
   }
  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader session={session} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}

export default AuthenticatedLayout
```
# 🔑 Configure OAuth Provider (Google / Gmail)
📝 Step 1: Register Your App with Google
1. 🌐 Go to Google Cloud Console
2. 📁 Create a New Project (name the project then click Create) then click on Dashboard
3. 🔐 Click on Go to APIs overview → Configure Consent Screen → Get Started
4. App info: Name the application and Enter your Email → Click Next
5. Audience: Select External → Click Next
6. Contact Info: Type your Email
7. Then Click Create.
8. Click Create OAuth Client.
9. 🖥️Application Type: select Web Application
10. Authorized redirect URIs: The redirect URI should follow this format:
          [origin]/api/auth/callback/[provider]
     in Our case the provider is Google, so The URL is:
          http://localhost:3000/api/auth/callback/google
     For production, we need to change this url to 
      https://{YOUR_DOMAIN}/api/auth/callback/google
11. Then Click Create
12. Get OAuth Credentials: Client ID and Client Secret
13. Store them securely in .env.local, it should follow this pattern: AUTH_[PROVIDER]_ID=
     AUTH_[PROVIDER]_SECRET=
14. If for some reason you want to name the variables differently,
then you will need to manually reference them in the config.
```
AUTH_GOOGLE_ID=your-google-client-id
AUTH_GOOGLE_SECRET=your-google-client-secret
```
⚙️ Step 2: Add Google Provider to NextAuth API
Import the Google provider from the package and pass it to the providers array we setup earlier in the Auth.js config file

- 📁 In auth.config.ts: If follow the environment variable pattern  
```   
AUTH_GOOGLE_ID=
AUTH_GOOGLE_SECRET=
```
```
export default {
  providers: [
    Google,]
}
```
- 📁 auth.config.ts: If use custom environment variable
```    
GOOGLE_CLIENT_ID=
GOOGLE_SECRET_ID=
```
```
export default {
  providers: [
    Google({
     clientId: process.env.GOOGLE_CLIENT_ID
     secretId: process.env.GOOGLE_SECRET_ID
    })]
}
```
Step 3: Create a Sign-In Buttons
🔁 How Redirect Works
- 🚪 User clicks Sign in with Google
- 🌐 Google authentication page opens
- ✅ User approves access
- 🔄 NextAuth redirects user to /dashboard

📁Server component: use signIn function from auth.ts
```
export default function SignIn(){
 return (
  <form action={async () => {
   "use server"
   await signIn("google", {redirectTo: "/dashboard"})
  }}><button type="submit">Sign in with Google</button></form>
 )
}
```
📁Client component: use signIn function from next/auth/react
```
export default function SignIn(){
 return (
 <button onClick={() => signIn("google", {callbackUrl: "/dashboard"})} type="submit">Sign in with Google</button>
 )
}
```
# 🔑 Configure OAuth Provider (GitHub)
📝 Step 1: Register Your App with GitHub

1. 🌐 Go to GitHub → Settings
2. 🔑 Open Developer settings
3. 🧩 Select OAuth Apps
4. ➕ Click New OAuth App
5. 🏷️ Application name - your app name (e.g. My Next.js App)
6. 🌍 Homepage URL:  http://localhost:3000 (later change it with your app domain).
7. 🔁 Authorization callback URL: http://localhost:3000/api/auth/callback/github (later change it with your app domain)
8. ✅ Click Register application
9. 🔑 Generate a Client Secret
10. Copy Client ID and Client Secret
11. Store Keys Securely in .env.local
```
AUTH_GITHUB_ID=your-google-client-id
AUTH_GITHUB_SECRET=your-google-client-secret
```
⚙️ Step 2: Add GitHub Provider to NextAuth API

Import the GitHub provider from the package and pass it to the providers array we setup earlier in the Auth.js config file

📁 auth.config.ts
```
export default {
  providers: [
    Google,Github]
}
````
Step 3: Create a Sign-In Buttons
```export default function SignIn() { return (<button onClick={() => signIn("github", {callbackUrl: "/   dashboard"})} type="submit">Sign in with Google</button>)}
```
# Catch OAuth error (OAuthAccountNotLinked)

- OAuthAccountNotLinked - this error occurs when user try to sign in with email already exists in DB. 
- It redirect to sigin in page with type of error (OAuthAccountNotLinked), so the link like this:
auth/signin?error=OAuthAccountNotLinked
- In sign in page, get the error params using useSearchParams().
auth/Signin/page.tsx
```
 const searchParams = useSearchParams();
  const oathError = searchParams.get("error");
  useEffect(() => {
    if (oathError === "OAuthAccountNotLinked") {
      setServerError(
        "An account with the same email already exists. Please sign in with different email",
      );
    }else{
      setServerError("")
    }
  },[searchParams])
  ```
  # Use Events in callbacks
- Events are asynchronous functions that do not return a response, they are useful for  logs / reporting or handling any other side-effects.
- For example: Use Event to update emailVerified in DB when user signin using OAuth providers because it doesn’t need to verify email
auth.ts
```
events: {
    // If OAuth provider, update the emailVerified in DB with date value because we don't need to verify email for OAuth users
    async linkAccount({ user }) {
      await prisma.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() },
      });
    },
  },
  ```
# Create custom pages
🎨 Create Custom Authentication Pages
⚙️ Step 1: Configure Custom Pages in auth.ts by adding pages property in NextAuth
📁 auth.ts
```
 pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
    signOut: "/auth/signout",
  },
  ```
📁 Step 2: Create Page Routes
```
app/
└─ auth/
   ├─ signin/
   │  └─ page.tsx
   ├─ signout/
   │  └─ page.tsx
   └─ error/
      └─ page.tsx
```
# Setup Database (Prisma) 
- Installation:
```
npm install @prisma/client @prisma/extension-accelerate @auth/prisma-adapter @prisma/adapter-pg
npm install --save-dev prisma@latest
```

- initialize Prisma in your project
```
npx prisma init --db --output ./generated/prisma
The .env file is created, now you can delete the DB URL and replace with your own DB URL.
```

- Set up Prisma Client
Create lib/prisma.ts
```
import { PrismaClient } from "@/prisma/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = global as unknown as {
  prisma: PrismaClient;
};

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter,
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
```
- Change the provider
In the prisma/schema.prisma file, change the provider name with DB that is used for example, if use mongodb, type provider: “mongodb”.
 
- Define your Prisma Schema
In the prisma/schema.prisma file, add User and Account models

- Apply Schema
This will create an SQL migration file and execute it:
```
npm exec prisma migrate dev
```

- Generate Prisma Client
```
npm exec prisma generate
```

Open Prisma Studio to inspect your data
```
npx prisma studio
```
If you update DB model’s fields, you need to run this command: 
```
npx prisma generate 
npx prisma db push
```
```
generator client {
  provider = "prisma-client"
  output   = "./generated/prisma"
}

datasource db {
  provider = "postgresql"
}
enum Role {
  ADMIN
  MODERATOR
  USER
}

model User {
  // id              String    @id @default(auto()) @map("_id") @db.ObjectId // For MongoDB
  id              String    @id @default(cuid())
  email           String    @unique
  password        String?    @unique
  name            String?
  emailVerified   DateTime? @map("email_verified")
  image           String?
  role            Role      @default(USER)
  isActive        Boolean   @default(true)
  createdAt       DateTime  @default(now()) @map("created_at")
  updatedAt       DateTime?  @updatedAt @map("updated_at")
  
  accounts        Account[]
 
  @@map("users")
}

model Account {
  id                 String  @id @default(cuid())
  userId             String  @map("user_id")
  type               String
  provider           String
  providerAccountId  String  @map("provider_account_id")
  refresh_token      String? @db.Text
  access_token       String? @db.Text
  expires_at         Int?
  token_type         String?
  scope              String?
  id_token           String? @db.Text
  session_state      String?
 
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
 
  @@unique([provider, providerAccountId])
  @@map("accounts")
}
```
Add DB adapter in auth configuration
After login with Google or Github, the user info is stored in DB
```
export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  ...authConfig,
})
```
# Credentials Provider (Email & Password)
## Create Signup route
To handle creating new user and save it in DB.
Create actions/signup.ts in root

```
"use server";

import { generateVerificationToken } from "@/lib/generateVerification";
import prisma from "@/lib/prisma";
import { sendVerificationEmail } from "@/lib/sendingEmail";
import { validateEmail, validatePassword } from "@/lib/validation";
import bcrypt from "bcryptjs";

type SignupResult = { success: string } | { error: string };

const signup = async (data: {
  name: string;
  email: string;
  password: string;
}): Promise<SignupResult> => {
  const { email, password, name } = data;
  const lowercaseEmail = email.toLowerCase();

  // Validation
  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  if (!validateEmail(email).isValid) {
    return { error: validateEmail(email).error ?? "Invalid email" };
  }

  if (!validatePassword(password).isValid) {
    return { error: validatePassword(password).error ?? "Invalid password" };
  }

  const existingUser = await prisma.user.findUnique({
    where: { email: lowercaseEmail },
  });

  if (existingUser) {
    return { error: "User already exists" };
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  await prisma.user.create({
    data: {
      name,
      email: lowercaseEmail,
      password: hashedPassword,
    },
  });
  // Generate verification token
  const verificationToken = await generateVerificationToken(lowercaseEmail);
  // Sending verification email
  await sendVerificationEmail(verificationToken.email, verificationToken.token)


  return {
    success: "Please check your email to verify.",
  };
};

export default signup;
```
## Create Signin route
Step 1: Add credentials provider in auth configuration. 
- The credentials object defines the input fields displayed on the sign-in page.
- The authorize function handles the custom login logic and determines whether the credentials provided are valid. It receives the input values defined in credentials, and return either a user object or null. If null is returned, the login fails.
```
 Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // Find user
        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
          include: { accounts: true },
        });
        if (!user) {
          return null;
        }

        // User registered with OAuth but tries credentials
        const hasOAuthAccount = user.accounts.some(
          (account) => account.provider !== "credentials",
        );

        if (hasOAuthAccount && !user.password) {
          throw new Error("OAuthAccountNotLinked");
        }

        if (!user.password) {
          return null;
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(
          credentials.password as string,
          user.password,
        );

        if (!isValidPassword) {
          return null;
        }

        // Check email verification (optional based on your requirements)
        if (!user.emailVerified) {
          // Regenerate email verification token
          const verificationToken = await generateVerificationToken(user.email);
           // Sending verification email
            await sendVerificationEmail(verificationToken.email, verificationToken.token)
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role,
          emailVerified: user.emailVerified,
        };
      },
    }),
    ```
Step 2: Create signin route  
Create actions/signin.ts in root. Validate the email and password or validate the user in DB before passing to credential provider and catch credential errors and send back to signin page.
```
"use server";
import { signIn } from "@/auth";
import { validateEmail, validateSignInPassword } from "@/lib/validation";
import { AuthError } from "next-auth";

type SigninResult = {
  error: string;
} 
// signin function accepts data as params
export async function signin(data: { email: string; password: string }): Promise<SigninResult> {
  try {
    // Validate email format
    if (validateEmail(data.email).isValid === false) {
      return { error: validateEmail(data.email).error || "invalid email" }
      }
    

    // Validate password strength
    if (validateSignInPassword(data.password).isValid === false) {
      return{error: validateSignInPassword(data.password).error || "Invalid password"}
    }

     await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirectTo: "/dashboard",
    });
   
    return {"error":""};
  } catch (error) {

    if (error instanceof AuthError) {
      
      if (error?.cause?.err?.message === "OAuthAccountNotLinked") {
        return {
          error:
            "An account with the same email already exists. Please use a different sign‑in method.",
        };
      }


      switch (error?.type) {
        case "CredentialsSignin":
          return { error: "Invalid email or password" };
        case "AccessDenied":
          return {error: "Please verify your email before signing in, otherwise contact support."};
        default:
          return { error: "An unknown error occurred" };
      }
    }
    throw error;
  }
}
  ```
Step 3: Create signin form  
```const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError("")
    setIsLoading(true);

    try {
      const signInResult = await signin(formData);
      if ("error" in signInResult) {
        setServerError(signInResult.error);
        return
      }
    } catch (error) {
      console.log(error)
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };
  ```

# Extending the NextAuth Session Object (JWT Strategy)
Step 1: Extend NextAuth Types (TypeScript)  
✅ Ensures TypeScript recognizes custom session fields.
```
declare module "next-auth" {
  interface User {
    image?: string | null;
    role?: string | null;
    emailVerified?: Date | null;
  }
  interface Session {
    user: User & DefaultSession["user"];
    provider?: string;
  } 
}
```
Step 2: Return Custom Fields from Credentials Provider
✅ Custom fields (in user object) must be returned from authorize().
```
Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }
        // Find user
        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
          include: { accounts: true },
        });
        if (!user) {
          return null;
        }

        // User registered with OAuth but tries credentials
        const hasOAuthAccount = user.accounts.some(
          (account) => account.provider !== "credentials",
        );

        if (hasOAuthAccount && !user.password) {
          throw new Error("OAuthAccountNotLinked");
        }

        if (!user.password) {
          return null;
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(
          credentials.password as string,
          user.password,
        );

        if (!isValidPassword) {
          return null;
        }

        // Check email verification (optional based on your requirements)
        if (!user.emailVerified) {
          // Regenerate email verification token
          const verificationToken = await generateVerificationToken(user.email);
           // Sending verification email
            await sendVerificationEmail(verificationToken.email, verificationToken.token)
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role,
          emailVerified: user.emailVerified,
        };
      },
    }), 
  
  ```
    Step 3: Store Custom Data in JWT Callback
✅ JWT acts as the single source of truth. 
- We use callbacks in NextAuth.
- Expose Custom Fields in Session Callback. Makes custom data available on the client.
```
callbacks: {
    async jwt({ token, user, account, trigger, profile }) {
      // Initial sign in
      if (user) {
        token.id = user.id
        token.image = user.image;
        token.role = user?.role;
        token.provider = account?.provider;
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.image = token.image as string;
        session.user.role = token.role as string;
      }

      // Provider info for API calls
      session.provider = token.provider as string;

      return session;
    },
}
    
  ```
  # Update the session object
Step 1: Add trigger property in jwt

- If the trigger is update, get the user from DB and select all data that is already stored in session and check if there is any changes

auth.ts
```
 callbacks: {
    async jwt({ token, user, account, trigger, profile }) {
      // Initial sign in
      if (user) {
        token.id = user.id
        token.image = user.image;
        token.role = user?.role;
        token.provider = account?.provider;
      }

      // Handle session updates (when user updates profile)
      if (trigger === "update") {
        // Fetch latest user data from database
        const updatedUser = await prisma.user.findUnique({
          where: { id: token.sub },
          select: {
            name: true,
            image: true,
            role: true,
          },
        });

        if (updatedUser) {
          token.name = updatedUser.name;
          token.image = updatedUser.image;
          token.role = updatedUser.role;
        }
      }

      return token;
    },

  },
  ```
Step 2: Create update function (client side)
- Let’s say we create settings page that allow user to update their name. We use API to update user info in DB and then update the session object using “update” from useSession()

 Create dashboard/settings/page.tsx
 ```
   const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: profileForm.name,
          email: profileForm.email,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update profile");
      }

      // Update session with new user data
      await update({
        ...session,
        user: {
          ...session?.user,
          name: profileForm.name,
          email: profileForm.email,
        },
      });

      setMessage({
        type: "success",
        text: "Profile updated successfully!",
      });

      // Refresh the page to reflect changes
      router.refresh();
    } catch (error: any) {
      setMessage({
        type: "error",
        text: error.message || "Failed to update profile",
      });
    } finally {
      setIsLoading(false);
    }
  };
  ```
Step 3: Create update (PUT) API route (server side)
- Wrap the PUT function with auth to check the authentication
- Check the authorization by checking the session if it exists
- Check the email if it is matched with email in session object, if it is not matched, check if this email is already taken.
- Update user data in DB

 Create api/profile/route.ts
 ```
 
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
export const PUT = auth(async function PUT(req) {
  console.log("request auth" + JSON.stringify(req.auth))
  if (!req.auth) {
  return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, email } = await req.json();

    // Check if email is already taken
    if (email !== session?.user.email) {
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        return NextResponse.json(
          { error: "Email already taken" },
          { status: 400 },
        );
      }
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: { name, email },
      select: { id: true, name: true, email: true, image: true },
    });

    return NextResponse.json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 },
    );
  }
});
```
# Restricting user access

- Prevent users from signing in unless their email is verified, and show a clear error message on the sign-in page.

Step 1: Return emailVerified from authorize()
In auth.config.ts
```
return {
    id: user.id,
    email: user.email,
    name: user.name,
    image: user.image,
    role: user.role,
    emailVerified: user.emailVerified,
   };
```
Step 2:  Block Access in signIn Callback
```
// Not allow user to signin if the the email is not verified
async signIn({ user, account}) {
  if (!user || (account?.provider === "credentials" && !user.emailVerified)) {
    return false;
  }
  return true;
},
```
Step 3:   Catch Auth Errors in Sign-In Route

It catches three errors: 
1. CredentialsSignin - if email or password problem.
2. AccessDenied - if the email is not verified.
3. OAuthAccountNotLinked - if an account with the same email already exists
Now converts technical auth errors into user-friendly messages in signin page.
```
try{}
catch (error) {
  if (error instanceof AuthError) {
    switch (error?.type) {
      case "CredentialsSignin":
        return { error: "Invalid email or password" };
      case "AccessDenied":
        return {error: "Please verify your email before signing in, otherwise contact support."};
      default:
        return { error: "An unknown error occurred" };
    }
  }
  throw error;
  }
  ```
# Custom error type message return from authorize() using Error class
- For example, lets catch OAuthAccountNotLinked error. If user try to signin with email that already exists in DB by using OAUTH provider.
- Update the authorize function in auth.config.ts
```
// Find user
  const user = await prisma.user.findUnique({
    where: { email: credentials.email as string },
    include: { accounts: true },
  });
  if (!user) {
    return null;
  }

  // User registered with OAuth but tries credentials
  const hasOAuthAccount = user.accounts.some(
    (account) => account.provider !== "credentials",
  );

  if (hasOAuthAccount && !user.password) {
    throw new Error("OAuthAccountNotLinked");
  }
```
Now catch the error in signin route.
actions/signin.ts
```
catch (error) {
    if (error instanceof AuthError) {  
      if (error?.cause?.err?.message === "OAuthAccountNotLinked") {
        return {
          error:
            "An account with the same email already exists. Please use a different sign‑in method.",
        };
      }

    }
    throw error;
  }
  ```
# Sending Verification Email
## Setup nodemailer using Gmail with OAuth 2.0 authentication method
step 1: Get Client-ID and Secret-ID for Google.
Step 2:  Get the refresh and access token
1. You will need to list the URL https://developers.google.com/oauthplayground as a valid redirect URI in your Google APIs Console's project.
- Go to https://console.cloud.google.com
- Select the project name that is created in slide 13.
- Click on Credential then click on Client ID that is created
- In Authorized redirect URIs, click on Add URL then add https://developers.google.com/oauthplayground then click Save
- In Same page Select Audience in left side of screen 
- Click Add user then enter your email and click Save
2. Go to https://developers.google.com/oauthplayground/
3. On the top-right corner, click the settings icon
4. Mark Use your own OAuth credentials, then enter the Client ID & Secret we've copied before
5. Now, in the left side, scroll down and select Gmail API v1
6. Select https://mail.google.com/ then click on Authoirse APIs
7. Select your account (which you've added as Test user in the Google developer console)
8. Now, click on Exchange authorize code for tokens
9. Copy Access token and refresh token and paste in .env.local file
```
GOOGLE_REFRESH_TOKEN=********
GMAIL_USER=YOUR_EMAIL

```
Step 3: Install Required Packages
```
npm install nodemailer googleapis
npm i --save-dev @types/nodemailer
```

Step 4: Create reusable transporter 
- Create OAuth2 client and set the refresh token to to get access token. 
- Create lib/emailConfig.ts
```
import nodemailer from "nodemailer";
import { google } from "googleapis";

const OAuth2 = google.auth.OAuth2;

// Create OAuth2 client
const oauth2Client = new OAuth2(
  process.env.AUTH_GOOGLE_ID,
  process.env.AUTH_GOOGLE_SECRET,
  "https://developers.google.com/oauthplayground", // Redirect URL
);

// Set the refresh token
oauth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
});

// Function to get access token
async function getAccessToken() {
  try {
    const { token } = await oauth2Client.getAccessToken();
    if (!token) {
      throw new Error("Failed to get access token");
    }
    return token;
  } catch (error) {
    console.error("Error getting access token:", error);
    throw error;
  }
}

// Create reusable transporter
export async function createTransporter() {
  const accessToken = await getAccessToken();

  return nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      type: "OAuth2",
      user: process.env.GMAIL_USER,
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
      refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
      accessToken: accessToken,
    },
  });
}
```
Step 5: Create email template for verification. Add templates as you need. 
Create lib/emailTemplate.ts
```
export const emailTemplates = {
  verification: (verificationLink: string) => ({
    subject: "Verify Your Email Address",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333;">Welcome!</h1>
        <p style="font-size: 16px; color: #555;">
          Thank you for signing up! Please verify your email address to complete your registration.
        </p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationLink}" 
             style="background-color: #4F46E5; color: white; padding: 12px 24px; 
                    text-decoration: none; border-radius: 5px; font-weight: bold;">
            Verify Email Address
          </a>
        </div>
        <p style="font-size: 14px; color: #777;">
          If the button doesn't work, copy and paste this link into your browser:
        </p>
        <p style="font-size: 12px; color: #999; word-break: break-all;">
          ${verificationLink}
        </p>
        <p style="font-size: 14px; color: #777; margin-top: 30px;">
          This link will expire in 24 hours.
        </p>
      </div>
    `,
    text: `Welcome! Please verify your email by visiting: ${verificationLink}`,
  }),

  welcome: (name?: string) => ({
    subject: "Welcome to Our Platform!",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333;">Welcome${name ? `, ${name}` : ""}!</h1>
        <p style="font-size: 16px; color: #555;">
          Your account has been successfully created and verified.
        </p>
        <p style="font-size: 16px; color: #555;">
          You can now access all features of our platform.
        </p>
        <div style="margin-top: 30px; padding: 20px; background-color: #f8f9fa; border-radius: 5px;">
          <h3 style="color: #333;">Getting Started:</h3>
          <ul style="color: #555;">
            <li>Complete your profile</li>
            <li>Explore our features</li>
            <li>Invite team members</li>
            <li>Check out our tutorials</li>
          </ul>
        </div>
      </div>
    `,
    text: `Welcome${name ? ` ${name}` : ""}! Your account has been successfully created and verified.`,
  }),
};
```
Step 6: Create functions to send verification and welcome email. 
Create lib/sendingEmail.ts
```
import nodemailer from "nodemailer";
import { createTransporter } from "./emailConfig";
import { emailTemplates } from "./emailTemplates";

type EmailOptions = {
  to: string;
  subject: string;
  html: string;
  text?: string;
  from?: string;
};

export async function sendVerificationEmail(email: string, token: string) {
  try {
    const verificationLink = `${process.env.NEXTAUTH_URL}/auth/verify-email?token=${token}`;
    const template = emailTemplates.verification(verificationLink);

    return await sendEmail({
      to: email,
      subject: template.subject,
      html: template.html,
      text: template.text,
    });
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw error;
  }
}

// Sending welcome email
export async function sendWelcomeEmail(email: string, name?: string) {
  try {
    const template = emailTemplates.welcome(name);

    return await sendEmail({
      to: email,
      subject: template.subject,
      html: template.html,
      text: template.text,
    });
  } catch (error) {
    console.error("Error sending welcome email:", error);
    throw error;
  }
}

// Generic email sender
export async function sendEmail({
  to,
  subject,
  html,
  text,
  from = process.env.GMAIL_USER  || 'noreply@yourdomain.com',
}: EmailOptions) {
  try {
    const transporter = await createTransporter();
    
    const mailOptions = {
      from: `"${process.env.EMAIL_SENDER_NAME || 'Your App'}" <${from}>`,
      to,
      subject,
      html,
      text: text || html.replace(/<[^>]*>/g, ''), // Fallback to plain text
    };
    
    const info = await transporter.sendMail(mailOptions);
    
    console.log('Email sent:', info.messageId);
    console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
    
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}
```

# Setup nodemailer using Gmail with App Password authentication method
Step 1:  generate a 16-character App Password 
- This password works like a regular SMTP password but is separate from your main Google account password.
1. Click on Manage Account
2. Click on Security & Signin
3. Click on 2-step verification and complete the steps of verification
4. In search bar look for App Password, name the app then copy the password of 16-character
5. Past the gmail user and password in env.local file
```
GMAIL_USER=YOUR_EMAIL
GMAIL_PASSWORD=*******

```
Step 2: Create reusable transporter 
Create lib/emailConfig.ts
```
export async function createTransporter() {

  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASSWORD
    },
  });
}
```


The remaining steps are same as we have done in Auth 2.0 authentication
# Setup Email verification
Step 1: Add new model in Prism schema
- In schema.prisma.ts file add VerificationToken model  with required properties
```
model VerificationToken {
  id         String   @id @default(cuid())
  email      String
  token      String   @unique
  expires    DateTime
 
  @@map("verification_tokens")
  @@unique([email, token])
}
```
Step 2: Create get verification token function
- This function return verification token by token and by email to use them later
Create lib/getVerification.ts 
```
import prisma from "./prisma";

// Get verification by email
export async function getVerificationByEmail(email: string) {
 try {
  const verificationToken = await prisma.verificationToken.findFirst({
    where: { email },
  });
  return verificationToken;
  
 } catch (error) {
  return null
 }
   
}
// Get verification by token
export async function getVerificationByToken(token: string) {
 try {
  const verificationToken = await prisma.verificationToken.findUnique({
    where: { token },
  });
  return verificationToken;
  
 } catch (error) {
  return null
  
 }
   
}
```
Step 3: Create generate verification token function
- This function checks if the token exists,  delete it, if not, create verification token
Create lib/generateVerification.ts 
```
import prisma from "./prisma";

// Generate a verification token
export async function generateVerificationToken(email: string) {
  const token = crypto.randomUUID();
  // const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // Expires in 24 hours

  // const expires = new Date(Date.now() + 60 * 60 * 1000); // Expires in 1 hour

  const expires = new Date(Date.now() + 2 * 60 * 1000); // Expires in 2 minutes
  // Check if a token already exists for the email
  const existingToken = await prisma.verificationToken.findFirst({
    where: { email },
  });
  if (existingToken) {
    await prisma.verificationToken.delete({
      where: { id : existingToken.id },
    });
  }
  return await prisma.verificationToken.create({
    data: {
      email,
      token,
      expires,
    },
  });
}
```
Step 4: Call generate verification token in signup route
- After creating user, generate verification token and send verification email by using sendVerificationEmail function that is created previously.

actions/signup.ts
```
// Generate verification token
  const verificationToken = await generateVerificationToken(lowercaseEmail);
  // Sending verification email
  await sendVerificationEmail(verificationToken.email, verificationToken.token)
```
Step 5: Call generate verification token in signin route and sending verification email
- If the user try to signin and email is not verified, regenerate new token and send verification email by using sendVerificationEmail function

auth.config.ts
```
// Check email verification (optional based on your requirements)
  if (!user.emailVerified) {
    // Regenerate email verification token
    const verificationToken = await generateVerificationToken(user.email);
      // Sending verification email
    await sendVerificationEmail(verificationToken.email, verificationToken.token)
  }
```
Step 6: Create verify email route (server side)
- This function accept token as param:
- Check if token is expired
- Check if user exists
- Check if the email is verified
- Update user's emailVerified field
- Delete the used token
- Send welcome email

actions/verifyEmail.ts
```
"use server"
import { getVerificationByToken } from "@/lib/getVerification";
import prisma from "@/lib/prisma";
import { sendWelcomeEmail } from "@/lib/sendingEmail";


type VerifyEmailResult = { success: string } | { error: string };
export async function verifyEmail(token: string): Promise<VerifyEmailResult> {
 try {
  //Get verification token from database by token
  const verificationToken = await getVerificationByToken(token);
  if (!verificationToken) {
    return { error: "This verification link is no longer valid." };
  }
  // Check if token is expired
  if (verificationToken.expires < new Date()) {
    return { error: "Token expired" };
  }
  // Check if user exists
  const user = await prisma.user.findUnique({
    where: { email: verificationToken.email },
  });

  // Check if the email is verified
  if (user?.emailVerified) {
   return { success: "Email is already verified" };
  }

  if (!user) {
    return { error: "User not found" };
  }
  // Update user's emailVerified field
  await prisma.user.update({
    where: { email: verificationToken.email },
    data: { email: verificationToken.email, emailVerified: new Date() },
  });
  // Delete the used token
  await prisma.verificationToken.delete({
    where: { token },
  });

  // Send welcome email
  if (user) {
    await sendWelcomeEmail(user.email, user.name || undefined);
  }

  return { success: "Email verified successfully" };
 } catch (error) {
  return { error: "Failed to verify email" };
 }
}
```
Step 7: Create verify email page 

- Now we’ll create the email verification page on the client side.
/auth/verify-email?token=YOUR_TOKEN

What this page does
1. Reads the token from the URL
2. Calls the verifyEmail server action
3. Displays a success or error message

auth/verify-email/page.tsx
```
const searchParams = useSearchParams();
const token = searchParams.get("token");
const handleVerifyEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);
    if (!token) {
      setIsLoading(false);
      return setError("No token provided");
    }
    setTokenExpired(token);
    try {
      await verifyEmail(token).then((result) => {
        if ("error" in result) {
          setError(result.error);
          setCurrentPage("resend email")
        }
        if ("success" in result) {
          setSuccess(result?.success);
        }
      });
    } catch (error) {
      console.log("Error verifying email:", error);
      setError("Failed to verify email");
    } finally {
      setIsLoading(false);
    }
  };
  ```

Step 8: Handle expired token or any errors
- Create resend verify email route. In this function accept token as param. 
- Get token info such as email
- Get user by email
- Check if the email is verified
- Generate new token

actions/resendVerifyEmail.ts
```
"use server"

import { generateVerificationToken } from "@/lib/generateVerification";
import { sendVerificationEmail } from "@/lib/sendingEmail";
import prisma from "@/lib/prisma"; 
import { getVerificationByToken } from "@/lib/getVerification";
type ResendEmailResult = { success: string } | { error: string };
export async function resendVerificationEmail(token: string): Promise<ResendEmailResult> {
 try{
  const expiredVerification = await getVerificationByToken(token);
  if (!expiredVerification) {
    return { error: "Invalid token" };
  }
  const user = await prisma.user.findUnique({
    where: { email: expiredVerification.email },
  });
  if (!user){
   return {error: "User not found"};
  }
  if (user.emailVerified) {
   return { success: "Email is already verified" };
  }
  // Generate new token
  const newVerificationToken = await generateVerificationToken(user.email);
  // Send verification email
  await sendVerificationEmail(newVerificationToken.email, newVerificationToken.token);
  return { success: "Verification email resent. Please check your inbox." };
 }
 catch(error){
  return { error: "Failed to resend verification email" };

 }
}
```
Now in auth/verify-email/page.tsx, add handle resend verify email like handleVerifyEmail function
```
 const handleResendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess("");
    setIsLoading(true);
    
    try {
      await resendVerificationEmail(tokenExpired).then((result) => {
        if ("error" in result) {
          setError(result.error);
        }
        if ("success" in result) {
          setSuccess(result?.success);
          setError("")
        }
      });
    } catch (error) {
      setError("Failed to send verify email");
    } finally {
      setIsLoading(false);
    }
  };
  ```
Step 9: Protect the verify-email route with used token

- If the email is verified successfully, the user can access the verify-email page again with used token if the page is refreshed.

- To protect the route, in actions/verifyEmail.ts add new function and in this function check if the token is already used


actions/verifyEmail.ts
```
export async function protectRoute(token: string) {
  //Get verification token from database by token
  const verificationToken = await getVerificationByToken(token);
  if (!verificationToken) {
    return { error: "This verification link is no longer valid." };
  }
}
```
Step 10: Call protectRoute in client side

- If the token is used, it should redirect to signin page.

auth/verify-email/page.tsx
```
// Protect Verify email route if the token is already used
  const onSubmit = useCallback(async () => {
    if (!token) return;

    setPageLoading(true);

    try {
      const result = await protectRoute(token);

      if (result?.error) {
        router.replace("/auth/signin");
        return;
      } else {
        setPageLoading(false);
      }
    } catch (error) {
      console.error(error);
      router.replace("/auth/signin");
    }
  }, [token, router]);

  useEffect(() => {
    onSubmit();
  }, [onSubmit]);
  ```
  # Reset password
Step 1: Add new model in Prism schema
- In schema.prisma.ts file add PasswordResetToken 
model with required properties
```
model PasswordResetToken {
  id         String   @id @default(cuid())
  email      String
  token      String   @unique
  expires    DateTime
 
  @@map("password_reset_tokens")
  @@unique([email, token])
}
```
Step 2: Create getResetPasswordToken function

- This function return reset password token by token to use it later
Create lib/getResetPasswordToken.ts
```
import prisma from "./prisma";

export async function getResetPasswordToken(token: string) {
 try {
  const verificationToken = await prisma.verificationToken.findUnique({
    where: { token },
  });
  return verificationToken;
  
 } catch (error) {
  return null
  
 }
   
}
```
Step 3: Track the device and browser that the user made changes. (optional)

- We can track the device type and browser then send these information with password reset confirmation email
Create lib/getDeviceInfo.ts 
```
import { headers } from "next/headers";

type DeviceInfoResult = {
  browser: string;
  os: string;
};

const browsers = ["Chrome", "Firefox", "Safari", "Edge"];
const OS = ["Windows", "Mac", "Linux", "Android", "iOS"];
export async function getDeviceInfo(): Promise<DeviceInfoResult> {
  const userAgent = (await headers()).get("user-agent") || "";

  
  const  browser =
    browsers.find((browser) => userAgent.includes(browser)) ?? "Unknown";
  const os = OS.find((os) => userAgent.includes(os)) ?? "Unknown";

  return { browser, os };
}
```
Step 4: Create email template for reset password link

- This function template accepts resetLink as param to allow user to click and redirect to password reset page.
/auth/reset-password?token=${token}
Step 5: Create email template for reset password confirmation

- This function accepts name, browser, and os as params to give user more security info.

lib/emailTemplates.ts
```
 passwordReset: (resetLink: string) => ({
    subject: "Reset Your Password",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333;">Password Reset Request</h1>
        <p style="font-size: 16px; color: #555;">
          You requested to reset your password. Click the button below to create a new password.
        </p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetLink}" 
             style="background-color: #DC2626; color: white; padding: 12px 24px; 
                    text-decoration: none; border-radius: 5px; font-weight: bold;">
            Reset Password
          </a>
        </div>
        <p style="font-size: 14px; color: #777;">
          If you didn't request this, please ignore this email.
        </p>
        <p style="font-size: 12px; color: #999; word-break: break-all;">
          Reset link: ${resetLink}
        </p>
        <p style="font-size: 14px; color: #777; margin-top: 30px;">
          This link will expire in 1 hour.
        </p>
      </div>
    `,
    text: `Reset your password by visiting: ${resetLink}`,
  }),
  passwordResetConfirmation: (name: string, browser: string, os: string) => ({
    subject: "Your Password Has Been Updated",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 30px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <div style="text-align: center background-color: #4CAF50; width: 60px; height: 60px; border-radius: 50%; margin: 0 auto; display: flex; align-items: center; justify-content: center;">
            <span style="color: white; font-size: 30px;">✓</span>
          </div>
          <h2 style="color: #333; margin-top: 20px;">Password Updated Successfully</h2>
        </div>
        
        <p style="color: #666; line-height: 1.6;">Hello ${name ? name : "there"},</p>
        
        <p style="color: #666; line-height: 1.6;">
          Your password has been successfully updated. If you made this change, no further action is needed.
        </p>
        
        <div style="background-color: #FFF3CD; border: 1px solid #FFEEBA; border-radius: 4px; padding: 15px; margin: 25px 0;">
          <p style="color: #856404; margin: 0;">
            <strong>⚠️ Didn't request this change?</strong><br>
            If you didn't change your password, please <a href="${process.env.NEXTAUTH_URL}/contact-support" style="color: #4F46E5;">contact support immediately</a>.
          </p>
        </div>
        
        <hr style="border: none; border-top: 1px solid #eee; margin: 25px 0;">
        
        <p style="color: #999; font-size: 12px; text-align: center;">
          This is an automated security message from Your App.<br>
        </p>
      </div>
      <p> Change Details:</p>
      <p> Date & Time: ${new Date().toLocaleString()}</p>
      <p> Device/Browser: ${browser} on ${os}</p>
      
      <ul>Security Tips:</ul>
      <li> Use a unique password </li>
      <li> Enable two-factor authentication</li>
      <li> Regularly review connected devices</li>
      <li> Never share your passwords</li>
      
      <p>This email was sent as a security notification for your account.</p>  
      <p>Need help? Contact us at support@yourapp.com</p>
      
      © ${new Date().getFullYear()} Your Company Name. All rights reserved.
    `,
    text: `
      PASSWORD CHANGED SUCCESSFULLY
      This email is to confirm that your account password has been successfully changed. 
    `,
  }),
  ```
Step 6: Update sendingEmail function

- Add two functions: one for sending reset password email and another for confirmation that password is updated.

lib/sendingEmail.ts

```
// Sending password reset email
export async function sendPasswordResetEmail(email: string, token: string) {
  try {
    const resetLink = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${token}`;
    const template = emailTemplates.passwordReset(resetLink);

    return await sendEmail({
      to: email,
      subject: template.subject,
      html: template.html,
      text: template.text,
    });
  } catch (error) {
    console.error("Error sending password reset email:", error);
    throw error;
  }
}
// Sending password confirmation email
export async function sendPasswordResetConfirmation(email: string, name: string, browser: string, os: string) {
  try {
   
    const template = emailTemplates.passwordResetConfirmation(name, browser, os);

    return await sendEmail({
      to: email,
      subject: template.subject,
      html: template.html,
      text: template.text,
    });
  } catch (error) {
    console.error("Error sending password reset email:", error);
    throw error;
  }
}
```
Step 7: Create reset password email route (server side)

- The purpose of this function is to send reset password link by email.
- This function accept email as param. And in this function:
 Validate email format
1. Check if user with the email exists
2. Check if user exist and password is not null (not social login)
3. Generate password reset token and send email

actions/resetPasswordEmail.ts
```
"use server"

import { generateVerificationToken } from "@/lib/generateVerification";
import prisma from "@/lib/prisma";
import { sendPasswordResetEmail } from "@/lib/sendingEmail";
import { validateEmail } from "@/lib/validation";

type ResetPasswordEmailResult = { success: string } | { error: string };

export async function resetPasswordEmail(email: string): Promise<ResetPasswordEmailResult> {
  try {
    // Validate email format
    if (validateEmail(email).isValid === false) {
      return { error: validateEmail(email).error || "invalid email" }
    }
    // Check if user with the email exists
    const userExists = await prisma.user.findUnique({
      where: { email },
    });
    if (!userExists) {
      return { error: "User with this email does not exist" };
    }
    // Check if user exist and password is not null (not social login)
    if (userExists && userExists.password === null) {
      return { error: "This email is associated with a social login. Please use the appropriate sign-in method." };
    }
    // Generate password reset token and send email
    const {token} = await generateVerificationToken(email)
    await sendPasswordResetEmail(email, token);
    return { success: "Password reset email sent successfully" };
  } catch (error) {
    console.error("Error sending password reset email:", error);
    return { error: "Failed to send password reset email" };
  }
}
```
Step 8: Create reset password route (server side)

- The purpose of this function is to update the password in DB.
- This function accepts password and token as params. And in this function:
1. Get verification token from database by token
2. Check if token is expired
3. Check if user exists
4. Hash the password and update user model
5. Delete the used token
actions/resetPassword.ts
```
"use server";

import { getDeviceInfo } from "@/lib/getDeviceInfo";
import { getResetPasswordToken } from "@/lib/getResetPasswordToken";
import prisma from "@/lib/prisma";
import { sendPasswordResetConfirmation } from "@/lib/sendingEmail";
import bcrypt from "bcryptjs";

type ResetPasswordResult = { success: string } | { error: string };
export async function resetPassword(
  password: string,
  token: string,
): Promise<ResetPasswordResult> {
  try {
    //Get verification token from database by token
    const verificationToken = await getResetPasswordToken(token);
    if (!verificationToken) {
      return { error: "This verification link is no longer valid." };
    }
    // Check if token is expired
    if (verificationToken.expires < new Date()) {
      return { error: "Token expired" };
    }
    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email: verificationToken.email },
    });

    if (!user) {
      return { error: "User not found" };
    }
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);
    // Update user's password field
    await prisma.user.update({
      where: { email: verificationToken.email },
      data: { password: hashedPassword },
    });
    // Delete the used token
    await prisma.verificationToken.delete({
      where: { token },
    });

    const { browser, os } = await getDeviceInfo();
    // Send welcome email
    if (user) {
      await sendPasswordResetConfirmation(
        user.email,
        user?.name || "",
        browser,
        os,
      );
    }

    return { success: "Password is updated successfully" };
  } catch (error) {
    return { error: "Failed to update the password" };
  }
}
```
Step 9: Create handle submit for both resetPassword and resetPasswordEmail (Client side)
```
 // Handle send reset password link to user
  const handleResetPasswordEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      await resetPasswordEmail(formData.email).then((result) => {
        if ("error" in result) {
          setError(result.error);
        }
        if ("success" in result) {
          setSuccess(result?.success);
        }
      });
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle reset password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      if (!token) {
        setError("Token is missing");
        return;
      }
      await resetPassword(formData.password, token).then((result) => {
        if ("error" in result) {
          setError(result.error);
        }
        if ("success" in result) {
          setTimeout(() => {
             setSuccess(result?.success);
             setFormData({
               email: "",
               password: "",
               confirmPassword: "",
             });
             setIsButtonDisabled((prev) => ({...prev, password: false, confirmPassword: false}))

          },3000)
         router.push("/auth/signin")
          
        }
      });
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };
  ```
Step 10: Protect the reset-password route with used token

- If the password is updated successfully, the user can access the reset-password page again with used token if the page is refreshed.
- To protect the route, in actions/resetPassword.ts add new function and in this function check if the token is already used

actions/resetPassword.ts
```
export async function ProtectResetPassword(token: string) {
  //Get verification token from database by token
  const verificationToken = await getResetPasswordToken(token);
  if (!verificationToken) {
    return { error: "This verification link is no longer valid." };
  }
}
```
Conclusion
- You now have a complete, secure authentication system in Next.js
- The setup supports Credentials and OAuth providers
- Authentication flows are scalable, secure, and production-ready
- You can confidently protect routes, manage sessions, and handle user access
- This foundation can be easily extended for real-world applications

⚡ Made with
* NextJS 
* Tailwind CSS
* Prisma
* Auth js
* Nodemailer

## ✨ Features That Make Us Stand Out

| 🎯 | Feature | Description |
|---|---|---|
| 🔐 | **Secure Auth** | NextAuth.js v5 with multiple providers |
| 📧 | **Email Magic** | Nodemailer OAuth2 integration |
| 🎨 | **Beautiful UI** | Clean, responsive dashboard design |
| 🔄 | **Real-time Updates** | Session management with instant updates |
| 🛡️ | **Type Safe** | Full TypeScript support |


🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.



<p align="center"> <b>If you found this helpful, please ⭐ star the repository!</b><br> <i>It helps others discover the project and motivates us to keep improving.</i> </p>

 




