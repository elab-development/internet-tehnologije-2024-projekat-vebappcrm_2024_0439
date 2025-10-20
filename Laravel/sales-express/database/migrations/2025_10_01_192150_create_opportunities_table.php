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
        Schema::create('opportunities', function (Blueprint $table) {
            $table->id();
            $table->foreignId('contact')->constrained('contacts');
            $table->foreignId('account')->constrained('accounts');
            $table->foreignId('owner')->constrained('users');
            $table->string('title')->nullable();
            $table->text('description')->nullable();
            $table->foreignId('status')->constrained('opportunity_status')->default('1');
            $table->foreignId('owningcompany')->constrained('company_info');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('opportunities');
    }
};
