<?php

namespace App\Http\Controllers;

use App\Models\MedicalRecord;
use App\Models\Responder;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;

class ResponderController extends Controller
{
    public function getResponders(Request $request) {
        $responders = Responder::all();

        return response()->json([
            'responders' => $responders
        ]);
    }
}
