const { execSync } = import('child_process');
const fs = import('fs');
const path = import('path');



// Garantir que a pasta dist existe
if (!fs.existsSync('dist')) {
    fs.mkdirSync('dist', { recursive: true });
}

// Executar build do Vite
try {
    execSync('npx vite build', { stdio: 'inherit' });
} catch (error) {
    console.error(' Erro no build:', error);
    process.exit(1);
}

// Criar um index.html SIMPLES na pasta dist
const htmlContent = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ranhentos Idiomas</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
        .loading { display: flex; justify-content: center; align-items: center; height: 100vh; font-size: 1.2rem; color: #666; }
    </style>
</head>
<body>
    <div id="root">
        <div class="loading">Carregando Ranhentos Idiomas...</div>
    </div>
    <script type="module">
        import Main from '/assets/main.js';

    </script>
</body>
</html>`;

fs.writeFileSync('dist/index.html', htmlContent);


// Verificar se o arquivo main.js foi gerado
if (!fs.existsSync('dist/assets/main.js')) {

    const fallbackJs = `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '../resources/js/App.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);`;
    fs.writeFileSync('dist/assets/main.js', fallbackJs);

}

