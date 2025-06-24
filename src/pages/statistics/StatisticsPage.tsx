import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  RadialBarChart,
  RadialBar,
} from "recharts";
import {
  Users,
  Clock,
  TrendingUp,
  Target,
  Award,
  Activity,
  Zap,
  Brain,
} from "lucide-react";
import {
  monthlyUsageData,
  gamePerformanceData,
  lecturePopularityData,
  weeklyActivityData,
  learningProgressData,
  timeDistributionData,
} from "@/data/statisticsData";
import { PageHeader } from "@/components/ui/page-header";
import { PageLayout } from "@/components/layouts/page-layout";

export default function StatisticsPage() {
  return (
    <PageLayout>
      <PageHeader
        title="Estadísticas"
        description="Visualiza tu progreso y rendimiento en la plataforma."
      />
      {/* Métricas principales */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Usuarios Activos
            </CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-neon">2,847</div>
            <p className="text-xs text-muted-foreground">
              +18.2% desde el mes pasado
            </p>
            <Progress value={72} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Sesiones Totales
            </CardTitle>
            <Activity className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-neon">12,456</div>
            <p className="text-xs text-muted-foreground">
              +25.1% desde el mes pasado
            </p>
            <Progress value={85} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tiempo Promedio
            </CardTitle>
            <Clock className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-neon">24m 32s</div>
            <p className="text-xs text-muted-foreground">
              +12.5% desde el mes pasado
            </p>
            <Progress value={68} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tasa de Retención
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-neon">89.3%</div>
            <p className="text-xs text-muted-foreground">
              +5.2% desde el mes pasado
            </p>
            <Progress value={89} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Gráficos principales */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-primary">Crecimiento Mensual</CardTitle>
            <CardDescription>
              Usuarios, sesiones y tiempo de uso por mes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={monthlyUsageData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1f2937",
                    border: "1px solid #10b981",
                    borderRadius: "8px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="usuarios"
                  stackId="1"
                  stroke="#10b981"
                  fill="#10b981"
                  fillOpacity={0.6}
                />
                <Area
                  type="monotone"
                  dataKey="sesiones"
                  stackId="2"
                  stroke="#06d6a0"
                  fill="#06d6a0"
                  fillOpacity={0.6}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-primary">
              Popularidad de Lecturas
            </CardTitle>
            <CardDescription>
              Distribución de lecturas más consultadas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={lecturePopularityData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {lecturePopularityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Más estadísticas */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-primary">
              Rendimiento en Juegos
            </CardTitle>
            <CardDescription>Precisión y completitud por juego</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={gamePerformanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="game" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1f2937",
                    border: "1px solid #10b981",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="precision" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-primary">Actividad Semanal</CardTitle>
            <CardDescription>
              Nivel de actividad por día de la semana
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={weeklyActivityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="day" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1f2937",
                    border: "1px solid #10b981",
                    borderRadius: "8px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="actividad"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={{ fill: "#10b981" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-primary">
              Distribución de Tiempo
            </CardTitle>
            <CardDescription>Tiempo dedicado por actividad</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <RadialBarChart
                cx="50%"
                cy="50%"
                innerRadius="20%"
                outerRadius="90%"
                data={timeDistributionData}
              >
                <RadialBar dataKey="tiempo" cornerRadius={10} fill="#10b981" />
                <Tooltip />
              </RadialBarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Progreso de aprendizaje */}
      <Card>
        <CardHeader>
          <CardTitle className="text-primary">Progreso por Nivel</CardTitle>
          <CardDescription>Avance en cada nivel de competencia</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {learningProgressData.map((nivel) => (
              <div key={nivel.nivel} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{nivel.nivel}</span>
                  <span className="text-sm text-primary">
                    {nivel.completado}%
                  </span>
                </div>
                <Progress value={nivel.completado} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Métricas adicionales */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Palabras Aprendidas
            </CardTitle>
            <Brain className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-neon">1,247</div>
            <p className="text-xs text-muted-foreground">+89 esta semana</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Exámenes Completados
            </CardTitle>
            <Award className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-neon">156</div>
            <p className="text-xs text-muted-foreground">+12 esta semana</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Racha Actual</CardTitle>
            <Zap className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-neon">23 días</div>
            <p className="text-xs text-muted-foreground">¡Récord personal!</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Precisión Global
            </CardTitle>
            <Target className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-neon">87.4%</div>
            <p className="text-xs text-muted-foreground">+2.1% este mes</p>
          </CardContent>
        </Card>
      </div>

      {/* Estadísticas detalladas */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-primary">
              Top Palabras Practicadas
            </CardTitle>
            <CardDescription>
              Las palabras más estudiadas esta semana
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { word: "beautiful", count: 45, trend: "+12%" },
                { word: "important", count: 38, trend: "+8%" },
                { word: "necessary", count: 32, trend: "+15%" },
                { word: "different", count: 28, trend: "+5%" },
                { word: "available", count: 24, trend: "+22%" },
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="w-8 text-center">
                      {index + 1}
                    </Badge>
                    <span className="font-medium">{item.word}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      {item.count}x
                    </span>
                    <Badge className="badge-neon text-xs">{item.trend}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-primary">Logros Recientes</CardTitle>
            <CardDescription>Últimos hitos alcanzados</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                {
                  achievement: "Maestro del Vocabulario",
                  date: "Hace 2 días",
                  icon: "🏆",
                },
                {
                  achievement: "Racha de 20 días",
                  date: "Hace 3 días",
                  icon: "🔥",
                },
                {
                  achievement: "100 Palabras Aprendidas",
                  date: "Hace 1 semana",
                  icon: "📚",
                },
                {
                  achievement: "Perfección en Verbos",
                  date: "Hace 1 semana",
                  icon: "⭐",
                },
                {
                  achievement: "Estudiante Dedicado",
                  date: "Hace 2 semanas",
                  icon: "🎯",
                },
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <span className="text-2xl">{item.icon}</span>
                  <div className="flex-1">
                    <p className="font-medium">{item.achievement}</p>
                    <p className="text-xs text-muted-foreground">{item.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
}
