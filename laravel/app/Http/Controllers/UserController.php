<?php

namespace App\Http\Controllers;

use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function index(Request $request) {
        $users = User::orderBy('lastname')
            ->paginate(15);

        return view('users.index', compact('users'));
    }

    public function updateUser(Request $request) {
        $request->validate([
            'user_id' => 'required|numeric',
            'email' => 'required|email',
            'contact_number' => 'required|numeric',
            'address' => 'required|string',
        ]);

        $user = User::find($request->user_id);
        $user->email = $request->email;
        $user->contact_number = $request->contact_number;
        $user->address = $request->address;
        $user->update();

        $user['formattedBirthdate'] = Carbon::parse($user['birthdate'])->format('F n, Y');

        return response()->json([
            'user' => $user
        ]);
    }
}
