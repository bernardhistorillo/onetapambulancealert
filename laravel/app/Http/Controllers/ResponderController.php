<?php

namespace App\Http\Controllers;

use App\Models\MedicalRecord;
use App\Models\Responder;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;

class ResponderController extends Controller
{
    public function index(Request $request) {
        $responders = Responder::query()
            ->orderBy('name')
            ->get();

        return view('responders.index', compact('responders'));
    }

    public function getResponders(Request $request) {
        $responders = Responder::all();

        return response()->json([
            'responders' => $responders
        ]);
    }

    public function addResponder(Request $request) {
        $request->validate([
            'type' => 'required|in:Human,Veterinary',
            'name' => 'required|string',
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
        ]);

        $responder = new Responder();
        $responder->type = $request->type;
        $responder->name = $request->name;
        $responder->latitude = $request->latitude;
        $responder->longitude = $request->longitude;
        $responder->save();

        $responders = Responder::query()
            ->orderBy('name')
            ->get();

        return response()->json([
            'content' => (string)view('responders.table', compact('responders'))
        ]);
    }

    public function editResponder(Request $request) {
        $request->validate([
            'responder_id' => 'required|numeric',
            'type' => 'required|in:Human,Veterinary',
            'name' => 'required|string',
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
        ]);

        $responder = Responder::find($request->responder_id);
        $responder->type = $request->type;
        $responder->name = $request->name;
        $responder->latitude = $request->latitude;
        $responder->longitude = $request->longitude;
        $responder->update();

        $responders = Responder::query()
            ->orderBy('name')
            ->get();

        return response()->json([
            'content' => (string)view('responders.table', compact('responders'))
        ]);
    }
}
