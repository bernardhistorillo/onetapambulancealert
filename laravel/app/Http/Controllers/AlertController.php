<?php

namespace App\Http\Controllers;

use App\Models\Alert;
use App\Models\AlertResponder;
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

    public function loadAlerts(Request $request) {
        $request->validate([
            'responder_id' => 'required|numeric',
        ]);

        $responder = Responder::find($request->responder_id);

        $type = ($responder['type'] == "Human") ? 'Human' : 'Animal';

        $alerts = Alert::select('alerts.*', 'sub_accounts.type', 'sub_accounts.name', 'users.firstname', 'users.middlename', 'users.lastname')
            ->join('sub_accounts', function($join) use ($type) {
                $join->on('alerts.sub_account_id', 'sub_accounts.id');
                $join->where('sub_accounts.type', $type);
                $join->join('users', 'sub_accounts.user_id', 'users.id');
            })
            ->get();

        return response()->json([
            'alerts' => $alerts
        ]);
    }

    public function loadAlert(Request $request) {
        $request->validate([
            'alert_id' => 'required|numeric',
        ]);

        $alert = Alert::find($request->alert_id);
        $alert['messages'] = $alert->messages();
        $alert['alertResponders'] = $alert->alertResponders();

        return response()->json([
            'alert' => $alert
        ]);
    }

    public function respond(Request $request) {
        $request->validate([
            'alert_id' => 'required|numeric',
            'responder_id' => 'required|numeric',
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
        ]);

        $alertResponder = AlertResponder::where('alert_id', $request->alert_id)
            ->where('responder_id', $request->responder_id)
            ->first();

        if(!$alertResponder) {
            $alertResponder = new AlertResponder();
            $alertResponder->alert_id = $request->alert_id;
            $alertResponder->responder_id = $request->responder_id;
            $alertResponder->latitude = $request->latitude;
            $alertResponder->longitude = $request->longitude;
            $alertResponder->status = "Responding";
            $alertResponder->save();
        }

        return response()->json([
            'alertResponder' => $alertResponder
        ]);
    }
}
