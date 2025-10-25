<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Espaco;
use App\Models\Reserva;
use Carbon\Carbon;

class ReservaSeeder extends Seeder
{
    public function run(): void
    {
        // Criar usuário de exemplo se não existir
        $user = User::firstOrCreate(
            ['email' => 'usuario@exemplo.com'],
            [
                'name' => 'Usuário Exemplo',
                'password' => bcrypt('123456')
            ]
        );

        // Criar espaço de exemplo se não existir
        $espaco = Espaco::firstOrCreate(
            ['nome' => 'Sala de Reunião Central'],
            [
                'descricao' => 'Sala moderna para reuniões e eventos corporativos',
                'endereco' => 'Rua das Flores, 123',
                'cidade' => 'São Paulo',
                'estado' => 'SP',
                'cep' => '01234-567',
                'preco_hora' => 50.00,
                'capacidade' => 20,
                'comodidades' => ['Wi-Fi', 'Projetor', 'Ar Condicionado'],
                'user_id' => $user->id,
                'ativo' => true
            ]
        );

        // Criar algumas reservas de exemplo para hoje
        $hoje = Carbon::today();
        
        Reserva::create([
            'user_id' => $user->id,
            'espaco_id' => $espaco->id,
            'data' => $hoje,
            'horario_inicio' => '09:00',
            'horario_fim' => '11:00',
            'valor_total' => 100.00,
            'status' => 'confirmada'
        ]);

        Reserva::create([
            'user_id' => $user->id,
            'espaco_id' => $espaco->id,
            'data' => $hoje,
            'horario_inicio' => '14:00',
            'horario_fim' => '16:00',
            'valor_total' => 100.00,
            'status' => 'confirmada'
        ]);
    }
}