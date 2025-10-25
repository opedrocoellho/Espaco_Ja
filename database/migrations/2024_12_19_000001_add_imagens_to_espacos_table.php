<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('espacos', function (Blueprint $table) {
            $table->json('imagens')->nullable()->after('imagem_principal');
        });
    }

    public function down()
    {
        Schema::table('espacos', function (Blueprint $table) {
            $table->dropColumn('imagens');
        });
    }
};