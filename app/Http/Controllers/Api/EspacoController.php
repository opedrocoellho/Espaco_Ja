<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Espaco;
use App\Models\Avaliacao;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class EspacoController extends Controller
{
    public function index(Request $request)
    {
        $query = Espaco::ativo();

        // Filtros
        if ($request->has('cidade')) {
            $query->where('cidade', 'like', '%' . $request->cidade . '%');
        }

        if ($request->has('capacidade')) {
            $query->where('capacidade', '>=', $request->capacidade);
        }

        if ($request->has('tipo')) {
            $query->whereJsonContains('amenidades', $request->tipo);
        }

        $espacos = $query->paginate(12);
        
        // Adicionar média de avaliações
        $espacos->getCollection()->transform(function ($espaco) {
            $espaco->media_avaliacoes = $espaco->avaliacoes()->avg('nota');
            $espaco->total_avaliacoes = $espaco->avaliacoes()->count();
            return $espaco;
        });

        return response()->json([
            'data' => $espacos->items(),
            'pagination' => [
                'current_page' => $espacos->currentPage(),
                'last_page' => $espacos->lastPage(),
                'per_page' => $espacos->perPage(),
                'total' => $espacos->total(),
            ]
        ]);
    }

    public function meusEspacos(Request $request)
    {
        $espacos = Espaco::where('user_id', $request->user()->id)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'data' => $espacos
        ]);
    }

    public function show($id)
    {
        $espaco = Espaco::findOrFail($id);
        $espaco->media_avaliacoes = $espaco->avaliacoes()->avg('nota');
        $espaco->total_avaliacoes = $espaco->avaliacoes()->count();

        return response()->json([
            'data' => $espaco
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nome' => 'required|string|max:255',
            'descricao' => 'required|string',
            'preco_por_hora' => 'required|numeric|min:0',
            'capacidade' => 'required|integer|min:1',
            'endereco' => 'required|string',
            'cidade' => 'required|string',
            'estado' => 'required|string',
            'cep' => 'required|string',
            'amenidades' => 'array',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
            'imagens.*' => 'image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Dados inválidos',
                'errors' => $validator->errors()
            ], 422);
        }

        $data = $request->only([
            'nome', 'descricao', 'preco_por_hora', 'capacidade',
            'endereco', 'cidade', 'estado', 'cep', 'amenidades', 'latitude', 'longitude'
        ]);
        $data['user_id'] = $request->user()->id;
        
        // Se não tiver coordenadas, usar coordenadas padrão
        if (!isset($data['latitude']) || !isset($data['longitude'])) {
            $data['latitude'] = -23.5505 + (rand(-1000, 1000) / 10000);
            $data['longitude'] = -46.6333 + (rand(-1000, 1000) / 10000);
        }
        
        $espaco = Espaco::create($data);

        // Processar imagens
        $imagens = [];
        if ($request->hasFile('imagens')) {
            foreach ($request->file('imagens') as $imagem) {
                $path = $imagem->store('espacos', 'public');
                $imagens[] = asset('storage/' . $path);
            }
            
            if (!empty($imagens)) {
                $espaco->update([
                    'imagens' => $imagens,
                    'imagem_principal' => $imagens[0]
                ]);
            }
        }

        return response()->json([
            'message' => 'Espaço criado com sucesso',
            'data' => $espaco->fresh()
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $espaco = Espaco::where('user_id', $request->user()->id)->findOrFail($id);

        $validator = Validator::make($request->all(), [
            'nome' => 'string|max:255',
            'descricao' => 'string',
            'preco_por_hora' => 'numeric|min:0',
            'capacidade' => 'integer|min:1',
            'endereco' => 'string',
            'cidade' => 'string',
            'estado' => 'string',
            'cep' => 'string',
            'amenidades' => 'array',
            'ativo' => 'boolean',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
            'imagens_para_remover' => 'array',
            'novas_imagens.*' => 'image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Dados inválidos',
                'errors' => $validator->errors()
            ], 422);
        }

        $data = $request->only([
            'nome', 'descricao', 'preco_por_hora', 'capacidade',
            'endereco', 'cidade', 'estado', 'cep', 'amenidades', 'ativo', 'latitude', 'longitude'
        ]);
        
        // Processar remoção de imagens
        $imagensAtuais = $espaco->imagens ?? [];
        if ($request->has('imagens_para_remover')) {
            $imagensParaRemover = $request->imagens_para_remover;
            $imagensAtuais = array_filter($imagensAtuais, function($imagem) use ($imagensParaRemover) {
                return !in_array($imagem, $imagensParaRemover);
            });
        }
        
        // Processar novas imagens
        if ($request->hasFile('novas_imagens')) {
            foreach ($request->file('novas_imagens') as $imagem) {
                $path = $imagem->store('espacos', 'public');
                $imagensAtuais[] = asset('storage/' . $path);
            }
        }
        
        $data['imagens'] = array_values($imagensAtuais);
        if (!empty($data['imagens'])) {
            $data['imagem_principal'] = $data['imagens'][0];
        }
        
        $espaco->update($data);

        return response()->json([
            'message' => 'Espaço atualizado com sucesso',
            'data' => $espaco->fresh()
        ]);
    }

    public function destroy(Request $request, $id)
    {
        $espaco = Espaco::where('user_id', $request->user()->id)->findOrFail($id);
        
        // Remove imagem se existir
        if ($espaco->imagem_principal && \Storage::exists('public/' . $espaco->imagem_principal)) {
            \Storage::delete('public/' . $espaco->imagem_principal);
        }
        
        $espaco->delete();

        return response()->json([
            'message' => 'Espaço removido com sucesso'
        ]);
    }

    public function reservasDoEspaco(Request $request, $id)
    {
        $espaco = Espaco::where('user_id', $request->user()->id)->findOrFail($id);
        
        $reservas = $espaco->reservas()
            ->with('user')
            ->orderBy('data', 'desc')
            ->orderBy('horario_inicio', 'desc')
            ->get();

        return response()->json([
            'data' => $reservas
        ]);
    }

    public function uploadImagem(Request $request, $id)
    {
        $espaco = Espaco::where('user_id', $request->user()->id)->findOrFail($id);
        
        $validator = \Validator::make($request->all(), [
            'imagem' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Imagem inválida',
                'errors' => $validator->errors()
            ], 422);
        }

        // Remove imagem anterior se existir
        if ($espaco->imagem_principal && \Storage::exists('public/' . $espaco->imagem_principal)) {
            \Storage::delete('public/' . $espaco->imagem_principal);
        }

        // Salva nova imagem
        $path = $request->file('imagem')->store('espacos', 'public');
        $espaco->update(['imagem_principal' => $path]);

        return response()->json([
            'message' => 'Imagem enviada com sucesso',
            'data' => $espaco
        ]);
    }

    public function verificarDisponibilidade(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'data' => 'required|date',
            'hora_inicio' => 'required|date_format:H:i',
            'hora_fim' => 'required|date_format:H:i|after:hora_inicio',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Dados inválidos',
                'errors' => $validator->errors()
            ], 422);
        }

        $espaco = Espaco::findOrFail($id);
        
        $disponivel = $espaco->isDisponivel(
            $request->data,
            $request->hora_inicio,
            $request->hora_fim
        );

        $horariosOcupados = $espaco->getReservasOcupadas($request->data);

        return response()->json([
            'disponivel' => $disponivel,
            'horarios_ocupados' => $horariosOcupados
        ]);
    }

    public function getAvaliacoes(Request $request, $id)
    {
        $espaco = Espaco::findOrFail($id);
        
        $avaliacoes = $espaco->avaliacoes()
            ->with('user')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'data' => $avaliacoes
        ]);
    }

    public function criarAvaliacao(Request $request, $id)
    {
        $espaco = Espaco::findOrFail($id);
        
        $validator = Validator::make($request->all(), [
            'nota' => 'required|integer|min:1|max:5',
            'comentario' => 'required|string|max:1000',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Dados inválidos',
                'errors' => $validator->errors()
            ], 422);
        }

        // Verifica se o usuário já avaliou este espaço
        $avaliacaoExistente = Avaliacao::where('user_id', $request->user()->id)
            ->where('espaco_id', $id)
            ->first();

        if ($avaliacaoExistente) {
            return response()->json([
                'message' => 'Você já avaliou este espaço'
            ], 422);
        }

        $avaliacao = Avaliacao::create([
            'user_id' => $request->user()->id,
            'espaco_id' => $id,
            'nota' => $request->nota,
            'comentario' => $request->comentario,
        ]);

        $avaliacao->load('user');

        return response()->json([
            'message' => 'Avaliação criada com sucesso',
            'data' => $avaliacao
        ], 201);
    }
}