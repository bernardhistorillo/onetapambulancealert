<?php

use App\Http\Controllers\AlertController;
use App\Http\Controllers\AuthenticationController;
use App\Http\Controllers\MedicalRecordController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\ResponderController;
use App\Http\Controllers\SubAccountController;
use App\Http\Controllers\UserController;
use App\Models\Alert;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
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

Route::get('/try', function() {
    return config('filesystems.disks.do.endpoint');
});

Route::post('/signup', [AuthenticationController::class, 'signup']);
Route::post('/login', [AuthenticationController::class, 'mobileLogin']);
Route::post('/requestPasswordReset', [AuthenticationController::class, 'requestPasswordReset']);

Route::post('/getUser', [UserController::class, 'getUser']);
Route::post('/updateUser', [UserController::class, 'updateUser']);

Route::post('/addMedicalRecord', [MedicalRecordController::class, 'addMedicalRecord']);
Route::post('/editMedicalRecord', [MedicalRecordController::class, 'editMedicalRecord']);
Route::post('/deleteMedicalRecord', [MedicalRecordController::class, 'deleteMedicalRecord']);

Route::post('/getResponders', [ResponderController::class, 'getResponders']);

Route::post('/addSubAccount', [SubAccountController::class, 'addSubAccount']);

Route::post('/alert', [AlertController::class, 'alert']);
Route::post('/sendMessage', [MessageController::class, 'sendMessage']);
Route::post('/loadAlert', [AlertController::class, 'loadAlert']);

Route::post('/loadAlerts', [AlertController::class, 'loadAlerts']);
Route::post('/respond', [AlertController::class, 'respond']);
Route::post('/stopResponse', [AlertController::class, 'stopResponse']);
Route::post('/completeResponse', [AlertController::class, 'completeResponse']);

