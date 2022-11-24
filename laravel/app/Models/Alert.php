<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Alert extends Model
{
    use HasFactory;

    public function subAccount() {
        return $this->belongsTo(SubAccount::class)
            ->first();
    }

    public function messages() {
        return $this->hasMany(Message::class)
            ->leftJoin('responders', 'responder_id', 'responders.id')
            ->select('messages.*', 'responders.name')
            ->get();
    }
}
