<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations;

class Contact extends Model
{
    /** @use HasFactory<\Database\Factories\ContactFactory> */
    use HasFactory;
    protected $table="contacts";
    public $timestamps = false;
    protected $fillable=[
        'id','firstname','lastname','title','email','phone','mobile','account'
    ];

    function account_obj()
    {
        return $this->hasOne(Account::class,"id","account");
    }

}
