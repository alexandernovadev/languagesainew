import { useRef, useState } from "react";
import { PageHeader } from "@/shared/components/ui/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import { Button } from "@/shared/components/ui/button";
import { ModalNova } from "@/shared/components/ui/modal-nova";
import { Target, Volume2, Languages, FileText, BookOpen, GraduationCap, Menu } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table";
import { Separator } from "@/shared/components/ui/separator";
import { cn } from "@/utils/common/classnames";

const PRONUNCIATION_SECTIONS = [
  { id: "quickref", label: "Chuleta Rápida", icon: Target },
  { id: "vowels", label: "Vocales", icon: Volume2 },
  { id: "consonants", label: "Consonantes", icon: Languages },
  { id: "stress", label: "Acento y Reducción", icon: FileText },
  { id: "orthography", label: "Ortografía → Sonido", icon: BookOpen },
  { id: "practice", label: "Práctica y Variación", icon: GraduationCap },
];

// Helper function para colores de badges IPA
const getIPABadgeColor = (ipa: string) => {
  // Vocales cortas - azul
  if (['/ɪ/', '/e/', '/æ/', '/ʌ/', '/ɒ/'].includes(ipa)) {
    return "bg-blue-100 text-blue-700 border-blue-300 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700";
  }
  // Vocales largas - verde
  if (['/iː/', '/ɑː/', '/ɔː/', '/uː/'].includes(ipa)) {
    return "bg-green-100 text-green-700 border-green-300 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700";
  }
  // Diptongos - púrpura
  if (['/eɪ/', '/aɪ/', '/ɔɪ/', '/oʊ/', '/aʊ/'].includes(ipa)) {
    return "bg-purple-100 text-purple-700 border-purple-300 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-700";
  }
  // Schwa - gris
  if (ipa === '/ə/') {
    return "bg-gray-100 text-gray-700 border-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600";
  }
  // Consonantes fricativas/africadas - naranja
  if (['/ʃ/', '/tʃ/', '/dʒ/'].includes(ipa)) {
    return "bg-orange-100 text-orange-700 border-orange-300 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-700";
  }
  // TH - rojo
  if (['/θ/', '/ð/'].includes(ipa)) {
    return "bg-red-100 text-red-700 border-red-300 dark:bg-red-900/30 dark:text-red-300 dark:border-red-700";
  }
  // N/NG - cian
  if (['/n/', '/ŋ/'].includes(ipa)) {
    return "bg-cyan-100 text-cyan-700 border-cyan-300 dark:bg-cyan-900/30 dark:text-cyan-300 dark:border-cyan-700";
  }
  // R - rosa
  if (ipa === '/ɹ/') {
    return "bg-pink-100 text-pink-700 border-pink-300 dark:bg-pink-900/30 dark:text-pink-300 dark:border-pink-700";
  }
  // Default
  return "bg-primary/10 text-primary border-primary/20";
};

