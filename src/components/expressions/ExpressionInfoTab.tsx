import { Expression } from "@/models/Expression";
import { ExpressionLevelBadge } from "../ExpressionLevelBadge";
import { Badge } from "@/components/ui/badge";

interface ExpressionInfoTabProps {
  expression: Expression;
}

export function ExpressionInfoTab({ expression }: ExpressionInfoTabProps) {
  return (
    <div className="space-y-4">
      {/* Definición */}
      <div>
        <h3 className="font-semibold mb-2">Definición</h3>
        <p className="text-muted-foreground">{expression.definition}</p>
      </div>
      
      {/* Traducción */}
      {expression.spanish && (
        <div>
          <h3 className="font-semibold mb-2">En Español</h3>
          <div className="space-y-2">
            {expression.spanish.expression && (
              <div>
                <span className="text-sm font-medium">Expresión: </span>
                <span className="text-muted-foreground">{expression.spanish.expression}</span>
              </div>
            )}
            {expression.spanish.definition && (
              <div>
                <span className="text-sm font-medium">Definición: </span>
                <span className="text-muted-foreground">{expression.spanish.definition}</span>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Contexto */}
      {expression.context && (
        <div>
          <h3 className="font-semibold mb-2">Contexto</h3>
          <p className="text-muted-foreground">{expression.context}</p>
        </div>
      )}
      
      {/* Nivel */}
      {expression.difficulty && (
        <div>
          <h3 className="font-semibold mb-2">Nivel</h3>
          <ExpressionLevelBadge level={expression.difficulty} />
        </div>
      )}
      
      {/* Tipos */}
      {expression.type && expression.type.length > 0 && (
        <div>
          <h3 className="font-semibold mb-2">Tipos</h3>
          <div className="flex flex-wrap gap-2">
            {expression.type.map((type, index) => (
              <Badge key={index} variant="secondary">
                {type}
              </Badge>
            ))}
          </div>
        </div>
      )}
      
      {/* Ejemplos */}
      {expression.examples && expression.examples.length > 0 && (
        <div>
          <h3 className="font-semibold mb-2">Ejemplos</h3>
          <ul className="space-y-1">
            {expression.examples.map((example, index) => (
              <li key={index} className="text-sm text-muted-foreground">
                • {example}
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {/* Imagen */}
      {expression.img && (
        <div>
          <h3 className="font-semibold mb-2">Imagen</h3>
          <img 
            src={expression.img} 
            alt={expression.expression}
            className="w-full max-w-xs rounded-lg object-contain border"
          />
        </div>
      )}
      
      {/* Información adicional */}
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="font-medium">Idioma: </span>
          <span className="text-muted-foreground">{expression.language}</span>
        </div>
        {expression.createdAt && (
          <div>
            <span className="font-medium">Creado: </span>
            <span className="text-muted-foreground">
              {new Date(expression.createdAt).toLocaleDateString()}
            </span>
          </div>
        )}
      </div>
    </div>
  );
} 