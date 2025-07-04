import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectContent,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { api } from "@/services/api";
import { getAuthHeaders } from "@/utils/services/headers";
import { FileInputButton } from "@/components/ui/FileInputButton";
import WordImportResult from "./WordImportResult";
import { toast } from "sonner";

const duplicateStrategies = [
  { value: "skip", label: "Skip (do not import duplicates)" },
  { value: "overwrite", label: "Overwrite (replace existing)" },
  { value: "error", label: "Error (fail on duplicate)" },
  { value: "merge", label: "Merge (combine data)" },
];

export default function WordImportForm() {
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [duplicateStrategy, setDuplicateStrategy] = useState("skip");
  const [batchSize, setBatchSize] = useState(10);
  const [batchSizeError, setBatchSizeError] = useState<string | null>(null);
  const [validateOnly, setValidateOnly] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  // File input handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] || null;
    if (selected) {
      if (!selected.name.endsWith(".json")) {
        setFile(null);
        setFileError("Only .json files are allowed");
      } else {
        setFile(selected);
        setFileError(null);
      }
    } else {
      setFile(null);
      setFileError(null);
    }
  };

  // Batch size handler
  const handleBatchSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    setBatchSize(value);
    if (isNaN(value) || value < 1 || value > 100) {
      setBatchSizeError("Batch size must be between 1 and 100");
    } else {
      setBatchSizeError(null);
    }
  };

  // Checkbox handler
  const handleValidateOnlyChange = (checked: boolean) => {
    setValidateOnly(checked);
  };

  // Botón deshabilitado si falta archivo válido o batch size inválido
  const isDisabled = !file || !!fileError || !!batchSizeError || loading;

  // Envío al backend
  const handleSubmit = async () => {
    if (!file || fileError || batchSizeError) return;
    setLoading(true);
    setResult(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("duplicateStrategy", duplicateStrategy);
      formData.append("batchSize", String(batchSize));
      formData.append("validateOnly", String(validateOnly));

      const response = await api.post("/api/words/import-file", formData, {
        headers: {
          ...getAuthHeaders(),
          "Content-Type": "multipart/form-data",
        },
      });
      const data = response.data;
      if (!data.success) {
        throw new Error(data.message || "Import failed");
      }
      setResult(data);
      toast.success("Import successful", {
        description: data.message || "Words imported successfully",
      });
    } catch (error: any) {
      toast.error("Import error", {
        description: error.message || "An error occurred during import",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
    >
      {/* File input */}
      <div>
        <Label htmlFor="word-file">JSON File</Label>
        <FileInputButton
          accept=".json"
          onFileChange={(selected: File | null) => {
            if (selected) {
              if (!selected.name.endsWith(".json")) {
                setFile(null);
                setFileError("Only .json files are allowed");
              } else {
                setFile(selected);
                setFileError(null);
              }
            } else {
              setFile(null);
              setFileError(null);
            }
          }}
          label="Seleccionar archivo"
          icon="📄"
          file={file}
          error={fileError}
          inputId="word-file"
          disabled={loading}
        />
      </div>

      {/* Duplicate strategy */}
      <div>
        <Label>Duplicate Strategy</Label>
        <Select value={duplicateStrategy} onValueChange={setDuplicateStrategy}>
          <SelectTrigger className="w-full">
            {duplicateStrategies.find((opt) => opt.value === duplicateStrategy)
              ?.label || "Select..."}
          </SelectTrigger>
          <SelectContent>
            {duplicateStrategies.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Batch size */}
      <div>
        <Label htmlFor="batch-size">Batch Size</Label>
        <Input
          id="batch-size"
          type="number"
          min={1}
          max={100}
          value={batchSize}
          onChange={handleBatchSizeChange}
        />
        {batchSizeError && (
          <div className="text-xs text-red-500 mt-1">{batchSizeError}</div>
        )}
      </div>

      {/* Validate only */}
      <div className="flex items-center space-x-2">
        <Checkbox
          id="validate-only"
          checked={validateOnly}
          onCheckedChange={handleValidateOnlyChange}
        />
        <Label htmlFor="validate-only">Validate only (do not import)</Label>
      </div>

      {/* Action button */}
      <Button type="submit" disabled={isDisabled}>
        {loading
          ? validateOnly
            ? "Validating..."
            : "Importing..."
          : validateOnly
          ? "Validate"
          : "Import"}
      </Button>

      {/* Feedback/result area */}
      {result && <WordImportResult result={result} />}
    </form>
  );
}
