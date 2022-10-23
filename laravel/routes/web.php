<?php

use App\Http\Controllers\AuthenticationController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\IncidentReportController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::middleware(['guest'])->group(function() {
    Route::get('/login', [AuthenticationController::class, 'loginPage'])->name('auth.loginPage');
    Route::post('/login', [AuthenticationController::class, 'login'])->name('auth.login');
});

Route::middleware(['auth'])->group(function() {
    Route::get('/logout', [AuthenticationController::class, 'logout'])->name('auth.logout');

    Route::get('/', [HomeController::class, 'index'])->name('home.index');
    Route::get('/users', [UserController::class, 'index'])->name('users.index');
    Route::get('/incident_reports', [IncidentReportController::class, 'index'])->name('incident_reports.index');
});
