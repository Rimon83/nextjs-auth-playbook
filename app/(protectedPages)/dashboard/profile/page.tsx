// app/dashboard/profile/page.tsx
import { auth } from "@/auth";
import { Mail, User, Calendar, Shield, Globe, Smartphone } from "lucide-react";

export default async function ProfilePage() {
  const session = await auth();

  const user = session?.user;
  const provider = session?.provider || "credentials";

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Your Profile</h1>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-8">
          <div className="flex items-center space-x-4">
            {user?.image ? (
              <img
                src={user.image}
                alt={user.name || "User"}
                className="w-20 h-20 rounded-full ring-4 ring-white"
              />
            ) : (
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-blue-600">
                  {user?.name?.charAt(0) || user?.email?.charAt(0) || "U"}
                </span>
              </div>
            )}
            <div>
              <h2 className="text-2xl font-bold text-white">
                {user?.name || "User"}
              </h2>
              <p className="text-blue-100">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Profile Details */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900 mb-4">
                Account Information
              </h3>

              <div className="flex items-start space-x-3">
                <User className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Full Name</p>
                  <p className="text-gray-900">{user?.name || "Not set"}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Email Address</p>
                  <p className="text-gray-900">{user?.email}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Shield className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Account Type</p>
                  <p className="text-gray-900 capitalize">{provider}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900 mb-4">
                Security & Activity
              </h3>

              <div className="flex items-start space-x-3">
                <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Member Since</p>
                  <p className="text-gray-900">February 2024</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Globe className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Last Login</p>
                  <p className="text-gray-900">Today at 2:30 PM</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Smartphone className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Active Devices</p>
                  <p className="text-gray-900">2 active sessions</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 pt-6 border-t border-gray-200 flex space-x-4">
            <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700">
              Edit Profile
            </button>
            <button className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50">
              View Activity Log
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
