<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::dropIfExists('question_attempts');
    }

    public function down(): void
    {
        // Não recria a tabela, pois não é mais necessária
    }
};
