import React from 'react';
import ReactDOM from 'react-dom/client';

function Teste() {
    return React.createElement('h1', null, 'TESTE FUNCIONOU!');
}

const root = document.getElementById('root');
if (root) {
    ReactDOM.createRoot(root).render(React.createElement(Teste));
} else {
    console.error('root não encontrado');
}
