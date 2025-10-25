<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('avaliacoes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('espaco_id')->constrained('espacos')->onDelete('cascade');
            $table->integer('nota')->check('nota >= 1 AND nota <= 5');
            $table->text('comentario');
            $table->timestamps();
            
            $table->unique(['user_id', 'espaco_id']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('avaliacoes');
    }
};