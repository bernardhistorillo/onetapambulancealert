<?php

namespace App\Http\Controllers;

use App\Models\Referral;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Session;

class AuthenticationController extends Controller
{
    public function home(Request $request) {
        return redirect()->route('auth.login');
    }

    public function logout(Request $request) {
        Auth::logout();
        return redirect()->route('auth.loginPage');
    }

    public function loginPage(Request $request) {
        return view('login.index');
    }

    public function login(Request $request) {
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        if(!Auth::attempt($credentials)) {
            abort(422, 'The provided credentials do not match our records.');
        }

        return response()->json([
            'data' => [
                'is_authenticated' => Auth::check()
            ]
        ]);
    }

    public function signup(Request $request) {
        $request->validate([
            'firstname' => 'required|string',
            'middlename' => 'required|string',
            'lastname' => 'required|string',
            'birthdate' => 'required|date',
            'email' => 'required|email',
            'contact_number' => 'required|numeric',
            'address' => 'required|string',
            'password' => 'required|string'
        ]);

        $user = User::where('email', 'LIKE', $request->email)
            ->first();

        if($user) {
            abort(422, 'Email already exists');
        }

        $user = new User();
        $user->firstname = $request->firstname;
        $user->middlename = $request->middlename;
        $user->lastname = $request->lastname;
        $user->birthdate = $request->birthdate;
        $user->email = $request->email;
        $user->contact_number = $request->contact_number;
        $user->address = $request->address;
        $user->password = Hash::make($request->password);
        $user->role = 3;
        $user->save();

        return response()->json([
            'user' => $user
        ]);
    }
}
