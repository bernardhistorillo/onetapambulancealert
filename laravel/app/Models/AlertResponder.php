<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AlertResponder extends Model
{
    use HasFactory;

    public function alert() {
        return $this->belongsTo(Alert::class)
            ->first();
    }
}
