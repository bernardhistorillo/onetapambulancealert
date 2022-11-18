<?php

use App\Http\Controllers\AuthenticationController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::post('/signup', [AuthenticationController::class, 'signup'])->name('auth.signup');
Route::post('/login', [AuthenticationController::class, 'mobileLogin'])->name('auth.login');

Route::post('/updateUser', [UserController::class, 'updateUser'])->name('user.updateUser');
