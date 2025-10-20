<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations;

class CompanyInfo extends Model
{
    /** @use HasFactory<\Database\Factories\CompanyInfoFactory> */
    use HasFactory;
    protected $table="company_info";
    public $timestamps = false;
    protected $fillable=[
        'id','imgpath','name','description','address'
    ];

    public function accounts()
    {
        return $this->hasMany(Account::class);
    }

    public function leads()
    {
        return $this->hasMany(Lead::class);
    }

    public function opportunities()
    {
        return $this->hasMany(Opportunity::class);
    }

    public function employees()
    {
        return $this->hasMany(User::class);
    }

}
