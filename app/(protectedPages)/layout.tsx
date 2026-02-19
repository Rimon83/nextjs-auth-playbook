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