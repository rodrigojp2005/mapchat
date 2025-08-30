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
    }
}
