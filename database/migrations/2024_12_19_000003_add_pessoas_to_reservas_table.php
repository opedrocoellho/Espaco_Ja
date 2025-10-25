<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('reservas', function (Blueprint $table) {
            $table->integer('adultos')->default(1)->after('observacoes');
            $table->integer('criancas')->default(0)->after('adultos');
            $table->integer('bebes')->default(0)->after('criancas');
            $table->integer('pets')->default(0)->after('bebes');
        });
    }

    public function down()
    {
        Schema::table('reservas', function (Blueprint $table) {
            $table->dropColumn(['adultos', 'criancas', 'bebes', 'pets']);
        });
    }
};