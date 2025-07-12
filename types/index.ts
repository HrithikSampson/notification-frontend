export interface Post {
  id: number
  socket_id: string
  content: string
  parent?: Post
  children?: Post[]
  created_at: string
  updated_at: string
}

export interface Notification {
  id: number
  socket_id: string
  content: string
  created_at: string
  updated_at: string
}
