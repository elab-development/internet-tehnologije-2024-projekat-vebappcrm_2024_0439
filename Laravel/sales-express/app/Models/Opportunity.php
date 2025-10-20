<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations;

class Opportunity extends Model
{
    /** @use HasFactory<\Database\Factories\OpportunityFactory> */
    use HasFactory;
    protected $table="opportunities";
    public $timestamps = false;
    protected $fillable=[
        'id','contact','account','owner','title','description','status'
    ];

    public function activities()
    {
        return $this->hasMany(Activity::class,'owningopportunity');
    }
    
    public function owner_obj()
    {
        return $this->belongsTo(User::class,"owner");
    }

    public function account_obj()
    {
        return $this->hasOne(Account::class,"id","account");
    }

    public function contact_obj()
    {
        return $this->hasOne(Contact::class,"id","contact");
    }

    public function status_obj()
    {
        return $this->hasOne(OpportunityStatus::class,"id","status");
    }
}
