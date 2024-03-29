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
use Illuminate\Support\Facades\Storage;

class MessageController extends Controller
{
    public function sendMessage(Request $request) {
        $request->validate([
            'alert_id' => 'required|numeric',
            'type' => 'required|string',
            'message' => 'required',
        ]);

        $message = new Message();
        $message->alert_id = $request['alert_id'];
        $message->sub_account_id = ($request->sub_account_id) ?? 0;
        $message->responder_id = ($request->responder_id) ?? 0;
        $message->type = $request->type;

        if($request->type == 'photo') {
            $file = $request->file('message');
            $name = $file->hashName();
            $path = config('filesystems.disks.do.folder') . '/';
            Storage::disk('do')->put($path, $file, "public");

            $message->content = config('filesystems.disks.do.cdn_endpoint') . $path . $name;
        } else {
            $message->content = $request->message;
        }

        $message->save();

        return response()->json([
            'user' => $message->alert()->subAccount()->user()->data()
        ]);
    }
}
