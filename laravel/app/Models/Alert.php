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
            ->leftJoin('sub_accounts', 'sub_account_id', 'sub_accounts.id')
            ->select('messages.*', 'responders.name as responder_name', 'sub_accounts.name as sub_account_name')
            ->orderBy('messages.id', 'asc')
            ->get();
    }

    public function alertResponders() {
        return $this->hasMany(AlertResponder::class)
            ->leftJoin('responders', 'alert_responders.responder_id', 'responders.id')
            ->select('alert_responders.*', 'responders.name', 'responders.type')
            ->get();
    }
}
