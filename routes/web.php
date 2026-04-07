<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json([
        'message' => 'Ranhentos Idiomas API',
        'version' => '1.0',
        'frontend' => 'https://crud-ranhentos-idiomas.vercel.app/'
    ]);
});
Route::get('/debug-db', function() {
    try {
        DB::connection()->getPdo();
        return ' Conexão com banco OK! Banco: ' . DB::connection()->getDatabaseName();
    } catch (Exception $e) {
        return ' Erro: ' . $e->getMessage();
    }
});

Route::get('/debug-env', function() {
    return [
        'APP_ENV' => env('APP_ENV'),
        'APP_DEBUG' => env('APP_DEBUG'),
        'DB_CONNECTION' => env('DB_CONNECTION'),
        'DB_HOST' => env('DB_HOST'),
        'DB_DATABASE' => env('DB_DATABASE'),
    ];
});
