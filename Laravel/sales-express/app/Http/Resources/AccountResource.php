<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Controllers\AccountController;
use App\Model\Account;

class AccountResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
			'id'=>$this->resource->id,
			'name'=>$this->resource->name,
            'lastname'=>$this->resource->lastname,
			'email'=>$this->resource->email,
			'billingaddress'=>$this->resource->billingaddress,
			'phone'=>$this->resource->phone,
			'website'=>$this->resource->website,
			'industry'=>$this->resource->industry,
			'created_at'=>$this->resource->created_at,
			'updated_at'=>$this->resource->updated_at

          ];
    }
}