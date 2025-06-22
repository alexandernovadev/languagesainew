import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Edit, Trash2, BookOpen, Calendar } from "lucide-react";
import type { Lecture } from "@/models/Lecture";
import { getMarkdownTitle } from "@/lib/utils";
import { languageData } from "@/data/languageData";
import { lectureTypes } from "@/data/lectureTypes";

interface LectureCardProps {
  lecture: Lecture;
  onView: (id: string) => void;
  onEdit: (lecture: Lecture) => void;
  onDelete: (id: string) => void;
}

export function LectureCard({ lecture, onView, onEdit, onDelete }: LectureCardProps) {
  const title = getMarkdownTitle(lecture.content) || `${lecture.language} - ${lecture.level}`;
  const typeLabel = lectureTypes.find(type => type.value === lecture.typeWrite)?.label || lecture.typeWrite;
  const lang = languageData.find(l => l.code === lecture.language);
  
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative h-48 w-full group">
        <img
          src={lecture.img || "/placeholder.svg"}
          alt={lecture.language}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute top-2 right-2 flex flex-col items-end gap-1.5">
          <Badge className="border-none bg-blue-600 text-white shadow-lg">
            {lecture.level}
          </Badge>
          {lang && (
            <Badge className="flex items-center gap-1.5 border-none bg-gray-900/80 text-white shadow-lg backdrop-blur-sm">
              <span className="text-base leading-none">{lang.flag}</span>
              <span className="text-xs">{lang.code.toLowerCase()}</span>
            </Badge>
          )}
        </div>
      </div>
      <CardHeader className="pb-3">
        <CardTitle className="line-clamp-2 text-xl font-semibold" title={title}>
          {title}
        </CardTitle>
        <CardDescription className="line-clamp-2 text-sm">
          {typeLabel}
        </CardDescription>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Calendar className="h-3 w-3" />
          {lecture.createdAt
            ? new Date(lecture.createdAt).toLocaleDateString()
            : ""}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex justify-between items-center">
          <Badge variant="secondary" className="text-xs">
            <BookOpen className="h-3 w-3 mr-1" />
            {lecture.time} min
          </Badge>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onView(lecture._id)}
              className="h-8 w-8 p-0"
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(lecture)}
              className="h-8 w-8 p-0"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(lecture._id)}
              className="h-8 w-8 p-0 text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 