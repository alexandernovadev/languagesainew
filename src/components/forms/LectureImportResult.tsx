import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

interface ProcessingResult {
  index: number;
  status: "valid" | "invalid" | "duplicate" | "error";
  action?: "skipped" | "inserted" | "updated" | "merged";
  error?: string;
  warnings?: string[];
}

interface BatchResult {
  batchIndex: number;
  processed: number;
  valid: number;
  invalid: number;
  duplicates: number;
  errors: number;
  inserted: number;
  updated: number;
  skipped: number;
  results?: ProcessingResult[];
}

interface ImportResultSummary {
  success: boolean;
  message: string;
  duration: number;
}

interface ImportResult {
  totalLectures: number;
  totalBatches: number;
  totalValid: number;
  totalInvalid: number;
  totalDuplicates: number;
  totalErrors: number;
  totalInserted: number;
  totalUpdated: number;
  totalSkipped: number;
  batches: BatchResult[];
  summary: ImportResultSummary;
}

function statusColor(status: string) {
  switch (status) {
    case "valid":
      return "text-green-600 font-semibold";
    case "invalid":
    case "error":
      return "text-red-600 font-semibold";
    case "duplicate":
      return "text-yellow-600 font-semibold";
    default:
      return "";
  }
}

function actionColor(action?: string) {
  switch (action) {
    case "inserted":
    case "updated":
    case "merged":
      return "text-green-700 font-semibold";
    case "skipped":
      return "text-gray-500 font-semibold";
    default:
      return "";
  }
}

function badgeStyle(label: string) {
  switch (label) {
    case "Inserted":
      return "border border-green-600 text-green-600 bg-transparent px-2 rounded";
    case "Errors":
      return "border border-red-600 text-red-600 bg-transparent px-2 rounded";
    case "Skipped":
      return "border border-gray-500 text-gray-500 bg-transparent px-2 rounded";
    case "Duplicates":
      return "border border-yellow-500 text-yellow-500 bg-transparent px-2 rounded";
    case "Updated":
      return "border border-green-700 text-green-700 bg-transparent px-2 rounded";
    case "Duration":
      return "border border-blue-600 text-blue-600 bg-transparent px-2 rounded";
    default:
      return "border border-slate-700 text-slate-700 bg-transparent px-2 rounded";
  }
}

export default function LectureImportResult({
  result,
}: {
  result: { data: ImportResult; message: string };
}) {
  if (!result || !result.data) return null;
  const data = result.data;
  const summary = data.summary;

  // Flatten all results with batch info
  const allRows: (ProcessingResult & { batchIndex: number })[] = [];
  data.batches.forEach((batch) => {
    batch.results?.forEach((r) => {
      allRows.push({ ...r, batchIndex: batch.batchIndex });
    });
  });

  const showDetails = allRows.length > 0;

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Import Result</CardTitle>
        <CardDescription>{summary.message}</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Resumen global */}
        <div className="flex flex-wrap gap-3 mb-6 items-center text-sm">
          <span>Total Lectures: <b>{data.totalLectures}</b></span>
          <span className={badgeStyle("Inserted")}>Inserted: {data.totalInserted}</span>
          <span className={badgeStyle("Updated")}>Updated: {data.totalUpdated}</span>
          <span className={badgeStyle("Skipped")}>Skipped: {data.totalSkipped}</span>
          <span className={badgeStyle("Duplicates")}>Duplicates: {data.totalDuplicates}</span>
          <span className={badgeStyle("Errors")}>Errors: {data.totalErrors}</span>
          <span className={badgeStyle("Duration")}>Duration: {summary.duration}ms</span>
        </div>

        {/* Tabla de detalles o totales por batch */}
        <div className="overflow-x-auto rounded border bg-background">
          {showDetails ? (
            <table className="min-w-full text-xs">
              <thead>
                <tr className="bg-muted text-left">
                  <th className="px-3 py-2">Batch</th>
                  <th className="px-3 py-2">Index</th>
                  <th className="px-3 py-2">Status</th>
                  <th className="px-3 py-2">Action</th>
                  <th className="px-3 py-2">Error</th>
                  <th className="px-3 py-2">Warnings</th>
                </tr>
              </thead>
              <tbody>
                {allRows.map((row, i) => (
                  <tr key={`${row.batchIndex}-${row.index}`} className="border-b last:border-0">
                    <td className="px-3 py-2 text-center font-mono">{row.batchIndex}</td>
                    <td className="px-3 py-2 text-center font-mono">{row.index}</td>
                    <td className={`px-3 py-2 text-center ${statusColor(row.status)}`}>{row.status}</td>
                    <td className={`px-3 py-2 text-center ${actionColor(row.action)}`}>{row.action || "-"}</td>
                    <td className="px-3 py-2 text-red-500 text-xs max-w-[200px] truncate" title={row.error || "-"}>{row.error || "-"}</td>
                    <td className="px-3 py-2 text-yellow-600 text-xs max-w-[200px] truncate" title={row.warnings?.join(", ") || "-"}>
                      {row.warnings && row.warnings.length > 0 ? row.warnings.join(", ") : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table className="min-w-full text-xs">
              <thead>
                <tr className="bg-muted text-left">
                  <th className="px-3 py-2">Batch</th>
                  <th className="px-3 py-2">Processed</th>
                  <th className="px-3 py-2">Valid</th>
                  <th className="px-3 py-2">Invalid</th>
                  <th className="px-3 py-2">Inserted</th>
                  <th className="px-3 py-2">Updated</th>
                  <th className="px-3 py-2">Skipped</th>
                  <th className="px-3 py-2">Duplicates</th>
                  <th className="px-3 py-2">Errors</th>
                </tr>
              </thead>
              <tbody>
                {data.batches.map((batch) => (
                  <tr key={batch.batchIndex} className="border-b last:border-0">
                    <td className="px-3 py-2 text-center font-mono">{batch.batchIndex}</td>
                    <td className="px-3 py-2 text-center">{batch.processed}</td>
                    <td className="px-3 py-2 text-center text-green-700 font-semibold">{batch.valid}</td>
                    <td className="px-3 py-2 text-center text-red-700 font-semibold">{batch.invalid}</td>
                    <td className="px-3 py-2 text-center text-green-700 font-semibold">{batch.inserted}</td>
                    <td className="px-3 py-2 text-center text-green-700 font-semibold">{batch.updated}</td>
                    <td className="px-3 py-2 text-center text-gray-500 font-semibold">{batch.skipped}</td>
                    <td className="px-3 py-2 text-center text-yellow-600 font-semibold">{batch.duplicates}</td>
                    <td className="px-3 py-2 text-center text-red-600 font-semibold">{batch.errors}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 