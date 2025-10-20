<?php

namespace App\Http\Controllers;

use App\Models\OpportunityStatus;
use Illuminate\Http\Request;
use Response;
use App\Http\Resources\OpportunityStatusCollection;
use Illuminate\Support\Facades\Validator;

class OpportunityStatusController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Response::json(array('opportunitystatuses'=>new OpportunityStatusCollection(OpportunityStatus::all()),'code'=>200),200);
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
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(OpportunityStatus $opportunityStatus)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(OpportunityStatus $opportunityStatus)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, OpportunityStatus $opportunityStatus)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(OpportunityStatus $opportunityStatus)
    {
        //
    }
}
