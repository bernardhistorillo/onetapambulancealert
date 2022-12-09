<?php

use App\Http\Controllers\AlertController;
use App\Http\Controllers\AuthenticationController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\ResponderController;
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
    Route::get('/', [AuthenticationController::class, 'loginPage'])->name('auth.loginPage');
    Route::post('/login', [AuthenticationController::class, 'login'])->name('auth.login');
});

Route::middleware(['auth'])->group(function() {
    Route::get('/logout', [AuthenticationController::class, 'logout'])->name('auth.logout');

    Route::get('/dashboard', [HomeController::class, 'index'])->name('dashboard.index');

    Route::get('/users', [UserController::class, 'index'])->name('users.index');
    Route::post('/editRole', [UserController::class, 'editRole'])->name('users.editRole');

    Route::get('/responders', [ResponderController::class, 'index'])->name('responders.index');
    Route::post('/addResponder', [ResponderController::class, 'addResponder'])->name('responders.add');
    Route::post('/editResponder', [ResponderController::class, 'editResponder'])->name('responders.edit');

    Route::get('/alerts', [AlertController::class, 'index'])->name('alerts.index');
});
