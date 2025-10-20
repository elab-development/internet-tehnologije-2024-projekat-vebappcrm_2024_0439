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
        Schema::create('leads', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('lastname');
            $table->string('company');
            $table->foreignId('owner')->constrained('users');
            $table->string('title');
            $table->text('description')->nullable();
            $table->foreignId('status')->constrained('lead_status')->default('1');
            $table->string('phone')->nullable();
            $table->string('email')->nullable();
            $table->foreignId('owningcompany')->constrained('company_info');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('leads');
    }
};
