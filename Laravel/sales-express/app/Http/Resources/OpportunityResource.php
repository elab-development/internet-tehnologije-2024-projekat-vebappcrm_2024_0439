<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Controllers\OpportunityController;
use App\Http\Resources\ActivityResource;
use App\Http\Resources\ActivityCollection;
use App\Model\Opportunity;

class OpportunityResource extends JsonResource
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
			'contact'=>$this->resource->contact_obj,
			'account'=>$this->resource->account_obj,
			'owner'=>$this->resource->owner_obj,
			'title'=>$this->resource->title,
			'description'=>$this->resource->description,
			'status'=>$this->resource->status_obj,
            'activities'=>new ActivityCollection($this->resource->activities)

          ];
    }
}