<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function index(Request $request) {
        $users = User::orderBy('lastname')
            ->paginate(15);

        return view('users.index', compact('users'));
    }
}
