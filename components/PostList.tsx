"use client"
import PostCard from "./PostCard"

interface PostListProps {
  posts: any[]
  socketId: string
  onReplyCreated: () => void
  newPostIds?: Set<number>
}

export default function PostList({ posts, socketId, onReplyCreated, newPostIds = new Set() }: PostListProps) {
  if (posts.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8 text-center">
        <p className="text-gray-500">No posts yet. Be the first to post!</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          socketId={socketId}
          onReplyCreated={onReplyCreated}
          isNew={newPostIds.has(post.id)}
        />
      ))}
    </div>
  )
}
