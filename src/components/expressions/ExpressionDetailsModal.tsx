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
      title={`${capitalize(expression.expression)} - ${
        expression.spanish?.expression || "Sin traducción"
      }`}
      size="4xl"
      height="h-[calc(100dvh-2rem)]"
    >
      <div className="p-4 h-full flex flex-col">
        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as "info" | "chat")}
          className="h-full flex flex-col"
        >
          <TabsList className="grid w-full grid-cols-2 sticky top-1 z-10">
            <TabsTrigger value="info">
              <Info className="h-4 w-4 mr-2" />
              Información
            </TabsTrigger>
            <TabsTrigger value="chat">
              <MessageCircle className="h-4 w-4 mr-2" />
              Chat
            </TabsTrigger>
          </TabsList>

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
