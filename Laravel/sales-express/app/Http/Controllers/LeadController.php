<?php

namespace App\Http\Controllers;

use App\Models\Lead;
use Illuminate\Http\Request;
use Response;
use App\Http\Resources\LeadCollection;
use App\Http\Resources\LeadResource;
use Illuminate\Support\Facades\Validator;

class LeadController extends Controller
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
            'lastname'=>'required|string',
            'company'=>'required|string',
            'owner'=>'required|integer',
            'title'=>'required|string',
            'email'=>'required|email'
        ]);
        if(!$validator->fails())
        {
            $l = new Lead();
            $l->name=$request->name;
            $l->lastname=$request->lastname;
            $l->company=$request->company;
            $l->owner=$request->owner;
            $l->title=$request->title;
            if($request->description!=null)
            {
                $l->description=$request->description;
            }
            if($request->phone!=null)
            {
                $l->phone=$request->phone;
            }
            $l->email=$request->email;
            $l->owningcompany=auth()->user()->company;
            $l->status=1;
            if($l->save())
            {
                return Response::json(array(
            'code'      =>  200,
            'message'   =>  "Lead created successfully."
             ), 200);
            }
            else
            {
                return Response::json(array(
            'code'      =>  400,
            'message'   =>  "Error creating lead."
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
    public function show($lead_id)
    {
        return Response::json(array('lead'=>new LeadResource(Lead::find($lead_id)),'code'=>200),200);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Lead $lead)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'lead_id'=>'required|integer'
        ]);
        if(!$validator->fails())
        {
            $l = Lead::find($request->lead_id);
            if($request->name!=null)
            {
                $l->name=$request->name;
            }
            if($request->lastname!=null)
            {
                $l->lastname=$request->lastname;
            }
            if($request->company!=null)
            {
                $l->company=$request->company;
            }
            if($request->owner!=null)
            {
                $l->owner=$request->owner;
            }
            if($request->title!=null)
            {
                $l->title=$request->title;
            }
            if($request->description!=null)
            {
                $l->description=$request->description;
            }
            if($request->phone!=null)
            {
                $l->phone=$request->phone;
            }
            if($request->email!=null)
            {
                $l->email=$request->email;
            }
            if($request->status!=null)
            {
                $l->status=$request->status;
            }
            if($l->update())
            {
                return Response::json(array(
                'code'      =>  200,
                'message'   =>  "Lead updated successfully."
                 ), 200);
            }
            else
            {
                return Response::json(array(
                'code'      =>  400,
                'message'   =>  "Error updating lead."
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
    public function destroy($lead_id)
    {
        $l = Lead::find($lead_id);
        $success=true;
        $act = $l->activities;
        foreach($act as $a)
        {
            $success = $a->delete();
        }
        $success = $l->delete();
        if($success==true)
        {
            return Response::json(array(
                'code'      =>  200,
                'message'   =>  "Lead deleted successfully."
                 ), 200);
        }
        else
            {
                return Response::json(array(
                'code'      =>  400,
                'message'   =>  "Error deleting lead."
                 ), 400);
            }
    }

    public function companyleads($companyid)
    {
        return Response::json(array('leads'=>new LeadCollection(Lead::where('owningcompany',$companyid)->get()),'code'=>200),200);
    }

    public function mycompanyleads()
    {
        return Response::json(array('leads'=>new LeadCollection(Lead::where('owningcompany',auth()->user()->company)->get()),'code'=>200),200);
    }

    public function myleads()
    {
        return Response::json(array('leads'=>new LeadCollection(auth()->user()->leads),'code'=>200),200);
    }

    public function userleads($userid)
    {
        return Response::json(array('leads'=>new LeadCollection(Lead::where('owner',$userid)),'code'=>200),200);
    }

    public function searchleads(Request $request)
    {

    }
}
