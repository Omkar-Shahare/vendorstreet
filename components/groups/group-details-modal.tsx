"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Users, Clock, TrendingDown, MapPin, User } from "lucide-react"
import { useLanguage } from "@/hooks/use-language"

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

interface GroupDetailsModalProps {
  group: GroupBuy | null
  isOpen: boolean
  onClose: () => void
  onJoinGroup: (groupId: string) => void
  canJoin?: boolean
}

export function GroupDetailsModal({ group, isOpen, onClose, onJoinGroup, canJoin = true }: GroupDetailsModalProps) {
  const { t } = useLanguage()
  const [isJoining, setIsJoining] = useState(false)

  if (!group) return null

  const getProgressPercentage = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100)
  }

  const handleJoinGroup = async () => {
    setIsJoining(true)
    await onJoinGroup(group.id)
    setIsJoining(false)
  }

  const participantsList = group.participantsList || [
    "Raj Kumar", "Priya Sharma", "Mohammed Ali", "Sunita Devi", "Amit Patel"
  ].slice(0, group.participants)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{group.title}</span>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              {group.savings} {t("savings")}
            </Badge>
          </DialogTitle>
          <DialogDescription className="flex items-center space-x-4">
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-1" />
              {group.location}
            </div>
            <div className="flex items-center">
              <User className="h-4 w-4 mr-1" />
              {t("organized_by")} {group.organizer}
            </div>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Description</h3>
            <p className="text-gray-600">{group.description}</p>
          </div>

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
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center justify-center mb-2">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <p className="text-lg font-bold text-blue-600">
                {group.participants}/{group.maxParticipants}
              </p>
              <p className="text-sm text-gray-600">{t("participants")}</p>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg">
              <div className="flex items-center justify-center mb-2">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
              <p className="text-lg font-bold text-orange-600">{group.timeLeft}</p>
              <p className="text-sm text-gray-600">{t("time_left")}</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="flex items-center justify-center mb-2">
                <TrendingDown className="h-6 w-6 text-green-600" />
              </div>
              <p className="text-lg font-bold text-green-600">{group.savings}</p>
              <p className="text-sm text-gray-600">{t("discount")}</p>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="text-lg font-semibold mb-4">Current Participants</h3>
            <div className="grid grid-cols-2 gap-2">
              {participantsList.map((participant, index) => (
                <div key={index} className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="text-xs">
                      {participant.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm">{participant}</span>
                </div>
              ))}
            </div>
          </div>

          {canJoin && group.status === "active" && group.participants < group.maxParticipants && (
            <>
              <Separator />
              <div className="bg-orange-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Ready to Join?</h3>
                <p className="text-sm text-gray-600 mb-4">
                  By joining this group, you'll get access to bulk pricing and save {group.savings} on your purchase.
                </p>
                <Button 
                  className="w-full" 
                  onClick={handleJoinGroup}
                  disabled={isJoining}
                >
                  {isJoining ? "Joining..." : `Join Group - Save ${group.savings}`}
                </Button>
              </div>
            </>
          )}

          {group.participants >= group.maxParticipants && (
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <p className="text-gray-600">This group is full. Check back later for similar groups!</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}