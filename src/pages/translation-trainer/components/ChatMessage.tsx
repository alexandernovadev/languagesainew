import { Clock, User, Bot, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

interface ChatMessageProps {
  message: {
    id: string;
    type: 'generated_text' | 'user_translation' | 'ai_feedback';
    content: string;
    timestamp: Date;
    metadata?: {
      score?: number;
      errors?: Array<{
        type: string;
        severity: string;
        original: string;
        corrected: string;
        explanation: string;
      }>;
      correctTranslation?: string;
    };
  };
  onRetry?: () => void;
}

export function ChatMessage({ message, onRetry }: ChatMessageProps) {
  const getMessageIcon = () => {
    switch (message.type) {
      case 'generated_text':
        return <Bot className="h-4 w-4 text-blue-500" />;
      case 'user_translation':
        return <User className="h-4 w-4 text-green-500" />;
      case 'ai_feedback':
        return <CheckCircle className="h-4 w-4 text-purple-500" />;
      default:
        return <Bot className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getMessageTitle = () => {
    switch (message.type) {
      case 'generated_text':
        return 'Generated Text';
      case 'user_translation':
        return 'Your Translation';
      case 'ai_feedback':
        return 'AI Feedback';
      default:
        return 'Message';
    }
  };

  const formatTime = (timestamp: Date) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <Card className="p-4 space-y-3">
      {/* Message Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {getMessageIcon()}
          <span className="font-medium text-sm">{getMessageTitle()}</span>
          {message.metadata?.score && (
            <Badge variant="secondary">
              Score: {message.metadata.score}%
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Clock className="h-3 w-3" />
          <span>{formatTime(message.timestamp)}</span>
        </div>
      </div>

      {/* Message Content */}
      <div className="text-sm">
        <p className="whitespace-pre-wrap">{message.content}</p>
      </div>

      {/* Metadata for AI Feedback */}
      {message.type === 'ai_feedback' && message.metadata && (
        <div className="space-y-3 pt-3 border-t border-border">
          {/* Score Display */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-muted-foreground">Score:</span>
            <Badge variant={message.metadata.score >= 90 ? 'default' : message.metadata.score >= 70 ? 'secondary' : 'destructive'}>
              {message.metadata.score}/100
            </Badge>
          </div>

          {/* Correct Translation */}
          {message.metadata.correctTranslation && (
            <div>
              <span className="text-xs font-medium text-muted-foreground">Correct Translation:</span>
              <div className="text-sm bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 p-3 rounded mt-1">
                <p className="whitespace-pre-wrap">{message.metadata.correctTranslation}</p>
              </div>
            </div>
          )}

          {/* Errors */}
          {message.metadata.errors && message.metadata.errors.length > 0 ? (
            <div>
              <span className="text-xs font-medium text-muted-foreground">
                Issues Found ({message.metadata.errors.length}):
              </span>
              <div className="space-y-3 mt-2">
                {message.metadata.errors.map((error, index) => (
                  <div key={index} className="bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-800 p-3 rounded">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="text-xs px-2 py-1">
                        {error.type}
                      </Badge>
                      <Badge 
                        variant={error.severity === 'critical' || error.severity === 'major' ? 'destructive' : 
                               error.severity === 'moderate' || error.severity === 'medium' ? 'secondary' : 'outline'} 
                        className="text-xs px-2 py-1"
                      >
                        {error.severity}
                      </Badge>
                    </div>
                    
                    {/* Error Message */}
                    <p className="text-sm font-medium mb-2">{error.message}</p>
                    
                    {/* Original vs Corrected */}
                    {error.original && (
                      <div className="mb-2">
                        <span className="text-xs font-medium text-red-600 dark:text-red-400">Original:</span>
                        <p className="text-sm bg-red-50 dark:bg-red-950/30 p-2 rounded mt-1">"{error.original}"</p>
                      </div>
                    )}
                    
                    {error.corrected && (
                      <div className="mb-2">
                        <span className="text-xs font-medium text-green-600 dark:text-green-400">Corrected:</span>
                        <p className="text-sm bg-green-50 dark:bg-green-950/30 p-2 rounded mt-1">"{error.corrected}"</p>
                      </div>
                    )}
                    
                    {/* Explanation */}
                    {error.explanation && (
                      <div>
                        <span className="text-xs font-medium text-muted-foreground">Explanation:</span>
                        <p className="text-sm text-muted-foreground mt-1">{error.explanation}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 p-3 rounded">
              <p className="text-sm text-green-700 dark:text-green-300 font-medium">✅ No errors found! Excellent translation.</p>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}