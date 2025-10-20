<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations;

class Lead extends Model
{
    /** @use HasFactory<\Database\Factories\LeadFactory> */
    use HasFactory;
    protected $table="leads";
    public $timestamps = false;
    protected $fillable=[
        'id','name','lastname','company','owner','title','description','status','phone','email'
    ];

    public function activities()
    {
        return $this->hasMany(Activity::class,'owninglead');
    }

    public function ownerobj()
    {
        return $this->belongsTo(User::class, 'owner', 'id');
    }

    public function statusobj()
    {
        return $this->belongsTo(LeadStatus::class, 'status', 'id');
    }
}
