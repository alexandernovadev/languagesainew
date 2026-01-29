import { useState } from "react";
import { PageHeader } from "@/shared/components/ui/page-header";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { toast } from "sonner";
import { labsService } from "@/services/labsService";
import { UserPlus, Mail, Loader2 } from "lucide-react";

export default function LabsPage() {
  const [isCreatingAdmin, setIsCreatingAdmin] = useState(false);
  const [isSendingBackup, setIsSendingBackup] = useState(false);

  const handleCreateAdmin = async () => {
    setIsCreatingAdmin(true);
    try {
      const response = await labsService.createAdminUser();
      if (response.success) {
        toast.success(response.message || "Admin user created successfully");
      } else {
        toast.error(response.message || "Failed to create admin user");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Error creating admin user");
    } finally {
      setIsCreatingAdmin(false);
    }
  };

  const handleSendBackup = async () => {
    setIsSendingBackup(true);
    try {
      const response = await labsService.sendBackupByEmail();
      if (response.success) {
        toast.success(response.message || "Backup sent successfully");

        // Mostrar estadísticas del backup si están disponibles
        if (response.data) {
          const { wordsCount, lecturesCount, expressionsCount } = response.data;
          toast.info(
            `Backup includes: ${wordsCount || 0} words, ${lecturesCount || 0} lectures, ${expressionsCount || 0} expressions`,
            { duration: 5000 }
          );
        }
      } else {
        toast.error(response.message || "Failed to send backup");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Error sending backup");
    } finally {
      setIsSendingBackup(false);
    }
  };

  return (
    <div className="space-y-4">
      <PageHeader
        title="Labs"
        description="Funciones experimentales y herramientas de desarrollo"
      />

      <div className="grid gap-4 md:grid-cols-2">
        {/* Card 1: Crear Admin */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              Create Admin User
            </CardTitle>
            <CardDescription>
              Create a new administrator user for development and testing purposes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={handleCreateAdmin}
              disabled={isCreatingAdmin}
              className="w-full"
              size="lg"
            >
              {isCreatingAdmin ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Admin User"
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Card 2: Enviar Backup */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Send Backup by Email
            </CardTitle>
            <CardDescription>
              Send a complete system backup via email with detailed statistics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={handleSendBackup}
              disabled={isSendingBackup}
              variant="secondary"
              className="w-full"
              size="lg"
            >
              {isSendingBackup ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                "Send Backup"
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Información adicional */}
      <Card>
        <CardHeader>
          <CardTitle>Information</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          <ul className="list-disc list-inside space-y-1">
            <li>Admin user creation is for development purposes only</li>
            <li>Backup emails include all words, lectures, and expressions</li>
            <li>These operations may take a few moments to complete</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
