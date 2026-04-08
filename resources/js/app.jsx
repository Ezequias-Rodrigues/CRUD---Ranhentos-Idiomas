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



export default App;
