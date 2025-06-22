import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BarChart3, Users, TrendingUp, Activity } from "lucide-react"

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-neon">Dashboard</h1>
        <p className="text-muted-foreground">Bienvenido a tu panel de control</p>
      </div>

      {/* Tarjetas de estadísticas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Usuarios</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-neon">2,350</div>
            <p className="text-xs text-muted-foreground">+20.1% desde el mes pasado</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ventas</CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-neon">$45,231</div>
            <p className="text-xs text-muted-foreground">+15% desde el mes pasado</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Actividad</CardTitle>
            <Activity className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-neon">573</div>
            <p className="text-xs text-muted-foreground">+201 desde ayer</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversiones</CardTitle>
            <BarChart3 className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-neon">12.5%</div>
            <p className="text-xs text-muted-foreground">+2% desde el mes pasado</p>
          </CardContent>
        </Card>
      </div>

      {/* Contenido principal */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle className="text-primary">Resumen</CardTitle>
            <CardDescription>Vista general de tu aplicación</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Usuarios activos</span>
                <span className="text-sm text-primary font-semibold">1,234</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Sesiones hoy</span>
                <span className="text-sm text-primary font-semibold">456</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Tiempo promedio</span>
                <span className="text-sm text-primary font-semibold">2m 30s</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle className="text-primary">Acciones Rápidas</CardTitle>
            <CardDescription>Tareas comunes que puedes realizar</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button className="w-full justify-start">
              <Users className="mr-2 h-4 w-4" />
              Gestionar Usuarios
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <BarChart3 className="mr-2 h-4 w-4" />
              Ver Reportes
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Activity className="mr-2 h-4 w-4" />
              Monitorear Sistema
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
