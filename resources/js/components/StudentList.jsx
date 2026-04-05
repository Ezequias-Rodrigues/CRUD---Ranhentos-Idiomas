import { useState, useEffect } from 'react';
import axios from 'axios';

function StudentList() {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios.get('/api/students')
            .then(response => {
                setStudents(response.data);
                setLoading(false);
            })
            .catch(err => {
                setError('Erro ao carregar alunos');
                setLoading(false);
            });
    }, []);

    if (loading) return <div className="p-4">Carregando...</div>;
    if (error) return <div className="p-4 text-red-500">{error}</div>;

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Lista de Alunos</h2>
            <div className="space-y-2">
                {students.map(student => (
                    <div key={student.id} className="border p-3 rounded">
                        <p className="font-semibold">{student.name}</p>
                        <p className="text-gray-600">{student.email}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default StudentList;
