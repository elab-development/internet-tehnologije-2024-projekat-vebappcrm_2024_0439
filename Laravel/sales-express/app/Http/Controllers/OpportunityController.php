<?php

namespace App\Http\Controllers;

use App\Models\Opportunity;
use App\Models\Contact;
use App\Models\Account;
use App\Models\Lead;
use Illuminate\Http\Request;
use Response;
use App\Http\Resources\OpportunityCollection;
use App\Http\Resources\OpportunityResource;
use Illuminate\Support\Facades\Validator;

class OpportunityController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
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
            'contact'=>'required|integer',
            'account'=>'required|integer',
            'owner'=>'required|integer',
            'title'=>'required|string',
            'description'=>'required|string',
            'phone'=>'required|string',
            'email'=>'required|email'
        ]);
        if(!$validator->fails())
        {
            $o = new Opportunity();
            $o->name=$request->name;
            $o->lastname=$request->lastname;
            $o->company=$request->company;
            $o->owner=$request->owner;
            $o->title=$request->title;
            $o->description=$request->description;
            $o->phone=$request->phone;
            $o->email=$request->email;
            $o->owningcompany=auth()->user()->company;
            $o->status=1;

            if($l->save())
            {
                return Response::json(array(
            'code'      =>  200,
            'message'   =>  "Opportunity created successfully."
             ), 200);
            }
            else
            {
                return Response::json(array(
            'code'      =>  400,
            'message'   =>  "Error creating opportunity."
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
    public function show($opportunity_id)
    {
        return Response::json(array('opportunity'=>new OpportunityResource(Opportunity::find($opportunity_id)),'code'=>200),200);
    }
    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Opportunity $opportunity)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Opportunity $opportunity)
    {
        $validator = Validator::make($request->all(), [
            'opportunity_id'=>'required|integer'
        ]);
        if(!$validator->fails())
        {
            $o = Opportunity::find($request->opportunity_id);
            if($request->account!=null)
            {
                $o->account=$request->account;
            }
            if($request->owner!=null)
            {
                $o->owner=$request->owner;
            }
            if($request->contact!=null)
            {
                $o->contact=$request->contact;
            }
            if($request->title!=null)
            {
                $o->title=$request->title;
            }
            if($request->description!=null)
            {
                $o->description=$request->description;
            }
            if($request->status!=null)
            {
                $o->status=$request->status;
            }

            if($o->update())
            {
                return Response::json(array(
            'code'      =>  200,
            'message'   =>  "Opportunity updated successfully."
             ), 200);
            }
            else
            {
                return Response::json(array(
            'code'      =>  400,
            'message'   =>  "Error creating opportunity."
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
    public function destroy($opportunity_id)
    {
        $o = Opportunity::find($opportunity_id);
        $success=true;
        $act = $o->activities;
        foreach($act as $a)
        {
            $success = $a->delete();
        }
        $success = $o->delete();
        if($success==true)
        {
            return Response::json(array(
                'code'      =>  200,
                'message'   =>  "Opportunity deleted successfully."
                 ), 200);
        }
        else
            {
                return Response::json(array(
                'code'      =>  400,
                'message'   =>  "Error deleting opportunity."
                 ), 400);
            }
    }

    public function convertlead(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'lead_id'=>'required|integer'
        ]);
        if(!$validator->fails())
        {
            $success = true;
            
            $lead_id = $request->lead_id;
            $l = Lead::find($lead_id);
            $a = Account::where('name',$l->company)->first();
            $c=null;
            if($a!=null)
            {
                $c = Contact::where('firstname', $l->name)->where('lastname', $l->lastname)->where('account', $l->account)->first();
                if($c==null)
                {
                $c = new Contact();
                $c->firstname = $l->name;
                $c->lastname=$l->lastname;
                $c->email=$l->email;
                $c->phone=$l->phone;
                $c->owningcompany=auth()->user()->company;
                $c->account = $a->id;
                $success = $c->save();
                }
            }
            else
            {
                $a= new Account();
                $a->name = $l->company;
                $a->owningcompany=auth()->user()->company;
                $success = $a->save();
                $c = new Contact();
                $c->firstname = $l->name;
                $c->lastname=$l->lastname;
                $c->email=$l->email;
                $c->phone=$l->phone;
                $c->owningcompany=auth()->user()->company;
                $c->account = $a->id;
                $success = $c->save();
                
            }

            $o = new Opportunity();
            $o->owningcompany=auth()->user()->company;
            $o->owner=$l->owner;
            $o->title=$l->title;
            $o->description=$l->description;
            $o->account = $a->id;
            $o->contact = $c->id;
            $o->status=1;
            $success = $o->save();

            foreach($l->activities as $act)
            {
                $act->owninglead=null;
                $act->owningopportunity=$o->id;
                $success = $act->update();
            }
            
            $success = $l->delete();
            
            if($success)
            {
                return Response::json(array(
            'code'      =>  200,
            'message'   =>  "Lead converted successfully."
             ), 200);
            }
            else
            {
                return Response::json(array(
            'code'      =>  400,
            'message'   =>  "Error converting lead."
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

    public function companyopts($companyid)
    {
        return Response::json(array('opportunities'=>new OpportunityCollection(Opportunity::where('owningcompany',$companyid)->get()),'code'=>200),200);
    }

    public function mycompanyopts()
    {
        return Response::json(array('opportunities'=>new OpportunityCollection(Opportunity::where('owningcompany',auth()->user()->company)->get()),'code'=>200),200);
    }

    public function myopts()
    {
        return Response::json(array('opportunities'=>new OpportunityCollection(auth()->user()->opportunities),'code'=>200),200);
    }

    public function useropts($userid)
    {
        return Response::json(array('opportunities'=>new OpportunityCollection(Opportunity::where('owner',$userid)),'code'=>200),200);
    }

    public function searchopts(Request $request)
    {

    }
}
