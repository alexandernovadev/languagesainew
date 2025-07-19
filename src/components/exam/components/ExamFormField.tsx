import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
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
          <div className="flex items-center gap-4">
            <Input
              type="number"
              value={props.value}
              onChange={(e) => props.onChange(parseInt(e.target.value))}
              min={props.min}
              max={props.max}
              step={props.step}
              className="w-24"
            />
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
                <SelectItem key={option.value} value={option.value}>
                  <div className="flex flex-col">
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
          <div className="space-y-3">
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
    <div className="space-y-2">
      <Label className="text-base font-medium">
        {label} {required && "*"}
      </Label>

      {renderField()}

      {description && !error && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}

      {error && <p className="text-sm text-red-500 font-medium">{error}</p>}
    </div>
  );
}
