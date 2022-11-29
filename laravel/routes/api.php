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
    return Alert::select('alerts.*', 'sub_accounts.type', 'sub_accounts.name', 'users.firstname', 'users.middlename', 'users.lastname')
        ->join('sub_accounts', function($join) {
            $join->on('alerts.sub_account_id', 'sub_accounts.id');
            $join->join('users', 'sub_accounts.user_id', 'users.id');
        })
        ->get();
});

Route::post('/signup', [AuthenticationController::class, 'signup']);
Route::post('/login', [AuthenticationController::class, 'mobileLogin']);

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
