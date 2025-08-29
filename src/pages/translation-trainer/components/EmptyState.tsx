// UI Components
import { Button } from "@/components/ui/button";

// Icons
import { Languages, MessageSquare, Settings, Zap } from "lucide-react";

interface EmptyStateProps {
  onCreateChat: () => void;
}

export function EmptyState({ onCreateChat }: EmptyStateProps) {
  return (
    <div className="flex-1 flex items-center justify-center bg-background">
      <div className="max-w-md text-center px-6">
        <div className="mb-6">
          <Languages className="h-16 w-16 mx-auto text-primary mb-4" />
          <h2 className="text-2xl font-semibold text-foreground mb-2">
            Translation Trainer
          </h2>
          <p className="text-muted-foreground">
            Practice your translation skills with AI-powered feedback and personalized content.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 mb-8">
          <div className="flex items-center gap-3 p-4 rounded-lg bg-card border border-border">
            <MessageSquare className="h-5 w-5 text-primary flex-shrink-0" />
            <div className="text-left">
              <p className="text-sm font-medium text-foreground">Interactive Chats</p>
              <p className="text-xs text-muted-foreground">Practice with real-time feedback</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 rounded-lg bg-card border border-border">
            <Settings className="h-5 w-5 text-primary flex-shrink-0" />
            <div className="text-left">
              <p className="text-sm font-medium text-foreground">Custom Configuration</p>
              <p className="text-xs text-muted-foreground">Use your vocabulary and grammar topics</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 rounded-lg bg-card border border-border">
            <Zap className="h-5 w-5 text-primary flex-shrink-0" />
            <div className="text-left">
              <p className="text-sm font-medium text-foreground">Multiple Languages</p>
              <p className="text-xs text-muted-foreground">Spanish, English, and Portuguese</p>
            </div>
          </div>
        </div>

        <Button onClick={onCreateChat} size="lg" className="w-full">
          <MessageSquare className="h-4 w-4 mr-2" />
          Start Your First Chat
        </Button>

        <p className="text-xs text-muted-foreground mt-4">
          Choose your configuration and begin practicing translations
        </p>
      </div>
    </div>
  );
}
