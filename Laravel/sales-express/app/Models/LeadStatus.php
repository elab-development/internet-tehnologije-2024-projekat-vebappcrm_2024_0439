<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations;

class LeadStatus extends Model
{
    /** @use HasFactory<\Database\Factories\LeadStatusFactory> */
    use HasFactory;
    protected $table="lead_status";
    public $timestamps = false;
    protected $fillable=[
        'id','name'
    ];
}
