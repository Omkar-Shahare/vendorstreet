"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Navigation } from "@/components/navigation"
import { useLanguage } from "@/hooks/use-language"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"
import { CreateGroupModal } from "./create-group-modal"
import { GroupDetailsModal } from "./group-details-modal"
import { Users, Clock, TrendingDown, Plus, MapPin } from "lucide-react"

interface GroupBuy {
  id: string
  title: string
  description: string
  organizer: string
  location: string
  targetAmount: number
  currentAmount: number
  participants: number
  maxParticipants: number
  timeLeft: string
  category: string
  savings: string
  status: "active" | "completed" | "upcoming"
  participantsList?: string[]
}

export function GroupBuyingPage() {
  const { t } = useLanguage()
  const { profile } = useAuth()
  const { toast } = useToast()
  const [activeGroups, setActiveGroups] = useState<GroupBuy[]>([])
  const [myGroups, setMyGroups] = useState<GroupBuy[]>([])
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [selectedGroup, setSelectedGroup] = useState<GroupBuy | null>(null)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)

  useEffect(() => {
    // Demo data
    const demoGroups: GroupBuy[] = [
      {
        id: "1",
        title: "Bulk Onion Purchase - Andheri",
        description: "Group buying 500kg onions at wholesale price",
        organizer: "Raj Kumar",
        location: "Andheri, Mumbai",
        targetAmount: 15000,
        currentAmount: 12000,
        participants: 8,
        maxParticipants: 12,
        timeLeft: "2 days",
        category: "vegetables",
        savings: "25%",
        status: "active",
        participantsList: ["Raj Kumar", "Priya Sharma", "Mohammed Ali", "Sunita Devi", "Amit Patel", "Ravi Singh", "Meera Joshi", "Kiran Patel"]
      },
      {
        id: "2",
        title: "Spice Mix Wholesale Deal",
        description: "Premium spices at 30% discount for bulk order",
        organizer: "Priya Sharma",
        location: "Karol Bagh, Delhi",
        targetAmount: 25000,
        currentAmount: 18500,
        participants: 15,
        maxParticipants: 20,
        timeLeft: "5 days",
        category: "spices",
        savings: "30%",
        status: "active",
        participantsList: ["Priya Sharma", "Raj Kumar", "Mohammed Ali", "Sunita Devi", "Amit Patel"]
      },
      {
        id: "3",
        title: "Cooking Oil Bulk Order",
        description: "Sunflower oil 15L containers at wholesale rates",
        organizer: "Mohammed Ali",
        location: "Bandra, Mumbai",
        targetAmount: 20000,
        currentAmount: 20000,
        participants: 10,
        maxParticipants: 10,
        timeLeft: "Completed",
        category: "oils",
        savings: "20%",
        status: "completed",
        participantsList: ["Mohammed Ali", "Raj Kumar", "Priya Sharma", "Sunita Devi", "Amit Patel"]
      },
    ]

    setActiveGroups(demoGroups.filter((g) => g.status === "active"))
    // Show groups where user is organizer or participant
    setMyGroups(demoGroups.filter((g) => 
      g.organizer === profile?.name || 
      g.participantsList?.includes(profile?.name || "")
    ))
  }, [])

  const getProgressPercentage = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100)
  }

  const handleCreateGroup = async (groupData: any) => {
    // In a real app, this would make an API call
    const newGroup: GroupBuy = {
      id: Date.now().toString(),
      title: groupData.title,
      description: groupData.description,
      organizer: profile?.name || "Unknown",
      location: groupData.location,
      targetAmount: groupData.targetAmount,
      currentAmount: 0,
      participants: 1,
      maxParticipants: groupData.maxParticipants,
      timeLeft: `${groupData.duration} days`,
      category: groupData.category,
      savings: "25%", // This would be calculated based on the deal
      status: "active",
      participantsList: [profile?.name || "Unknown"]
    }
    
    setActiveGroups(prev => [newGroup, ...prev])
    setMyGroups(prev => [newGroup, ...prev])
    
    toast({
      title: "Group Created Successfully!",
      description: "Your group buying initiative has been created and is now live.",
    })
  }

  const handleJoinGroup = async (groupId: string) => {
    // In a real app, this would make an API call
    setActiveGroups(prev => prev.map(group => {
      if (group.id === groupId && group.participants < group.maxParticipants) {
        const updatedGroup = {
          ...group,
          participants: group.participants + 1,
          currentAmount: group.currentAmount + (group.targetAmount / group.maxParticipants),
          participantsList: [...(group.participantsList || []), profile?.name || "Unknown"]
        }
        
        // Add to my groups if not already there
        setMyGroups(prev => {
          const exists = prev.some(g => g.id === groupId)
          return exists ? prev.map(g => g.id === groupId ? updatedGroup : g) : [updatedGroup, ...prev]
        })
        
        return updatedGroup
      }
      return group
    }))
    
    toast({
      title: "Successfully Joined Group!",
      description: "You've been added to the group buying initiative.",
    })
  }

  const handleViewDetails = (group: GroupBuy) => {
    setSelectedGroup(group)
    setIsDetailsModalOpen(true)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{t("group_buying")}</h1>
            <p className="text-gray-600">{t("group_buying_subtitle")}</p>
          </div>
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            {t("create_group")}
          </Button>
        </div>

        <Tabs defaultValue="active" className="space-y-6">
          <TabsList>
            <TabsTrigger value="active">{t("active_groups")}</TabsTrigger>
            <TabsTrigger value="my-groups">{t("my_groups")}</TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {activeGroups.map((group) => (
                <Card key={group.id} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleViewDetails(group)}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-2">{group.title}</CardTitle>
                        <CardDescription className="flex items-center mb-2">
                          <MapPin className="h-4 w-4 mr-1" />
                          {group.location}
                        </CardDescription>
                        <p className="text-sm text-gray-600">{group.description}</p>
                      </div>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        {group.savings} {t("savings")}
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>{t("progress")}</span>
                        <span>
                          ₹{group.currentAmount.toLocaleString()} / ₹{group.targetAmount.toLocaleString()}
                        </span>
                      </div>
                      <Progress value={getProgressPercentage(group.currentAmount, group.targetAmount)} />
                    </div>

                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="flex items-center justify-center mb-1">
                          <Users className="h-4 w-4 text-blue-600" />
                        </div>
                        <p className="text-sm font-medium">
                          {group.participants}/{group.maxParticipants}
                        </p>
                        <p className="text-xs text-gray-500">{t("participants")}</p>
                      </div>
                      <div>
                        <div className="flex items-center justify-center mb-1">
                          <Clock className="h-4 w-4 text-orange-600" />
                        </div>
                        <p className="text-sm font-medium">{group.timeLeft}</p>
                        <p className="text-xs text-gray-500">{t("time_left")}</p>
                      </div>
                      <div>
                        <div className="flex items-center justify-center mb-1">
                          <TrendingDown className="h-4 w-4 text-green-600" />
                        </div>
                        <p className="text-sm font-medium">{group.savings}</p>
                        <p className="text-xs text-gray-500">{t("discount")}</p>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-4 border-t">
                      <p className="text-sm text-gray-600">
                        {t("organized_by")} <span className="font-medium">{group.organizer}</span>
                      </p>
                      <Button 
                        size="sm" 
                        onClick={(e) => {
                          e.stopPropagation()
                          handleJoinGroup(group.id)
                        }}
                        disabled={group.participants >= group.maxParticipants || group.participantsList?.includes(profile?.name || "")}
                      >
                        {group.participantsList?.includes(profile?.name || "") ? "Joined" : t("join_group")}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="my-groups" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {myGroups.map((group) => (
                <Card key={group.id} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleViewDetails(group)}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-2">{group.title}</CardTitle>
                        <CardDescription className="flex items-center mb-2">
                          <MapPin className="h-4 w-4 mr-1" />
                          {group.location}
                        </CardDescription>
                        <p className="text-sm text-gray-600">{group.description}</p>
                      </div>
                      <Badge variant={group.status === "completed" ? "default" : "secondary"}>{t(group.status)}</Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>{t("progress")}</span>
                        <span>
                          ₹{group.currentAmount.toLocaleString()} / ₹{group.targetAmount.toLocaleString()}
                        </span>
                      </div>
                      <Progress value={getProgressPercentage(group.currentAmount, group.targetAmount)} />
                    </div>

                    <div className="flex justify-between items-center pt-4 border-t">
                      <p className="text-sm text-gray-600">
                        {group.participants} {t("participants")} • {group.savings} {t("savings")}
                      </p>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleViewDetails(group)
                        }}
                      >
                        {t("view_details")}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {myGroups.length === 0 && (
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No groups yet</p>
                <p className="text-gray-400 mt-2">Create or join a group to start saving money!</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
        
        <CreateGroupModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onCreateGroup={handleCreateGroup}
        />
        
        <GroupDetailsModal
          group={selectedGroup}
          isOpen={isDetailsModalOpen}
          onClose={() => setIsDetailsModalOpen(false)}
          onJoinGroup={handleJoinGroup}
          canJoin={!selectedGroup?.participantsList?.includes(profile?.name || "")}
        />
      </div>
    </div>
  )
}
