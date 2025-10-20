<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Response;
use App\Http\Resources\RoleCollection;
use App\Models\Role;
use Illuminate\Support\Facades\Validator;

class RoleController extends Controller
{
    public function getsysroles()
    {
         return Response::json(array('sysroles'=>new RoleCollection(Role::where('type',0)->get()),'code'=>200),200);
    }    

    public function getcompanyroles()
    {
        return Response::json(array('companyroles'=>new RoleCollection(Role::where('type',[1,2])->get()),'code'=>200),200);
    }
}
