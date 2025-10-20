<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Controllers\ContactController;
use App\Model\Contact;

class ContactResource extends JsonResource
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
            'firstname'=>$this->resource->firstname,
            'lastname'=>$this->resource->lastname,
			'title'=>$this->resource->title,
			'email'=>$this->resource->email,
			'phone'=>$this->resource->phone,
			'mobile'=>$this->resource->mobile,
			'account'=>$this->resource->account_obj,
			'created_at'=>$this->resource->created_at,
			'updated_at'=>$this->resource->updated_at

          ];
    }
}