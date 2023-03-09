<?php

namespace App\Http\Controllers;

use App\Models\Referral;
use App\Models\SubAccount;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
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
            'lastname' => 'required|string',
            'birthdate' => 'required|date',
            'email' => 'required|email',
            'contact_number' => 'required|numeric',
            'address' => 'required|string',
            'person_to_contact_name' => 'required|string',
            'person_to_contact_email' => 'required|email',
            'person_to_contact_contact_number' => 'required|numeric',
            'password' => 'required|string'
        ]);

        $user = User::where('email', 'LIKE', $request->email)
            ->first();

        if($user) {
            return response()->json([
                'errors' => "Email already exists",
            ], 422);
        }

        $user = new User();
        $user->firstname = $request->firstname;
        $user->middlename = $request->middlename;
        $user->lastname = $request->lastname;
        $user->birthdate = Carbon::parse($request->birthdate)->format('Y-m-d');
        $user->email = $request->email;
        $user->contact_number = $request->contact_number;
        $user->address = $request->address;
        $user->person_to_contact_name = $request->person_to_contact_name;
        $user->person_to_contact_email = $request->person_to_contact_email;
        $user->person_to_contact_contact_number = $request->person_to_contact_contact_number;
        $user->password = Hash::make($request->password);
        $user->role = 3;
        $user->save();

        $subAccount = new SubAccount();
        $subAccount->user_id = $user['id'];
        $subAccount->name = $user->fullName();
        $subAccount->type = 'Human';
        $subAccount->save();

        return response()->json([
            'user' => $user->data()
        ]);
    }

    public function mobileLogin(Request $request) {
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required|string'
        ]);

        if(!Auth::attempt($credentials)) {
            return response()->json([
                'errors' => "Invalid Login Credentials",
            ], 422);
        }

        $user = User::find(Auth::user()->id);

        return response()->json([
            'user' => $user->data()
        ]);
    }

    public function requestPasswordReset(Request $request) {
        $request->validate([
            'email' => 'required|email'
        ]);

        $user = User::where('email', 'LIKE', $request->email)
            ->first();

        if(!$user) {
            return response()->json([
                'errors' => "Email doesn't exist.",
            ], 422);
        }

        $status = Password::sendResetLink(
            $request->only('email')
        );

        return $status === Password::RESET_LINK_SENT
            ? response()->json([
                'status' => $status
            ])
            : response()->json([
                'errors' => $status,
            ], 422);
    }
}
