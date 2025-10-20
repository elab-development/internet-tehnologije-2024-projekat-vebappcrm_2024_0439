<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Controllers\ActivityController;
use App\Model\Activity;

class ActivityResource extends JsonResource
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
			'title'=>$this->resource->title,
			'description'=>$this->resource->description,
			'date'=>$this->resource->date,
			'status'=>$this->resource->status,
            'assigned_to'=>$this->resource->assigned_to_obj,
            'owning_lead'=>$this->resource->owninglead_obj,
            'owning_opportunity'=>$this->resource->owningopportunity_obj,
			'created_at'=>$this->resource->created_at,
			'updated_at'=>$this->resource->updated_at

          ];
    }
}