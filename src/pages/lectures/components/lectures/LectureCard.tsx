import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
// Removed char-based truncation; we'll show tooltip on visual overflow
import { Eye, Edit, Trash2, BookOpen, Calendar } from "lucide-react";
import type { Lecture } from "@/models/Lecture";
import { getMarkdownTitle } from "@/utils/common/string";
import { getLanguageInfo } from "@/utils/common/language";
import { lectureTypes } from "@/data/lectureTypes";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { capitalize } from "@/utils/common/string/capitalize";

interface LectureCardProps {
  lecture: Lecture;
  onView: (id: string) => void;
  onEdit: (lecture: Lecture) => void;
  onDelete: (id: string) => void;
}

export function LectureCard({
  lecture,
  onView,
  onEdit,
  onDelete,
}: LectureCardProps) {
  const title =
    getMarkdownTitle(lecture.content) ||
    `${lecture.language} - ${lecture.level}`;
  const typeLabel =
    lectureTypes.find((type) => type.value === lecture.typeWrite)?.label ||
    lecture.typeWrite;
  const lang = getLanguageInfo(lecture.language);

  const formattedDate = lecture.createdAt
    ? format(new Date(lecture.createdAt), "EEEE, d 'de' MMMM - yyyy", {
        locale: es,
      })
    : "";



  return (
    <TooltipProvider>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow flex flex-col">
        <div className="relative h-48 w-full group">
          <img
            src={lecture.img || "/images/noImage.png"}
            alt={title}
            className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute top-2 right-2 flex flex-col items-end gap-1.5">
            <Badge variant="blue" className="border-none shadow-lg">
              {lecture.level}
            </Badge>
            {lang && (
              <Badge variant="outline" className="flex items-center gap-1.5 border-none bg-gray-900/80 text-white shadow-lg backdrop-blur-sm">
                <span className="text-base leading-none">{lang.flag}</span>
                <span className="text-xs">{lang.code.toLowerCase()}</span>
              </Badge>
            )}
          </div>
        </div>
        <CardHeader className="pb-3 flex-grow">
          <Tooltip>
            <TooltipTrigger asChild>
              <CardTitle className="line-clamp-2 text-xl font-semibold cursor-help">
                {title}
              </CardTitle>
            </TooltipTrigger>
            <TooltipContent className="max-w-md">
              <p className="text-sm">{title}</p>
            </TooltipContent>
          </Tooltip>
          <CardDescription className="line-clamp-2 text-sm">
            {typeLabel}
          </CardDescription>
          <div className="flex items-center gap-2 text-[11px] text-gray-300">
            <Calendar className="h-3 w-3" />
            {lecture.createdAt ? capitalize(formattedDate) : ""}
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex justify-between items-center flex-wrap gap-2">
                                        <Badge variant="secondary">
              <BookOpen className="h-3 w-3 mr-1" />
              {lecture.time} min
            </Badge>
            <div className="flex gap-1 flex-shrink-0">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onView(lecture._id)}
                      className="h-8 w-8 rounded-md text-green-400 hover:text-green-300 hover:bg-green-900/20 border border-transparent hover:border-green-700/30 transition-all duration-200"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Ver lectura</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(lecture)}
                      className="h-8 w-8 rounded-md text-blue-400 hover:text-blue-300 hover:bg-blue-900/20 border border-transparent hover:border-blue-700/30 transition-all duration-200"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Editar lectura</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(lecture._id)}
                      className="h-8 w-8 rounded-md text-red-400 hover:text-red-300 hover:bg-red-900/20 border border-transparent hover:border-red-700/30 transition-all duration-200"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Eliminar lectura</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}
