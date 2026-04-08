import { useState, useEffect } from 'react';

function StudentForm({ student, onSubmit, onCancel, loading }) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: ''
    });
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    // Se tiver student para editar, carrega os dados
    useEffect(() => {
        if (student) {
            setFormData({
                name: student.name || '',
                email: student.email || '',
                phone: student.phone || ''
            });
        }
    }, [student]);

    const validateField = (fieldName, value) => {
        switch (fieldName) {
            case 'name':
                if (!value.trim()) return 'Nome é obrigatório';
                if (value.trim().length < 3) return 'Nome deve ter pelo menos 3 caracteres';
                return '';
            case 'email':
                if (!value.trim()) return 'Email é obrigatório';
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) return 'Email inválido';
                return '';
            case 'phone':
                if (value && !/^\(?[1-9]{2}\)? ?[9]?[0-9]{4}-?[0-9]{4}$/.test(value)) {
                    return 'Telefone inválido';
                }
                return '';
            default:
                return '';
        }
    };

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData(prev => ({...prev, [name]: value}));
        // Limpa o erro do campo quando o usuário começa a digitar
        if (errors[name]) {
            setErrors(prev => ({...prev, [name]: ''}));
        }
    }
    const handleBlur = (e) => {
        const { fieldName, value } = e.target;
        setTouched(prev => ({ ...prev, [fieldName]: true }));
        const error = validateField(fieldName, value);
        setErrors(prev => ({ ...prev, [fieldName]: error }));
    };
    const handleSubmit = (e) => {
        e.preventDefault(); //Cancela ação padrão para implementar a lógica abaixo

        // Validar todos os campos antes de enviar
        const newErrors = {
            name: validateField('name', formData.name),
            email: validateField('email', formData.email),
            phone: validateField('phone', formData.phone)
        };

        setErrors(newErrors);
        setTouched({ name: true, email: true, phone: true });

        const hasErrors = Object.values(newErrors).some(error => error !== '');
        if (hasErrors) return;

        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition
                        ${touched.name && errors.name ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                    placeholder="Digite o nome completo"
                    disabled={loading}
                />
                {touched.name && errors.name && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <span>⚠️</span> {errors.name}
                    </p>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email <span className="text-red-500">*</span>
                </label>
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition
                        ${touched.email && errors.email ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                    placeholder="exemplo@email.com"
                    disabled={loading}
                />
                {touched.email && errors.email && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <span>⚠️</span> {errors.email}
                    </p>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Telefone
                </label>
                <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition
                        ${touched.phone && errors.phone ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                    placeholder="(11) 99999-9999"
                    disabled={loading}
                />
                {touched.phone && errors.phone && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <span>⚠️</span> {errors.phone}
                    </p>
                )}
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
                    {loading ? 'Salvando...' : student ? 'Atualizar' : 'Salvar'}
                </button>
            </div>
        </form>);
}

export default StudentForm;
