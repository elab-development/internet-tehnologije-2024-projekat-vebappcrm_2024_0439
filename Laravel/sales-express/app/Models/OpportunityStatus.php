<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations;

class OpportunityStatus extends Model
{
    /** @use HasFactory<\Database\Factories\OpportunityStatusFactory> */
    use HasFactory;
    protected $table="opportunity_status";
    public $timestamps = false;
    protected $fillable=[
        'id','name'
    ];
}
