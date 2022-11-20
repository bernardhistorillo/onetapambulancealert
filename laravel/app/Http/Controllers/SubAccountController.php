<?php

namespace App\Http\Controllers;

use App\Models\MedicalRecord;
use App\Models\Responder;
use App\Models\SubAccount;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;

class SubAccountController extends Controller
{
    public function addSubAccount(Request $request) {
        $request->validate([
            'user_id' => 'required|numeric',
            'name' => 'required|string',
            'type' => 'required|string'
        ]);

        $subAccount = new SubAccount();
        $subAccount->user_id = $request->user_id;
        $subAccount->name = $request->name;
        $subAccount->type = $request->type;
        $subAccount->save();

        $user = User::find($subAccount['user_id']);

        return response()->json([
            'user' => $user->data()
        ]);
    }
}
