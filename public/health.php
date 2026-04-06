<?php
// Arquivo simples para testar se o servidor está rodando
echo "Servidor está funcionando!<br>";
echo "PHP Version: " . phpversion() . "<br>";

// Verificar extensões
$extensions = ['pdo_mysql', 'pdo', 'mysqli'];
foreach ($extensions as $ext) {
    echo extension_loaded($ext) ? "$ext carregado<br>" : "$ext não carregado<br>";
}
