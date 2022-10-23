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
}
