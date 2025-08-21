import { useState } from "react";
import { ModalNova } from "@/components/ui/modal-nova";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Expression } from "@/models/Expression";
import { ExpressionInfoTab } from "./ExpressionInfoTab";
import { ExpressionChatTab } from "./ExpressionChatTab";
import { capitalize } from "@/utils/common";
import { Info, MessageCircle } from "lucide-react";

interface ExpressionDetailsModalProps {
  open: boolean;
  expression: Expression | null;
  onClose: () => void;
}

export function ExpressionDetailsModal({
  open,
  expression,
  onClose,
}: ExpressionDetailsModalProps) {
  const [activeTab, setActiveTab] = useState<"info" | "chat">("info");

  if (!expression) return null;

  return (
    <ModalNova
      open={open}
      onOpenChange={onClose}
      title={`${capitalize(expression.expression)} - ${expression.spanish?.expression || 'Sin traducción'}`}
      size="4xl"
      height="h-[calc(100dvh-2rem)]"
    >
      <div className="p-4 h-full flex flex-col">
        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as "info" | "chat")}
          className="h-full flex flex-col"
        >
          {/* Contenedor con scroll horizontal en móvil */}
          <div className="max-sm:overflow-x-auto max-sm:pb-2">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 max-sm:flex max-sm:w-max max-sm:min-w-full sticky top-1 z-10">
              <TabsTrigger value="info" className="max-sm:flex-shrink-0 max-sm:whitespace-nowrap">
                <Info className="h-4 w-4 mr-2" />
                <span className="max-sm:hidden sm:inline">Información</span>
                <span className="sm:hidden">Info</span>
              </TabsTrigger>
              <TabsTrigger value="chat" className="max-sm:flex-shrink-0 max-sm:whitespace-nowrap">
                <MessageCircle className="h-4 w-4 mr-2" />
                <span className="max-sm:hidden sm:inline">Chat</span>
                <span className="sm:hidden">Chat</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="info" className="pr-2 flex-1">
            <ExpressionInfoTab expression={expression} />
          </TabsContent>

          <TabsContent value="chat" className="flex-1">
            <ExpressionChatTab expression={expression} />
          </TabsContent>
        </Tabs>
      </div>
    </ModalNova>
  );
}
