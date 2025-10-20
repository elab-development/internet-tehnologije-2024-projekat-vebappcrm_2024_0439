<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Controllers\CompanyInfoController;
use App\Model\CompanyInfo;
use Illuminate\Support\Facades\Storage;

class CompanyInfoResource extends JsonResource
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
			'imgpath'=>Storage::url($this->resource->imgpath),
			'name'=>$this->resource->name,
            'address'=>$this->resource->address,
			'description'=>$this->resource->description,

          ];
    }
}