import { auth } from "@/auth";
import {
  BarChart3,
  Users,
  DollarSign,
  TrendingUp,
  Activity,
  Calendar,
  ArrowUp,
  ArrowDown,
} from "lucide-react";

export default async function DashboardPage() {
  const session = await auth();
  const name = session?.user.name
  const modifiedName = name ? name.charAt(0).toUpperCase() + name.slice(1) : ""

  const stats = [
    {
      name: "Total Revenue",
      value: "$45,231.89",
      change: "+20.1%",
      trend: "up",
      icon: DollarSign,
      color: "bg-green-500",
    },
    {
      name: "Active Users",
      value: "2,345",
      change: "+15.3%",
      trend: "up",
      icon: Users,
      color: "bg-blue-500",
    },
    {
      name: "Conversion Rate",
      value: "3.24%",
      change: "-2.1%",
      trend: "down",
      icon: TrendingUp,
      color: "bg-purple-500",
    },
    {
      name: "Avg. Session",
      value: "4.5m",
      change: "+5.4%",
      trend: "up",
      icon: Activity,
      color: "bg-orange-500",
    },
  ];

  const recentActivity = [
    {
      id: 1,
      user: "John Doe",
      action: "Completed purchase",
      time: "5 minutes ago",
      amount: "$129.99",
    },
    {
      id: 2,
      user: "Jane Smith",
      action: "Signed up",
      time: "15 minutes ago",
      amount: null,
    },
    {
      id: 3,
      user: "Mike Johnson",
      action: "Upgraded plan",
      time: "25 minutes ago",
      amount: "$49.99",
    },
    {
      id: 4,
      user: "Sarah Williams",
      action: "Made a deposit",
      time: "35 minutes ago",
      amount: "$299.99",
    },
    {
      id: 5,
      user: "Tom Brown",
      action: "Completed survey",
      time: "45 minutes ago",
      amount: null,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {modifiedName}!
        </h1>
        <p className="text-gray-600 mt-1">
          Here's what's happening with your account today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div className={`p-3 ${stat.color} bg-opacity-10 rounded-lg`}>
                <stat.icon
                  className={`w-6 h-6 ${stat.color.replace("bg-", "text-")}`}
                />
              </div>
              <span
                className={`text-sm font-medium flex items-center ${
                  stat.trend === "up" ? "text-green-600" : "text-red-600"
                }`}
              >
                {stat.change}
                {stat.trend === "up" ? (
                  <ArrowUp className="w-4 h-4 ml-1" />
                ) : (
                  <ArrowDown className="w-4 h-4 ml-1" />
                )}
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900 mt-4">
              {stat.value}
            </p>
            <p className="text-sm text-gray-600">{stat.name}</p>
          </div>
        ))}
      </div>

      {/* Charts and Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Placeholder */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Revenue Overview
            </h2>
            <select className="text-sm border border-gray-300 rounded-md px-2 py-1">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Last 3 months</option>
            </select>
          </div>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
            <div className="text-center">
              <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">Chart visualization would go here</p>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Recent Activity
          </h2>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Activity className="w-4 h-4 text-blue-600" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    {activity.action}
                  </p>
                  <p className="text-xs text-gray-500">
                    {activity.user} • {activity.time}
                  </p>
                  {activity.amount && (
                    <p className="text-xs font-semibold text-green-600 mt-1">
                      {activity.amount}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
          <button className="mt-4 w-full text-center text-sm text-blue-600 hover:text-blue-700 font-medium">
            View all activity
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
            <Calendar className="w-6 h-6 text-blue-600 mx-auto mb-2" />
            <span className="text-sm text-gray-700">Schedule</span>
          </button>
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
            <Users className="w-6 h-6 text-purple-600 mx-auto mb-2" />
            <span className="text-sm text-gray-700">Invite</span>
          </button>
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
            <DollarSign className="w-6 h-6 text-green-600 mx-auto mb-2" />
            <span className="text-sm text-gray-700">Payments</span>
          </button>
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
            <BarChart3 className="w-6 h-6 text-orange-600 mx-auto mb-2" />
            <span className="text-sm text-gray-700">Reports</span>
          </button>
        </div>
      </div>
    </div>
  );
}
