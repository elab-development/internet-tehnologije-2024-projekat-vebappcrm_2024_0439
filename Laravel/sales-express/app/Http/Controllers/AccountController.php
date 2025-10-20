<?php

namespace App\Http\Controllers;

use App\Models\Account;
use Illuminate\Http\Request;
use Response;
use App\Http\Resources\AccountResource;
use App\Http\Resources\AccountCollection;
use Illuminate\Support\Facades\Validator;

class AccountController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Response::json(array("data"=>new AccountCollection(Account::where("owningcompany",auth()->user()->company)->get()),"code"=>200),200);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name'=>'required|string',
        ]);
        if(!$validator->fails())
        {
            $a = new Account();
            $a->name=$request->name;
            if($request->billingaddress!=null)
            {   
                $a->billingaddress = $request->billingaddress;
            }
             if($request->website!=null)
            {   
                $a->website = $request->website;
            }
             if($request->industry!=null)
            {   
                $a->industry = $request->industry;
            }
             if($request->phone!=null)
            {   
                $a->phone=$request->phone;
            }
             if($request->email!=null)
            {   
                $a->email=$request->email;
            }
            $a->owningcompany=auth()->user()->company;
            if($a->save())
            {
                return Response::json(array(
            'code'      =>  200,
            'message'   =>  "Account created successfully."
             ), 200);
            }
            else
            {
                return Response::json(array(
            'code'      =>  400,
            'message'   =>  "Error creating account."
             ), 400);
            }
        }
        else
        {
            return Response::json(array(
                'code' => 400,
                'message' => $validator->errors(),
            ), 400);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($account_id)
    {
        return Response::json(array('account'=>new AccountResource(Account::find($account_id)),'code'=>200),200);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Account $account)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'account_id'=>'required|integer'
        ]);
        if(!$validator->fails())
        {
            $a = Account::find($request->account_id);
            if($request->name!=null)
            {
                $a->name=$request->name;
            }
            if($request->billingaddress!=null)
            {
                $a->billingaddress = $request->billingaddress;
            }
            if($request->website!=null)
            {
                $a->website = $request->website;
            }
            if($request->industry!=null)
            {
                $a->industry = $request->industry;
            }
            if($request->phone!=null)
            {
                $a->phone=$request->phone;
            }
            if($request->email!=null)
            {
                $a->email=$request->email;
            }

            if($a->update())
            {
                return Response::json(array(
            'code'      =>  200,
            'message'   =>  "Account created successfully."
             ), 200);
            }
            else
            {
                return Response::json(array(
            'code'      =>  400,
            'message'   =>  "Error creating account."
             ), 400);
            }
        }
        else
        {
            return Response::json(array(
                'code' => 400,
                'message' => $validator->errors(),
            ), 400);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($account_id)
    {
        $a = Account::find($account_id);
        $success = $a->delete();
        if($success==true)
        {
            return Response::json(array(
                'code'      =>  200,
                'message'   =>  "Account deleted successfully."
                 ), 200);
        }
        else
            {
                return Response::json(array(
                'code'      =>  400,
                'message'   =>  "Error deleting account."
                 ), 400);
            }
    }

    public function companyaccounts($companyid)
    {
        return Response::json(array('data'=>new AccountCollection(Account::where('owningcompany',$companyid)->get()),'code'=>200),200);
    }

    public function mycompanyaccounts()
    {
        return Response::json(array('accounts'=>new AccountCollection(Account::where('owningcompany',auth()->user()->company)->get()),'code'=>200),200);
    }

    public function searchaccountbyname(Request $request)
    {
        $a= " ";
        if($request->account!=null)
        {
            $a = $request->account;
        }
        else
        {
            $accounts = Account::where('owningcompany',auth()->user()->company)->get();
            return Response::json(array(
            'accounts' => $accounts,
            'code' => "200",
        ), 200);
        }
        
        $accounts = Account::where('name', 'LIKE', "%".$a."%")->where('owningcompany', auth()->user()->company)->get();
        $accounts = new AccountCollection($accounts);
        if(count($accounts)==0)
        {
            return Response::json(array(
            'message' => "No contacts found",
            'code' => "404",
        ), 404);
        }
        return Response::json(array(
            'accounts' => $accounts,
            'code' => "200",
        ), 200);

    }

}
