<?php

namespace App\Http\Controllers;

use App\Models\Alert;
use App\Models\Responder;
use App\Models\User;
use Illuminate\Http\Request;

class HomeController extends Controller
{
    public function index() {
        $usersCount = User::query()
            ->count();

        $respondersCount = Responder::query()
            ->count();

        $activeAlertsCount = Alert::where('status', 'LIKE', 'Ongoing')
            ->count();

        $slertsCount = Alert::where('status', 'NOT LIKE', 'Ongoing')
            ->count();

        return view('dashboard.index', compact('usersCount', 'respondersCount', 'activeAlertsCount', 'slertsCount'));
    }
}
