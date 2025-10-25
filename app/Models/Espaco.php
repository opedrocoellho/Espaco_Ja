<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Espaco extends Model
{
    use HasFactory;

    protected $table = 'espacos';

    protected $fillable = [
        'nome',
        'descricao',
        'preco_por_hora',
        'capacidade',
        'endereco',
        'cidade',
        'estado',
        'cep',
        'latitude',
        'longitude',
        'amenidades',
        'imagem_principal',
        'imagens',
        'ativo',
        'user_id'
    ];

    protected $casts = [
        'amenidades' => 'array',
        'imagens' => 'array',
        'preco_por_hora' => 'decimal:2',
        'latitude' => 'decimal:8',
        'longitude' => 'decimal:8',
        'ativo' => 'boolean'
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function reservas(): HasMany
    {
        return $this->hasMany(Reserva::class);
    }

    public function avaliacoes(): HasMany
    {
        return $this->hasMany(Avaliacao::class);
    }

    public function getMediaAvaliacoesAttribute()
    {
        return $this->avaliacoes()->avg('nota');
    }

    public function getTotalAvaliacoesAttribute()
    {
        return $this->avaliacoes()->count();
    }



    public function scopeAtivo($query)
    {
        return $query->where('ativo', true);
    }

    public function isDisponivel(string $data, string $horaInicio, string $horaFim): bool
    {
        // Verifica conflitos de horário considerando horários que passam da meia-noite
        $conflitos = $this->reservas()
            ->where('data', $data)
            ->where('status', '!=', 'cancelada')
            ->get()
            ->filter(function ($reserva) use ($horaInicio, $horaFim) {
                $reservaInicio = $reserva->horario_inicio;
                $reservaFim = $reserva->horario_fim;
                
                // Converte horários para minutos para facilitar comparação
                $inicioMinutos = $this->horaParaMinutos($horaInicio);
                $fimMinutos = $this->horaParaMinutos($horaFim);
                $reservaInicioMinutos = $this->horaParaMinutos($reservaInicio);
                $reservaFimMinutos = $this->horaParaMinutos($reservaFim);
                
                // Se horário passa da meia-noite, ajusta
                if ($fimMinutos <= $inicioMinutos) {
                    $fimMinutos += 24 * 60;
                }
                if ($reservaFimMinutos <= $reservaInicioMinutos) {
                    $reservaFimMinutos += 24 * 60;
                }
                
                // Verifica sobreposição
                return !($fimMinutos <= $reservaInicioMinutos || $inicioMinutos >= $reservaFimMinutos);
            });
            
        return $conflitos->isEmpty();
    }
    
    private function horaParaMinutos(string $hora): int
    {
        [$h, $m] = explode(':', $hora);
        return (int)$h * 60 + (int)$m;
    }

    public function getReservasOcupadas(string $data): array
    {
        return $this->reservas()
            ->where('data', $data)
            ->where('status', '!=', 'cancelada')
            ->select('horario_inicio', 'horario_fim')
            ->get()
            ->toArray();
    }
}