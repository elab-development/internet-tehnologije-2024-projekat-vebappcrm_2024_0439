<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations;

class Account extends Model
{
    /** @use HasFactory<\Database\Factories\AccountFactory> */
    use HasFactory;
    protected $table="accounts";
    public $timestamps = false;
    protected $fillable=[
        'id','name','email','billingaddress','phone','website','industry'
    ];
    
}
