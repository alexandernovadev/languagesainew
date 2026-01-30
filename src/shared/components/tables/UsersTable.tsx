import { User } from "@/services/userService";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Card, CardContent } from "../ui/card";
import { Edit, Trash2, Loader2, Mail, Globe } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Skeleton } from "../ui/skeleton";

interface UsersTableProps {
  users: User[];
  loading: boolean;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
}

export function UsersTable({ users, loading, onEdit, onDelete }: UsersTableProps) {
  // Loading skeleton
  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Empty state
  if (!users || users.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-12">
            <p className="text-muted-foreground">No users found</p>
            <p className="text-sm text-muted-foreground mt-1">
              Try adjusting your filters or create a new user
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Get role variant for badge
  const getRoleVariant = (role: string): "default" | "secondary" | "destructive" => {
    switch (role.toLowerCase()) {
      case "admin":
        return "destructive";
      case "teacher":
        return "secondary";
      default:
        return "default";
    }
  };

  // Get initials for avatar fallback
  const getInitials = (user: User): string => {
    if (user.firstName && user.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    return user.username.substring(0, 2).toUpperCase();
  };

  return (
    <div className="space-y-4">
      {users.map((user) => (
        <Card key={user._id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex gap-4 items-start">
              {/* Avatar */}
              <div className="flex-shrink-0">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={user.image} alt={user.username} />
                  <AvatarFallback className="text-lg">{getInitials(user)}</AvatarFallback>
                </Avatar>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 mb-2">
                  {/* User Info */}
                  <div>
                    <h3 className="font-bold text-2xl capitalize">{user.username}</h3>
                    {(user.firstName || user.lastName) && (
                      <p className="text-sm text-muted-foreground">
                        {user.firstName} {user.lastName}
                      </p>
                    )}
                  </div>

                  {/* Badges */}
                  <div className="flex flex-wrap gap-2 items-center">
                    <Badge variant={getRoleVariant(user.role)}>
                      {user.role}
                    </Badge>
                    <Badge variant={user.isActive ? "default" : "outline"}>
                      {user.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-center gap-2 text-sm mb-1">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{user.email}</span>
                </div>

                {/* Language */}
                <div className="flex items-center gap-2 text-sm mb-3">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <span className="uppercase font-medium">{user.language}</span>
                </div>

                {/* Actions */}
                <div className="flex gap-2 mt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(user)}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => onDelete(user)}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
