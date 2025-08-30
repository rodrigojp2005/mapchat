<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Question;

class QuestionSeeder extends Seeder
{
    public function run(): void
    {
        Question::create([
            'user_id' => 1,
            'question_text' => 'Em que cidade está localizado o Cristo Redentor?',
            'answer_lat' => -22.9519,
            'answer_lng' => -43.2105,
            'category' => 'Cultura',
            'hint' => 'Fica no Sudeste do Brasil.',
        ]);
        Question::create([
            'user_id' => 1,
            'question_text' => 'Onde foi realizada a final da Copa do Mundo de 2014?',
            'answer_lat' => -22.9121,
            'answer_lng' => -43.2302,
            'category' => 'Esporte',
            'hint' => 'Estádio famoso no Rio de Janeiro.',
        ]);
        Question::create([
            'user_id' => 1,
            'question_text' => 'Qual a capital do Brasil?',
            'answer_lat' => -15.793889,
            'answer_lng' => -47.882778,
            'category' => 'Geografia',
            'hint' => 'Cidade planejada no Centro-Oeste.',
        ]);
        Question::create([
            'user_id' => 1,
            'question_text' => 'Onde está localizado o Teatro Amazonas?',
            'answer_lat' => -3.1303,
            'answer_lng' => -60.0239,
            'category' => 'Cultura',
            'hint' => 'Fica na maior cidade da Amazônia.',
        ]);
        Question::create([
            'user_id' => 1,
            'question_text' => 'Em que cidade está o Elevador Lacerda?',
            'answer_lat' => -12.9718,
            'answer_lng' => -38.5108,
            'category' => 'Turismo',
            'hint' => 'Cidade famosa pelo carnaval e acarajé.',
        ]);
        Question::create([
            'user_id' => 1,
            'question_text' => 'Onde está o Museu do Ipiranga?',
            'answer_lat' => -23.5859,
            'answer_lng' => -46.6236,
            'category' => 'História',
            'hint' => 'Fica na maior cidade do Brasil.',
        ]);
        Question::create([
            'user_id' => 1,
            'question_text' => 'Em que cidade está o Mercado Ver-o-Peso?',
            'answer_lat' => -1.4521,
            'answer_lng' => -48.5044,
            'category' => 'Cultura',
            'hint' => 'Famosa pelo açaí e pelo rio Amazonas.',
        ]);
        Question::create([
            'user_id' => 1,
            'question_text' => 'Onde está o Parque Barigui?',
            'answer_lat' => -25.4278,
            'answer_lng' => -49.2731,
            'category' => 'Natureza',
            'hint' => 'Cidade modelo do sul do Brasil.',
        ]);
        Question::create([
            'user_id' => 1,
            'question_text' => 'Em que cidade está o Farol da Barra?',
            'answer_lat' => -12.9718,
            'answer_lng' => -38.5108,
            'category' => 'Turismo',
            'hint' => 'Cidade famosa pelo carnaval e acarajé.',
        ]);
        Question::create([
            'user_id' => 1,
            'question_text' => 'Onde está o Palácio dos Leões?',
            'answer_lat' => -2.5297,
            'answer_lng' => -44.3028,
            'category' => 'História',
            'hint' => 'Fica na capital do Maranhão.',
        ]);
    }
}
