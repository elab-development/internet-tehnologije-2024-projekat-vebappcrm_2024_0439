<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Controllers\LeadController;
use App\Model\Lead;

class LeadResource extends JsonResource
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
			'company'=>$this->resource->company,
			'owner'=>$this->resource->ownerobj,
			'title'=>$this->resource->title,
			'description'=>$this->resource->description,
			'status'=>$this->resource->statusobj,
			'phone'=>$this->resource->phone,
			'email'=>$this->resource->email,
            'activities'=>new ActivityCollection($this->resource->activities)

          ];
    }
}