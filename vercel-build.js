import { execSync } from 'child_process';
import fs from 'fs';

console.log('🔨 Iniciando build...');

// Executar build
try {
    execSync('npx vite build', { stdio: 'inherit' });
} catch (error) {
    console.error('Erro no build:', error);
}

// Verificar se o index.html foi criado na pasta dist
if (!fs.existsSync('dist/index.html')) {
    console.log('⚠️ index.html não encontrado, criando...');
    const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ranhentos Idiomas</title>
</head>
<body>
    <div id="root"></div>
    <script type="module" src="/assets/main.js"></script>
</body>
</html>`;
    fs.writeFileSync('dist/index.html', html);
}

console.log('✅ Build concluído!');
