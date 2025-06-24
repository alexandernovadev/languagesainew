import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Verb,
  VerbField,
  UserAnswers,
  CheckedAnswers,
  InputFields,
} from "../types";
import { VerbRow } from "./VerbRow";

interface VerbsTableProps {
  verbs: Verb[];
  inputFields: InputFields;
  userAnswers: UserAnswers;
  showAnswers: boolean;
  checkedAnswers: CheckedAnswers;
  onInputChange: (verbId: number, field: VerbField, value: string) => void;
}

export function VerbsTable({
  verbs,
  inputFields,
  userAnswers,
  showAnswers,
  checkedAnswers,
  onInputChange,
}: VerbsTableProps) {
  return (
    <Card>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Infinitivo</TableHead>
                <TableHead className="w-[150px]">Pasado</TableHead>
                <TableHead className="w-[150px]">Participio</TableHead>
                <TableHead>Significado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {verbs.map((verb) => (
                <VerbRow
                  key={verb.id}
                  verb={verb}
                  field={inputFields[verb.id]}
                  userAnswer={userAnswers[verb.id]?.[inputFields[verb.id]]}
                  showAnswers={showAnswers}
                  isCorrect={checkedAnswers[verb.id] || false}
                  onInputChange={onInputChange}
                />
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
