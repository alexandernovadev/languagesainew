import { Input } from "@/components/ui/input";
import { TableCell, TableRow } from "@/components/ui/table";
import { Verb, VerbField } from "../types";

interface VerbRowProps {
  verb: Verb;
  field: VerbField;
  userAnswer: string | undefined;
  showAnswers: boolean;
  isCorrect: boolean;
  onInputChange: (verbId: number, field: VerbField, value: string) => void;
}

export function VerbRow({
  verb,
  field,
  userAnswer,
  showAnswers,
  isCorrect,
  onInputChange,
}: VerbRowProps) {
  const getInputClassName = () => {
    if (!showAnswers) return "";
    return isCorrect
      ? "border-green-500 bg-green-50 dark:bg-green-950"
      : "border-red-500 bg-red-50 dark:bg-red-950";
  };

  const renderField = (fieldType: VerbField, value: string) => {
    if (field === fieldType) {
      return (
        <>
          <Input
            placeholder="..."
            value={userAnswer || ""}
            onChange={(e) => onInputChange(verb.id, fieldType, e.target.value)}
            className={`min-w-[90px] md:min-w-[120px] px-2 py-1 text-sm h-7 ${getInputClassName()}`}
            disabled={showAnswers}
          />
          {showAnswers && !isCorrect && (
            <div className="text-xs text-green-600 dark:text-green-400 mt-0.5">
              Respuesta: {value}
            </div>
          )}
        </>
      );
    }
    return value;
  };

  return (
    <TableRow className="py-0.5 h-8">
      <TableCell className="font-medium py-1 text-sm">
        {renderField("infinitive", verb.infinitive)}
      </TableCell>
      <TableCell className="py-1 text-sm">
        {renderField("past", verb.past)}
      </TableCell>
      <TableCell className="py-1 text-sm">
        {renderField("participle", verb.participle)}
      </TableCell>
      <TableCell className="text-muted-foreground capitalize font-bold text-xs md:text-sm py-1">
        {verb.meaning}
      </TableCell>
    </TableRow>
  );
}
