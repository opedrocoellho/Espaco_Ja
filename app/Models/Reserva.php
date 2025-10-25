<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Patterns\ReservaSubject;
use App\Patterns\EmailNotificationObserver;
use App\Patterns\SMSNotificationObserver;

class Reserva extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'espaco_id',
        'data',
        'horario_inicio',
        'horario_fim',
        'valor_total',
        'status',
        'tipo',
        'desconto',
        'observacoes',
        'adultos',
        'criancas',
        'bebes',
        'pets'
    ];

    protected $casts = [
        'data' => 'date',
        'valor_total' => 'decimal:2',
        'desconto' => 'decimal:2'
    ];

    protected static function boot()
    {
        parent::boot();

        static::created(function ($reserva) {
            $subject = new ReservaSubject();
            $subject->attach(new EmailNotificationObserver());
            $subject->attach(new SMSNotificationObserver());
            $subject->notify($reserva, 'criada');
        });

        static::updated(function ($reserva) {
            if ($reserva->isDirty('status')) {
                $subject = new ReservaSubject();
                $subject->attach(new EmailNotificationObserver());
                $subject->attach(new SMSNotificationObserver());
                $subject->notify($reserva, $reserva->status);
            }
        });
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function espaco(): BelongsTo
    {
        return $this->belongsTo(Espaco::class);
    }

    public function getStatusColorAttribute(): string
    {
        return match($this->status) {
            'pendente' => 'yellow',
            'confirmada' => 'green',
            'cancelada' => 'red',
            default => 'gray'
        };
    }

    public function getStatusTextAttribute(): string
    {
        return match($this->status) {
            'pendente' => 'Pendente',
            'confirmada' => 'Confirmada',
            'cancelada' => 'Cancelada',
            default => 'Desconhecido'
        };
    }
}