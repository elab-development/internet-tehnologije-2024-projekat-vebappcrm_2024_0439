<?php

namespace App\Http\Controllers;

use App\Models\Activity;
use App\Models\User;
use App\Models\Lead;
use App\Models\Opportunity;

use Response;
use Illuminate\Http\Request;

use Illuminate\Support\Facades\Validator;
use App\Http\Resources\ActivityResource;


class ActivityController extends Controller
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
            'assigned_to'=>'required|integer',
            'title'=>'required|string',
            'date'=>'required|string',
        ]);
        if(!$validator->fails())
        {
            $act = new Activity();
            $act->assigned_to = $request->assigned_to;
            $act->title = $request->title;
            $act->date = $request->date;
            $act->owningcompany=auth()->user()->company;
            if($request->owninglead!=null)
            {
                $act->owninglead=$request->owninglead;
            }
            if($request->owningopportunity!=null)
            {
                $act->owningopportunity=$request->owningopportunity;
            }
            if($request->description!=null)
            {
                $act->description = $request->description;
            }
            $act->status=$request->status;
            if($act->save())
            {
                return Response::json(array(
            'code'      =>  200,
            'message'   =>  "Activity created successfully."
             ), 200);
            }
            else
            {
                return Response::json(array(
            'code'      =>  400,
            'message'   =>  "Error creating activity."
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
    public function show($activity_id)
    {
        return Response::json(array('activity'=>new ActivityResource(Activity::find($activity_id)),'code'=>200),200);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Activity $activity)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'activity_id'=>'required|integer'
        ]);
        if(!$validator->fails())
        {
            $act = Activity::find($request->activity_id);
            if($request->assigned_to!=null)
            {
                $act->assigned_to = $request->assigned_to;
            }

            if($request->title!=null)
            {
                $act->title = $request->title;
            }

            if($request->date!=null)
            {
                $act->date = $request->date;
            }
            if($request->description!=null)
            {
                $act->description = $request->description;
            }
            if($request->status!=null)
            {
                $act->status=$request->status;
            }
            if($act->update())
            {
                return Response::json(array(
            'code'      =>  200,
            'message'   =>  "Activity updated successfully."
             ), 200);
            }
            else
            {
                return Response::json(array(
            'code'      =>  400,
            'message'   =>  "Error updating activity."
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
    public function destroy($activity_id)
    {
        if(Activity::find($activity_id)->delete())
        {
            return Response::json(array(
                'code'      =>  200,
                'message'   =>  "Activity deleted successfully."
                 ), 200);
        }
        else
            {
                return Response::json(array(
                'code'      =>  400,
                'message'   =>  "Error deleting activity."
                 ), 400);
            }
    }

}
