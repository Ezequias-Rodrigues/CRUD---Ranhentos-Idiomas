import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ReactDOM from 'react-dom/client';
import Layout from './components/Layout';
import StudentList from './components/StudentList';

// Placeholders para outras páginas (vamos implementar depois)
const CoursesList = () => <div className="text-center py-8">Página de Cursos</div>;
const EnrollmentsList = () => <div className="text-center py-8">Página de Matrículas</div>;
const ReportsPage = () => <div className="text-center py-8">Página de Relatórios</div>;

function App() {
    return (
        <Router>
            <Layout>
                <Routes>
                    <Route path="/" element={<Navigate to="/students" replace />} />
                    <Route path="/students" element={<StudentList />} />
                    <Route path="/courses" element={<CoursesList />} />
                    <Route path="/enrollments" element={<EnrollmentsList />} />
                    <Route path="/reports" element={<ReportsPage />} />
                </Routes>
            </Layout>
        </Router>
    );
}
ReactDOM.createRoot(document.getElementById('app')).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
export default App;
