import { useState, useEffect } from 'react';

function CourseForm({ course, onSubmit, onCancel, loading }) {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        max_students: ''
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (course) {
            setFormData({
                name: course.name || '',
                description: course.description || '',
                price: course.price || '',
                max_students: course.max_students || ''
            });
        }
    }, [course]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault(); //Cancela o comportamento padrão, acredito eu que seria recarregar a página

        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = 'Nome do curso é obrigatório';
        if (!formData.price) newErrors.price = 'Preço é obrigatório';
        if (formData.price && isNaN(formData.price)) newErrors.price = 'Preço deve ser um número';
        if (formData.price && parseFloat(formData.price) < 0) newErrors.price = 'Preço não pode ser negativo';
        if (formData.max_students && isNaN(formData.max_students)) newErrors.max_students = 'Número máximo deve ser um número';
        if (formData.max_students && parseInt(formData.max_students) < 1) newErrors.max_students = 'Mínimo de 1 aluno';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        onSubmit({
            ...formData,
            price: parseFloat(formData.price),
            max_students: formData.max_students ? parseInt(formData.max_students) : null
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome do Curso *
                </label>
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Ex: Inglês Básico"
                    disabled={loading}
                />
                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descrição
                </label>
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Descreva o curso..."
                    disabled={loading}
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Preço (R$) *
                </label>
                <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    step="0.01"
                    min="0"
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.price ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="0.00"
                    disabled={loading}
                />
                {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price}</p>}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Número Máximo de Alunos
                </label>
                <input
                    type="number"
                    name="max_students"
                    value={formData.max_students}
                    onChange={handleChange}
                    min="1"
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.max_students ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Deixe em branco para ilimitado"
                    disabled={loading}
                />
                {errors.max_students && <p className="mt-1 text-sm text-red-600">{errors.max_students}</p>}
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
                    {loading ? 'Salvando...' : course ? 'Atualizar' : 'Salvar'}
                </button>
            </div>
        </form>
    );
}

export default CourseForm;
