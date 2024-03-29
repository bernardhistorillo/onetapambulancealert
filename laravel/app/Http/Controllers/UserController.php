<?php

namespace App\Http\Controllers;

use App\Models\Responder;
use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function index() {
        $users = User::query()
            ->orderBy('lastname')
            ->get();

        $responders = Responder::query()
            ->orderBy('name')
            ->get();

        return view('users.index', compact('users', 'responders'));
    }

    public function editRole(Request $request) {
        $request->validate([
            'user_id' => 'required|numeric',
            'user_role' => 'required|string',
        ]);

        if($request->user_role == 'Responder') {
            $request->validate([
                'responder_id' => 'required|numeric',
            ]);
        }

        $role = ($request->user_role == 'Responder') ? 2 : 3;
        $responder_id = ($request->user_role == 'Responder') ? $request->responder_id : 0;

        $user = User::find($request->user_id);
        $user->role = $role;
        $user->responder_id = $responder_id;
        $user->update();

        return response()->json([
            'responder' => $user->responder()
        ]);
    }

    public function getUser(Request $request) {
        $request->validate([
            'user_id' => 'required|numeric',
        ]);

        $user = User::find($request->user_id);

        return response()->json([
            'user' => $user->data()
        ]);
    }

    public function updateUser(Request $request) {
        $request->validate([
            'user_id' => 'required|numeric',
            'email' => 'required|email',
            'contact_number' => 'required|numeric',
            'address' => 'required|string',
            'person_to_contact_name' => 'required|string',
            'person_to_contact_email' => 'required|email',
            'person_to_contact_contact_number' => 'required|numeric',
        ]);

        $user = User::find($request->user_id);
        $user->email = $request->email;
        $user->contact_number = $request->contact_number;
        $user->address = $request->address;
        $user->person_to_contact_name = $request->person_to_contact_name;
        $user->person_to_contact_email = $request->person_to_contact_email;
        $user->person_to_contact_contact_number = $request->person_to_contact_contact_number;
        $user->update();

        return response()->json([
            'user' => $user->data()
        ]);
    }
}
