import { useState, useEffect } from 'react';
import api from '../services/api';
import { Bar, Pie, Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    PointElement,
    LineElement
} from 'chart.js';

// Registrar componentes do Chart.js
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    PointElement,
    LineElement
);

function Reports() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [investmentData, setInvestmentData] = useState([]);
    const [popularCourses, setPopularCourses] = useState([]);
    const [revenueData, setRevenueData] = useState([]);
    const [summary, setSummary] = useState({});

    // Carregar todos os relatórios
    const loadReports = async () => {
        setLoading(true);
        try {
            const [investmentRes, popularRes, revenueRes] = await Promise.all([
                api.get('/reports/investment-per-student'),
                api.get('/reports/popular-courses'),
                api.get('/reports/revenue-per-course')
            ]);

            setInvestmentData(investmentRes.data.data || []);
            setPopularCourses(popularRes.data.data || []);
            setRevenueData(revenueRes.data.data || []);
            setSummary(investmentRes.data.summary || {});
            setError(null);
        } catch (err) {
            setError('Erro ao carregar relatórios: ' + (err.response?.data?.message || err.message));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadReports();
    }, []);

    // Configuração do gráfico de investimento por aluno (Bar)
    const investmentChartData = {
        labels: investmentData.map(item => item.student_name),
        datasets: [
            {
                label: 'Total Investido (R$)',
                data: investmentData.map(item => item.total_invested),
                backgroundColor: 'rgba(54, 162, 235, 0.6)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
            },
            {
                label: 'Média por Curso (R$)',
                data: investmentData.map(item => item.total_courses > 0 ? item.total_invested / item.total_courses : 0),
                backgroundColor: 'rgba(255, 99, 132, 0.6)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1,
            }
        ],
    };

    // Configuração do gráfico de cursos populares (Bar)
    const popularCoursesChartData = {
        labels: popularCourses.map(item => item.name),
        datasets: [
            {
                label: 'Total de Matrículas',
                data: popularCourses.map(item => item.total_enrollments),
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },
            {
                label: 'Matrículas Ativas',
                data: popularCourses.map(item => item.active_enrollments),
                backgroundColor: 'rgba(54, 162, 235, 0.6)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
            }
        ],
    };

    // Configuração do gráfico de faturamento (Pie)
    const revenueChartData = {
        labels: revenueData.map(item => item.course_name),
        datasets: [
            {
                label: 'Faturamento Total (R$)',
                data: revenueData.map(item => item.total_revenue),
                backgroundColor: [
                    'rgba(255, 99, 132, 0.6)',
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(255, 206, 86, 0.6)',
                    'rgba(75, 192, 192, 0.6)',
                    'rgba(153, 102, 255, 0.6)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                ],
                borderWidth: 1,
            },
        ],
    };

    // Opções dos gráficos
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                font: {
                    size: 16
                }
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        let label = context.dataset.label || '';
                        if (label) {
                            label += ': ';
                        }
                        if (context.parsed.y !== undefined) {
                            label += new Intl.NumberFormat('pt-BR', {
                                style: 'currency',
                                currency: 'BRL'
                            }).format(context.parsed.y);
                        } else if (context.parsed !== undefined) {
                            label += new Intl.NumberFormat('pt-BR', {
                                style: 'currency',
                                currency: 'BRL'
                            }).format(context.parsed);
                        }
                        return label;
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    callback: function(value) {
                        return new Intl.NumberFormat('pt-BR', {
                            style: 'currency',
                            currency: 'BRL'
                        }).format(value);
                    }
                }
            }
        }
    };

    const pieOptions = {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                font: {
                    size: 16
                }
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        const label = context.label || '';
                        const value = context.parsed || 0;
                        const total = context.dataset.data.reduce((a, b) => a + b, 0);
                        const percentage = ((value / total) * 100).toFixed(1);
                        return `${label}: ${new Intl.NumberFormat('pt-BR', {
                            style: 'currency',
                            currency: 'BRL'
                        }).format(value)} (${percentage}%)`;
                    }
                }
            }
        }
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

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-gray-500">Carregando relatórios...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4">
                <div className="p-3 bg-red-100 text-red-700 rounded-lg border border-red-200">
                    {error}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Cards de Resumo */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg p-6 shadow-lg">
                    <div className="text-sm uppercase tracking-wide">Total de Alunos</div>
                    <div className="text-3xl font-bold mt-2">{summary.total_students || 0}</div>
                    <div className="text-sm mt-2 opacity-80">Alunos cadastrados</div>
                </div>
                <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg p-6 shadow-lg">
                    <div className="text-sm uppercase tracking-wide">Total de Cursos</div>
                    <div className="text-3xl font-bold mt-2">{summary.total_courses || 0}</div>
                    <div className="text-sm mt-2 opacity-80">Cursos disponíveis</div>
                </div>
                <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg p-6 shadow-lg">
                    <div className="text-sm uppercase tracking-wide">Faturamento Total</div>
                    <div className="text-3xl font-bold mt-2">{formatPrice(summary.total_revenue || 0)}</div>
                    <div className="text-sm mt-2 opacity-80">Receita total</div>
                </div>
            </div>

            {/* Relatório 1: Total investido por aluno */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                    📊 Total Investido por Aluno
                </h2>
                {investmentData.length > 0 ? (
                    <>
                        <div className="h-96">
                            <Bar data={investmentChartData} options={{
                                ...chartOptions,
                                plugins: {
                                    ...chartOptions.plugins,
                                    title: {
                                        ...chartOptions.plugins.title,
                                        text: 'Investimento por Aluno'
                                    }
                                }
                            }} />
                        </div>
                        <div className="mt-6 overflow-x-auto">
                            <table className="min-w-full">
                                <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Aluno</th>
                                    <th className="px-4 py-2 text-right text-sm font-medium text-gray-500">Total Investido</th>
                                    <th className="px-4 py-2 text-right text-sm font-medium text-gray-500">Total Cursos</th>
                                    <th className="px-4 py-2 text-right text-sm font-medium text-gray-500">Média por Curso</th>
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                {investmentData.map((item, index) => (
                                    <tr key={index} className="hover:bg-gray-50">
                                        <td className="px-4 py-2 text-sm text-gray-900">{item.student_name}</td>
                                        <td className="px-4 py-2 text-sm text-right font-semibold text-green-600">
                                            {formatPrice(item.total_invested)}
                                        </td>
                                        <td className="px-4 py-2 text-sm text-right">{item.total_courses}</td>
                                        <td className="px-4 py-2 text-sm text-right">
                                            {formatPrice(item.total_invested / item.total_courses)}
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                ) : (
                    <p className="text-gray-500 text-center py-8">Nenhum dado disponível</p>
                )}
            </div>

            {/* Relatório 2: Cursos com mais alunos */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                    🎓 Cursos com Mais Alunos
                </h2>
                {popularCourses.length > 0 ? (
                    <>
                        <div className="h-96">
                            <Bar data={popularCoursesChartData} options={{
                                ...chartOptions,
                                plugins: {
                                    ...chartOptions.plugins,
                                    title: {
                                        ...chartOptions.plugins.title,
                                        text: 'Popularidade dos Cursos'
                                    }
                                }
                            }} />
                        </div>
                        <div className="mt-6 overflow-x-auto">
                            <table className="min-w-full">
                                <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Curso</th>
                                    <th className="px-4 py-2 text-right text-sm font-medium text-gray-500">Total Matrículas</th>
                                    <th className="px-4 py-2 text-right text-sm font-medium text-gray-500">Ativas</th>
                                    <th className="px-4 py-2 text-right text-sm font-medium text-gray-500">Concluídas</th>
                                    <th className="px-4 py-2 text-right text-sm font-medium text-gray-500">Canceladas</th>
                                    <th className="px-4 py-2 text-right text-sm font-medium text-gray-500">Ocupação</th>
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                {popularCourses.map((course, index) => (
                                    <tr key={index} className="hover:bg-gray-50">
                                        <td className="px-4 py-2 text-sm text-gray-900">{course.name}</td>
                                        <td className="px-4 py-2 text-sm text-right font-semibold">{course.total_enrollments}</td>
                                        <td className="px-4 py-2 text-sm text-right text-green-600">{course.active_enrollments}</td>
                                        <td className="px-4 py-2 text-sm text-right text-blue-600">{course.completed_enrollments}</td>
                                        <td className="px-4 py-2 text-sm text-right text-red-600">{course.cancelled_enrollments}</td>
                                        <td className="px-4 py-2 text-sm text-right">
                                            {course.occupancy_percentage ? `${course.occupancy_percentage}%` : 'Ilimitado'}
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                ) : (
                    <p className="text-gray-500 text-center py-8">Nenhum dado disponível</p>
                )}
            </div>

            {/* Relatório 3: Faturamento por curso */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                    💰 Faturamento Total por Curso
                </h2>
                {revenueData.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="h-96">
                            <Pie data={revenueChartData} options={pieOptions} />
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full">
                                <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Curso</th>
                                    <th className="px-4 py-2 text-right text-sm font-medium text-gray-500">Faturamento Total</th>
                                    <th className="px-4 py-2 text-right text-sm font-medium text-gray-500">Matrículas</th>
                                    <th className="px-4 py-2 text-right text-sm font-medium text-gray-500">Ticket Médio</th>
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                {revenueData.map((course, index) => (
                                    <tr key={index} className="hover:bg-gray-50">
                                        <td className="px-4 py-2 text-sm text-gray-900">{course.course_name}</td>
                                        <td className="px-4 py-2 text-sm text-right font-semibold text-green-600">
                                            {formatPrice(course.total_revenue)}
                                        </td>
                                        <td className="px-4 py-2 text-sm text-right">{course.total_enrollments}</td>
                                        <td className="px-4 py-2 text-sm text-right">
                                            {formatPrice(course.average_ticket)}
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                                <tfoot className="bg-gray-50 font-bold">
                                <tr>
                                    <td className="px-4 py-2 text-sm">Total Geral</td>
                                    <td className="px-4 py-2 text-sm text-right text-green-700">
                                        {formatPrice(revenueData.reduce((sum, item) => sum + item.total_revenue, 0))}
                                    </td>
                                    <td className="px-4 py-2 text-sm text-right">
                                        {revenueData.reduce((sum, item) => sum + item.total_enrollments, 0)}
                                    </td>
                                    <td className="px-4 py-2 text-sm text-right"></td>
                                </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>
                ) : (
                    <p className="text-gray-500 text-center py-8">Nenhum dado disponível</p>
                )}
            </div>
        </div>
    );
}

export default Reports;
