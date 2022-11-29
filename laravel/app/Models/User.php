<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    public function fullName() {
        $name = '';

        if($this->firstname) {
            $name = $this->firstname;
        }

        if($this->middlename) {
            $name = $name . ' ' . $this->middlename;
        }

        if($this->lastname) {
            $name = $name . ' ' . $this->lastname;
        }

        return $name;
    }

    public function role() {
        $role = 'Admin';

        if($this->role == 2) {
            $role = 'Responder';
        } else if($this->role == 3) {
            $role = 'End-User';
        }

        return $role;
    }

    public function subAccounts() {
        return $this->hasMany(SubAccount::class)
            ->get();
    }

    public function responder() {
        return $this->belongsTo(Responder::class)
            ->first();
    }

    public function data() {
        $this->formattedBirthdate = Carbon::parse($this->birthdate)->format('F n, Y');
        $subAccounts = $this->subAccounts();
        $responder = $this->responder();

        foreach($subAccounts as $subAccount) {
            $subAccount['medicalRecords'] = $subAccount->medicalRecords();
            $subAccount['alerts'] = $subAccount->alerts();
        }

        $this->subAccounts = $subAccounts;
        $this->responder = $responder;

        return $this;
    }
}