export default function PronunciationGuidePage() {
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [sectionsModalOpen, setSectionsModalOpen] = useState(false);

  const scrollToSection = (id: string) => {
    sectionRefs.current[id]?.scrollIntoView({ behavior: "smooth", block: "start" });
    setSectionsModalOpen(false);
  };

  return (
    <div className="space-y-4 flex flex-col flex-1 min-h-0">
      <PageHeader
        title="Guía IPA"
        description="Pronunciación en inglés basado en IPA"
      />

      <div className="flex flex-1 min-h-0 gap-4">
        {/* Sidebar - navegación fija, solo en desktop (lg+) */}
        <Card className="hidden lg:flex w-56 shrink-0 flex-col overflow-hidden h-[calc(100dvh-12rem)] min-h-[280px] sticky top-20 self-start">
          <CardContent className="flex-1 min-h-0 overflow-hidden p-0 flex flex-col">
            <div className="py-3 px-4 shrink-0 border-b">
              <h3 className="text-sm font-medium flex items-center gap-2 text-foreground">
                <Volume2 className="h-4 w-4 shrink-0" />
                Secciones
              </h3>
            </div>
            <ScrollArea className="flex-1 min-h-0">
              <nav className="p-2 space-y-0.5">
                {PRONUNCIATION_SECTIONS.map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => scrollToSection(id)}
                    className="flex w-full items-center gap-2 px-3 py-2 text-sm font-medium hover:bg-muted rounded-md transition-colors text-left"
                  >
                    <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
                    <span className="truncate">{label}</span>
                  </button>
                ))}
              </nav>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Contenido principal */}
        <Card className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <ScrollArea className="flex-1 h-[calc(100dvh-12rem)] min-h-[400px]">
            <div className="p-6 space-y-6 sm:space-y-8">
              {/* CHULETA RÁPIDA */}
              <section
                id="quickref"
                ref={(el) => { sectionRefs.current["quickref"] = el; }}
              >
        <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
          <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-t-lg">
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl lg:text-2xl">
              <Target className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Chuleta Rápida
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-blue-600 dark:text-blue-400">Vocales clave</h3>
              <div className="space-y-4">
                <div className="space-y-2 p-3 rounded-lg bg-blue-50/50 dark:bg-blue-950/20">
                  <div className="flex items-center gap-3 flex-wrap">
                    <Badge variant="outline" className={cn("font-mono text-sm sm:text-base lg:text-lg font-bold px-2 sm:px-3 py-1", getIPABadgeColor("/ɪ/"))}>/ɪ/</Badge>
                    <span className="font-semibold text-sm sm:text-base">ship</span>
                    <span className="text-muted-foreground text-sm sm:text-base lg:text-lg">≠</span>
                    <Badge variant="outline" className={cn("font-mono text-sm sm:text-base lg:text-lg font-bold px-2 sm:px-3 py-1", getIPABadgeColor("/iː/"))}>/iː/</Badge>
                    <span className="font-semibold text-sm sm:text-base">sheep</span>
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground pl-2">
                    <strong>/ɪ/</strong>: Boca relajada, lengua en posición media-alta, sonido corto y relajado.
                    <strong>/iː/</strong>: Boca estirada hacia los lados (como sonrisa), lengua alta, sonido largo y tenso.
                  </p>
                </div>
                <div className="space-y-2 p-3 rounded-lg bg-blue-50/50 dark:bg-blue-950/20">
                  <div className="flex items-center gap-3 flex-wrap">
                    <Badge variant="outline" className={cn("font-mono text-sm sm:text-base lg:text-lg font-bold px-2 sm:px-3 py-1", getIPABadgeColor("/æ/"))}>/æ/</Badge>
                    <span className="font-semibold text-sm sm:text-base">cat</span>
                    <span className="text-muted-foreground text-sm sm:text-base lg:text-lg">≠</span>
                    <Badge variant="outline" className={cn("font-mono text-sm sm:text-base lg:text-lg font-bold px-2 sm:px-3 py-1", getIPABadgeColor("/ʌ/"))}>/ʌ/</Badge>
                    <span className="font-semibold text-sm sm:text-base">cup</span>
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground pl-2">
                    <strong>/æ/</strong>: Boca muy abierta, lengua baja y adelante, sonido corto y abierto.
                    <strong>/ʌ/</strong>: Boca medio abierta, lengua en posición central, sonido corto y relajado.
                  </p>
                </div>
                <div className="space-y-2 p-3 rounded-lg bg-purple-50/50 dark:bg-purple-950/20">
                  <div className="flex items-center gap-3 flex-wrap">
                    <Badge variant="outline" className={cn("font-mono text-sm sm:text-base lg:text-lg font-bold px-2 sm:px-3 py-1", getIPABadgeColor("/eɪ/"))}>/eɪ/</Badge>
                    <span className="font-semibold text-sm sm:text-base">wait</span>
                    <span className="text-muted-foreground text-sm sm:text-base lg:text-lg">≠</span>
                    <Badge variant="outline" className={cn("font-mono text-sm sm:text-base lg:text-lg font-bold px-2 sm:px-3 py-1", getIPABadgeColor("/aɪ/"))}>/aɪ/</Badge>
                    <span className="font-semibold text-sm sm:text-base">time</span>
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground pl-2">
                    <strong>/eɪ/</strong>: Comienza con boca medio abierta y se desliza hacia /i/, como "ei" en español pero más cerrado al final.
                    <strong>/aɪ/</strong>: Comienza con boca muy abierta y se desliza hacia /i/, como "ai" pero más marcado.
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-xl font-bold mb-4 text-orange-600 dark:text-orange-400">Consonantes críticas</h3>
              <div className="space-y-4">
                <div className="space-y-2 p-3 rounded-lg bg-orange-50/50 dark:bg-orange-950/20">
                  <div className="flex items-center gap-3 flex-wrap">
                    <Badge variant="outline" className={cn("font-mono text-sm sm:text-base lg:text-lg font-bold px-2 sm:px-3 py-1", getIPABadgeColor("/ʃ/"))}>/ʃ/</Badge>
                    <span className="font-semibold text-sm sm:text-base">shop</span>
                    <span className="text-muted-foreground text-sm sm:text-base lg:text-lg">≠</span>
                    <Badge variant="outline" className={cn("font-mono text-sm sm:text-base lg:text-lg font-bold px-2 sm:px-3 py-1", getIPABadgeColor("/tʃ/"))}>/tʃ/</Badge>
                    <span className="font-semibold text-sm sm:text-base">chop</span>
                    <span className="text-muted-foreground text-sm sm:text-base lg:text-lg">≠</span>
                    <Badge variant="outline" className={cn("font-mono text-sm sm:text-base lg:text-lg font-bold px-2 sm:px-3 py-1", getIPABadgeColor("/dʒ/"))}>/dʒ/</Badge>
                    <span className="font-semibold text-sm sm:text-base">job</span>
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground pl-2">
                    <strong>/ʃ/</strong>: Lengua hacia atrás, labios redondeados, aire pasa creando fricción (como "sh" suave).
                    <strong>/tʃ/</strong>: Primero bloqueas el aire con la lengua, luego lo sueltas con fricción (como "ch" en español).
                    <strong>/dʒ/</strong>: Igual que /tʃ/ pero con vibración de cuerdas vocales (sonido sonoro).
                  </p>
                </div>
                <div className="space-y-2 p-3 rounded-lg bg-red-50/50 dark:bg-red-950/20">
                  <div className="flex items-center gap-3 flex-wrap">
                    <Badge variant="outline" className={cn("font-mono text-sm sm:text-base lg:text-lg font-bold px-2 sm:px-3 py-1", getIPABadgeColor("/θ/"))}>/θ/</Badge>
                    <span className="font-semibold text-sm sm:text-base">think</span>
                    <span className="text-muted-foreground text-sm sm:text-base lg:text-lg">≠</span>
                    <Badge variant="outline" className={cn("font-mono text-sm sm:text-base lg:text-lg font-bold px-2 sm:px-3 py-1", getIPABadgeColor("/ð/"))}>/ð/</Badge>
                    <span className="font-semibold text-sm sm:text-base">this</span>
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground pl-2">
                    <strong>/θ/</strong>: Punta de la lengua entre los dientes, aire pasa sin vibración (sorda, sin voz).
                    <strong>/ð/</strong>: Misma posición pero con vibración de cuerdas vocales (sonora, con voz).
                  </p>
                </div>
                <div className="space-y-2 p-3 rounded-lg bg-cyan-50/50 dark:bg-cyan-950/20">
                  <div className="flex items-center gap-3 flex-wrap">
                    <Badge variant="outline" className={cn("font-mono text-sm sm:text-base lg:text-lg font-bold px-2 sm:px-3 py-1", getIPABadgeColor("/n/"))}>/n/</Badge>
                    <span className="font-semibold text-sm sm:text-base">seen</span>
                    <span className="text-muted-foreground text-sm sm:text-base lg:text-lg">≠</span>
                    <Badge variant="outline" className={cn("font-mono text-sm sm:text-base lg:text-lg font-bold px-2 sm:px-3 py-1", getIPABadgeColor("/ŋ/"))}>/ŋ/</Badge>
                    <span className="font-semibold text-sm sm:text-base">sing</span>
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground pl-2">
                    <strong>/n/</strong>: Lengua toca el paladar detrás de los dientes superiores, aire sale por la nariz.
                    <strong>/ŋ/</strong>: Lengua toca el paladar blando (parte posterior), aire sale por la nariz, sonido más atrás en la boca.
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-amber-600 dark:text-amber-400">Reglas de oro</h3>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span>El <strong>acento manda</strong></span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span>Las sílabas débiles → <Badge variant="outline" className="font-mono">/ə/</Badge></span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span>La escritura miente; el IPA no</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

              {/* VOCALES */}
              <section
                id="vowels"
                ref={(el) => { sectionRefs.current["vowels"] = el; }}
              >
        <Card className="border-2 border-blue-200 dark:border-blue-800 bg-gradient-to-br from-blue-50/50 to-indigo-50/50 dark:from-blue-950/20 dark:to-indigo-950/20">
          <CardHeader className="bg-gradient-to-r from-blue-100/50 to-indigo-100/50 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-t-lg">
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl lg:text-2xl">
              <Volume2 className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 dark:text-blue-400" />
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
                Vocales (MAPA COMPLETO)
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-blue-600 dark:text-blue-400">Vocales Cortas (Lax)</h3>
              <p className="text-sm sm:text-base text-muted-foreground mb-3 sm:mb-4">
                Las vocales cortas se pronuncian de forma relajada, sin tensar los músculos de la boca.
                Son sonidos breves y naturales. La lengua está en posición relajada y la boca no se estira.
              </p>
              <div className="overflow-x-auto -mx-4 sm:mx-0">
                <div className="inline-block min-w-full align-middle px-4 sm:px-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-xs sm:text-sm">IPA</TableHead>
                        <TableHead className="text-xs sm:text-sm">Ejemplos</TableHead>
                        <TableHead className="text-xs sm:text-sm hidden sm:table-cell">Boca</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell><Badge variant="outline" className={cn("font-mono text-xs sm:text-sm lg:text-base font-bold", getIPABadgeColor("/ɪ/"))}>/ɪ/</Badge></TableCell>
                        <TableCell className="font-semibold text-xs sm:text-sm break-words">sit, ship, bit, hit, fit, win, thin, this</TableCell>
                        <TableCell className="hidden sm:table-cell">relajada</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell><Badge variant="outline" className={cn("font-mono text-xs sm:text-sm lg:text-base font-bold", getIPABadgeColor("/e/"))}>/e/</Badge></TableCell>
                        <TableCell className="font-semibold text-xs sm:text-sm break-words">bed, red, head, said, dead, bread, friend, end</TableCell>
                        <TableCell className="hidden sm:table-cell">media</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell><Badge variant="outline" className={cn("font-mono text-xs sm:text-sm lg:text-base font-bold", getIPABadgeColor("/æ/"))}>/æ/</Badge></TableCell>
                        <TableCell className="font-semibold text-xs sm:text-sm break-words">cat, hat, bat, sat, man, can, hand, stand</TableCell>
                        <TableCell className="hidden sm:table-cell">abierta</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell><Badge variant="outline" className={cn("font-mono text-xs sm:text-sm lg:text-base font-bold", getIPABadgeColor("/ʌ/"))}>/ʌ/</Badge></TableCell>
                        <TableCell className="font-semibold text-xs sm:text-sm break-words">cup, up, but, cut, sun, fun, run, love</TableCell>
                        <TableCell className="hidden sm:table-cell">central</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell><Badge variant="outline" className={cn("font-mono text-xs sm:text-sm lg:text-base font-bold", getIPABadgeColor("/ɒ/"))}>/ɒ/</Badge> <span className="text-xs">(UK)</span></TableCell>
                        <TableCell className="font-semibold text-xs sm:text-sm break-words">hot, not, lot, got, stop, box, dog, job</TableCell>
                        <TableCell className="hidden sm:table-cell">muy abierta</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-green-600 dark:text-green-400">Vocales Largas (Tense)</h3>
              <p className="text-sm sm:text-base text-muted-foreground mb-3 sm:mb-4">
                Las vocales largas requieren tensar los músculos de la boca y mantener el sonido más tiempo.
                La lengua se posiciona de forma específica y la boca se estira o redondea según el sonido.
                Se mantienen más tiempo que las cortas.
              </p>
              <div className="overflow-x-auto -mx-4 sm:mx-0">
                <div className="inline-block min-w-full align-middle px-4 sm:px-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-xs sm:text-sm">IPA</TableHead>
                        <TableHead className="text-xs sm:text-sm">Ejemplos</TableHead>
                        <TableHead className="text-xs sm:text-sm hidden sm:table-cell">Boca</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell><Badge variant="outline" className={cn("font-mono text-xs sm:text-sm lg:text-base font-bold", getIPABadgeColor("/iː/"))}>/iː/</Badge></TableCell>
                        <TableCell className="font-semibold text-xs sm:text-sm break-words">seen, sheep, meet, seat, beat, read, need, tree</TableCell>
                        <TableCell className="hidden sm:table-cell">estirada</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell><Badge variant="outline" className={cn("font-mono text-xs sm:text-sm lg:text-base font-bold", getIPABadgeColor("/ɑː/"))}>/ɑː/</Badge></TableCell>
                        <TableCell className="font-semibold text-xs sm:text-sm break-words">car, far, star, hard, card, park, dark, start</TableCell>
                        <TableCell className="hidden sm:table-cell">abierta</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell><Badge variant="outline" className={cn("font-mono text-xs sm:text-sm lg:text-base font-bold", getIPABadgeColor("/ɔː/"))}>/ɔː/</Badge></TableCell>
                        <TableCell className="font-semibold text-xs sm:text-sm break-words">law, saw, raw, draw, door, more, four, floor</TableCell>
                        <TableCell className="hidden sm:table-cell">redondeada</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell><Badge variant="outline" className={cn("font-mono text-xs sm:text-sm lg:text-base font-bold", getIPABadgeColor("/uː/"))}>/uː/</Badge></TableCell>
                        <TableCell className="font-semibold text-xs sm:text-sm break-words">food, moon, soon, room, blue, true, shoe, move</TableCell>
                        <TableCell className="hidden sm:table-cell">cerrada</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-purple-600 dark:text-purple-400">Diptongos</h3>
              <p className="text-sm sm:text-base text-muted-foreground mb-3 sm:mb-4">
                Los diptongos son combinaciones de dos vocales en una sola sílaba. La pronunciación comienza
                con un sonido y se desliza hacia otro. Es importante hacer el movimiento completo de la boca
                y la lengua durante la pronunciación.
              </p>
              <div className="overflow-x-auto -mx-4 sm:mx-0">
                <div className="inline-block min-w-full align-middle px-4 sm:px-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-xs sm:text-sm">IPA</TableHead>
                        <TableHead className="text-xs sm:text-sm hidden md:table-cell">Movimiento</TableHead>
                        <TableHead className="text-xs sm:text-sm">Ejemplos</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell><Badge variant="outline" className={cn("font-mono text-xs sm:text-sm lg:text-base font-bold", getIPABadgeColor("/eɪ/"))}>/eɪ/</Badge></TableCell>
                        <TableCell className="font-semibold text-xs sm:text-sm hidden md:table-cell">e → i</TableCell>
                        <TableCell className="font-semibold text-xs sm:text-sm break-words">wait, way, say, day, make, take, name, same</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell><Badge variant="outline" className={cn("font-mono text-xs sm:text-sm lg:text-base font-bold", getIPABadgeColor("/aɪ/"))}>/aɪ/</Badge></TableCell>
                        <TableCell className="font-semibold text-xs sm:text-sm hidden md:table-cell">a → i</TableCell>
                        <TableCell className="font-semibold text-xs sm:text-sm break-words">time, like, find, mind, light, right, night, high</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell><Badge variant="outline" className={cn("font-mono text-xs sm:text-sm lg:text-base font-bold", getIPABadgeColor("/ɔɪ/"))}>/ɔɪ/</Badge></TableCell>
                        <TableCell className="font-semibold text-xs sm:text-sm hidden md:table-cell">o → i</TableCell>
                        <TableCell className="font-semibold text-xs sm:text-sm break-words">boy, toy, joy, coin, join, point, voice, choice</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell><Badge variant="outline" className={cn("font-mono text-xs sm:text-sm lg:text-base font-bold", getIPABadgeColor("/oʊ/"))}>/oʊ/</Badge></TableCell>
                        <TableCell className="font-semibold text-xs sm:text-sm hidden md:table-cell">o → u</TableCell>
                        <TableCell className="font-semibold text-xs sm:text-sm break-words">go, no, so, show, know, low, slow, home</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell><Badge variant="outline" className={cn("font-mono text-xs sm:text-sm lg:text-base font-bold", getIPABadgeColor("/aʊ/"))}>/aʊ/</Badge></TableCell>
                        <TableCell className="font-semibold text-xs sm:text-sm hidden md:table-cell">a → u</TableCell>
                        <TableCell className="font-semibold text-xs sm:text-sm break-words">now, how, cow, down, town, found, sound, round</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-gray-600 dark:text-gray-400">Schwa <Badge variant="outline" className={cn("font-mono text-sm sm:text-base lg:text-lg font-bold ml-2", getIPABadgeColor("/ə/"))}>/ə/</Badge></h3>
              <p className="text-muted-foreground mb-3">
                El schwa es la vocal más común en inglés. Se pronuncia con la boca completamente relajada,
                la lengua en posición central y sin tensión. Es el sonido "uh" muy suave. Solo aparece en
                sílabas <strong>sin acento</strong>.
              </p>
              <div>
                <h4 className="font-semibold mb-2">Ejemplos:</h4>
                <ul className="space-y-1 list-disc list-inside">
                  <li>a<strong>bout</strong></li>
                  <li>teach<strong>er</strong></li>
                  <li>fami<strong>ly</strong></li>
                </ul>
              </div>
            </div>

          </CardContent>
        </Card>
              </section>

              {/* CONSONANTES */}
              <section
                id="consonants"
                ref={(el) => { sectionRefs.current["consonants"] = el; }}
              >
        <Card className="border-2 border-orange-200 dark:border-orange-800 bg-gradient-to-br from-orange-50/50 to-red-50/50 dark:from-orange-950/20 dark:to-red-950/20">
          <CardHeader className="bg-gradient-to-r from-orange-100/50 to-red-100/50 dark:from-orange-900/30 dark:to-red-900/30 rounded-t-lg">
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl lg:text-2xl">
              <Languages className="h-5 w-5 sm:h-6 sm:w-6 text-orange-600 dark:text-orange-400" />
              <span className="bg-gradient-to-r from-orange-600 to-red-600 dark:from-orange-400 dark:to-red-400 bg-clip-text text-transparent">
                Consonantes (CLASIFICADAS)
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-orange-600 dark:text-orange-400">Fricativas y Africadas</h3>
              <p className="text-sm sm:text-base text-muted-foreground mb-3 sm:mb-4">
                <strong>Fricativas:</strong> Se producen cuando el aire pasa por un espacio estrecho entre
                los órganos articulatorios, creando fricción (como /ʃ/ en "shop").<br />
                <strong>Africadas:</strong> Comienzan como una oclusiva (bloqueo de aire) y terminan como
                fricativa (como /tʃ/ en "chop" - primero bloqueas el aire con la lengua, luego lo sueltas
                con fricción).
              </p>
              <div className="overflow-x-auto -mx-4 sm:mx-0">
                <div className="inline-block min-w-full align-middle px-4 sm:px-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-xs sm:text-sm">IPA</TableHead>
                        <TableHead className="text-xs sm:text-sm hidden md:table-cell">Tipo</TableHead>
                        <TableHead className="text-xs sm:text-sm">Ejemplos</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell><Badge variant="outline" className={cn("font-mono text-xs sm:text-sm lg:text-base font-bold", getIPABadgeColor("/ʃ/"))}>/ʃ/</Badge></TableCell>
                        <TableCell className="font-semibold text-xs sm:text-sm hidden md:table-cell">fricativa</TableCell>
                        <TableCell className="font-semibold text-xs sm:text-sm break-words">shop, ship, she, show, wish, fish, push, cash</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell><Badge variant="outline" className={cn("font-mono text-xs sm:text-sm lg:text-base font-bold", getIPABadgeColor("/tʃ/"))}>/tʃ/</Badge></TableCell>
                        <TableCell className="font-semibold text-xs sm:text-sm hidden md:table-cell">africada</TableCell>
                        <TableCell className="font-semibold text-xs sm:text-sm break-words">chop, chat, check, chair, much, such, watch, catch</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell><Badge variant="outline" className={cn("font-mono text-xs sm:text-sm lg:text-base font-bold", getIPABadgeColor("/dʒ/"))}>/dʒ/</Badge></TableCell>
                        <TableCell className="font-semibold text-xs sm:text-sm hidden md:table-cell">africada</TableCell>
                        <TableCell className="font-semibold text-xs sm:text-sm break-words">job, jump, judge, large, age, page, change, bridge</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-red-600 dark:text-red-400">TH (dos fonemas)</h3>
              <p className="text-sm sm:text-base text-muted-foreground mb-3 sm:mb-4">
                Para pronunciar TH, coloca la punta de la lengua entre los dientes superiores e inferiores
                (o justo detrás de los dientes superiores). El aire debe pasar entre la lengua y los dientes.<br />
                <strong>/θ/</strong> (sorda): Sin vibración de cuerdas vocales, como en "think".<br />
                <strong>/ð/</strong> (sonora): Con vibración de cuerdas vocales, como en "this".
              </p>
              <div className="overflow-x-auto -mx-4 sm:mx-0">
                <div className="inline-block min-w-full align-middle px-4 sm:px-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-xs sm:text-sm">IPA</TableHead>
                        <TableHead className="text-xs sm:text-sm hidden md:table-cell">Voz</TableHead>
                        <TableHead className="text-xs sm:text-sm">Ejemplos</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell><Badge variant="outline" className={cn("font-mono text-xs sm:text-sm lg:text-base font-bold", getIPABadgeColor("/θ/"))}>/θ/</Badge></TableCell>
                        <TableCell className="font-semibold text-xs sm:text-sm hidden md:table-cell">sorda</TableCell>
                        <TableCell className="font-semibold text-xs sm:text-sm break-words">think, thing, three, through, both, path, math, health</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell><Badge variant="outline" className={cn("font-mono text-xs sm:text-sm lg:text-base font-bold", getIPABadgeColor("/ð/"))}>/ð/</Badge></TableCell>
                        <TableCell className="font-semibold text-xs sm:text-sm hidden md:table-cell">sonora</TableCell>
                        <TableCell className="font-semibold text-xs sm:text-sm break-words">this, that, the, they, there, then, other, mother</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-lg font-semibold mb-3">R inglesa /ɹ/</h3>
              <p className="text-sm sm:text-base text-muted-foreground mb-3 sm:mb-4">
                La R inglesa es diferente a la española. La lengua se curva hacia atrás sin tocar el paladar,
                creando un sonido suave. No hay vibración como en español. La punta de la lengua se eleva
                hacia el paladar pero sin contacto. En inglés británico, la R solo se pronuncia antes de vocales.
              </p>
              <ul className="space-y-1 list-disc list-inside text-muted-foreground mb-4">
                <li>Aproximante</li>
                <li>No vibra</li>
                <li>Lengua no toca</li>
              </ul>
              <div className="space-y-1">
                <p><strong>UK:</strong> <em>car</em> <Badge variant="outline" className="font-mono">/kɑː/</Badge></p>
                <p><strong>US:</strong> <em>car</em> <Badge variant="outline" className="font-mono">/kɑɹ/</Badge></p>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-lg font-semibold mb-3">Diagramas de Boca</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">NG /ŋ/ vs N /n/</h4>
                  <pre className="bg-muted p-4 rounded-lg font-mono text-sm overflow-x-auto">
                    {`/n/  → lengua adelante (seen)
/ŋ/  → lengua atrás (sing)
        ↑ sin soltar aire`}
                  </pre>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">TH /θ/ /ð/</h4>
                  <pre className="bg-muted p-4 rounded-lg font-mono text-sm overflow-x-auto">
                    {`Dientes
  ↓
  θ  ← lengua sale un poco`}
                  </pre>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
              </section>

              {/* ACENTO Y REDUCCIÓN */}
              <section
                id="stress"
                ref={(el) => { sectionRefs.current["stress"] = el; }}
              >
        <Card className="border-2 border-amber-200 dark:border-amber-800 bg-gradient-to-br from-amber-50/50 to-yellow-50/50 dark:from-amber-950/20 dark:to-yellow-950/20">
          <CardHeader className="bg-gradient-to-r from-amber-100/50 to-yellow-100/50 dark:from-amber-900/30 dark:to-yellow-900/30 rounded-t-lg">
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl lg:text-2xl">
              <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-amber-600 dark:text-amber-400" />
              <span className="bg-gradient-to-r from-amber-600 to-yellow-600 dark:from-amber-400 dark:to-yellow-400 bg-clip-text text-transparent">
                Acento y Reducción
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-amber-600 dark:text-amber-400">Cambio de acento = cambio de vocal</h3>
              <p className="text-sm sm:text-base text-muted-foreground mb-3 sm:mb-4">
                Cuando cambia el acento en una palabra, las vocales también cambian. Las sílabas acentuadas
                mantienen su sonido completo, mientras que las sílabas sin acento se reducen al schwa /ə/.
                Esto es fundamental para la pronunciación natural del inglés.
              </p>
              <div className="space-y-2">
                <p className="text-sm sm:text-base lg:text-lg"><strong className="text-amber-600 dark:text-amber-400">PHO</strong>tograph <Badge variant="outline" className={cn("font-mono text-xs sm:text-sm lg:text-base font-bold ml-2", getIPABadgeColor("/ə/"))}>/ˈfoʊtəgræf/</Badge></p>
                <p className="text-sm sm:text-base lg:text-lg">pho<strong className="text-amber-600 dark:text-amber-400">TO</strong>graphy <Badge variant="outline" className={cn("font-mono text-xs sm:text-sm lg:text-base font-bold ml-2", getIPABadgeColor("/ə/"))}>/fəˈtɑːgrəfi/</Badge></p>
              </div>
              <p className="text-muted-foreground mt-3 text-sm sm:text-base font-semibold">Las sílabas débiles → <Badge variant="outline" className={cn("font-mono text-xs sm:text-sm lg:text-base font-bold ml-2", getIPABadgeColor("/ə/"))}>/ə/</Badge></p>
            </div>

            <Separator />

            <div>
              <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-amber-600 dark:text-amber-400">Palabras funcionales reducidas</h3>
              <p className="text-sm sm:text-base text-muted-foreground mb-3 sm:mb-4">
                En el habla natural, las palabras funcionales (artículos, preposiciones, conjunciones) se
                pronuncian de forma reducida y rápida. No reciben acento y sus vocales se convierten en
                schwa /ə/ o se eliminan completamente.
              </p>
              <div className="overflow-x-auto -mx-4 sm:mx-0">
                <div className="inline-block min-w-full align-middle px-4 sm:px-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-xs sm:text-sm">Escritura</TableHead>
                        <TableHead className="text-xs sm:text-sm">Habla real</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-semibold text-sm sm:text-base lg:text-lg">to</TableCell>
                        <TableCell><Badge variant="outline" className={cn("font-mono text-xs sm:text-sm lg:text-base font-bold", getIPABadgeColor("/ə/"))}>/tə/</Badge></TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-semibold text-sm sm:text-base lg:text-lg">of</TableCell>
                        <TableCell><Badge variant="outline" className={cn("font-mono text-xs sm:text-sm lg:text-base font-bold", getIPABadgeColor("/ə/"))}>/əv/</Badge></TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-semibold text-sm sm:text-base lg:text-lg">and</TableCell>
                        <TableCell><Badge variant="outline" className={cn("font-mono text-xs sm:text-sm lg:text-base font-bold", getIPABadgeColor("/ə/"))}>/ən/</Badge></TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
              </section>

              {/* ORTOGRAFÍA */}
              <section
                id="orthography"
                ref={(el) => { sectionRefs.current["orthography"] = el; }}
              >
        <Card className="border-2 border-teal-200 dark:border-teal-800 bg-gradient-to-br from-teal-50/50 to-cyan-50/50 dark:from-teal-950/20 dark:to-cyan-950/20">
          <CardHeader className="bg-gradient-to-r from-teal-100/50 to-cyan-100/50 dark:from-teal-900/30 dark:to-cyan-900/30 rounded-t-lg">
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl lg:text-2xl">
              <BookOpen className="h-5 w-5 sm:h-6 sm:w-6 text-teal-600 dark:text-teal-400" />
              <span className="bg-gradient-to-r from-teal-600 to-cyan-600 dark:from-teal-400 dark:to-cyan-400 bg-clip-text text-transparent">
                Ortografía → Sonido
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-teal-600 dark:text-teal-400">E muda (V + C + e)</h3>
              <p className="text-sm sm:text-base text-muted-foreground mb-3 sm:mb-4">
                Cuando una palabra termina en "vocal + consonante + e", la "e" final es muda (no se pronuncia)
                pero hace que la vocal anterior sea larga. Ejemplo: "kit" (corta) vs "kite" (larga - la "e"
                no se pronuncia pero alarga la "i").
              </p>
              <div className="overflow-x-auto -mx-4 sm:mx-0">
                <div className="inline-block min-w-full align-middle px-4 sm:px-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-xs sm:text-sm">Corta</TableHead>
                        <TableHead className="text-xs sm:text-sm">Larga</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="text-xs sm:text-sm break-words">kit, bit, sit, hit, fit</TableCell>
                        <TableCell className="text-xs sm:text-sm break-words">kite, bite, site, white, write</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="text-xs sm:text-sm break-words">hop, not, lot, got, dot</TableCell>
                        <TableCell className="text-xs sm:text-sm break-words">hope, note, vote, rope, cope</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="text-xs sm:text-sm break-words">cut, but, nut, hut, shut</TableCell>
                        <TableCell className="text-xs sm:text-sm break-words">cute, mute, flute, route, suit</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="text-xs sm:text-sm break-words">plan, can, man, pan, ran</TableCell>
                        <TableCell className="text-xs sm:text-sm break-words">plane, cane, mane, pane, rain</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-teal-600 dark:text-teal-400">Doble consonante</h3>
              <p className="text-sm sm:text-base text-muted-foreground mb-3 sm:mb-4">
                Las consonantes dobles en inglés no se pronuncian dos veces. Su función es indicar que la
                vocal anterior es corta. La doble consonante "bloquea" la vocal larga. Ejemplos:
                <strong>sitting</strong> (la "i" es corta), <strong>better</strong> (la "e" es corta).
              </p>
              <div className="space-y-2">
                <p className="text-sm font-semibold">Ejemplos:</p>
                <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                  <li><strong>sitting</strong> (vs. siting), <strong>better</strong> (vs. beter)</li>
                  <li><strong>running</strong>, <strong>stopping</strong>, <strong>getting</strong>, <strong>putting</strong></li>
                  <li><strong>happy</strong>, <strong>summer</strong>, <strong>letter</strong>, <strong>matter</strong></li>
                </ul>
                <p className="text-sm mt-2">Bloquea vocal larga, <strong>no</strong> duplica sonido.</p>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-teal-600 dark:text-teal-400">Dos vocales juntas</h3>
              <p className="text-sm sm:text-base text-muted-foreground mb-3 sm:mb-4">
                Cuando dos vocales aparecen juntas, generalmente forman un diptongo o una vocal larga.
                La primera vocal suele ser la que se pronuncia más fuerte, y la segunda indica el sonido
                resultante. No se pronuncian ambas vocales por separado.
              </p>
              <div className="space-y-3">
                <div>
                  <p className="font-semibold mb-1 text-sm sm:text-base"><strong>ea</strong> → <Badge variant="outline" className={cn("font-mono text-xs sm:text-sm lg:text-base font-bold ml-2", getIPABadgeColor("/iː/"))}>/iː/</Badge></p>
                  <p className="text-xs sm:text-sm text-muted-foreground break-words">sea, tea, read, eat, meat, beat, heat, seat</p>
                </div>
                <div>
                  <p className="font-semibold mb-1 text-sm sm:text-base"><strong>ai</strong> → <Badge variant="outline" className={cn("font-mono text-xs sm:text-sm lg:text-base font-bold ml-2", getIPABadgeColor("/eɪ/"))}>/eɪ/</Badge></p>
                  <p className="text-xs sm:text-sm text-muted-foreground break-words">wait, rain, train, pain, main, gain, chain, plain</p>
                </div>
                <div>
                  <p className="font-semibold mb-1 text-sm sm:text-base"><strong>oa</strong> → <Badge variant="outline" className={cn("font-mono text-xs sm:text-sm lg:text-base font-bold ml-2", getIPABadgeColor("/oʊ/"))}>/oʊ/</Badge></p>
                  <p className="text-xs sm:text-sm text-muted-foreground break-words">boat, coat, road, load, soap, goal, coal, float</p>
                </div>
                <div>
                  <p className="font-semibold mb-1 text-sm sm:text-base"><strong>ee</strong> → <Badge variant="outline" className={cn("font-mono text-xs sm:text-sm lg:text-base font-bold ml-2", getIPABadgeColor("/iː/"))}>/iː/</Badge></p>
                  <p className="text-xs sm:text-sm text-muted-foreground break-words">see, tree, free, meet, keep, sleep, deep, green</p>
                </div>
                <div>
                  <p className="font-semibold mb-1 text-sm sm:text-base"><strong>oo</strong> → <Badge variant="outline" className={cn("font-mono text-xs sm:text-sm lg:text-base font-bold ml-2", getIPABadgeColor("/uː/"))}>/uː/</Badge></p>
                  <p className="text-xs sm:text-sm text-muted-foreground break-words">moon, soon, food, cool, tool, pool, school, room</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
              </section>

              {/* PRÁCTICA */}
              <section
                id="practice"
                ref={(el) => { sectionRefs.current["practice"] = el; }}
              >
        <Card className="border-2 border-violet-200 dark:border-violet-800 bg-gradient-to-br from-violet-50/50 to-purple-50/50 dark:from-violet-950/20 dark:to-purple-950/20">
          <CardHeader className="bg-gradient-to-r from-violet-100/50 to-purple-100/50 dark:from-violet-900/30 dark:to-purple-900/30 rounded-t-lg">
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl lg:text-2xl">
              <GraduationCap className="h-5 w-5 sm:h-6 sm:w-6 text-violet-600 dark:text-violet-400" />
              <span className="bg-gradient-to-r from-violet-600 to-purple-600 dark:from-violet-400 dark:to-purple-400 bg-clip-text text-transparent">
                Práctica y Variación
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-violet-600 dark:text-violet-400">Pares Mínimos (Entrenamiento)</h3>
              <p className="text-sm sm:text-base text-muted-foreground mb-3 sm:mb-4">
                Los pares mínimos son palabras que solo difieren en un sonido. Practicar con ellos ayuda
                a entrenar el oído y la pronunciación para distinguir sonidos similares. Pronuncia cada
                par enfocándote en la diferencia del sonido que cambia.
              </p>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Vocales</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span>ship</span>
                      <Badge variant="outline" className={cn("font-mono text-xs sm:text-sm lg:text-base font-bold", getIPABadgeColor("/ɪ/"))}>/ɪ/</Badge>
                      <span className="text-muted-foreground">–</span>
                      <span>sheep</span>
                      <Badge variant="outline" className={cn("font-mono text-xs sm:text-sm lg:text-base font-bold", getIPABadgeColor("/iː/"))}>/iː/</Badge>
                      <span className="text-muted-foreground">|</span>
                      <span>bit</span>
                      <Badge variant="outline" className={cn("font-mono text-xs sm:text-sm lg:text-base font-bold", getIPABadgeColor("/ɪ/"))}>/ɪ/</Badge>
                      <span className="text-muted-foreground">–</span>
                      <span>beat</span>
                      <Badge variant="outline" className={cn("font-mono text-xs sm:text-sm lg:text-base font-bold", getIPABadgeColor("/iː/"))}>/iː/</Badge>
                    </div>
                    <div className="flex items-center gap-3 flex-wrap">
                      <span>full</span>
                      <Badge variant="outline" className={cn("font-mono text-xs sm:text-sm lg:text-base font-bold", getIPABadgeColor("/ʊ/"))}>/ʊ/</Badge>
                      <span className="text-muted-foreground">–</span>
                      <span>fool</span>
                      <Badge variant="outline" className={cn("font-mono text-xs sm:text-sm lg:text-base font-bold", getIPABadgeColor("/uː/"))}>/uː/</Badge>
                      <span className="text-muted-foreground">|</span>
                      <span>pull</span>
                      <Badge variant="outline" className={cn("font-mono text-xs sm:text-sm lg:text-base font-bold", getIPABadgeColor("/ʊ/"))}>/ʊ/</Badge>
                      <span className="text-muted-foreground">–</span>
                      <span>pool</span>
                      <Badge variant="outline" className={cn("font-mono text-xs sm:text-sm lg:text-base font-bold", getIPABadgeColor("/uː/"))}>/uː/</Badge>
                    </div>
                    <div className="flex items-center gap-3 flex-wrap">
                      <span>cat</span>
                      <Badge variant="outline" className={cn("font-mono text-xs sm:text-sm lg:text-base font-bold", getIPABadgeColor("/æ/"))}>/æ/</Badge>
                      <span className="text-muted-foreground">–</span>
                      <span>cut</span>
                      <Badge variant="outline" className={cn("font-mono text-xs sm:text-sm lg:text-base font-bold", getIPABadgeColor("/ʌ/"))}>/ʌ/</Badge>
                      <span className="text-muted-foreground">|</span>
                      <span>hat</span>
                      <Badge variant="outline" className={cn("font-mono text-xs sm:text-sm lg:text-base font-bold", getIPABadgeColor("/æ/"))}>/æ/</Badge>
                      <span className="text-muted-foreground">–</span>
                      <span>hut</span>
                      <Badge variant="outline" className={cn("font-mono text-xs sm:text-sm lg:text-base font-bold", getIPABadgeColor("/ʌ/"))}>/ʌ/</Badge>
                    </div>
                    <div className="flex items-center gap-3 flex-wrap">
                      <span>bed</span>
                      <Badge variant="outline" className={cn("font-mono text-xs sm:text-sm lg:text-base font-bold", getIPABadgeColor("/e/"))}>/e/</Badge>
                      <span className="text-muted-foreground">–</span>
                      <span>bad</span>
                      <Badge variant="outline" className={cn("font-mono text-xs sm:text-sm lg:text-base font-bold", getIPABadgeColor("/æ/"))}>/æ/</Badge>
                      <span className="text-muted-foreground">|</span>
                      <span>pen</span>
                      <Badge variant="outline" className={cn("font-mono text-xs sm:text-sm lg:text-base font-bold", getIPABadgeColor("/e/"))}>/e/</Badge>
                      <span className="text-muted-foreground">–</span>
                      <span>pan</span>
                      <Badge variant="outline" className={cn("font-mono text-xs sm:text-sm lg:text-base font-bold", getIPABadgeColor("/æ/"))}>/æ/</Badge>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-semibold mb-2">Consonantes</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span>shop</span>
                      <Badge variant="outline" className={cn("font-mono text-xs sm:text-sm lg:text-base font-bold", getIPABadgeColor("/ʃ/"))}>/ʃ/</Badge>
                      <span className="text-muted-foreground">–</span>
                      <span>chop</span>
                      <Badge variant="outline" className={cn("font-mono text-xs sm:text-sm lg:text-base font-bold", getIPABadgeColor("/tʃ/"))}>/tʃ/</Badge>
                      <span className="text-muted-foreground">|</span>
                      <span>wish</span>
                      <Badge variant="outline" className={cn("font-mono text-xs sm:text-sm lg:text-base font-bold", getIPABadgeColor("/ʃ/"))}>/ʃ/</Badge>
                      <span className="text-muted-foreground">–</span>
                      <span>which</span>
                      <Badge variant="outline" className={cn("font-mono text-xs sm:text-sm lg:text-base font-bold", getIPABadgeColor("/tʃ/"))}>/tʃ/</Badge>
                    </div>
                    <div className="flex items-center gap-3 flex-wrap">
                      <span>thin</span>
                      <Badge variant="outline" className={cn("font-mono text-xs sm:text-sm lg:text-base font-bold", getIPABadgeColor("/θ/"))}>/θ/</Badge>
                      <span className="text-muted-foreground">–</span>
                      <span>tin</span>
                      <Badge variant="outline" className={cn("font-mono text-xs sm:text-sm lg:text-base font-bold", "bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-600")}>/t/</Badge>
                      <span className="text-muted-foreground">|</span>
                      <span>think</span>
                      <Badge variant="outline" className={cn("font-mono text-xs sm:text-sm lg:text-base font-bold", getIPABadgeColor("/θ/"))}>/θ/</Badge>
                      <span className="text-muted-foreground">–</span>
                      <span>tink</span>
                      <Badge variant="outline" className={cn("font-mono text-xs sm:text-sm lg:text-base font-bold", "bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-600")}>/t/</Badge>
                    </div>
                    <div className="flex items-center gap-3 flex-wrap">
                      <span>seen</span>
                      <Badge variant="outline" className={cn("font-mono text-xs sm:text-sm lg:text-base font-bold", getIPABadgeColor("/n/"))}>/n/</Badge>
                      <span className="text-muted-foreground">–</span>
                      <span>sing</span>
                      <Badge variant="outline" className={cn("font-mono text-xs sm:text-sm lg:text-base font-bold", getIPABadgeColor("/ŋ/"))}>/ŋ/</Badge>
                      <span className="text-muted-foreground">|</span>
                      <span>sin</span>
                      <Badge variant="outline" className={cn("font-mono text-xs sm:text-sm lg:text-base font-bold", getIPABadgeColor("/n/"))}>/n/</Badge>
                      <span className="text-muted-foreground">–</span>
                      <span>sing</span>
                      <Badge variant="outline" className={cn("font-mono text-xs sm:text-sm lg:text-base font-bold", getIPABadgeColor("/ŋ/"))}>/ŋ/</Badge>
                    </div>
                    <div className="flex items-center gap-3 flex-wrap">
                      <span>this</span>
                      <Badge variant="outline" className={cn("font-mono text-xs sm:text-sm lg:text-base font-bold", getIPABadgeColor("/ð/"))}>/ð/</Badge>
                      <span className="text-muted-foreground">–</span>
                      <span>dis</span>
                      <Badge variant="outline" className={cn("font-mono text-xs sm:text-sm lg:text-base font-bold", "bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-600")}>/d/</Badge>
                      <span className="text-muted-foreground">|</span>
                      <span>they</span>
                      <Badge variant="outline" className={cn("font-mono text-xs sm:text-sm lg:text-base font-bold", getIPABadgeColor("/ð/"))}>/ð/</Badge>
                      <span className="text-muted-foreground">–</span>
                      <span>day</span>
                      <Badge variant="outline" className={cn("font-mono text-xs sm:text-sm lg:text-base font-bold", "bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-600")}>/d/</Badge>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-semibold mb-2">Diptongos</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span>late</span>
                      <Badge variant="outline" className={cn("font-mono text-xs sm:text-sm lg:text-base font-bold", getIPABadgeColor("/eɪ/"))}>/eɪ/</Badge>
                      <span className="text-muted-foreground">–</span>
                      <span>light</span>
                      <Badge variant="outline" className={cn("font-mono text-xs sm:text-sm lg:text-base font-bold", getIPABadgeColor("/aɪ/"))}>/aɪ/</Badge>
                      <span className="text-muted-foreground">|</span>
                      <span>wait</span>
                      <Badge variant="outline" className={cn("font-mono text-xs sm:text-sm lg:text-base font-bold", getIPABadgeColor("/eɪ/"))}>/eɪ/</Badge>
                      <span className="text-muted-foreground">–</span>
                      <span>white</span>
                      <Badge variant="outline" className={cn("font-mono text-xs sm:text-sm lg:text-base font-bold", getIPABadgeColor("/aɪ/"))}>/aɪ/</Badge>
                    </div>
                    <div className="flex items-center gap-3 flex-wrap">
                      <span>coat</span>
                      <Badge variant="outline" className={cn("font-mono text-xs sm:text-sm lg:text-base font-bold", getIPABadgeColor("/oʊ/"))}>/oʊ/</Badge>
                      <span className="text-muted-foreground">–</span>
                      <span>cow</span>
                      <Badge variant="outline" className={cn("font-mono text-xs sm:text-sm lg:text-base font-bold", getIPABadgeColor("/aʊ/"))}>/aʊ/</Badge>
                      <span className="text-muted-foreground">|</span>
                      <span>go</span>
                      <Badge variant="outline" className={cn("font-mono text-xs sm:text-sm lg:text-base font-bold", getIPABadgeColor("/oʊ/"))}>/oʊ/</Badge>
                      <span className="text-muted-foreground">–</span>
                      <span>how</span>
                      <Badge variant="outline" className={cn("font-mono text-xs sm:text-sm lg:text-base font-bold", getIPABadgeColor("/aʊ/"))}>/aʊ/</Badge>
                    </div>
                    <div className="flex items-center gap-3 flex-wrap">
                      <span>boy</span>
                      <Badge variant="outline" className="font-mono">/ɔɪ/</Badge>
                      <span className="text-muted-foreground">–</span>
                      <span>buy</span>
                      <Badge variant="outline" className={cn("font-mono text-xs sm:text-sm lg:text-base font-bold", getIPABadgeColor("/aɪ/"))}>/aɪ/</Badge>
                      <span className="text-muted-foreground">|</span>
                      <span>toy</span>
                      <Badge variant="outline" className="font-mono">/ɔɪ/</Badge>
                      <span className="text-muted-foreground">–</span>
                      <span>tie</span>
                      <Badge variant="outline" className={cn("font-mono text-xs sm:text-sm lg:text-base font-bold", getIPABadgeColor("/aɪ/"))}>/aɪ/</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-violet-600 dark:text-violet-400">Variación y Homófonos</h3>
              <p className="text-sm sm:text-base text-muted-foreground mb-3 sm:mb-4">
                <strong>Homófonos:</strong> Palabras que suenan igual pero se escriben diferente. Se pronuncian
                exactamente igual, así que el contexto es clave para entenderlas.<br />
                <strong>Variación UK vs US:</strong> El inglés británico y americano tienen diferencias en
                la pronunciación de ciertos sonidos. Ambas son correctas, pero es importante ser consistente
                con el dialecto que estés aprendiendo.
              </p>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Homófonos</h4>
                  <div className="space-y-1">
                    <p>wait / weigh / way</p>
                    <p>see / sea</p>
                    <p>two / too / to</p>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-semibold mb-2 text-sm sm:text-base">UK vs US</h4>
                  <div className="overflow-x-auto -mx-4 sm:mx-0">
                    <div className="inline-block min-w-full align-middle px-4 sm:px-0">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="text-xs sm:text-sm">Palabra</TableHead>
                            <TableHead className="text-xs sm:text-sm">UK</TableHead>
                            <TableHead className="text-xs sm:text-sm">US</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow>
                            <TableCell className="text-xs sm:text-sm font-semibold">hot</TableCell>
                            <TableCell><Badge variant="outline" className={cn("font-mono text-xs sm:text-sm lg:text-base font-bold", getIPABadgeColor("/ɒ/"))}>/ɒ/</Badge></TableCell>
                            <TableCell><Badge variant="outline" className={cn("font-mono text-xs sm:text-sm lg:text-base font-bold", "bg-blue-100 text-blue-700 border-blue-300 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700")}>/ɑ/</Badge></TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="text-xs sm:text-sm font-semibold">better</TableCell>
                            <TableCell><Badge variant="outline" className={cn("font-mono text-xs sm:text-sm lg:text-base font-bold", getIPABadgeColor("/ə/"))}>/ˈbetə/</Badge></TableCell>
                            <TableCell><Badge variant="outline" className={cn("font-mono text-xs sm:text-sm lg:text-base font-bold", getIPABadgeColor("/ə/"))}>/ˈbedɚ/</Badge></TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
              </section>
            </div>
          </ScrollArea>
        </Card>
      </div>

      {/* Botón flotante para secciones - solo en mobile/tablet */}
      <Button
        variant="default"
        size="icon"
        className="fixed bottom-6 right-6 z-40 h-14 w-14 rounded-full shadow-lg lg:hidden"
        onClick={() => setSectionsModalOpen(true)}
        aria-label="Abrir secciones"
      >
        <Menu className="h-6 w-6" />
      </Button>

      {/* Modal de secciones - mobile/tablet */}
      <ModalNova
        open={sectionsModalOpen}
        onOpenChange={setSectionsModalOpen}
        title="Secciones"
        description="Elige una sección para navegar"
        size="sm"
        height="h-auto max-h-[70dvh]"
      >
        <nav className="p-4 space-y-0.5">
          {PRONUNCIATION_SECTIONS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => scrollToSection(id)}
              className="flex w-full items-center gap-2 px-3 py-2.5 text-sm font-medium hover:bg-muted rounded-md transition-colors text-left"
            >
              <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
              <span>{label}</span>
            </button>
          ))}
        </nav>
      </ModalNova>
    </div>
  );
}
