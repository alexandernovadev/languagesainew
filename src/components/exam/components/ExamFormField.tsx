import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ExamFormFieldProps } from "../types/examTypes";

export function ExamFormField(props: ExamFormFieldProps) {
  const { label, required, description, error, type } = props;

  const renderField = () => {
    switch (type) {
      case "text":
        return (
          <Input
            value={props.value}
            onChange={(e) => props.onChange(e.target.value)}
            placeholder={props.placeholder}
          />
        );

      case "textarea":
        return (
          <div className="space-y-2">
            <Textarea
              value={props.value}
              onChange={(e) => props.onChange(e.target.value)}
              placeholder={props.placeholder}
              rows={props.rows || 3}
              className="resize-none"
            />
            {props.extraContent && (
              <div className="flex items-center justify-between">
                {props.extraContent}
              </div>
            )}
          </div>
        );

      case "number":
        return (
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                const currentValue =
                  Number(props.value) || (props as any).min || 4;
                const newValue = Math.max(
                  (props as any).min || 4,
                  currentValue - 1
                );
                (props as any).onChange(newValue);
              }}
              className="h-8 w-8 p-0"
              disabled={Number(props.value) <= ((props as any).min || 4)}
            >
              -
            </Button>
            <Input
              type="number"
              value={props.value}
              onChange={(e) => {
                const inputValue = e.target.value;
                // Solo permitir números enteros
                if (/^\d*$/.test(inputValue)) {
                  const numValue = parseInt(inputValue) || 0;
                  const clampedValue = Math.max(
                    (props as any).min || 4,
                    Math.min((props as any).max || 30, numValue)
                  );
                  (props as any).onChange(clampedValue);
                }
              }}
              onKeyDown={(e) => {
                // Prevenir caracteres no numéricos excepto backspace, delete, arrow keys
                if (
                  !/[\d\b\-\+]/.test(e.key) &&
                  ![
                    "Backspace",
                    "Delete",
                    "ArrowLeft",
                    "ArrowRight",
                    "ArrowUp",
                    "ArrowDown",
                    "Tab",
                  ].includes(e.key)
                ) {
                  e.preventDefault();
                }
              }}
              min={(props as any).min || 4}
              max={(props as any).max || 30}
              className={`w-16 text-center ${
                Number(props.value) < 4 || Number(props.value) > 30
                  ? "border-red-500 text-red-500"
                  : ""
              }`}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                const currentValue =
                  Number(props.value) || (props as any).min || 4;
                const newValue = Math.min(
                  (props as any).max || 30,
                  currentValue + 1
                );
                (props as any).onChange(newValue);
              }}
              className="h-8 w-8 p-0"
              disabled={Number(props.value) >= ((props as any).max || 30)}
            >
              +
            </Button>
          </div>
        );

      case "select":
        return (
          <Select value={props.value} onValueChange={props.onChange}>
            <SelectTrigger>
              <SelectValue placeholder={props.placeholder} />
            </SelectTrigger>
            <SelectContent>
              {props.options.map((option) => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  className="text-left"
                >
                  <div className="flex flex-col items-start">
                    <span className="font-medium">{option.label}</span>
                    {option.description && (
                      <span className="text-xs text-muted-foreground">
                        {option.description}
                      </span>
                    )}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case "slider":
        return (
          <div className="space-y-2">
            <Slider
              value={[props.value]}
              onValueChange={(value) => props.onChange(value[0])}
              max={props.max}
              min={props.min}
              step={props.step}
              className="w-full"
            />
            {props.showLabels && (
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>1</span>
                <span>2</span>
                <span>3</span>
                <span>4</span>
                <span>5</span>
              </div>
            )}
            {props.getLabel && (
              <div className="text-center">
                <span className="text-sm font-medium">
                  {props.getLabel(props.value)}
                </span>
              </div>
            )}
          </div>
        );

      case "checkbox-group":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {props.options.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <Checkbox
                  id={option.value}
                  checked={props.value.includes(option.value)}
                  onCheckedChange={(checked) => {
                    const newValue = checked
                      ? [...props.value, option.value]
                      : props.value.filter((v) => v !== option.value);
                    props.onChange(newValue);
                  }}
                />
                <Label
                  htmlFor={option.value}
                  className="flex flex-col cursor-pointer"
                >
                  <span className="font-medium">{option.label}</span>
                  {option.description && (
                    <span className="text-xs text-muted-foreground">
                      {option.description}
                    </span>
                  )}
                </Label>
              </div>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-1.5">
      <Label className="text-sm font-medium">
        {label.includes("(") ? (
          <>
            {label.split("(")[0]}
            <span className="text-[10px] text-muted-foreground font-normal">
              ({label.split("(")[1]}
            </span>
          </>
        ) : (
          label
        )}
        {error && (
          <span className="text-[12px] text-red-500 font-normal ml-1">
            ({error})
          </span>
        )}
      </Label>

      {renderField()}

      {description && !error && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}

      {type === "number" &&
        (Number(props.value) < 4 || Number(props.value) > 30) && (
          <p className="text-xs text-red-500">
            El valor debe estar entre 4 y 30
          </p>
        )}
    </div>
  );
}
