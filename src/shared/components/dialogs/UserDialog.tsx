import { useState, useEffect } from "react";
import { User, UserCreate, UserUpdate } from "@/services/userService";
import { systemRolesJson, languagesJson } from "@/data/bussiness/shared";
import { ModalNova } from "../ui/modal-nova";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Loader2 } from "lucide-react";
import { Switch } from "../ui/switch";

interface UserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user?: User | null;
  onSave: (userData: UserCreate | UserUpdate) => Promise<boolean>;
}

export function UserDialog({ open, onOpenChange, user, onSave }: UserDialogProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "student" as "admin" | "teacher" | "student",
    firstName: "",
    lastName: "",
    language: "en",
    isActive: true,
    phone: "",
    address: "",
  });

  // Reset form when dialog opens with user data
  useEffect(() => {
    // SOLO actuar cuando el diálogo está abierto
    if (!open) return;
    
    if (user) {
      setFormData({
        username: user.username || "",
        email: user.email || "",
        password: "", // Don't pre-fill password
        role: user.role as any,
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        language: user.language || "en",
        isActive: user.isActive ?? true,
        phone: user.phone || "",
        address: user.address || "",
      });
    } else {
      // Reset for new user
      setFormData({
        username: "",
        email: "",
        password: "",
        role: "student",
        firstName: "",
        lastName: "",
        language: "en",
        isActive: true,
        phone: "",
        address: "",
      });
    }
  }, [user, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const userData: any = {
        username: formData.username,
        email: formData.email,
        role: formData.role,
        firstName: formData.firstName || undefined,
        lastName: formData.lastName || undefined,
        language: formData.language,
        isActive: formData.isActive,
        phone: formData.phone || undefined,
        address: formData.address || undefined,
      };

      // Only include password if it's filled (for create or update)
      if (formData.password) {
        userData.password = formData.password;
      }

      const success = await onSave(userData);
      if (success) {
        onOpenChange(false);
      }
    } finally {
      setLoading(false);
    }
  };

  const isEditMode = !!user;

  return (
    <ModalNova
      open={open}
      onOpenChange={onOpenChange}
      title={isEditMode ? "Edit User" : "Create New User"}
      description={
        isEditMode
          ? "Update user information. Leave password empty to keep current password."
          : "Fill in the information to create a new user."
      }
      size="2xl"
      height="h-auto"
      footer={
        <>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={loading} onClick={handleSubmit}>
            {loading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
            {isEditMode ? "Update User" : "Create User"}
          </Button>
        </>
      }
    >
      <div className="px-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username *</Label>
              <Input
                id="username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                required
                disabled={loading}
                autoComplete="off"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                disabled={loading}
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password">
              Password {!isEditMode && "*"}
              {isEditMode && <span className="text-xs text-muted-foreground ml-1">(leave empty to keep current)</span>}
            </Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required={!isEditMode}
              disabled={loading}
              autoComplete="new-password"
            />
          </div>

          {/* Name */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                disabled={loading}
              />
            </div>
          </div>

          {/* Role and Language */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="role">Role *</Label>
              <Select
                value={formData.role}
                onValueChange={(value: any) => setFormData({ ...formData, role: value })}
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {systemRolesJson.map((role) => (
                    <SelectItem key={role.value} value={role.value}>
                      {role.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="language">Language *</Label>
              <Select
                value={formData.language}
                onValueChange={(value) => setFormData({ ...formData, language: value })}
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {languagesJson.map((lang) => (
                    <SelectItem key={lang.value} value={lang.value}>
                      {lang.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Contact Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                disabled={loading}
              />
            </div>
          </div>

          {/* Status */}
          <div className="flex items-center space-x-2">
            <Switch
              id="isActive"
              checked={formData.isActive}
              onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
              disabled={loading}
            />
            <Label htmlFor="isActive">Active User</Label>
          </div>
        </form>
      </div>
    </ModalNova>
  );
}
