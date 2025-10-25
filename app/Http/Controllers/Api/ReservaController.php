<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Reserva;
use App\Models\Espaco;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;

class ReservaController extends Controller
{
    public function index(Request $request)
    {
        $reservas = Reserva::with('espaco')
            ->where('user_id', $request->user()->id)
            ->orderBy('data', 'desc')
            ->orderBy('horario_inicio', 'desc')
            ->paginate(10);

        return response()->json([
            'data' => $reservas->items(),
            'pagination' => [
                'current_page' => $reservas->currentPage(),
                'last_page' => $reservas->lastPage(),
                'per_page' => $reservas->perPage(),
                'total' => $reservas->total(),
            ]
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'espaco_id' => 'required|exists:espacos,id',
            'data' => 'required|date|after_or_equal:today',
            'horario_inicio' => 'required|date_format:H:i',
            'horario_fim' => 'required|date_format:H:i',
            'observacoes' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Dados inválidos',
                'errors' => $validator->errors()
            ], 422);
        }

        // Permite horários que passam da meia-noite (ex: 22:00 - 02:00)

        $espaco = Espaco::findOrFail($request->espaco_id);

        // Verificar disponibilidade
        if (!$espaco->isDisponivel($request->data, $request->horario_inicio, $request->horario_fim)) {
            return response()->json([
                'message' => 'Horário não disponível'
            ], 422);
        }

        // Calcular valor total
        $horaInicio = Carbon::createFromFormat('H:i', $request->horario_inicio);
        $horaFim = Carbon::createFromFormat('H:i', $request->horario_fim);
        
        // Se horário fim é menor que início, adiciona 24h (passa da meia-noite)
        if ($horaFim->lt($horaInicio)) {
            $horaFim->addDay();
        }
        
        $horas = $horaFim->diffInHours($horaInicio);
        $valorTotal = $horas * $espaco->preco_por_hora;

        $reserva = Reserva::create([
            'user_id' => $request->user()->id,
            'espaco_id' => $request->espaco_id,
            'data' => $request->data,
            'horario_inicio' => $request->horario_inicio,
            'horario_fim' => $request->horario_fim,
            'valor_total' => $valorTotal,
            'observacoes' => $request->observacoes,
            'status' => 'pendente',
        ]);

        $reserva->load('espaco');

        return response()->json([
            'message' => 'Reserva criada com sucesso',
            'data' => $reserva
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $reserva = Reserva::where('user_id', $request->user()->id)->findOrFail($id);

        // Só permite editar reservas pendentes
        if ($reserva->status !== 'pendente') {
            return response()->json([
                'message' => 'Não é possível editar esta reserva'
            ], 422);
        }

        $validator = Validator::make($request->all(), [
            'data' => 'date|after_or_equal:today',
            'horario_inicio' => 'date_format:H:i',
            'horario_fim' => 'date_format:H:i|after:horario_inicio',
            'observacoes' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Dados inválidos',
                'errors' => $validator->errors()
            ], 422);
        }

        // Se mudou horário, verificar disponibilidade
        if ($request->has('data') || $request->has('horario_inicio') || $request->has('horario_fim')) {
            $data = $request->data ?? $reserva->data;
            $horaInicio = $request->horario_inicio ?? $reserva->horario_inicio;
            $horaFim = $request->horario_fim ?? $reserva->horario_fim;

            if (!$reserva->espaco->isDisponivel($data, $horaInicio, $horaFim)) {
                return response()->json([
                    'message' => 'Horário não disponível'
                ], 422);
            }

            // Recalcular valor
            $horaInicioCarbon = Carbon::createFromFormat('H:i', $horaInicio);
            $horaFimCarbon = Carbon::createFromFormat('H:i', $horaFim);
            
            // Se horário fim é menor que início, adiciona 24h
            if ($horaFimCarbon->lt($horaInicioCarbon)) {
                $horaFimCarbon->addDay();
            }
            
            $horas = $horaFimCarbon->diffInHours($horaInicioCarbon);
            $request->merge(['valor_total' => $horas * $reserva->espaco->preco_por_hora]);
        }

        $reserva->update($request->only([
            'data', 'horario_inicio', 'horario_fim', 'valor_total', 'observacoes'
        ]));

        $reserva->load('espaco');

        return response()->json([
            'message' => 'Reserva atualizada com sucesso',
            'data' => $reserva
        ]);
    }

    public function destroy(Request $request, $id)
    {
        $reserva = Reserva::where('user_id', $request->user()->id)->findOrFail($id);

        // Só permite cancelar reservas pendentes ou confirmadas
        if (!in_array($reserva->status, ['pendente', 'confirmada'])) {
            return response()->json([
                'message' => 'Não é possível cancelar esta reserva'
            ], 422);
        }

        $reserva->update(['status' => 'cancelada']);

        return response()->json([
            'message' => 'Reserva cancelada com sucesso'
        ]);
    }
}