<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('activities', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('description')->nullable();
            $table->date('date')->nullable();
            $table->integer('status'); //0 - Open,  1 - Working, 2 - Closed
            $table->foreignId('owningcompany')->constrained('company_info');
            //$table->integer('type')->default(0); //0 - Lead , 1 - Opportunity
            $table->foreignId('owninglead')->nullable()->constrained('leads');
            $table->foreignId('owningopportunity')->nullable()->constrained('opportunities');
            $table->foreignId('assigned_to')->constrained('users');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('activities');
    }
};
