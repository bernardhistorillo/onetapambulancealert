<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SubAccount extends Model
{
    use HasFactory;

    public function user() {
        return $this->belongsTo(User::class)
            ->first();
    }

    public function medicalRecords() {
        return $this->hasMany(MedicalRecord::class)
            ->orderBy('id', 'desc')
            ->get();
    }
}
