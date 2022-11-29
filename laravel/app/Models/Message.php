<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Message extends Model
{
    use HasFactory;

    public function responder() {
        return $this->belongsTo(Responder::class)
            ->first();
    }

    public function alert() {
        return $this->belongsTo(Alert::class)
            ->first();
    }
}
