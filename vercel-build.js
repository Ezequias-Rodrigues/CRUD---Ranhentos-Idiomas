import { execSync } from 'child_process';
import fs from 'fs';

console.log('🔨 Iniciando build para Vercel...');

try {
    // Executar build do Vite
    execSync('npx vite build', { stdio: 'inherit' });
} catch (error) {
    console.error('❌ Erro no build:', error);
}

// Criar index.html manualmente
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

// Escrever o arquivo
fs.writeFileSync('dist/index.html', html);
console.log('✅ index.html criado');

console.log('✅ Build finalizado');
