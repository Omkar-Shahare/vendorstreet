"use client"

import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { VendorDashboard } from "./vendor-dashboard"
import { SupplierDashboard } from "./supplier-dashboard"

export function DashboardPage() {
  const { profile, loading } = useAuth()
  const router = useRouter()

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!profile) {
    router.push("/auth")
    return null
  }

  // Render different dashboards based on user type
  if (profile.userType === 'supplier') {
    return <SupplierDashboard />
  }
  
  return <VendorDashboard />
}
