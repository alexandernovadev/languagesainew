import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Play, Settings } from "lucide-react";
import { GameConfig } from "../types";
import { GAME_CONFIG_OPTIONS, irregularVerbs } from "../data";
import { useVerbsGameStore } from "@/lib/store/useVerbsGameStore";

interface GameConfigModalProps {
  onStartGame: (config: GameConfig) => void;
}

export function GameConfigModal({ onStartGame }: GameConfigModalProps) {
  const config = useVerbsGameStore((state) => state.config);
  const updateConfig = useVerbsGameStore((state) => state.updateConfig);

  const handleConfigChange = <K extends keyof GameConfig>(
    key: K,
    value: GameConfig[K]
  ) => {
    updateConfig({ [key]: value } as Partial<GameConfig>);
  };

  const handleStartGame = () => {
    onStartGame(config);
  };

  return (
    <div className="flex items-center justify-center min-h-[60dvh] p-4">
      <Card className="w-full max-w-7xl px-4 md:px-8">
        <CardHeader className="text-left">
          <div className="flex items-center justify-start mb-4">
            <Settings className="h-8 w-8 mr-2" />
            <CardTitle className="text-2xl">Configuración del Juego</CardTitle>
          </div>
          <p className="text-muted-foreground">
            Personaliza tu experiencia de aprendizaje de verbos irregulares
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Configuration Grid - 3 columns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Columna 1 */}
            <div className="space-y-8">
              {/* Shuffle option */}
              <div className="flex items-center justify-between p-4 border rounded-lg w-full">
                <div className="space-y-0.5">
                  <Label htmlFor="shuffle" className="text-base font-medium">
                    Mezclar verbos
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Los verbos aparecerán en orden aleatorio
                  </p>
                </div>
                <Switch
                  id="shuffle"
                  checked={config.shuffle}
                  onCheckedChange={(checked) =>
                    handleConfigChange("shuffle", checked)
                  }
                />
              </div>

              {/* Verbos por página */}
              <div className="space-y-2 w-full flex flex-col items-start">
                <Label htmlFor="itemsPerPage" className="text-base font-medium">
                  Verbos por página
                </Label>
                <div className="w-full">
                  <Select
                    value={config.itemsPerPage.toString()}
                    onValueChange={(value) =>
                      handleConfigChange("itemsPerPage", parseInt(value))
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {GAME_CONFIG_OPTIONS.itemsPerPage.map((count) => (
                        <SelectItem
                          key={count}
                          value={count.toString()}
                          className="w-full"
                        >
                          {count} verbos
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Columna 2 */}
            <div className="space-y-8">
              {/* Total de verbos */}
              <div className="space-y-2 w-full flex flex-col items-start">
                <Label htmlFor="totalVerbs" className="text-base font-medium">
                  Total de verbos
                </Label>
                <div className="w-full">
                  <Select
                    value={config.totalVerbs.toString()}
                    onValueChange={(value) =>
                      handleConfigChange("totalVerbs", parseInt(value))
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {GAME_CONFIG_OPTIONS.totalVerbs.map((count) => (
                        <SelectItem
                          key={count}
                          value={count.toString()}
                          className="w-full"
                        >
                          {count === irregularVerbs.length
                            ? "Todos"
                            : `${count} verbos`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Dificultad */}
              <div className="space-y-2 w-full flex flex-col items-start">
                <Label htmlFor="difficulty" className="text-base font-medium">
                  Dificultad
                </Label>
                <div className="w-full">
                  <Select
                    value={config.difficulty}
                    onValueChange={(value: "easy" | "medium" | "hard") =>
                      handleConfigChange("difficulty", value)
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {GAME_CONFIG_OPTIONS.difficulty.map((option) => (
                        <SelectItem
                          key={option.value}
                          value={option.value}
                          className="w-full"
                        >
                          <div className="flex items-center justify-between w-full">
                            <span>{option.label}</span>
                            <Badge variant="outline" className="ml-2">
                              {option.description}
                            </Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Límite de tiempo */}
              <div className="space-y-2 w-full flex flex-col items-start">
                <Label htmlFor="timeLimit" className="text-base font-medium">
                  Límite de tiempo
                </Label>
                <div className="w-full">
                  <Select
                    value={config.timeLimit?.toString() || "undefined"}
                    onValueChange={(value) =>
                      handleConfigChange(
                        "timeLimit",
                        value === "undefined" ? undefined : parseInt(value)
                      )
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {GAME_CONFIG_OPTIONS.timeLimit.map((option) => (
                        <SelectItem
                          key={option.value?.toString() || "undefined"}
                          value={option.value?.toString() || "undefined"}
                          className="w-full"
                        >
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Columna 3: Resumen del juego */}
            <div className="flex flex-col h-full justify-between">
              <Card className="bg-muted/50 w-full">
                <CardContent className="p-4">
                  <h4 className="font-semibold mb-3">Resumen del juego:</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Total de verbos:</span>
                      <Badge variant="secondary">{config.totalVerbs}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Páginas:</span>
                      <Badge variant="secondary">
                        {Math.ceil(config.totalVerbs / config.itemsPerPage)}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Dificultad:</span>
                      <Badge variant="secondary">
                        {
                          GAME_CONFIG_OPTIONS.difficulty.find(
                            (d) => d.value === config.difficulty
                          )?.label
                        }
                      </Badge>
                    </div>
                    {config.timeLimit && (
                      <div className="flex justify-between">
                        <span>Tiempo límite:</span>
                        <Badge variant="secondary">
                          {config.timeLimit} min
                        </Badge>
                      </div>
                    )}
                    {config.shuffle && (
                      <div className="flex justify-between">
                        <span>Modo:</span>
                        <Badge variant="secondary">Mezclado</Badge>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Start button */}
          <div className="pt-4">
            <Button onClick={handleStartGame} className="w-full" size="lg">
              <Play className="h-4 w-4 mr-2" />
              Comenzar Juego
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
