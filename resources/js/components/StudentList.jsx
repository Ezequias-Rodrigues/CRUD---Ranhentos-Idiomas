import { useState, useEffect } from 'react';
import api from '../services/api';
import StudentForm from './StudentForm';
import Modal from './Modal';
import Toast from "./Toast.jsx";
import SearchBar from "./SearchBar.jsx";

function StudentList() {
    const [students, setStudents] = useState([]);
    const [filteredStudents, setFilteredStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [toast, setToast] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    // Estados do modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingStudent, setEditingStudent] = useState(null);
    const [formLoading, setFormLoading] = useState(false);

    const showToast = (message, type) => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };
    // Carregar alunos
    const loadStudents = async () => {
        setLoading(true);
        try {
            const response = await api.get('/students');
            setStudents(response.data);
            setFilteredStudents(response.data);
            setError(null);
        } catch (err) {
            setError('Erro ao carregar alunos: ' + (err.response?.data?.message || err.message));
            showToast('Erro ao carregar alunos', 'error')
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadStudents();
    }, []);
    const handleSearch = (term) => {
        setSearchTerm(term);
        if (!term.trim()) {
            setFilteredStudents(students);
            return;
        }

        const lowercasedTerm = term.toLowerCase();
        const filtered = students.filter(student =>
            student.name.toLowerCase().includes(lowercasedTerm) ||
            student.email.toLowerCase().includes(lowercasedTerm) ||
            (student.phone && student.phone.includes(term))
        );
        setFilteredStudents(filtered);
    };
    // Criar aluno
    const handleCreate = async (data) => {
        setFormLoading(true);
        try {
            await api.post('/students', data);
            await loadStudents();
            setIsModalOpen(false);
            showToast('Aluno criado com sucesso!', 'success');
        } catch (err) {
            const error = err.response?.data?.errors || err.response?.data?.message || 'Erro ao criar aluno';
            showToast(error, 'error');
        } finally {
            setFormLoading(false);
        }
    };

    // Atualizar aluno
    const handleUpdate = async (data) => {
        setFormLoading(true);
        try {
            await api.put(`/students/${editingStudent.id}`, data);
            await loadStudents();
            setIsModalOpen(false);
            setEditingStudent(null);
            showToast('Aluno atualizado com sucesso!', 'success');
        } catch (err) {
            const error = err.response?.data?.errors || err.response?.data?.message || 'Erro ao atualizar aluno';
            showToast(error, 'error');
        } finally {
            setFormLoading(false);
        }
    };

    // Deletar aluno
    const handleDelete = async (student) => {
        if (!confirm(`Tem certeza que deseja excluir o aluno "${student.name}"?`)) {
            return;
        }

        try {
            await api.delete(`/students/${student.id}`);
            await loadStudents();
            showToast('Aluno excluído com sucesso!', 'success');
        } catch (err) {
            showToast('Erro ao excluir aluno', 'error');
        }
    };


    // Abrir modal para editar
    const openEditModal = (student) => {
        setEditingStudent(student);
        setIsModalOpen(true);
    };

    // Abrir modal para criar
    const openCreateModal = () => {
        setEditingStudent(null);
        setIsModalOpen(true);
    };

    if (loading && students.length === 0) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-gray-500">Carregando alunos...</div>
            </div>
        );
    }

    return (
        <div className="p-4">
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Alunos</h2>
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                    <SearchBar
                        onSearch={handleSearch}
                        placeholder="Pesquisar por nome, email ou telefone..."
                        className="w-full sm:w-80"
                    />
                    <button
                        onClick={openCreateModal}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2 justify-center"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Novo Aluno
                    </button>
                </div>
            </div>

            {searchTerm && (
                <div className="mb-4 text-sm text-gray-500">
                    {filteredStudents.length} resultado(s) encontrado(s) para "{searchTerm}"
                </div>
            )}

            {error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg border border-red-200">
                    {error}
                </div>
            )}

            {filteredStudents.length === 0 && !loading ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <p className="text-gray-500">
                        {searchTerm ? `Nenhum aluno encontrado para "${searchTerm}"` : 'Nenhum aluno cadastrado.'}
                    </p>
                    {!searchTerm && (
                        <button onClick={openCreateModal} className="mt-2 text-blue-600 hover:text-blue-700">
                            Clique aqui para criar o primeiro aluno
                        </button>
                    )}
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {filteredStudents.map(student => (
                        <div key={student.id} className="bg-white rounded-lg shadow-md border border-gray-200 p-4 hover:shadow-lg transition">
                            <div className="flex justify-between items-start gap-2">
                                <div className="flex-1 min-w-0"> {/*  min-w-0 pra truncar */}
                                    <h3 className="font-semibold text-lg text-gray-800 break-words"> { /*break words */}
                                        {student.name}
                                    </h3>
                                    <p className="text-gray-600 text-sm mt-1 break-words">{student.email}</p>
                                    {student.phone && (
                                        <p className="text-gray-500 text-sm mt-1 break-words">{student.phone}</p>
                                    )}
                                </div>
                                <div className="flex gap-2 flex-shrink-0"> {}
                                    <button
                                        onClick={() => openEditModal(student)}
                                        className="text-blue-600 hover:text-blue-800 transition p-1"
                                        title="Editar"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                    </button>
                                    <button
                                        onClick={() => handleDelete(student)}
                                        className="text-red-600 hover:text-red-800 transition p-1"
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

            <Modal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setEditingStudent(null); }} title={editingStudent ? 'Editar Aluno' : 'Novo Aluno'}>
                <StudentForm student={editingStudent} onSubmit={editingStudent ? handleUpdate : handleCreate} onCancel={() => { setIsModalOpen(false); setEditingStudent(null); }} loading={formLoading} />
            </Modal>
        </div>
    );
}

export default StudentList;
