<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;

use App\Http\Controllers\RoleController;
use App\Http\Controllers\LeadStatusController;

Route::group(['middleware' => ['auth:sanctum']], function () {
    });
    

    
    Route::post('/login', [AuthController::class, 'login']);
Route::post('/registermanager', [AuthController::class, 'register_manager']);
Route::post('/registeremployee/{companyid}', [AuthController::class, 'register_employee']);
Route::post('/forgotpassword', [AuthController::class,'makepasswordresettoken']);
Route::post('/newpassword', [AuthController::class, 'resetpassword']);
