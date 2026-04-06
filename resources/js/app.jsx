import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ReactDOM from 'react-dom/client';
import Layout from './components/Layout';
import StudentList from './components/StudentList';
import CourseList from "./components/CourseList.jsx";
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
ReactDOM.createRoot(document.getElementById('app')).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
export default App;
