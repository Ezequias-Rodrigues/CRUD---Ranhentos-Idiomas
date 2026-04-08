import { useState, useEffect } from 'react';
import api from '../services/api';
import EnrollmentForm from './EnrollmentForm';
import Modal from './Modal';
import Toast from "./Toast.jsx";
import SearchBar from "./SearchBar.jsx";

function EnrollmentList() {
    const [enrollments, setEnrollments] = useState([]);
    const [students, setStudents] = useState([]);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [toast, setToast] = useState(null);
    const [filteredEnrollments, setFilteredEnrollments] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingEnrollment, setEditingEnrollment] = useState(null);
    const [formLoading, setFormLoading] = useState(false);

    const showToast = (message, type) => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const handleSearch = (term) => {
        setSearchTerm(term);
        if (!term.trim()) {
            setFilteredEnrollments(enrollments);
            return;
        }

        const lowercasedTerm = term.toLowerCase();
        const filtered = enrollments.filter(enrollment =>
            enrollment.student?.name?.toLowerCase().includes(lowercasedTerm) ||
            enrollment.course?.name?.toLowerCase().includes(lowercasedTerm)
        );
        setFilteredEnrollments(filtered);
    };
    // Carregar todos os dados necessários
    const loadData = async () => {
        setLoading(true);
        try {
            const [enrollmentsRes, studentsRes, coursesRes] = await Promise.all([
                api.get('/enrollments'),
                api.get('/students'),
                api.get('/courses')
            ]);

            setEnrollments(enrollmentsRes.data.data || enrollmentsRes.data);
            setFilteredEnrollments(enrollmentsRes.data.data || enrollmentsRes.data);
            setStudents(studentsRes.data);
            setCourses(coursesRes.data);
            setError(null);
        } catch (err) {
            setError('Erro ao carregar dados: ' + (err.response?.data?.message || err.message));
            showToast('Erro ao carregar dados', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleCreate = async (data) => {
        setFormLoading(true);
        try {
            await api.post('/enrollments', data);
            await loadData();
            setIsModalOpen(false);
            showToast('Matrícula realizada com sucesso!', 'success');
        } catch (err) {
            const error = err.response?.data?.message || err.response?.data?.errors || 'Erro ao criar matrícula';
            showToast(typeof error === 'object' ? JSON.stringify(error) : error, "error");
        } finally {
            setFormLoading(false);
        }
    };

    const handleUpdate = async (data) => {
        setFormLoading(true);
        try {
            await api.put(`/enrollments/${editingEnrollment.id}`, data);
            await loadData();
            setIsModalOpen(false);
            setEditingEnrollment(null);
            showSuccess('Matrícula atualizada com sucesso!');
        } catch (err) {
            const error = err.response?.data?.message || err.response?.data?.errors || 'Erro ao atualizar matrícula';
            showToast(typeof error === 'object' ? JSON.stringify(error) : error, 'error');
        } finally {
            setFormLoading(false);
        }
    };

    const handleDelete = async (enrollment) => {
        const studentName = enrollment.student?.name || 'Aluno';
        const courseName = enrollment.course?.name || 'Curso';

        if (!confirm(`Tem certeza que deseja cancelar/excluir a matrícula de ${studentName} no curso ${courseName}?`)) {
            return;
        }

        try {
            await api.delete(`/enrollments/${enrollment.id}`);
            await loadData();
            showToast('Matrícula removida com sucesso!', 'success');
        } catch (err) {
            showToast('Erro ao remover matrícula: ' + (err.response?.data?.message || err.message), 'error');
        }
    };

    const showSuccess = (message) => {
        setSuccessMessage(message);
        setTimeout(() => setSuccessMessage(''), 3000);
    };

    const openEditModal = (enrollment) => {
        setEditingEnrollment(enrollment);
        setIsModalOpen(true);
    };

    const openCreateModal = () => {
        setEditingEnrollment(null);
        setIsModalOpen(true);
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(price);
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('pt-BR');
    };

    const getStatusColor = (status) => {
        switch(status) {
            case 'active': return 'bg-green-100 text-green-800';
            case 'completed': return 'bg-blue-100 text-blue-800';
            case 'cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusText = (status) => {
        switch(status) {
            case 'active': return 'Ativo';
            case 'completed': return 'Concluído';
            case 'cancelled': return 'Cancelado';
            default: return status;
        }
    };

    if (loading && enrollments.length === 0) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-gray-500">Carregando matrículas...</div>
            </div>
        );
    }

    return (
        <div className="p-4">
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
            <SearchBar onSearch={handleSearch} placeholder="Pesquisar por aluno ou curso..." className="w-full sm:w-80" />
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Matrículas</h2>
                <button onClick={openCreateModal} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Nova Matrícula
                </button>
            </div>

            {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">{error}</div>}

            {enrollments.length === 0 && !loading ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <p className="text-gray-500">Nenhuma matrícula cadastrada.</p>
                    <button onClick={openCreateModal} className="mt-2 text-blue-600 hover:text-blue-700">Criar primeira matrícula</button>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white rounded-lg overflow-hidden">
                        <thead className="bg-gray-100">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Aluno</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Curso</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Início</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Valor</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Ações</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                        {filteredEnrollments.map(enrollment => (
                            <tr key={enrollment.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{enrollment.student?.name || 'N/A'}</td>
                                <td className="px-6 py-4 text-sm text-gray-900">{enrollment.course?.name || 'N/A'}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatDate(enrollment.start_date)}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">{formatPrice(enrollment.price_paid)}</td>
                                <td className="px-6 py-4 whitespace-nowrap"><span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(enrollment.status)}`}>{getStatusText(enrollment.status)}</span></td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <div className="flex gap-2">
                                        <button onClick={() => openEditModal(enrollment)} className="text-blue-600 hover:text-blue-900" title="Editar">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                        </button>
                                        <button onClick={() => handleDelete(enrollment)} className="text-red-600 hover:text-red-900" title="Excluir">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}

            <Modal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setEditingEnrollment(null); }} title={editingEnrollment ? 'Editar Matrícula' : 'Nova Matrícula'}>
                <EnrollmentForm enrollment={editingEnrollment} students={students} courses={courses} onSubmit={editingEnrollment ? handleUpdate : handleCreate} onCancel={() => { setIsModalOpen(false); setEditingEnrollment(null); }} loading={formLoading} />
            </Modal>
        </div>
    );
}
export default EnrollmentList;
