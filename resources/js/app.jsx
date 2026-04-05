import React from 'react';
import ReactDOM from 'react-dom/client';
import StudentList from './components/StudentList';

function App() {
    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="bg-white shadow p-4">
                <h1 className="text-xl font-bold">Ranhentos Idiomas</h1>
            </nav>
            <main>
                <StudentList />
            </main>
        </div>
    );
}
const root = ReactDOM.createRoot(document.getElementById('app'));
root.render(<App />);
export default App;
