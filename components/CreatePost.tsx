"use client"

import type React from "react"
import { useState } from "react"

interface CreatePostProps {
  socketId: string
  onPostCreated: () => void
  parentId?: number
  placeholder?: string
}

export default function CreatePost({
  socketId,
  onPostCreated,
  parentId,
  placeholder = "What's happening?",
}: CreatePostProps) {
  const [content, setContent] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return

    setIsLoading(true)
    try {
      const response = await fetch(`${process.env.NEXT_APP_BACKEND_URL}/posts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          socket_id: socketId,
          content: content.trim(),
          ...(parentId && { parent_id: parentId }),
        }),
      })

      if (response.ok) {
        setContent("")
        onPostCreated()
      } else {
        console.error("Failed to create post")
      }
    } catch (error) {
      console.error("Error creating post:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-4 border-b border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900">{parentId ? "Reply to post" : "Create a new post"}</h2>
      </div>
      <div className="p-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={placeholder}
            className="w-full min-h-[100px] p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            maxLength={280}
          />
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">{content.length}/280</span>
            <button
              type="submit"
              disabled={!content.trim() || isLoading}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? "Posting..." : parentId ? "Reply" : "Post"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
