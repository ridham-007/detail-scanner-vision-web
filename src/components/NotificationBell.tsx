import React, { useState } from "react";
import {
  Bell,
  Check,
  CheckCheck,
  Trash2,
  X,
  Trophy,
  AlertTriangle,
  Calendar,
  Lightbulb,
  Brain,
  Clock,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useNotifications, NotificationType } from "@/hooks/useNotifications";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

const getNotificationIcon = (type: NotificationType) => {
  switch (type) {
    case "achievement":
      return <Trophy className="h-4 w-4 text-yellow-500" />;
    case "health_alert":
      return <AlertTriangle className="h-4 w-4 text-red-500" />;
    case "weekly_summary":
      return <Calendar className="h-4 w-4 text-blue-500" />;
    case "product_suggestion":
      return <Lightbulb className="h-4 w-4 text-green-500" />;
    case "quiz_challenge":
      return <Brain className="h-4 w-4 text-purple-500" />;
    case "scan_reminder":
    default:
      return <Clock className="h-4 w-4 text-primary" />;
  }
};

const NotificationBell: React.FC = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const {
    notifications,
    loading,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
  } = useNotifications();

  if (!user) return null;

  const handleNotificationClick = (notification: (typeof notifications)[0]) => {
    markAsRead(notification.id);
    if (notification.action_url) {
      setOpen(false);
      router.push(notification.action_url);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ""}`}
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-destructive text-destructive-foreground text-xs flex items-center justify-center font-medium animate-pulse">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        side="bottom"
        sideOffset={12}
        collisionPadding={20}
        className="
    w-[360px]
    max-w-[calc(100vw-24px)]
    p-0
    rounded-2xl
    shadow-2xl
    border
    bg-background
    z-[99999]
  "
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-xl font-semibold tracking-tight text-foreground">
            Notifications
          </h3>
          <div className="flex items-center gap-1">
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={markAllAsRead}
                className="h-8 text-xs"
              >
                <CheckCheck className="h-3 w-3 mr-1" />
                Mark all read
              </Button>
            )}
          </div>
        </div>

        <ScrollArea className="h-[400px]">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Bell className="h-12 w-12 mb-4 opacity-20" />
              <p className="text-sm">No notifications yet</p>
              <p className="text-xs mt-1">
                We'll notify you when something happens
              </p>
            </div>
          ) : (
            <div className="divide-y">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={cn(
                    "p-4 hover:bg-muted/50 cursor-pointer transition-colors relative group",
                    !notification.is_read && "bg-primary/5",
                  )}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 mt-0.5">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p
                          className={cn(
                            "text-sm line-clamp-1",
                            !notification.is_read && "font-semibold",
                          )}
                        >
                          {notification.title}
                        </p>
                        {!notification.is_read && (
                          <span className="flex-shrink-0 h-2 w-2 rounded-full bg-primary" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                        {notification.body}
                      </p>
                      <p className="text-xs text-muted-foreground/80 mt-2">
                        {formatDistanceToNow(
                          new Date(notification.created_at),
                          { addSuffix: true },
                        )}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity absolute top-2 right-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNotification(notification.id);
                      }}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        {notifications.length > 0 && (
          <div className="p-2 border-t">
            <Button
              variant="ghost"
              size="sm"
              className="w-full text-xs text-muted-foreground hover:text-destructive"
              onClick={clearAllNotifications}
            >
              <Trash2 className="h-3 w-3 mr-1" />
              Clear all notifications
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default NotificationBell;
