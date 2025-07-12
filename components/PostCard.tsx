"use client"

import { useState } from "react"
import CreatePost from "./CreatePost"
import { Post } from "@/types"

interface PostCardProps {
  post: any
  socketId: string
  onReplyCreated: () => void
  isReply?: boolean
  isNew?: boolean
}

export default function PostCard({ post, socketId, onReplyCreated, isReply = false, isNew = false }: PostCardProps) {
  const [showReplyForm, setShowReplyForm] = useState(false)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString()
  }

  const handleReplyCreated = () => {
    setShowReplyForm(false)
    onReplyCreated()
  }

  return (
    <div
      className={`bg-white rounded-lg shadow-sm border transition-all duration-500 ${
        isNew ? "border-blue-300 bg-blue-50 shadow-lg animate-pulse" : "border-gray-200"
      } ${isReply ? "ml-8 border-l-4 border-l-blue-200" : ""}`}
    >
      {isNew && <div className="bg-blue-500 text-white text-xs px-3 py-1 rounded-t-lg">✨ New Post</div>}

      <div className="p-4">
        {/* Post Header */}
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
            {post.socket_id.slice(0, 2).toUpperCase()}
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>User {post.socket_id.slice(0, 8)}</span>
            <span>•</span>
            <span>{formatDate(post.created_at)}</span>
          </div>
        </div>

        {/* Post Content */}
        <div className="mb-4">
          <p className="text-gray-900 whitespace-pre-wrap">{post.content}</p>
        </div>

        {/* Post Actions */}
        <div className="flex items-center gap-4 pt-2 border-t border-gray-100">
          <button
            onClick={() => setShowReplyForm(!showReplyForm)}
            className="flex items-center gap-1 text-gray-500 hover:text-blue-500 text-sm transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            Reply {post.children?.length > 0 && `(${post.children.length})`}
          </button>
        </div>

        {/* Reply Form */}
        {showReplyForm && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <CreatePost
              socketId={socketId}
              onPostCreated={handleReplyCreated}
              parentId={post.id}
              placeholder={`Reply to ${post.socket_id.slice(0, 8)}...`}
            />
          </div>
        )}

        {/* Replies */}
        {post.children && post.children.length > 0 && (
          <div className="mt-4 space-y-3">
            {post.children.map((reply: Post) => (
              <PostCard
                key={reply.id}
                post={reply}
                socketId={socketId}
                onReplyCreated={onReplyCreated}
                isReply={true}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
