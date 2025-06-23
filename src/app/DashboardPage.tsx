import * as React from "react";
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationPrevious, PaginationNext, PaginationEllipsis } from "@/components/ui/pagination";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter, SheetClose } from "@/components/ui/sheet";
import { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator } from "@/components/ui/input-otp";
import { Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter, DrawerClose } from "@/components/ui/drawer";
import { Calendar } from "@/components/ui/calendar";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator, BreadcrumbEllipsis } from "@/components/ui/breadcrumb";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export default function DashboardPage() {
  return (
    <div className="space-y-10 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-neon">Dashboard</h1>
        <p className="text-muted-foreground">Bienvenido a tu panel de control</p>
      </div>

      {/* 1. AlertDialog - Múltiples variantes */}
      <section>
        <h2 className="text-xl font-semibold mb-4">AlertDialog - Todas las variantes</h2>
        <div className="flex flex-wrap gap-4">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="default">Diálogo básico</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                <AlertDialogDescription>Esta acción no se puede deshacer.</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction>Aceptar</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">Eliminar</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Eliminar elemento</AlertDialogTitle>
                <AlertDialogDescription>¿Realmente quieres eliminar este elemento? Esta acción es irreversible.</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Eliminar</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline">Confirmar acción</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirmar cambios</AlertDialogTitle>
                <AlertDialogDescription>Los cambios se guardarán permanentemente.</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction>Guardar</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </section>

      {/* 2. Pagination - Múltiples variantes */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Pagination - Todas las variantes</h2>
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium mb-2">Paginación básica</h3>
            <Pagination>
              <PaginationContent>
                <PaginationItem><PaginationPrevious /></PaginationItem>
                <PaginationItem><PaginationLink isActive>1</PaginationLink></PaginationItem>
                <PaginationItem><PaginationLink>2</PaginationLink></PaginationItem>
                <PaginationItem><PaginationLink>3</PaginationLink></PaginationItem>
                <PaginationItem><PaginationNext /></PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-2">Paginación con elipsis</h3>
            <Pagination>
              <PaginationContent>
                <PaginationItem><PaginationPrevious /></PaginationItem>
                <PaginationItem><PaginationLink isActive>1</PaginationLink></PaginationItem>
                <PaginationItem><PaginationLink>2</PaginationLink></PaginationItem>
                <PaginationItem><PaginationEllipsis /></PaginationItem>
                <PaginationItem><PaginationLink>9</PaginationLink></PaginationItem>
                <PaginationItem><PaginationLink>10</PaginationLink></PaginationItem>
                <PaginationItem><PaginationNext /></PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-2">Paginación compacta</h3>
            <Pagination>
              <PaginationContent>
                <PaginationItem><PaginationPrevious /></PaginationItem>
                <PaginationItem><PaginationLink>1</PaginationLink></PaginationItem>
                <PaginationItem><PaginationLink isActive>2</PaginationLink></PaginationItem>
                <PaginationItem><PaginationLink>3</PaginationLink></PaginationItem>
                <PaginationItem><PaginationNext /></PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      </section>

      {/* 3. Card - Múltiples variantes */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Card - Todas las variantes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Card básica</CardTitle>
              <CardDescription>Descripción de la tarjeta</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Contenido principal de la tarjeta.</p>
            </CardContent>
            <CardFooter>
              <span>Pie de tarjeta</span>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Card con badge</CardTitle>
              <CardDescription>Tarjeta con elementos adicionales</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="default">Nuevo</Badge>
                <Badge variant="secondary">Destacado</Badge>
              </div>
              <p>Contenido con badges y elementos interactivos.</p>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" size="sm">Cancelar</Button>
              <Button size="sm">Aceptar</Button>
            </CardFooter>
          </Card>

          <Card className="border-dashed">
            <CardHeader>
              <CardTitle>Card con borde punteado</CardTitle>
              <CardDescription>Estilo alternativo</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Tarjeta con borde punteado para destacar.</p>
            </CardContent>
          </Card>

          <Card className="bg-muted/50">
            <CardHeader>
              <CardTitle>Card con fondo</CardTitle>
              <CardDescription>Fondo alternativo</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Tarjeta con fondo personalizado.</p>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Card con sombra</CardTitle>
              <CardDescription>Sombra pronunciada</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Tarjeta con sombra más pronunciada.</p>
            </CardContent>
          </Card>

          <Card className="border-primary">
            <CardHeader>
              <CardTitle>Card destacada</CardTitle>
              <CardDescription>Borde de color primario</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Tarjeta con borde de color primario.</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* 4. Slider - Múltiples variantes */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Slider - Todas las variantes</h2>
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-medium mb-2">Slider básico</h3>
            <div className="w-64">
              <Slider defaultValue={[50]} max={100} step={1} />
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-2">Slider con rango</h3>
            <div className="w-64">
              <Slider defaultValue={[25, 75]} max={100} step={1} />
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-2">Slider con pasos</h3>
            <div className="w-64">
              <Slider defaultValue={[2]} max={5} step={1} />
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-2">Slider deshabilitado</h3>
            <div className="w-64">
              <Slider defaultValue={[50]} max={100} step={1} disabled />
            </div>
          </div>
        </div>
      </section>

      {/* 5. Tabs - Múltiples variantes */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Tabs - Todas las variantes</h2>
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-medium mb-2">Tabs horizontales</h3>
            <Tabs defaultValue="tab1" className="w-[400px]">
              <TabsList>
                <TabsTrigger value="tab1">Tab 1</TabsTrigger>
                <TabsTrigger value="tab2">Tab 2</TabsTrigger>
                <TabsTrigger value="tab3">Tab 3</TabsTrigger>
              </TabsList>
              <TabsContent value="tab1">Contenido de la pestaña 1</TabsContent>
              <TabsContent value="tab2">Contenido de la pestaña 2</TabsContent>
              <TabsContent value="tab3">Contenido de la pestaña 3</TabsContent>
            </Tabs>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-2">Tabs con contenido complejo</h3>
            <Tabs defaultValue="account" className="w-[400px]">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="account">Cuenta</TabsTrigger>
                <TabsTrigger value="password">Contraseña</TabsTrigger>
              </TabsList>
              <TabsContent value="account" className="space-y-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre</Label>
                  <input id="name" className="w-full p-2 border rounded" placeholder="Tu nombre" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <input id="email" className="w-full p-2 border rounded" placeholder="tu@email.com" />
                </div>
              </TabsContent>
              <TabsContent value="password" className="space-y-2">
                <div className="space-y-2">
                  <Label htmlFor="current">Contraseña actual</Label>
                  <input id="current" type="password" className="w-full p-2 border rounded" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new">Nueva contraseña</Label>
                  <input id="new" type="password" className="w-full p-2 border rounded" />
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>

      {/* 6. Popover - Múltiples variantes */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Popover - Todas las variantes</h2>
        <div className="flex flex-wrap gap-4">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">Popover básico</Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium leading-none">Información</h4>
                  <p className="text-sm text-muted-foreground">Este es un popover básico con información.</p>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="secondary">Popover con contenido</Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium leading-none">Configuración</h4>
                  <p className="text-sm text-muted-foreground">Ajusta las configuraciones aquí.</p>
                </div>
                <div className="grid gap-2">
                  <div className="grid grid-cols-3 items-center gap-4">
                    <Label htmlFor="width">Ancho</Label>
                    <input id="width" defaultValue="100%" className="col-span-2 h-8" />
                  </div>
                  <div className="grid grid-cols-3 items-center gap-4">
                    <Label htmlFor="maxWidth">Máx. ancho</Label>
                    <input id="maxWidth" defaultValue="300px" className="col-span-2 h-8" />
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost">Popover con acciones</Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium leading-none">Acciones</h4>
                  <p className="text-sm text-muted-foreground">Selecciona una acción.</p>
                </div>
                <div className="grid gap-2">
                  <Button variant="outline" size="sm">Editar</Button>
                  <Button variant="outline" size="sm">Duplicar</Button>
                  <Button variant="destructive" size="sm">Eliminar</Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </section>

      {/* 7. HoverCard - Múltiples variantes */}
      <section>
        <h2 className="text-xl font-semibold mb-4">HoverCard - Todas las variantes</h2>
        <div className="flex flex-wrap gap-4">
          <HoverCard>
            <HoverCardTrigger asChild>
              <Button variant="link">HoverCard básico</Button>
            </HoverCardTrigger>
            <HoverCardContent className="w-80">
              <div className="flex justify-between space-x-4">
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold">Información</h4>
                  <p className="text-sm">Este es un HoverCard básico que aparece al pasar el mouse.</p>
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>

          <HoverCard>
            <HoverCardTrigger asChild>
              <Button variant="outline">HoverCard con avatar</Button>
            </HoverCardTrigger>
            <HoverCardContent className="w-80">
              <div className="flex justify-between space-x-4">
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                  <span className="text-sm font-medium">JD</span>
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold">John Doe</h4>
                  <p className="text-sm">Desarrollador Frontend</p>
                  <div className="flex items-center pt-2">
                    <span className="text-xs text-muted-foreground">Última actividad: hace 2 horas</span>
                  </div>
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>

          <HoverCard>
            <HoverCardTrigger asChild>
              <span className="underline cursor-pointer">HoverCard con enlace</span>
            </HoverCardTrigger>
            <HoverCardContent className="w-80">
              <div className="space-y-1">
                <h4 className="text-sm font-semibold">Enlace externo</h4>
                <p className="text-sm">Este enlace te llevará a más información sobre el tema.</p>
                <p className="text-xs text-muted-foreground">Haz clic para visitar</p>
              </div>
            </HoverCardContent>
          </HoverCard>
        </div>
      </section>

      {/* 8. Resizable - Múltiples variantes */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Resizable - Todas las variantes</h2>
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-medium mb-2">Resizable horizontal</h3>
            <div className="h-32 w-full max-w-xl border rounded">
              <ResizablePanelGroup direction="horizontal">
                <ResizablePanel defaultSize={50} className="bg-muted flex items-center justify-center">Panel 1</ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel defaultSize={50} className="bg-muted flex items-center justify-center">Panel 2</ResizablePanel>
              </ResizablePanelGroup>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-2">Resizable vertical</h3>
            <div className="h-64 w-full max-w-xl border rounded">
              <ResizablePanelGroup direction="vertical">
                <ResizablePanel defaultSize={50} className="bg-muted flex items-center justify-center">Panel superior</ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel defaultSize={50} className="bg-muted flex items-center justify-center">Panel inferior</ResizablePanel>
              </ResizablePanelGroup>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-2">Resizable con 3 paneles</h3>
            <div className="h-32 w-full max-w-xl border rounded">
              <ResizablePanelGroup direction="horizontal">
                <ResizablePanel defaultSize={33} className="bg-muted flex items-center justify-center">Panel 1</ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel defaultSize={33} className="bg-muted flex items-center justify-center">Panel 2</ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel defaultSize={34} className="bg-muted flex items-center justify-center">Panel 3</ResizablePanel>
              </ResizablePanelGroup>
            </div>
          </div>
        </div>
      </section>

      {/* 9. ScrollArea - Múltiples variantes */}
      <section>
        <h2 className="text-xl font-semibold mb-4">ScrollArea - Todas las variantes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium mb-2">ScrollArea vertical</h3>
            <div className="h-32 w-64">
              <ScrollArea className="h-full w-full rounded border">
                <div className="h-64 p-4 space-y-2">
                  {Array.from({ length: 20 }, (_, i) => (
                    <div key={i} className="p-2 bg-muted rounded">Elemento {i + 1}</div>
                  ))}
                </div>
                <ScrollBar orientation="vertical" />
              </ScrollArea>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-2">ScrollArea horizontal</h3>
            <div className="h-32 w-64">
              <ScrollArea className="h-full w-full rounded border">
                <div className="flex space-x-2 p-4" style={{ width: 'max-content' }}>
                  {Array.from({ length: 20 }, (_, i) => (
                    <div key={i} className="p-2 bg-muted rounded whitespace-nowrap">Item {i + 1}</div>
                  ))}
                </div>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-2">ScrollArea con contenido mixto</h3>
            <div className="h-32 w-64">
              <ScrollArea className="h-full w-full rounded border">
                <div className="p-4 space-y-2">
                  <h4 className="font-medium">Lista de elementos</h4>
                  {Array.from({ length: 15 }, (_, i) => (
                    <div key={i} className="flex items-center space-x-2 p-2 bg-muted rounded">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span>Elemento {i + 1}</span>
                    </div>
                  ))}
                </div>
                <ScrollBar />
              </ScrollArea>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-2">ScrollArea con scrollbars personalizados</h3>
            <div className="h-32 w-64">
              <ScrollArea className="h-full w-full rounded border">
                <div className="h-64 p-4">
                  <p>Contenido largo que requiere scroll...</p>
                  {Array.from({ length: 10 }, (_, i) => (
                    <p key={i} className="mt-2">Párrafo {i + 1} con contenido extenso para demostrar el scroll.</p>
                  ))}
                </div>
                <ScrollBar className="bg-muted" />
              </ScrollArea>
            </div>
          </div>
        </div>
      </section>

      {/* 10. Label - Múltiples variantes */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Label - Todas las variantes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <input id="email" type="email" placeholder="tu@email.com" className="w-full p-2 border rounded" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <input id="password" type="password" className="w-full p-2 border rounded" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descripción</Label>
              <textarea id="description" className="w-full p-2 border rounded" rows={3} placeholder="Escribe una descripción..."></textarea>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="checkbox">Acepto los términos</Label>
              <div className="flex items-center space-x-2">
                <input id="checkbox" type="checkbox" />
                <span className="text-sm text-muted-foreground">He leído y acepto los términos y condiciones</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Opciones</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <input id="option1" type="radio" name="options" />
                  <Label htmlFor="option1">Opción 1</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input id="option2" type="radio" name="options" />
                  <Label htmlFor="option2">Opción 2</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input id="option3" type="radio" name="options" />
                  <Label htmlFor="option3">Opción 3</Label>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="range">Rango</Label>
              <input id="range" type="range" min="0" max="100" className="w-full" />
            </div>
          </div>
        </div>
      </section>

      {/* 11. Sheet - Variantes */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Sheet - Todas las variantes</h2>
        <div className="flex flex-wrap gap-4">
          {( ["right", "left", "top", "bottom"] as Array<"right" | "left" | "top" | "bottom"> ).map((side) => (
            <Sheet key={side}>
              <SheetTrigger asChild>
                <Button variant="outline">Sheet {side}</Button>
              </SheetTrigger>
              <SheetContent side={side} className="sm:max-w-md">
                <SheetHeader>
                  <SheetTitle>Sheet {side}</SheetTitle>
                  <SheetDescription>
                    Este es un panel lateral desde el <b>{side}</b>.
                  </SheetDescription>
                </SheetHeader>
                <div className="py-4">Contenido del Sheet ({side})</div>
                <SheetFooter>
                  <SheetClose asChild>
                    <Button variant="secondary">Cerrar</Button>
                  </SheetClose>
                </SheetFooter>
              </SheetContent>
            </Sheet>
          ))}
        </div>
      </section>

      {/* 12. InputOTP - Variantes */}
      <section>
        <h2 className="text-xl font-semibold mb-4">InputOTP - Todas las variantes</h2>
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium mb-2">OTP de 6 dígitos</h3>
            <InputOTP maxLength={6}>
              <InputOTPGroup>
                {[...Array(6)].map((_, i) => (
                  <InputOTPSlot key={i} index={i} />
                ))}
              </InputOTPGroup>
            </InputOTP>
          </div>
          <div>
            <h3 className="text-sm font-medium mb-2">OTP de 4 dígitos con separador</h3>
            <InputOTP maxLength={4}>
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSeparator />
                <InputOTPSlot index={1} />
                <InputOTPSeparator />
                <InputOTPSlot index={2} />
                <InputOTPSeparator />
                <InputOTPSlot index={3} />
              </InputOTPGroup>
            </InputOTP>
          </div>
        </div>
      </section>

      {/* 13. Drawer - Variantes */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Drawer - Todas las variantes</h2>
        <div className="flex flex-wrap gap-4">
          <Drawer>
            <DrawerTrigger asChild>
              <Button variant="outline">Abrir Drawer</Button>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>Drawer básico</DrawerTitle>
                <DrawerDescription>Este es un Drawer simple.</DrawerDescription>
              </DrawerHeader>
              <div className="p-4">Contenido del Drawer</div>
              <DrawerFooter>
                <DrawerClose asChild>
                  <Button variant="secondary">Cerrar</Button>
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
          <Drawer shouldScaleBackground={false}>
            <DrawerTrigger asChild>
              <Button variant="secondary">Drawer sin escala</Button>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>Drawer sin escala</DrawerTitle>
                <DrawerDescription>El fondo no se escala al abrir.</DrawerDescription>
              </DrawerHeader>
              <div className="p-4">Contenido alternativo</div>
              <DrawerFooter>
                <DrawerClose asChild>
                  <Button variant="outline">Cerrar</Button>
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        </div>
      </section>

      {/* 14. Calendar - Variantes */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Calendar - Todas las variantes</h2>
        <div className="flex flex-wrap gap-8">
          <div>
            <h3 className="text-sm font-medium mb-2">Calendario simple</h3>
            <Calendar />
          </div>
          <div>
            <h3 className="text-sm font-medium mb-2">Calendario sin días externos</h3>
            <Calendar showOutsideDays={false} />
          </div>
        </div>
      </section>

      {/* 15. Breadcrumb - Variantes */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Breadcrumb - Todas las variantes</h2>
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium mb-2">Breadcrumb simple</h3>
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="#">Inicio</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href="#">Panel</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Actual</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div>
            <h3 className="text-sm font-medium mb-2">Breadcrumb con elipsis</h3>
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="#">Inicio</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbEllipsis />
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Final</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </div>
      </section>

      {/* 16. Tooltip - Variantes */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Tooltip - Todas las variantes</h2>
        <TooltipProvider>
          <div className="flex flex-wrap gap-4">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline">Tooltip arriba</Button>
              </TooltipTrigger>
              <TooltipContent side="top">Tooltip arriba</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline">Tooltip derecha</Button>
              </TooltipTrigger>
              <TooltipContent side="right">Tooltip derecha</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline">Tooltip abajo</Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">Tooltip abajo</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline">Tooltip izquierda</Button>
              </TooltipTrigger>
              <TooltipContent side="left">Tooltip izquierda</TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
      </section>

      {/* 17. Alert - Variantes */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Alert - Todas las variantes</h2>
        <div className="space-y-4">
          <Alert>
            <AlertTitle>Alerta por defecto</AlertTitle>
            <AlertDescription>Esta es una alerta informativa.</AlertDescription>
          </Alert>
          <Alert variant="destructive">
            <AlertTitle>Alerta destructiva</AlertTitle>
            <AlertDescription>Esta es una alerta de error o peligro.</AlertDescription>
          </Alert>
        </div>
      </section>

      {/* 18. Accordion - Variantes */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Accordion - Todas las variantes</h2>
        <Accordion type="single" collapsible className="w-full max-w-md">
          <AccordionItem value="item-1">
            <AccordionTrigger>¿Qué es un Accordion?</AccordionTrigger>
            <AccordionContent>
              Un componente que permite expandir y contraer secciones de contenido.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>¿Para qué sirve?</AccordionTrigger>
            <AccordionContent>
              Para mostrar información de forma compacta y expandible.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <Accordion type="multiple" className="w-full max-w-md mt-4">
          <AccordionItem value="item-1">
            <AccordionTrigger>Accordion múltiple</AccordionTrigger>
            <AccordionContent>
              Puedes abrir varios a la vez.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>Otro panel</AccordionTrigger>
            <AccordionContent>
              Más contenido expandible.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      {/* 19. ToggleGroup - Variantes */}
      <section>
        <h2 className="text-xl font-semibold mb-4">ToggleGroup - Todas las variantes</h2>
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium mb-2">ToggleGroup simple</h3>
            <ToggleGroup type="single" defaultValue="b">
              <ToggleGroupItem value="a">A</ToggleGroupItem>
              <ToggleGroupItem value="b">B</ToggleGroupItem>
              <ToggleGroupItem value="c">C</ToggleGroupItem>
            </ToggleGroup>
          </div>
          <div>
            <h3 className="text-sm font-medium mb-2">ToggleGroup múltiple</h3>
            <ToggleGroup type="multiple" defaultValue={["a", "c"]}>
              <ToggleGroupItem value="a">A</ToggleGroupItem>
              <ToggleGroupItem value="b">B</ToggleGroupItem>
              <ToggleGroupItem value="c">C</ToggleGroupItem>
            </ToggleGroup>
          </div>
        </div>
      </section>
    </div>
  );
}
