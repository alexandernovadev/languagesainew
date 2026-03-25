import { useState, useEffect, useMemo } from "react";
import { useAuth } from "./useAuth";
import { userService } from "@/services/userService";
import { toast } from "sonner";

export function useProfile() {
  const { user, refreshAccessToken } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
    language: "en" as any,
    explainsLanguage: "es" as any,
  });

  // Initialize form data when user changes
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        phone: user.phone || "",
        address: user.address || "",
        language: user.language || "en",
        explainsLanguage: user.explainsLanguage || "es",
      });
    }
  }, [user]);

  const isDirty = useMemo(() => {
    if (!user) return false;
    return (
      formData.firstName !== (user.firstName || "") ||
      formData.lastName !== (user.lastName || "") ||
      formData.phone !== (user.phone || "") ||
      formData.address !== (user.address || "") ||
      formData.language !== (user.language || "en") ||
      formData.explainsLanguage !== (user.explainsLanguage || "es")
    );
  }, [user, formData]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    if (!user) return;

    try {
      setIsSaving(true);
      await userService.updateUser(user._id, formData);
      
      // Refrescar token para que req.user en backend tenga el idioma actualizado
      await refreshAccessToken();
      
      toast.success("Perfil actualizado correctamente");
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    // Reset form data to original user data
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        phone: user.phone || "",
        address: user.address || "",
        language: user.language || "en",
        explainsLanguage: user.explainsLanguage || "es",
      });
    }
  };

  return {
    user,
    formData,
    isDirty,
    isSaving,
    handleInputChange,
    handleSave,
    handleCancel,
  };
}
