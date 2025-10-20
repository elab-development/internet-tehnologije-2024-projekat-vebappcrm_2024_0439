<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Role extends Model
{
    protected $table="roles";
    protected $fillable=['name','value','type'];
    /*
    * 0 - System, predefined
    * 1 - Company, predefined
    * 2 - Company, custom
    */
}
