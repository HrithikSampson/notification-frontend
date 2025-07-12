"use client"

import { useEffect, useState } from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { io, type Socket } from "socket.io-client"
import { v4 as uuidv4 } from "uuid"
import PostList from "@/components/PostList"
import CreatePost from "@/components/CreatePost"
import NotificationPanel from "@/components/NotificationPanel"

export default function Home() {
  const [socketId, setSocketId] = useState<string>("")
  const [notifications, setNotifications] = useState({ saved: [], pending: [] })
  const [newPostIds, setNewPostIds] = useState<Set<number>>(new Set())

  const queryClient = useQueryClient()

  // Fetch posts using React Query
  const { data: posts = [], isLoading } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/posts`)
      if (!response.ok) throw new Error("Failed to fetch posts")
      return response.json()
    },
    staleTime: 0,
    refetchInterval: 60000,
    refetchIntervalInBackground: true,
  })

  useEffect(() => {
    // Generate a unique socket ID for this session
    const userId = uuidv4()
    setSocketId(userId)

    // Initialize socket connection
    const newSocket = io(`${process.env.NEXT_PUBLIC_BACKEND_URL}`, {
      query: { userId },
    })

    newSocket.on("connect", () => {
      console.log("Connected to server:", newSocket.id)
    })

    newSocket.on("notification", (data) => {
      console.log("Received notification:", data)

      // Store current posts to compare after refetch
      const currentPosts = (queryClient.getQueryData(["posts"]) as any[]) || []

      // Invalidate and refetch posts
      queryClient.refetchQueries({ queryKey: ["posts"] }).then(() => {
        // After refetch, identify new posts
        const updatedPosts = (queryClient.getQueryData(["posts"]) as any[]) || []
        const currentPostIds = new Set(currentPosts.map((p) => p.id))
        const newIds = updatedPosts.filter((post) => !currentPostIds.has(post.id)).map((post) => post.id)

        if (newIds.length > 0) {
          setNewPostIds(new Set(newIds))
          // Clear the highlight after 5 seconds
          setTimeout(() => {
            setNewPostIds(new Set())
          }, 5000)
        }
      })

      // Refresh notifications
      fetchNotifications(userId)
    })


    // Fetch initial notifications
    fetchNotifications(userId)

    return () => {
      newSocket.close()
    }
  }, [queryClient])

  const fetchNotifications = async (userId: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/notifications`, {
        headers: {
          "x-socket-id": userId,
        },
      })
      const data = await response.json()
      setNotifications(data)
      // queryClient.refetchQueries({ queryKey: ["posts"] });
    } catch (error) {
      console.error("Error fetching notifications:", error)
    }
  }

  const handlePostCreated = () => {
    queryClient.invalidateQueries({ queryKey: ["posts"] })
  }

  const handleReplyCreated = () => {
    queryClient.invalidateQueries({ queryKey: ["posts"] })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading posts...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Insyd Social</h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500">Socket ID: {socketId.slice(0, 8)}...</span>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Notifications:</span>
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                  {notifications.saved.length + notifications.pending.length}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* New Posts Alert */}
        {newPostIds.size > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="text-blue-800 font-medium">
                {newPostIds.size} new {newPostIds.size === 1 ? "post" : "posts"} received!
              </span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Create Post */}
            <CreatePost socketId={socketId} onPostCreated={handlePostCreated} />

            {/* Posts Feed */}
            <PostList posts={posts} socketId={socketId} onReplyCreated={handleReplyCreated} newPostIds={newPostIds} />
          </div>

          {/* Notifications Panel - Always Visible */}
          <div className="lg:col-span-1">
            <NotificationPanel notifications={notifications} />
          </div>
        </div>
      </div>
    </div>
  )
}
