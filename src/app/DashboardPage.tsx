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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell, TableCaption } from "@/components/ui/table";
import { Sidebar } from "@/components/ui/sidebar";
import { Command, CommandDialog, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem, CommandShortcut, CommandSeparator } from "@/components/ui/command";
import { Separator } from "@/components/ui/separator";
import { Menubar, MenubarMenu, MenubarTrigger, MenubarContent, MenubarItem, MenubarSeparator, MenubarSub, MenubarSubTrigger, MenubarSubContent, MenubarCheckboxItem, MenubarRadioGroup, MenubarRadioItem, MenubarLabel } from "@/components/ui/menubar";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuCheckboxItem, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuLabel, DropdownMenuSub, DropdownMenuSubTrigger, DropdownMenuSubContent } from "@/components/ui/dropdown-menu";
import { Toggle } from "@/components/ui/toggle";
import { ToastProvider, Toast, ToastTitle, ToastDescription, ToastAction, ToastClose, ToastViewport } from "@/components/ui/toast";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectLabel, SelectSeparator, SelectGroup, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Form, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Skeleton } from "@/components/ui/skeleton";
import { useForm, FormProvider } from "react-hook-form";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { StatsGrid } from "@/components/ui/stats-grid";
import { ProgressBar } from "@/components/ui/progress-bar";
import { PageHeader } from "@/components/ui/page-header";
import { LecturePagination } from "@/components/ui/LecturePagination";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import { AvatarFallbackClient } from "@/components/ui/avatar-fallback-client";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { useIsMobile } from "@/hooks/use-mobile";

