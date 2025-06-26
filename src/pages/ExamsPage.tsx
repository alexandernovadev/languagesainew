import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Plus, Filter, BookOpen } from 'lucide-react';
import { examService, Exam } from '@/services/examService';
import { useNavigate } from 'react-router-dom';
import ExamCard from '@/components/exam/ExamCard';
import ExamViewModal from '@/components/exam/ExamViewModal';

interface ExamFilters {
  level: string;
  language: string;
  topic: string;
  source: string;
  adaptive: string;
  sortBy: string;
  sortOrder: string;
}

export default function ExamsPage() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<ExamFilters>({
    level: 'all',
    language: 'all',
    topic: 'all',
    source: 'all',
    adaptive: 'all',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10
  });
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const navigate = useNavigate();

  const fetchExams = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.currentPage.toString(),
        limit: pagination.itemsPerPage.toString(),
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder
      });

      if (filters.level && filters.level !== 'all') params.append('level', filters.level);
      if (filters.language && filters.language !== 'all') params.append('language', filters.language);
      if (filters.topic && filters.topic !== 'all') params.append('topic', filters.topic);
      if (filters.source && filters.source !== 'all') params.append('source', filters.source);
      if (filters.adaptive && filters.adaptive !== 'all') params.append('adaptive', filters.adaptive);

      console.log('Fetching exams with params:', params.toString());
      const response = await examService.getExams(params.toString());
      console.log('API Response:', response);
      
      if (response && response.success && response.data) {
        setExams(response.data.data || []);
        
        setPagination({
          currentPage: response.data.page || 1,
          totalPages: response.data.pages || 1,
          totalItems: response.data.total || 0,
          itemsPerPage: pagination.itemsPerPage
        });
      } else {
        console.warn('Unexpected response structure:', response);
        setExams([]);
        setPagination(prev => ({
          ...prev,
          totalPages: 1,
          totalItems: 0
        }));
      }
    } catch (error) {
      console.error('Error fetching exams:', error);
      setExams([]);
      setPagination(prev => ({
        ...prev,
        totalPages: 1,
        totalItems: 0
      }));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch on component mount
    fetchExams();
  }, []); // Empty dependency array for initial load

  useEffect(() => {
    // Fetch when pagination or filters change (but not on initial mount)
    if (pagination.currentPage > 0) {
      fetchExams();
    }
  }, [pagination.currentPage, filters.sortBy, filters.sortOrder, filters.level, filters.language, filters.topic, filters.source, filters.adaptive]);

  const handleFilterChange = (key: keyof ExamFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const handleSearch = () => {
    setPagination(prev => ({ ...prev, currentPage: 1 }));
    fetchExams();
  };

  const handleViewExam = (exam: Exam) => {
    setSelectedExam(exam);
    setIsViewModalOpen(true);
  };

  const handleTakeExam = (exam: Exam) => {
    // Navigate to exam taking page
    navigate(`/exams/${exam._id}/take`);
  };

  const handleCloseViewModal = () => {
    setIsViewModalOpen(false);
    setSelectedExam(null);
  };

  const handleEditExam = (exam: Exam) => {
    // Navigate to exam generator with exam data
    navigate(`/generator/exam?edit=${exam._id}`);
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Cargando exámenes...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Exámenes</h1>
          <p className="text-muted-foreground">
            Gestiona y revisa todos tus exámenes
          </p>
        </div>
        <Button onClick={() => navigate('/generator/exam')}>
          <Plus className="w-4 h-4 mr-2" />
          Crear Examen
        </Button>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium">Nivel</label>
              <Select value={filters.level} onValueChange={(value) => handleFilterChange('level', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos los niveles" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los niveles</SelectItem>
                  <SelectItem value="A1">A1</SelectItem>
                  <SelectItem value="A2">A2</SelectItem>
                  <SelectItem value="B1">B1</SelectItem>
                  <SelectItem value="B2">B2</SelectItem>
                  <SelectItem value="C1">C1</SelectItem>
                  <SelectItem value="C2">C2</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium">Idioma</label>
              <Select value={filters.language} onValueChange={(value) => handleFilterChange('language', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos los idiomas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los idiomas</SelectItem>
                  <SelectItem value="es">Español</SelectItem>
                  <SelectItem value="en">Inglés</SelectItem>
                  <SelectItem value="fr">Francés</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium">Origen</label>
              <Select value={filters.source} onValueChange={(value) => handleFilterChange('source', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos los orígenes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los orígenes</SelectItem>
                  <SelectItem value="manual">Manual</SelectItem>
                  <SelectItem value="ai">IA</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium">Ordenar por</label>
              <Select value={filters.sortBy} onValueChange={(value) => handleFilterChange('sortBy', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="createdAt">Fecha de creación</SelectItem>
                  <SelectItem value="title">Título</SelectItem>
                  <SelectItem value="level">Nivel</SelectItem>
                  <SelectItem value="language">Idioma</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search */}
      <div className="flex gap-2 mb-6">
        <Input
          placeholder="Buscar exámenes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        />
        <Button onClick={handleSearch}>
          <Search className="w-4 h-4" />
        </Button>
      </div>

      {/* Exams Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {exams.map((exam) => (
          <ExamCard
            key={exam._id}
            exam={exam}
            onViewExam={handleViewExam}
            onTakeExam={handleTakeExam}
            onEditExam={handleEditExam}
          />
        ))}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <div className="flex gap-2">
            <Button
              variant="outline"
              disabled={pagination.currentPage === 1}
              onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage - 1 }))}
            >
              Anterior
            </Button>
            
            <span className="flex items-center px-4">
              Página {pagination.currentPage} de {pagination.totalPages}
            </span>
            
            <Button
              variant="outline"
              disabled={pagination.currentPage === pagination.totalPages}
              onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage + 1 }))}
            >
              Siguiente
            </Button>
          </div>
        </div>
      )}

      {exams.length === 0 && !loading && (
        <div className="text-center py-12">
          <BookOpen className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No hay exámenes</h3>
          <p className="text-muted-foreground mb-4">
            Comienza creando tu primer examen
          </p>
          <Button onClick={() => navigate('/generator/exam')}>
            <Plus className="w-4 h-4 mr-2" />
            Crear Examen
          </Button>
        </div>
      )}

      {/* Exam View Modal */}
      <ExamViewModal
        exam={selectedExam}
        isOpen={isViewModalOpen}
        onClose={handleCloseViewModal}
        onEditExam={handleEditExam}
      />
    </div>
  );
} 