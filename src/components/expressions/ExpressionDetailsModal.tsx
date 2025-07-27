import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Expression } from "@/models/Expression";
import { ExpressionInfoTab } from "./ExpressionInfoTab";
import { ExpressionChatTab } from "./ExpressionChatTab";

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
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] border border-gray-600 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">{expression.expression}</DialogTitle>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "info" | "chat")}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="info">Información</TabsTrigger>
            <TabsTrigger value="chat">Chat con GPT</TabsTrigger>
          </TabsList>
          
          <TabsContent value="info" className="max-h-[60vh] overflow-y-auto pr-2">
            <ExpressionInfoTab expression={expression} />
          </TabsContent>
          
          <TabsContent value="chat" className="h-96">
            <ExpressionChatTab expression={expression} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
} 