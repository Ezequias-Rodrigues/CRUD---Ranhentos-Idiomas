import { Link, useLocation } from 'react-router-dom';

function Layout({ children }) {
    const location = useLocation();

    const navigation = [
        { name: 'Alunos', href: '/students', icon: '👥' },
        { name: 'Cursos', href: '/courses', icon: '📚' },
        { name: 'Matrículas', href: '/enrollments', icon: '📝' },
        { name: 'Relatórios', href: '/reports', icon: '📊' },
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Navbar */}
            <nav className="bg-white shadow-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <h1 className="text-xl font-bold text-gray-800">
                                🏫 Ranhentos Idiomas
                            </h1>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Menu inferior para mobile / lateral para desktop */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="flex flex-col md:flex-row gap-6">
                    {/* Sidebar / Menu */}
                    <div className="md:w-64 space-y-1">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                to={item.href}
                                className={`flex items-center gap-3 px-4 py-2 rounded-lg transition ${
                                    isActive(item.href)
                                        ? 'bg-blue-600 text-white'
                                        : 'text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                <span className="text-xl">{item.icon}</span>
                                <span>{item.name}</span>
                            </Link>
                        ))}
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 bg-white rounded-lg shadow-md p-6">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Layout;
