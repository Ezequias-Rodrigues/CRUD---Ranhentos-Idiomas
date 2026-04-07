import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import StudentList from './components/StudentList';
import CourseList from './components/CourseList';
import EnrollmentList from './components/EnrollmentList';
import Reports from './components/Reports';

function App() {
    return (
        <Router>
            <Layout>
                <Routes>
                    <Route path="/" element={<Navigate to="/students" replace />} />
                    <Route path="/students" element={<StudentList />} />
                    <Route path="/courses" element={<CourseList />} />
                    <Route path="/enrollments" element={<EnrollmentList />} />
                    <Route path="/reports" element={<Reports />} />
                </Routes>
            </Layout>
        </Router>
    );
}

// Tentar renderizar imediatamente
const rootElement = document.getElementById('root');
if (rootElement) {
    ReactDOM.createRoot(rootElement).render(<App />);
} else {
    // Se não achou, aguardar o DOM
    window.addEventListener('DOMContentLoaded', () => {
        const root = document.getElementById('root');
        if (root) {
            ReactDOM.createRoot(root).render(<App />);
        } else {
            console.error('Root element not found');
        }
    });
}

export default App;
