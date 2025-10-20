<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CompanyInfoController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\OpportunityStatusController;
use App\Http\Controllers\OpportunityController;
use App\Http\Controllers\LeadStatusController;
use App\Http\Controllers\LeadController;

Route::group(['middleware' => ['auth:sanctum']], function () {

     Route::get('/user',[AuthController::class,'me']);
    Route::get('/user/{user_id}',[AuthController::class,'show']);
    Route::get('/mycompanyemployees',[AuthController::class,'mycompanyemployees']);
    Route::delete('/deleteuser/{user_id}',[AuthController::class,'destroy']);
    Route::put('/updateuser',[AuthController::class,'update']);

    Route::post('/logoff',[AuthController::class,'logoff']);

    Route::patch('/updatemyprofile',[AuthController::class,'updatemyprofile']);
    Route::patch('/updateuser',[AuthController::class,'update']);
    
    Route::post('/searchuserbyname',[AuthController::class,'searchuserbyname']);
    
    Route::get('/mycompany',[CompanyInfoController::class,'mycompany']);
    Route::post('/updatecompany',[CompanyInfoController::class,'update']);
    Route::get('/sysroles',[RoleController::class,'getsysroles']);
    Route::get('/companyroles',[RoleController::class,'getcompanyroles']);
     Route::get('/opportunitystatuses',[OpportunityStatusController::class,'index']);
    Route::get('/leadstatuses',[LeadStatusController::class,'index']);

     Route::get('/lead/{lead_id}',[LeadController::class,'show']);
    Route::post('/newlead',[LeadController::class,'store']);
    Route::post('/convertlead',[OpportunityController::class,'convertlead']);
    Route::patch('/updatelead',[LeadController::class,'update']);
    Route::get('/mycompanyleads',[LeadController::class,'mycompanyleads']);
    Route::delete('/deletelead/{lead_id}',[LeadController::class,'destroy']);


    Route::get('/opportunity/{opportunity_id}',[OpportunityController::class,'show']);
    Route::get('/mycompanyopportunities',[OpportunityController::class,'mycompanyopts']);
    Route::patch('/updateopportunity',[OpportunityController::class,'update']);
    Route::delete('/deleteopportunity/{opportunity_id}',[OpportunityController::class,'destroy']);

    });
    

    
    Route::post('/login', [AuthController::class, 'login']);
Route::post('/registermanager', [AuthController::class, 'register_manager']);
Route::post('/registeremployee/{companyid}', [AuthController::class, 'register_employee']);
Route::post('/forgotpassword', [AuthController::class,'makepasswordresettoken']);
Route::post('/newpassword', [AuthController::class, 'resetpassword']);
