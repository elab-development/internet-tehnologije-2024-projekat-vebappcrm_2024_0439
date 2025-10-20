<?php

namespace App\Http\Controllers;

use App\Models\CompanyInfo;
use App\Http\Resources\CompanyInfoResource;
use Illuminate\Http\Request;
use Response;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;
class CompanyInfoController extends Controller
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
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(CompanyInfo $companyInfo)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(CompanyInfo $companyInfo)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
public function update(Request $request)
{
    $ci = CompanyInfo::find(auth()->user()->company);
    $path = "";
    $z = "";

    if ($request->name != null)
        $ci->name = $request->name;

    if ($request->address != null)
        $ci->address = $request->address;

    if ($request->description != null)
        $ci->description = $request->description;

    if ($request->hasFile('imgpath')) {
        $path = $request->file('imgpath')->store("images");
        $ci->imgpath = $path;
    }

    if ($ci->save()) {
        return response()->json([
            "message" => "Successfully updated company info ".$z,
            "path" => $path,
            "code" => 200
        ]);
    }

    return response()->json(["message" => "Error updating company info", "code" => 400], 400);
}

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(CompanyInfo $companyInfo)
    {
        //
    }

    public function mycompany()
    {
        return Response::json(array('company'=>new CompanyInfoResource(auth()->user()->companyinfo),'code'=>200),200);
    }
}
