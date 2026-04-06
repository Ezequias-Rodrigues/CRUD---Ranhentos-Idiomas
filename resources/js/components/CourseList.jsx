import { useState, useEffect } from 'react';
import api from '../services/api';
import CourseForm from './CourseForm';
import Modal from './Modal';

function CourseList() {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCourse, setEditingCourse] = useState(null);
    const [formLoading, setFormLoading] = useState(false);

    const loadCourses = async () => {
        setLoading(true);
        try {
            const response = await api.get('/courses');
            setCourses(response.data);
            setError(null);
        } catch (err) {
            setError('Erro ao carregar cursos: ' + (err.response?.data?.message || err.message));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCourses();
    }, []);

    const handleCreate = async (data) => {
        setFormLoading(true);
        try {
            await api.post('/courses', data);
            await loadCourses();
            setIsModalOpen(false);
            showSuccess('Curso criado com sucesso!');
        } catch (err) {
            const errorMsg = err.response?.data?.errors || err.response?.data?.message || 'Erro ao criar curso';
            alert(typeof errorMsg === 'object' ? JSON.stringify(errorMsg) : errorMsg);
        } finally {
            setFormLoading(false);
        }
    };

    const handleUpdate = async (data) => {
        setFormLoading(true);
        try {
            await api.put(`/courses/${editingCourse.id}`, data);
            await loadCourses();
            setIsModalOpen(false);
            setEditingCourse(null);
            showSuccess('Curso atualizado com sucesso!');
        } catch (err) {
            const errorMsg = err.response?.data?.errors || err.response?.data?.message || 'Erro ao atualizar curso';
            alert(typeof errorMsg === 'object' ? JSON.stringify(errorMsg) : errorMsg);
        } finally {
            setFormLoading(false);
        }
    };

    const handleDelete = async (course) => {
        if (!confirm(`Tem certeza que deseja excluir o curso "${course.name}"?\n\nIsso também removerá todas as matrículas relacionadas.`)) {
            return;
        }

        try {
            await api.delete(`/courses/${course.id}`);
            await loadCourses();
            showSuccess('Curso excluído com sucesso!');
        } catch (err) {
            alert('Erro ao excluir curso: ' + (err.response?.data?.message || err.message));
        }
    };

    const showSuccess = (message) => {
        setSuccessMessage(message);
        setTimeout(() => setSuccessMessage(''), 3000);
    };

    const openEditModal = (course) => {
        setEditingCourse(course);
        setIsModalOpen(true);
    };

    const openCreateModal = () => {
        setEditingCourse(null);
        setIsModalOpen(true);
    };

    // Formatar preço
    const formatPrice = (price) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(price);
    };

    if (loading && courses.length === 0) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-gray-500">Carregando cursos...</div>
            </div>
        );
    }

    return (
        <div className="p-4">
            {successMessage && (
                <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg border border-green-200">
                    {successMessage}
                </div>
            )}

            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Cursos</h2>
                <button
                    onClick={openCreateModal}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Novo Curso
                </button>
            </div>

            {error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg border border-red-200">
                    {error}
                </div>
            )}

            {courses.length === 0 && !loading ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <p className="text-gray-500">Nenhum curso cadastrado.</p>
                    <button
                        onClick={openCreateModal}
                        className="mt-2 text-blue-600 hover:text-blue-700"
                    >
                        Clique aqui para criar o primeiro curso
                    </button>
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {courses.map(course => (
                        <div key={course.id} className="bg-white rounded-lg shadow-md border border-gray-200 p-4 hover:shadow-lg transition">
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <h3 className="font-semibold text-lg text-gray-800">{course.name}</h3>
                                    {course.description && (
                                        <p className="text-gray-600 text-sm mt-1 line-clamp-2">{course.description}</p>
                                    )}
                                    <div className="mt-2 space-y-1">
                                        <p className="text-lg font-bold text-green-600">
                                            {formatPrice(course.price)}
                                        </p>
                                        {course.max_students && (
                                            <p className="text-sm text-gray-500">
                                                🎓 Máximo: {course.max_students} alunos
                                            </p>
                                        )}
                                        {!course.max_students && (
                                            <p className="text-sm text-gray-500">
                                                🎓 Vagas: Ilimitadas
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => openEditModal(course)}
                                        className="text-blue-600 hover:text-blue-800 transition"
                                        title="Editar"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                    </button>
                                    <button
                                        onClick={() => handleDelete(course)}
                                        className="text-red-600 hover:text-red-800 transition"
                                        title="Excluir"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <Modal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setEditingCourse(null);
                }}
                title={editingCourse ? 'Editar Curso' : 'Novo Curso'}
            >
                <CourseForm
                    course={editingCourse}
                    onSubmit={editingCourse ? handleUpdate : handleCreate}
                    onCancel={() => {
                        setIsModalOpen(false);
                        setEditingCourse(null);
                    }}
                    loading={formLoading}
                />
            </Modal>
        </div>
    );
}

export default CourseList;
