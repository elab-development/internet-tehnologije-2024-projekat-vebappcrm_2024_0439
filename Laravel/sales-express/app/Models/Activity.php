<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations;

class Activity extends Model
{
    /** @use HasFactory<\Database\Factories\ActivityFactory> */
    use HasFactory;
    protected $table="activities";
    public $timestamps = false;
    protected $fillable=[
        'id','title','description','date','status','assigned_to','owningcompany','owningopportunity','owninglead'
    ];

    function assigned_to_obj()
    {
        return $this->belongsTo(User::class,'assigned_to','id');
    }

    function owninglead_obj()
    {
        return $this->belongsTo(Lead::class,'owninglead','id');
    }

    function owningopportunity_obj()
    {
        return $this->belongsTo(Opportunity::class,'owningopportunity','id');
    }

}
