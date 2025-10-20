<?php

namespace App\Http\Controllers;

use App\Models\Contact;
use Illuminate\Http\Request;
use Response;
use App\Http\Resources\ContactResource;
use App\Http\Resources\ContactCollection;
use Illuminate\Support\Facades\Validator;

class ContactController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {

        return Response::json(array("data"=>new ContactCollection(Contact::where("owningcompany",auth()->user()->company)->get()),"code"=>200),200);
        
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
         $validator = Validator::make($request->all(), [
            'firstname'=>'required|string',
            'lastname'=>'required|string',
            'account'=>'required|integer',
        ]);
        if(!$validator->fails())
        {
            $c = new Contact();
            $c->firstname=$request->firstname;
            $c->lastname=$request->lastname;
            $c->account=$request->account;
                        if($request->title!=null)
            {
                $c->title=$request->title;
            }
            if($request->mobile!=null)
            {
                $c->mobile=$request->mobile;
            }
            if($request->phone!=null)
            {
                $c->phone=$request->phone;
            }
            if($request->email!=null)
            {
                $c->email=$request->email;
            }
            $c->owningcompany=auth()->user()->company;
            if($c->save())
            {
                return Response::json(array(
            'code'      =>  200,
            'message'   =>  "Contact created successfully."
             ), 200);
            }
            else
            {
                return Response::json(array(
            'code'      =>  400,
            'message'   =>  "Error creating contact."
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
    public function show($contact_id)
    {
        return Response::json(array('contact'=>new ContactResource(Contact::find($contact_id)),'code'=>200),200);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Contact $contact)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'contact_id'=>'required|integer'
        ]);
        if(!$validator->fails())
        {
            $c = Contact::find($request->contact_id);
            if($request->firstname!=null)
            {
                $c->firstname=$request->firstname;
            }
            if($request->lastname!=null)
            {
                $c->lastname=$request->lastname;
            }
            if($request->account!=null)
            {
                $c->account=$request->account;
            }
            if($request->title!=null)
            {
                $c->title=$request->title;
            }
            if($request->mobile!=null)
            {
                $c->mobile=$request->mobile;
            }
            if($request->phone!=null)
            {
                $c->phone=$request->phone;
            }
            if($request->email!=null)
            {
                $c->email=$request->email;
            }
            if($c->update())
            {
                return Response::json(array(
            'code'      =>  200,
            'message'   =>  "Contact updated successfully."
             ), 200);
            }
            else
            {
                return Response::json(array(
            'code'      =>  400,
            'message'   =>  "Error updating contact."
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
    public function companycontacts($companyid)
    {
        return Response::json(array('data'=>new ContactCollection(Contact::where('owningcompany',$companyid)->get()),'code'=>200),200);
    }

    public function mycompanycontacts()
    {
        return Response::json(array('contacts'=>new ContactCollection(Contact::where('owningcompany',auth()->user()->company)->get()),'code'=>200),200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($contact_id)
    {
        $c = Contact::find($contact_id);
        $success = $c->delete();
        if($success==true)
        {
            return Response::json(array(
                'code'      =>  200,
                'message'   =>  "Contact deleted successfully."
                 ), 200);
        }
        else
            {
                return Response::json(array(
                'code'      =>  400,
                'message'   =>  "Error deleting contact."
                 ), 400);
            }
    }

    public function searchcontactbyname(Request $request)
    {
        $c = " ";
        $contacts = null;
        if($request->contact!=null)
        {
            $c = $request->contact;
            if($request->account!=null)
            {
            $contacts = Contact::where(function($query) use($c){
            $query->where('firstname', 'LIKE', "%".$c."%")
              ->orWhere('lastname', 'LIKE', "%".$c."%");
            })->where('owningcompany', auth()->user()->company)->where('account',$request->account)->get();
            }
            else
            {
            $contacts = Contact::where(function($query) use($c){
             $query->where('firstname', 'LIKE', "%".$c."%")
              ->orWhere('lastname', 'LIKE', "%".$c."%");
            })->where('owningcompany', auth()->user()->company)->get();
            }
        }
        else
        {
            if($request->account!=null)
            {
                $contacts = Contact::where('owningcompany', auth()->user()->company)->where('account',$request->account)->get();
            }
            else
            {
                $contacts = Contact::where('owningcompany', auth()->user()->company)-get();
            }
        }
        

        $contacts = new ContactCollection($contacts);
        if(count($contacts)==0)
        {
            return Response::json(array(
            'message' => "No contacts found",
            'code' => "404",
        ), 404);
        }
        return Response::json(array(
            'contacts' => $contacts,
            'code' => "200",
        ), 200);

    }
}
