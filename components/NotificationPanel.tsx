"use client"

import type { Notification } from "@/types"

interface NotificationPanelProps {
  notifications: {
    saved: Notification[]
    pending: Notification[]
  }
}

export default function NotificationPanel({ notifications }: NotificationPanelProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString()
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 sticky top-4">
      <div className="p-4 border-b border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 17h5l-5 5v-5zM4 19h6v-2H4v2zM4 15h8v-2H4v2zM4 11h10V9H4v2zM4 7h12V5H4v2z"
            />
          </svg>
          Notifications
        </h2>
      </div>
      <div className="p-4 space-y-4">
        {/* Pending Notifications */}
        {notifications.pending.length > 0 && (
          <div>
            <h3 className="font-medium text-sm text-gray-700 mb-2 flex items-center gap-2">
              <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">Pending</span>
              Queue ({notifications.pending.length})
            </h3>
            <div className="space-y-2">
              {notifications.pending.map((notif, index) => (
                <div key={index} className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <p className="text-sm text-gray-900">{notif.content}</p>
                  <p className="text-xs text-gray-500 mt-1">Processing...</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Saved Notifications */}
        {notifications.saved.length > 0 && (
          <div>
            <h3 className="font-medium text-sm text-gray-700 mb-2 flex items-center gap-2">
              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Delivered</span>
              History ({notifications.saved.length})
            </h3>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {notifications.saved.map((notif) => (
                <div key={notif.id} className="p-3 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-sm text-gray-900">{notif.content}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <p className="text-xs text-gray-500">{formatDate(notif.created_at)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {notifications.saved.length === 0 && notifications.pending.length === 0 && (
          <div className="text-center py-8">
            <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 17h5l-5 5v-5zM4 19h6v-2H4v2zM4 15h8v-2H4v2zM4 11h10V9H4v2zM4 7h12V5H4v2z"
              />
            </svg>
            <p className="text-gray-500 text-sm">No notifications yet</p>
          </div>
        )}
      </div>
    </div>
  )
}
