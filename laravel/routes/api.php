<?php

use App\Http\Controllers\AuthenticationController;
use App\Http\Controllers\MedicalRecordController;
use App\Http\Controllers\ResponderController;
use App\Http\Controllers\SubAccountController;
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

Route::post('/addMedicalRecord', [MedicalRecordController::class, 'addMedicalRecord'])->name('user.addMedicalRecord');
Route::post('/editMedicalRecord', [MedicalRecordController::class, 'editMedicalRecord'])->name('user.editMedicalRecord');
Route::post('/deleteMedicalRecord', [MedicalRecordController::class, 'deleteMedicalRecord'])->name('user.deleteMedicalRecord');

Route::post('/getResponders', [ResponderController::class, 'getResponders'])->name('user.getResponders');

Route::post('/addSubAccount', [SubAccountController::class, 'addSubAccount'])->name('user.addSubAccount');
