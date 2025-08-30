<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class QuestionAttempt extends Model
{
    use HasFactory;

    protected $fillable = [
        'question_id',
        'attempt_lat',
        'attempt_lng',
        'is_correct',
        'distance',
    ];

    public function question()
    {
        return $this->belongsTo(Question::class);
    }
}
