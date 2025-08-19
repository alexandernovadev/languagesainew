import { memo, useRef } from "react";
import { Expression } from "@/models/Expression";
import { ExpressionLevelBadge } from "../ExpressionLevelBadge";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/utils/common/classnames";
import { formatDateShort } from "@/utils/common/time/formatDate";
import { getLanguageInfo } from "@/utils/common/language";


interface ExpressionInfoTabProps {
  expression: Expression;
}

// Componente memoizado para SectionContainer
const SectionContainer = memo(
  ({
    children,
    className = "",
  }: {
    children: React.ReactNode;
    className?: string;
  }) => (
    <div className="mb-4">
      <div
        className={cn(
          "p-4 rounded-lg border bg-zinc-900/40 border-zinc-800",
          className
        )}
      >
        {children}
      </div>
    </div>
  )
);

SectionContainer.displayName = "SectionContainer";

// Componente memoizado para SectionHeader
const SectionHeader = memo(
  ({ title, icon }: { title: string; icon?: string }) => (
    <div className="flex items-center gap-2 mb-3">
      {icon && <span className="text-lg">{icon}</span>}
      <h3 className="text-sm font-semibold text-zinc-200 uppercase tracking-wide">
        {title}
      </h3>
    </div>
  )
);

SectionHeader.displayName = "SectionHeader";

// Componente memoizado para SelectableTextContainer
const SelectableTextContainer = memo(
  ({
    children,
    containerRef,
  }: {
    children: React.ReactNode;
    containerRef?: React.RefObject<HTMLDivElement | null>;
  }) => (
    <div ref={containerRef} className="relative text-selectable">
      {children}
    </div>
  )
);

SelectableTextContainer.displayName = "SelectableTextContainer";

export const ExpressionInfoTab = memo(function ExpressionInfoTab({
  expression,
}: ExpressionInfoTabProps) {
  // Refs separados para cada sección seleccionable
  const definitionRef = useRef<HTMLDivElement>(null);
  const contextRef = useRef<HTMLDivElement>(null);
  const examplesRef = useRef<HTMLDivElement>(null);



  return (
    <div className="space-y-4">
      {/* Header con nivel y idioma */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{getLanguageInfo(expression.language).flag}</span>
            {expression.difficulty && (
              <ExpressionLevelBadge
                level={expression.difficulty}
                className="text-xs"
              />
            )}
          </div>
        </div>
      </div>

      {/* Expresión */}
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-white capitalize mb-1">
          {expression.expression}
        </h1>
      </div>

      {/* Definición */}
      {expression.definition && (
        <SelectableTextContainer containerRef={definitionRef}>
          <SectionContainer>
            <SectionHeader title="Definición" icon="📖" />
            <p className="text-sm text-zinc-300 leading-relaxed">
              {expression.definition}
            </p>
          </SectionContainer>
        </SelectableTextContainer>
      )}

      {/* Traducción al español */}
      {expression.spanish && (
        <SectionContainer className="border-blue-500/30">
          <SectionHeader title="Traducción" icon="🇪🇸" />
          <div className="space-y-2">
            {expression.spanish.expression && (
              <div>
                <h3 className="text-lg font-bold text-blue-400 capitalize mb-1">
                  {expression.spanish.expression}
                </h3>
              </div>
            )}
            {expression.spanish.definition && (
              <p className="text-sm text-zinc-300 leading-relaxed">
                {expression.spanish.definition}
              </p>
            )}
          </div>
        </SectionContainer>
      )}

      {/* Contexto */}
      {expression.context && (
        <SelectableTextContainer containerRef={contextRef}>
          <SectionContainer className="border-green-500/30">
            <SectionHeader title="Contexto" icon="🎯" />
            <p className="text-sm text-zinc-300 leading-relaxed">
              {expression.context}
            </p>
          </SectionContainer>
        </SelectableTextContainer>
      )}

      {/* Tipos */}
      {expression.type && expression.type.length > 0 && (
        <SectionContainer className="border-purple-500/30">
          <SectionHeader title="Tipos" icon="🏷️" />
          <div className="flex flex-wrap gap-2">
            {expression.type.map((type, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="px-2 py-1 bg-purple-900/30 border border-purple-700/30 text-xs text-purple-300 capitalize"
              >
                {type}
              </Badge>
            ))}
          </div>
        </SectionContainer>
      )}

      {/* Ejemplos */}
      {expression.examples && expression.examples.length > 0 && (
        <SelectableTextContainer containerRef={examplesRef}>
          <SectionContainer className="border-yellow-500/30">
            <SectionHeader title="Ejemplos" icon="💬" />
            <div className="space-y-2">
              {expression.examples.map((example, index) => (
                <p
                  key={index}
                  className="text-sm text-zinc-300 leading-relaxed"
                >
                  • {example}
                </p>
              ))}
            </div>
          </SectionContainer>
        </SelectableTextContainer>
      )}

      {/* Imagen */}
      {expression.img && (
        <SectionContainer>
          <SectionHeader title="Imagen" icon="🖼️" />
          <div className="relative flex justify-center">
            <img
              src={expression.img}
              alt={expression.expression}
              className="w-full max-w-xs rounded-lg max-h-96 object-contain border border-zinc-700"
            />
          </div>
        </SectionContainer>
      )}

      {/* Información adicional */}
      <SectionContainer className="border-orange-500/30">
        <SectionHeader title="Información" icon="ℹ️" />
                  <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <h4 className="font-semibold text-zinc-400 mb-1">Idioma</h4>
              <div className="flex items-center gap-2">
                <span className="text-sm">{getLanguageInfo(expression.language).flag}</span>
                <p className="text-zinc-500">{getLanguageInfo(expression.language).name}</p>
              </div>
            </div>
            {expression.createdAt && (
              <div>
                <h4 className="font-semibold text-zinc-400 mb-1">Creado</h4>
                <p className="text-zinc-500">
                  {formatDateShort(expression.createdAt)}
                </p>
              </div>
            )}
          </div>
      </SectionContainer>


    </div>
  );
});
