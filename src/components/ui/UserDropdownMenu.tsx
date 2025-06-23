import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { AvatarFallbackClient } from "@/components/ui/avatar-fallback-client";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Link } from "react-router-dom";
import { useUserStore } from "@/lib/store/user-store";

interface UserDropdownMenuProps {
  avatarSize?: string;
  buttonClassName?: string;
  showName?: boolean;
  avatarSrc?: string;
  showFullHeader?: boolean;
}

export function UserDropdownMenu({
  avatarSize = "size-8",
  buttonClassName = "",
  showName = false,
  avatarSrc,
  showFullHeader = false,
}: UserDropdownMenuProps) {
  const { user, logout } = useUserStore();

  if (!user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <span
          className={`inline-flex items-center gap-2 cursor-pointer transition-transform duration-150 hover:scale-105 ${buttonClassName}`.trim()}
        >
          {showFullHeader ? (
            <>
              <Avatar
                className={[avatarSize, "border-2", "border-gray-700"].join(" ")}
              >
                <AvatarImage
                  src={avatarSrc || user.image || ""}
                  alt={
                    avatarSrc
                      ? "Logo"
                      : user.firstName || user.username || "Usuario"
                  }
                />
                {avatarSrc ? null : <AvatarFallbackClient user={user} />}
              </Avatar>
              <div className="flex flex-col gap-0.5 leading-none">
                <span className="font-semibold">LanguagesAI</span>
                <span className="text-xs">v1.0.0</span>
              </div>
            </>
          ) : (
            <>
              <Avatar
                className={[avatarSize, "border-2", "border-gray-700"].join(" ")}
              >
                <AvatarImage
                  src={avatarSrc || user.image || ""}
                  alt={
                    avatarSrc
                      ? "Logo"
                      : user.firstName || user.username || "Usuario"
                  }
                />
                {avatarSrc ? null : <AvatarFallbackClient user={user} />}
              </Avatar>
              {showName && !avatarSrc && (
                <span className="text-xs text-muted-foreground">
                  {user.firstName || user.username || "Usuario"}
                </span>
              )}
            </>
          )}
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <div className="px-3 py-2">
          <div className="flex items-center gap-2">
            <Avatar className="size-8">
              <AvatarImage
                src={user.image || ""}
                alt={user.firstName || user.username || "Usuario"}
              />
              <AvatarFallbackClient user={user} />
            </Avatar>
            <div>
              <div className="font-semibold text-sm">
                {user.firstName || ""} {user.lastName || ""}
              </div>
              <div className="text-xs text-muted-foreground">
                {user.username}
              </div>
            </div>
          </div>
          {user.email && (
            <div className="text-xs text-muted-foreground mt-1">
              {user.email}
            </div>
          )}
          {user.role && (
            <div className="text-xs text-muted-foreground mt-0.5 capitalize">
              {user.role}
            </div>
          )}
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/profile">Mi perfil</Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={logout} className="text-red-600">
          Cerrar sesión
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
