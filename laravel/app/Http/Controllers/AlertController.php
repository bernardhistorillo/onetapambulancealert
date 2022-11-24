<?php

namespace App\Http\Controllers;

use App\Models\Alert;
use App\Models\MedicalRecord;
use App\Models\Message;
use App\Models\Responder;
use App\Models\SubAccount;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;

class AlertController extends Controller
{
    public function alert(Request $request) {
        $request->validate([
            'sub_account_id' => 'required|numeric',
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
        ]);

        $alert = new Alert();
        $alert->sub_account_id = $request->sub_account_id;
        $alert->latitude = $request->latitude;
        $alert->longitude = $request->longitude;
        $alert->status = "Ongoing";
        $alert->save();

        if($request->notes) {
            $message = new Message();
            $message->alert_id = $alert['id'];
            $message->sub_account_id = $alert['sub_account_id'];
            $message->type = 'text';
            $message->content = $request->notes;
            $message->save();
        }

        return response()->json([
            'user' => $alert->subAccount()->user()->data()
        ]);
    }
}