function ToastDemoButtons() {
  const { toast } = useToast();
  return (
    <div className="flex flex-wrap gap-4 items-center">
      <Button
        onClick={() =>
          toast({
            title: "Toast por defecto",
            description: "Este es un toast informativo.",
          })
        }
      >
        Mostrar Toast Default
      </Button>
      <Button
        onClick={() =>
          toast({
            title: "Error",
            description: "Este es un toast destructivo.",
            variant: "destructive",
          })
        }
        variant="destructive"
      >
        Mostrar Toast Destructivo
      </Button>
      <Button
        onClick={() =>
          toast({
            title: "Con acción",
            description: "Toast con botón de acción.",
            action: (
              <ToastAction altText="Deshacer" onClick={() => alert("Deshecho!")}>
                Deshacer
              </ToastAction>
            ),
          })
        }
        variant="secondary"
      >
        Mostrar Toast con Acción
      </Button>
    </div>
  );
}

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

      {/* 20. RadioGroup - Variantes */}
      <section>
        <h2 className="text-xl font-semibold mb-4">RadioGroup - Todas las variantes</h2>
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium mb-2">RadioGroup simple</h3>
            <RadioGroup defaultValue="option1">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="option1" id="r1" />
                <label htmlFor="r1">Opción 1</label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="option2" id="r2" />
                <label htmlFor="r2">Opción 2</label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="option3" id="r3" />
                <label htmlFor="r3">Opción 3</label>
              </div>
            </RadioGroup>
          </div>
          <div>
            <h3 className="text-sm font-medium mb-2">RadioGroup deshabilitado</h3>
            <RadioGroup defaultValue="option1" disabled>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="option1" id="r4" disabled />
                <label htmlFor="r4">Opción 1</label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="option2" id="r5" disabled />
                <label htmlFor="r5">Opción 2</label>
              </div>
            </RadioGroup>
          </div>
        </div>
      </section>

      {/* 21. Switch - Variantes */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Switch - Todas las variantes</h2>
        <div className="flex flex-wrap gap-8 items-center">
          <div className="flex flex-col items-center gap-2">
            <span>Switch ON</span>
            <Switch checked />
          </div>
          <div className="flex flex-col items-center gap-2">
            <span>Switch OFF</span>
            <Switch />
          </div>
          <div className="flex flex-col items-center gap-2">
            <span>Switch deshabilitado</span>
            <Switch disabled />
          </div>
        </div>
      </section>

      {/* 22. Button - Variantes */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Button - Todas las variantes</h2>
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Button variant="default">Default</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="link">Link</Button>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button size="sm">Small</Button>
            <Button size="default">Default</Button>
            <Button size="lg">Large</Button>
            <Button size="icon"><span>🔔</span></Button>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button disabled>Disabled</Button>
            <Button variant="destructive" disabled>Destructive</Button>
          </div>
        </div>
      </section>

      {/* 23. Table - Variantes */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Table - Todas las variantes</h2>
        <div className="space-y-8">
          <div>
            <h3 className="text-sm font-medium mb-2">Tabla básica</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Rol</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>Juan</TableCell>
                  <TableCell>juan@email.com</TableCell>
                  <TableCell>Admin</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Maria</TableCell>
                  <TableCell>maria@email.com</TableCell>
                  <TableCell>Usuario</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
          <div>
            <h3 className="text-sm font-medium mb-2">Tabla con caption y footer</h3>
            <Table>
              <TableCaption>Usuarios registrados</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Rol</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>Pedro</TableCell>
                  <TableCell>pedro@email.com</TableCell>
                  <TableCell>Editor</TableCell>
                </TableRow>
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={3}>Total: 1</TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </div>
        </div>
      </section>

      {/* 24. Sidebar - Variante básica (aislada, solo visual) */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Sidebar (solo ejemplo visual, no funcional)</h2>
        <div className="border rounded w-64 bg-sidebar text-sidebar-foreground p-4 flex flex-col gap-2">
          <div className="font-bold text-lg">Sidebar</div>
          <div className="text-sm">Este es solo un ejemplo visual de Sidebar.<br/>No afecta la Sidebar real de la app.</div>
          <ul className="mt-2 space-y-1">
            <li className="hover:bg-muted rounded px-2 py-1 cursor-pointer">Dashboard</li>
            <li className="hover:bg-muted rounded px-2 py-1 cursor-pointer">Usuarios</li>
            <li className="hover:bg-muted rounded px-2 py-1 cursor-pointer">Ajustes</li>
          </ul>
        </div>
      </section>

      {/* 25. Command - Variantes */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Command - Todas las variantes</h2>
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium mb-2">Command básico</h3>
            <Command className="w-full max-w-md">
              <CommandInput placeholder="Buscar..." />
              <CommandList>
                <CommandEmpty>No se encontraron resultados.</CommandEmpty>
                <CommandGroup heading="Opciones">
                  <CommandItem>Perfil <CommandShortcut>⌘P</CommandShortcut></CommandItem>
                  <CommandItem>Configuración <CommandShortcut>⌘S</CommandShortcut></CommandItem>
                </CommandGroup>
                <CommandSeparator />
                <CommandGroup heading="Acciones">
                  <CommandItem>Salir <CommandShortcut>⌘Q</CommandShortcut></CommandItem>
                </CommandGroup>
              </CommandList>
            </Command>
          </div>
        </div>
      </section>

      {/* 26. Separator - Variantes */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Separator - Todas las variantes</h2>
        <div className="space-y-4">
          <Separator />
          <div className="flex h-8 items-center space-x-4">
            <span>Texto</span>
            <Separator orientation="vertical" />
            <span>Más texto</span>
          </div>
        </div>
      </section>

      {/* 27. Badge - Variantes */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Badge - Todas las variantes</h2>
        <div className="flex flex-wrap gap-2">
          <Badge variant="default">Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="destructive">Destructive</Badge>
          <Badge variant="outline">Outline</Badge>
        </div>
      </section>

      {/* 28. Menubar - Variantes */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Menubar - Todas las variantes</h2>
        <Menubar>
          <MenubarMenu>
            <MenubarTrigger>Archivo</MenubarTrigger>
            <MenubarContent>
              <MenubarItem>Nuevo</MenubarItem>
              <MenubarItem>Abrir...</MenubarItem>
              <MenubarSeparator />
              <MenubarSub>
                <MenubarSubTrigger>Más</MenubarSubTrigger>
                <MenubarSubContent>
                  <MenubarItem>Opción 1</MenubarItem>
                  <MenubarItem>Opción 2</MenubarItem>
                </MenubarSubContent>
              </MenubarSub>
            </MenubarContent>
          </MenubarMenu>
          <MenubarMenu>
            <MenubarTrigger>Editar</MenubarTrigger>
            <MenubarContent>
              <MenubarCheckboxItem checked>Cortar</MenubarCheckboxItem>
              <MenubarCheckboxItem>Pegar</MenubarCheckboxItem>
              <MenubarRadioGroup value="a">
                <MenubarLabel>Modo</MenubarLabel>
                <MenubarRadioItem value="a">A</MenubarRadioItem>
                <MenubarRadioItem value="b">B</MenubarRadioItem>
              </MenubarRadioGroup>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      </section>

      {/* 29. Avatar - Variantes */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Avatar - Todas las variantes</h2>
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex flex-col items-center gap-2">
            <span>Con imagen</span>
            <Avatar>
              <AvatarImage src="https://randomuser.me/api/portraits/men/32.jpg" alt="Avatar" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
          </div>
          <div className="flex flex-col items-center gap-2">
            <span>Solo iniciales</span>
            <Avatar>
              <AvatarFallback>AB</AvatarFallback>
            </Avatar>
          </div>
      </div>
      </section>

      {/* 30. Dialog - Variantes */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Dialog - Todas las variantes</h2>
        <div className="flex flex-wrap gap-4">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Abrir Dialog</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Dialog básico</DialogTitle>
                <DialogDescription>Este es un diálogo simple.</DialogDescription>
              </DialogHeader>
              <div className="py-4">Contenido del diálogo</div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="secondary">Cerrar</Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </section>

      {/* 31. Checkbox - Variantes */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Checkbox - Todas las variantes</h2>
        <div className="flex flex-wrap gap-8 items-center">
          <div className="flex items-center gap-2">
            <Checkbox id="cb1" checked />
            <label htmlFor="cb1">Checked</label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox id="cb2" />
            <label htmlFor="cb2">Unchecked</label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox id="cb3" disabled />
            <label htmlFor="cb3">Disabled</label>
          </div>
        </div>
      </section>

      {/* 32. DropdownMenu - Variantes */}
      <section>
        <h2 className="text-xl font-semibold mb-4">DropdownMenu - Todas las variantes</h2>
        <div className="flex flex-wrap gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">Dropdown básico</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Opción 1</DropdownMenuItem>
              <DropdownMenuItem>Opción 2</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Opción 3</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary">Dropdown con submenú</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>Más opciones</DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <DropdownMenuItem>Subopción 1</DropdownMenuItem>
                  <DropdownMenuItem>Subopción 2</DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Opción final</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost">Dropdown con radio y checkbox</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuCheckboxItem checked>Check 1</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>Check 2</DropdownMenuCheckboxItem>
              <DropdownMenuRadioGroup value="a">
                <DropdownMenuLabel>Modo</DropdownMenuLabel>
                <DropdownMenuRadioItem value="a">A</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="b">B</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </section>

      {/* 33. Toggle - Variantes */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Toggle - Todas las variantes</h2>
        <div className="flex flex-wrap gap-4 items-center">
          <Toggle>Default</Toggle>
          <Toggle variant="outline">Outline</Toggle>
          <Toggle size="sm">Small</Toggle>
          <Toggle size="lg">Large</Toggle>
          <Toggle pressed>On</Toggle>
          <Toggle>Off</Toggle>
        </div>
      </section>

      {/* 34. Toast - Variantes */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Toast - Todas las variantes</h2>
        <ToastDemoButtons />
      </section>

      {/* 35. Select - Variantes */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Select - Todas las variantes</h2>
        <div className="flex flex-wrap gap-4 items-center">
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Selecciona una opción" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="a">Opción A</SelectItem>
              <SelectItem value="b">Opción B</SelectItem>
              <SelectItem value="c">Opción C</SelectItem>
            </SelectContent>
          </Select>
          <Select disabled>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Deshabilitado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="a">Opción A</SelectItem>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Con grupos" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Grupo 1</SelectLabel>
                <SelectItem value="g1a">G1 - A</SelectItem>
                <SelectItem value="g1b">G1 - B</SelectItem>
                <SelectSeparator />
                <SelectLabel>Grupo 2</SelectLabel>
                <SelectItem value="g2a">G2 - A</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </section>

      {/* 36. Textarea - Variantes */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Textarea - Todas las variantes</h2>
        <div className="space-y-4">
          <Textarea placeholder="Escribe algo..." />
          <Textarea disabled placeholder="Deshabilitado" />
        </div>
      </section>

      {/* 37. Input - Variantes */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Input - Todas las variantes</h2>
        <div className="space-y-4">
          <Input placeholder="Texto" />
          <Input type="password" placeholder="Contraseña" />
          <Input disabled placeholder="Deshabilitado" />
        </div>
      </section>

      {/* 38. Form - Ejemplo simple */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Form - Ejemplo simple</h2>
        <div className="max-w-sm">
          {(() => {
            const methods = useForm();
            return (
              <FormProvider {...methods}>
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input placeholder="Tu nombre" />
                  </FormControl>
                  <FormDescription>Este es tu nombre completo.</FormDescription>
                  <FormMessage />
                </FormItem>
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="tu@email.com" />
                  </FormControl>
                  <FormDescription>Tu correo electrónico.</FormDescription>
                  <FormMessage />
                </FormItem>
              </FormProvider>
            );
          })()}
        </div>
      </section>

      {/* 39. Skeleton - Variantes */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Skeleton - Todas las variantes</h2>
        <div className="flex flex-wrap gap-4 items-end">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-12 w-12 rounded-full" />
          <Skeleton className="h-4 w-64" />
        </div>
      </section>

      {/* 41. Sonner - Ejemplo de integración */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Sonner (Toaster alternativo)</h2>
        <div className="text-sm text-muted-foreground mb-2">Este es un ejemplo de cómo se integraría el Toaster de Sonner. No interfiere con el Toaster principal.</div>
        <div className="border rounded p-4 bg-background">
          <SonnerToaster position="top-right" />
          <span className="text-xs">(No funcional aquí, solo visual)</span>
        </div>
      </section>

      {/* 42. StatsGrid - Variantes */}
      <section>
        <h2 className="text-xl font-semibold mb-4">StatsGrid - Todas las variantes</h2>
        <StatsGrid
          stats={[
            { label: "Usuarios", value: 120 },
            { label: "Ventas", value: 45, suffix: "USD" },
            { label: "Visitas", value: 3200 },
            { label: "Conversiones", value: 12, suffix: "%" },
          ]}
        />
      </section>

      {/* 43. ProgressBar - Variantes */}
      <section>
        <h2 className="text-xl font-semibold mb-4">ProgressBar - Todas las variantes</h2>
        <div className="space-y-4">
          <ProgressBar progress={20} />
          <ProgressBar progress={50} showPercentage />
          <ProgressBar progress={80} className="bg-muted" showPercentage />
        </div>
      </section>

      {/* 44. PageHeader - Variantes */}
      <section>
        <h2 className="text-xl font-semibold mb-4">PageHeader - Todas las variantes</h2>
        <PageHeader
          title="Dashboard"
          description="Resumen de tu actividad"
          actions={<Button>Acción</Button>}
        />
        <div className="mt-4" />
        <PageHeader title="Solo título" />
      </section>

      {/* 45. LecturePagination - Ejemplo funcional */}
      <section>
        <h2 className="text-xl font-semibold mb-4">LecturePagination - Ejemplo funcional</h2>
        <LecturePaginationDemo />
      </section>

      {/* 46. Collapsible - Variantes */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Collapsible - Todas las variantes</h2>
        <CollapsibleDemo />
      </section>

      {/* 47. AvatarFallbackClient - Variantes */}
      <section>
        <h2 className="text-xl font-semibold mb-4">AvatarFallbackClient - Todas las variantes</h2>
        <div className="flex gap-4 items-center">
          <Avatar>
            <AvatarFallbackClient user={{
              _id: "1",
              email: "alex@email.com",
              role: "admin",
              isActive: true,
              firstName: "Alex",
              lastName: "Dev",
              username: "alexdev",
              image: "",
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            }} />
          </Avatar>
          <Avatar>
            <AvatarFallbackClient user={null} />
          </Avatar>
        </div>
      </section>

      {/* 48. AspectRatio - Variantes */}
      <section>
        <h2 className="text-xl font-semibold mb-4">AspectRatio - Todas las variantes</h2>
        <div className="flex gap-4">
          <AspectRatio ratio={16 / 9} className="bg-muted w-48">
            <img
              src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80"
              alt="Demo"
              className="object-cover w-full h-full rounded"
            />
          </AspectRatio>
          <AspectRatio ratio={1} className="bg-muted w-24">
            <div className="flex items-center justify-center h-full">1:1</div>
          </AspectRatio>
        </div>
      </section>

      {/* 49. useIsMobile - Ejemplo visual */}
      <section>
        <h2 className="text-xl font-semibold mb-4">useIsMobile - Ejemplo visual</h2>
        <IsMobileDemo />
      </section>

      {/* 50. Toaster - Mensaje de integración */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Toaster (Radix) - Integración</h2>
        <div className="text-sm text-muted-foreground">El Toaster de Radix ya está integrado al final del DashboardPage y es funcional para los Toasts.</div>
      </section>

      <Toaster />
    </div>
  );
}

// Componentes auxiliares para los ejemplos funcionales:
function LecturePaginationDemo() {
  const [page, setPage] = React.useState(1);
  return (
    <LecturePagination currentPage={page} totalPages={7} onPageChange={setPage} />
  );
}

function CollapsibleDemo() {
  const [open, setOpen] = React.useState(false);
  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger asChild>
        <Button variant="outline">{open ? "Cerrar" : "Abrir"} contenido</Button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="p-4 border rounded mt-2">Este es el contenido colapsable.</div>
      </CollapsibleContent>
    </Collapsible>
  );
}

function IsMobileDemo() {
  const isMobile = useIsMobile();
  return (
    <div className="p-2 border rounded w-fit">
      <span className="font-mono">{isMobile ? "Móvil" : "Desktop"}</span>
    </div>
  );
}
