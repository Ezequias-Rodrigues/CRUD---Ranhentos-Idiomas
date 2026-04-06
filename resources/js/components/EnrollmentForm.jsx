import { useState, useEffect } from 'react';

function EnrollmentForm({ enrollment, students, courses, onSubmit, onCancel, loading }) {
    const [formData, setFormData] = useState({
        student_id: '',
        course_id: '',
        start_date: '',
        price_paid: '',
        status: 'active'
    });
    const [errors, setErrors] = useState({});
    const [selectedCourse, setSelectedCourse] = useState(null);

    useEffect(() => {
        if (enrollment) {
            setFormData({
                student_id: enrollment.student_id || '',
                course_id: enrollment.course_id || '',
                start_date: enrollment.start_date || '',
                price_paid: enrollment.price_paid || '',
                status: enrollment.status || 'active'
            });
            // Carregar dados do curso selecionado
            const course = courses.find(c => c.id === enrollment.course_id);
            if (course) setSelectedCourse(course);
        }
    }, [enrollment, courses]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Limpar erro do campo
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }

        // Quando selecionar um curso, carregar seus dados
        if (name === 'course_id') {
            const course = courses.find(c => c.id === parseInt(value));
            setSelectedCourse(course);
            // Sugerir o preço do curso como valor padrão
            if (course && !formData.price_paid) {
                setFormData(prev => ({ ...prev, price_paid: course.price }));
            }
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const newErrors = {};
        if (!formData.student_id) newErrors.student_id = 'Selecione um aluno';
        if (!formData.course_id) newErrors.course_id = 'Selecione um curso';
        if (!formData.start_date) newErrors.start_date = 'Data de início é obrigatória';
        if (!formData.price_paid) newErrors.price_paid = 'Valor pago é obrigatório';
        if (formData.price_paid && isNaN(formData.price_paid)) newErrors.price_paid = 'Valor deve ser um número';
        if (formData.price_paid && parseFloat(formData.price_paid) < 0) newErrors.price_paid = 'Valor não pode ser negativo';
        if (!formData.status) newErrors.status = 'Status é obrigatório';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        onSubmit({
            ...formData,
            student_id: parseInt(formData.student_id),
            course_id: parseInt(formData.course_id),
            price_paid: parseFloat(formData.price_paid)
        });
    };

    // Formatar preço para exibição
    const formatPrice = (price) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(price);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Aluno *
                </label>
                <select
                    name="student_id"
                    value={formData.student_id}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.student_id ? 'border-red-500' : 'border-gray-300'
                    }`}
                    disabled={loading}
                >
                    <option value="">Selecione um aluno</option>
                    {students.map(student => (
                        <option key={student.id} value={student.id}>
                            {student.name} - {student.email}
                        </option>
                    ))}
                </select>
                {errors.student_id && <p className="mt-1 text-sm text-red-600">{errors.student_id}</p>}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Curso *
                </label>
                <select
                    name="course_id"
                    value={formData.course_id}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.course_id ? 'border-red-500' : 'border-gray-300'
                    }`}
                    disabled={loading}
                >
                    <option value="">Selecione um curso</option>
                    {courses.map(course => (
                        <option key={course.id} value={course.id}>
                            {course.name} - {formatPrice(course.price)}
                            {course.max_students && ` (Máx: ${course.max_students} alunos)`}
                        </option>
                    ))}
                </select>
                {errors.course_id && <p className="mt-1 text-sm text-red-600">{errors.course_id}</p>}
            </div>

            {selectedCourse && (
                <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-sm text-blue-800">
                        <strong>Informações do Curso:</strong><br />
                        Preço sugerido: {formatPrice(selectedCourse.price)}
                        {selectedCourse.max_students && (
                            <> | Máximo de alunos: {selectedCourse.max_students}</>
                        )}
                    </p>
                </div>
            )}

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Data de Início *
                </label>
                <input
                    type="date"
                    name="start_date"
                    value={formData.start_date}
                    onChange={handleChange}
                    min={new Date().toISOString().split('T')[0]}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.start_date ? 'border-red-500' : 'border-gray-300'
                    }`}
                    disabled={loading}
                />
                {errors.start_date && <p className="mt-1 text-sm text-red-600">{errors.start_date}</p>}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Valor Pago (R$) *
                </label>
                <input
                    type="number"
                    name="price_paid"
                    value={formData.price_paid}
                    onChange={handleChange}
                    step="0.01"
                    min="0"
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.price_paid ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="0.00"
                    disabled={loading}
                />
                {errors.price_paid && <p className="mt-1 text-sm text-red-600">{errors.price_paid}</p>}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status *
                </label>
                <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={loading}
                >
                    <option value="active">Ativo</option>
                    <option value="completed">Concluído</option>
                    <option value="cancelled">Cancelado</option>
                </select>
                {errors.status && <p className="mt-1 text-sm text-red-600">{errors.status}</p>}
            </div>

            <div className="flex justify-end space-x-3 pt-4">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
                    disabled={loading}
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                    disabled={loading}
                >
                    {loading ? 'Salvando...' : enrollment ? 'Atualizar' : 'Salvar'}
                </button>
            </div>
        </form>
    );
}

export default EnrollmentForm;
