const { execSync } = require('child_process');
const fs = require('fs');
//Script criado pq o vercel tava dando 404, deletando o index.html e não gerando ele de volta

// Executar build do Vite
try {
    execSync('npx vite build', { stdio: 'inherit' });
} catch (error) {
    console.error('Erro no build:', error);
    process.exit(1);
}

// Garantir que a pasta dist existe
if (!fs.existsSync('dist')) {
    fs.mkdirSync('dist');
}

// Criar index.html se não existir
if (!fs.existsSync('dist/index.html')) {
    const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ranhentos Idiomas</title>
</head>
<body>
    <div id="root"></div>
    <script type="module" src="/assets/index.js"></script>
</body>
</html>`;

    fs.writeFileSync('dist/index.html', html);
}

