<?php

namespace Database\Seeders;

use App\Models\Espaco;
use App\Models\EspacoImagem;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;

class EspacoSeeder extends Seeder
{
    public function run(): void
    {
        $espacos = [
            [
                'nome' => 'Sala de Reunião Premium',
                'descricao' => 'Sala moderna e equipada para reuniões executivas, com capacidade para até 12 pessoas. Ambiente climatizado com vista panorâmica da cidade.',
                'endereco' => 'Av. Paulista, 1000',
                'cidade' => 'São Paulo',
                'estado' => 'SP',
                'cep' => '01310-100',
                'preco_por_hora' => 150.00,
                'capacidade' => 12,
                'amenidades' => ['Wi-Fi', 'Projetor', 'Ar condicionado', 'Café', 'Quadro branco'],
                'latitude' => -23.5613,
                'longitude' => -46.6565,
                'ativo' => true
            ],
            [
                'nome' => 'Coworking Criativo',
                'descricao' => 'Espaço colaborativo ideal para freelancers e startups. Ambiente descontraído com mesas compartilhadas e salas privativas.',
                'endereco' => 'Rua Augusta, 500',
                'cidade' => 'São Paulo',
                'estado' => 'SP',
                'cep' => '01305-000',
                'preco_por_hora' => 25.00,
                'capacidade' => 30,
                'amenidades' => ['Wi-Fi', 'Impressora', 'Café', 'Cozinha', 'Área de descanso'],
                'latitude' => -23.5505,
                'longitude' => -46.6333,
                'ativo' => true
            ],
            [
                'nome' => 'Auditório Corporativo',
                'descricao' => 'Auditório completo para eventos, palestras e apresentações. Sistema de som profissional e iluminação adequada.',
                'endereco' => 'Av. Faria Lima, 2000',
                'cidade' => 'São Paulo',
                'estado' => 'SP',
                'cep' => '04538-132',
                'preco_por_hora' => 300.00,
                'capacidade' => 100,
                'amenidades' => ['Sistema de som', 'Projetor', 'Palco', 'Ar condicionado', 'Estacionamento'],
                'latitude' => -23.5781,
                'longitude' => -46.6925,
                'ativo' => true
            ],
            [
                'nome' => 'Sala de Treinamento',
                'descricao' => 'Sala ideal para treinamentos e workshops. Layout flexível com mesas móveis e equipamentos audiovisuais.',
                'endereco' => 'Rua do Ouvidor, 100',
                'cidade' => 'Rio de Janeiro',
                'estado' => 'RJ',
                'cep' => '20040-030',
                'preco_por_hora' => 120.00,
                'capacidade' => 25,
                'amenidades' => ['Wi-Fi', 'Projetor', 'Flipchart', 'Ar condicionado', 'Material de escritório'],
                'latitude' => -22.9068,
                'longitude' => -43.1729,
                'ativo' => true
            ],
            [
                'nome' => 'Espaço para Eventos',
                'descricao' => 'Salão versátil para eventos sociais e corporativos. Decoração elegante e serviço de buffet disponível.',
                'endereco' => 'Av. Atlântica, 1500',
                'cidade' => 'Rio de Janeiro',
                'estado' => 'RJ',
                'cep' => '22021-000',
                'preco_por_hora' => 250.00,
                'capacidade' => 80,
                'amenidades' => ['Cozinha', 'Sistema de som', 'Decoração', 'Estacionamento', 'Vista para o mar'],
                'latitude' => -22.9711,
                'longitude' => -43.1822,
                'ativo' => true
            ],
            [
                'nome' => 'Sala de Videoconferência',
                'descricao' => 'Sala especializada em videoconferências com equipamentos de última geração. Ideal para reuniões remotas.',
                'endereco' => 'Av. Afonso Pena, 800',
                'cidade' => 'Belo Horizonte',
                'estado' => 'MG',
                'cep' => '30130-002',
                'preco_por_hora' => 80.00,
                'capacidade' => 8,
                'amenidades' => ['Videoconferência', 'Wi-Fi', 'Ar condicionado', 'Quadro branco', 'Café'],
                'latitude' => -19.9167,
                'longitude' => -43.9345,
                'ativo' => true
            ],
            [
                'nome' => 'Sala Executiva VIP',
                'descricao' => 'Sala executiva de alto padrão com mobiliário de luxo e tecnologia de ponta.',
                'endereco' => 'Av. Brigadeiro Faria Lima, 3000',
                'cidade' => 'São Paulo',
                'estado' => 'SP',
                'cep' => '04538-132',
                'preco_por_hora' => 200.00,
                'capacidade' => 8,
                'amenidades' => ['Wi-Fi', 'TV 65"', 'Ar condicionado', 'Serviço de café', 'Mesa de reunião premium'],
                'latitude' => -23.5781,
                'longitude' => -46.6925,
                'ativo' => true
            ],
            [
                'nome' => 'Espaço Coworking 24h',
                'descricao' => 'Coworking que funciona 24 horas com segurança e acesso controlado.',
                'endereco' => 'Rua dos Pinheiros, 800',
                'cidade' => 'São Paulo',
                'estado' => 'SP',
                'cep' => '05422-001',
                'preco_por_hora' => 35.00,
                'capacidade' => 50,
                'amenidades' => ['Wi-Fi', 'Segurança 24h', 'Café', 'Impressora', 'Sala de descanso'],
                'latitude' => -23.5629,
                'longitude' => -46.6544,
                'ativo' => true
            ],
            [
                'nome' => 'Auditório Tech Hub',
                'descricao' => 'Auditório moderno ideal para eventos de tecnologia e startups.',
                'endereco' => 'Av. Ipiranga, 1500',
                'cidade' => 'São Paulo',
                'estado' => 'SP',
                'cep' => '01046-001',
                'preco_por_hora' => 350.00,
                'capacidade' => 150,
                'amenidades' => ['Sistema de som profissional', 'Projeção 4K', 'Streaming', 'Ar condicionado', 'Camarim'],
                'latitude' => -23.5431,
                'longitude' => -46.6291,
                'ativo' => true
            ],
            [
                'nome' => 'Sala de Podcast',
                'descricao' => 'Sala especializada para gravação de podcasts com isolamento acústico.',
                'endereco' => 'Rua Consolacao, 500',
                'cidade' => 'São Paulo',
                'estado' => 'SP',
                'cep' => '01302-000',
                'preco_por_hora' => 90.00,
                'capacidade' => 4,
                'amenidades' => ['Isolamento acústico', 'Microfones profissionais', 'Mesa de som', 'Ar condicionado'],
                'latitude' => -23.5558,
                'longitude' => -46.6396,
                'ativo' => true
            ],
            [
                'nome' => 'Espaço Gourmet',
                'descricao' => 'Espaço para eventos gastronômicos com cozinha profissional completa.',
                'endereco' => 'Av. Copacabana, 800',
                'cidade' => 'Rio de Janeiro',
                'estado' => 'RJ',
                'cep' => '22060-000',
                'preco_por_hora' => 180.00,
                'capacidade' => 40,
                'amenidades' => ['Cozinha profissional', 'Forno industrial', 'Geladeira', 'Utensilios', 'Ar condicionado'],
                'latitude' => -22.9711,
                'longitude' => -43.1822,
                'ativo' => true
            ],
            [
                'nome' => 'Sala de Yoga e Meditação',
                'descricao' => 'Ambiente zen para práticas de yoga, meditação e bem-estar.',
                'endereco' => 'Rua das Laranjeiras, 200',
                'cidade' => 'Rio de Janeiro',
                'estado' => 'RJ',
                'cep' => '22240-000',
                'preco_por_hora' => 60.00,
                'capacidade' => 20,
                'amenidades' => ['Tatames', 'Espelhos', 'Som ambiente', 'Ar condicionado', 'Vestiario'],
                'latitude' => -22.9364,
                'longitude' => -43.1823,
                'ativo' => true
            ],
            [
                'nome' => 'Laboratório de Inovação',
                'descricao' => 'Espaço equipado para workshops de inovação e design thinking.',
                'endereco' => 'Av. do Contorno, 1000',
                'cidade' => 'Belo Horizonte',
                'estado' => 'MG',
                'cep' => '30110-000',
                'preco_por_hora' => 100.00,
                'capacidade' => 30,
                'amenidades' => ['Quadros móveis', 'Post-its', 'Marcadores', 'Projetor', 'Wi-Fi'],
                'latitude' => -19.9167,
                'longitude' => -43.9345,
                'ativo' => true
            ]
        ];

        // Pega o primeiro usuário ou cria um usuário padrão
        $user = User::first();
        if (!$user) {
            $user = User::firstOrCreate(
                ['email' => 'usuario@exemplo.com'],
                [
                    'name' => 'Usuário Exemplo',
                    'password' => bcrypt('123456'),
                    'whatsapp' => '11999999999'
                ]
            );
        }

        // URLs de imagens de exemplo do Unsplash
        $imagensExemplo = [
            [
                'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800',
                'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800',
                'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800'
            ],
            [
                'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800',
                'https://images.unsplash.com/photo-1556761175-4b46a572b786?w=800',
                'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800'
            ],
            [
                'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800',
                'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
                'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800'
            ],
            [
                'https://images.unsplash.com/photo-1517502884422-41eaead166d4?w=800',
                'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800',
                'https://images.unsplash.com/photo-1497366412874-3415097a27e7?w=800'
            ],
            [
                'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800',
                'https://images.unsplash.com/photo-1464207687429-7505649dae38?w=800',
                'https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=800'
            ],
            [
                'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800',
                'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800',
                'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800'
            ],
            [
                'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800',
                'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=800',
                'https://images.unsplash.com/photo-1560472355-536de3962603?w=800'
            ],
            [
                'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800',
                'https://images.unsplash.com/photo-1556761175-4b46a572b786?w=800',
                'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800'
            ],
            [
                'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800',
                'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
                'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800'
            ],
            [
                'https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=800',
                'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800',
                'https://images.unsplash.com/photo-1464207687429-7505649dae38?w=800'
            ],
            [
                'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800',
                'https://images.unsplash.com/photo-1517502884422-41eaead166d4?w=800',
                'https://images.unsplash.com/photo-1497366412874-3415097a27e7?w=800'
            ],
            [
                'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800',
                'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
                'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800'
            ],
            [
                'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800',
                'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800',
                'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800'
            ]
        ];

        foreach ($espacos as $index => $espacoData) {
            $espacoData['user_id'] = $user->id;
            $espacoData['imagens'] = $imagensExemplo[$index] ?? $imagensExemplo[0];
            $espacoData['imagem_principal'] = $espacoData['imagens'][0];
            
            Espaco::create($espacoData);
        }
    }
}