<?php

namespace App\Http\Controllers;

use App\Models\MedicalRecord;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;

class MedicalRecordController extends Controller
{
    public function addMedicalRecord(Request $request) {
        $request->validate([
            'user_id' => 'required|numeric',
            'title' => 'required|string',
            'details' => 'required|string',
        ]);

        $medicalRecord = new MedicalRecord();
        $medicalRecord->user_id = $request->user_id;
        $medicalRecord->title = $request->title;
        $medicalRecord->details = $request->details;
        $medicalRecord->save();

        $user = User::find($request->user_id);

        return response()->json([
            'user' => $user->data()
        ]);
    }

    public function editMedicalRecord(Request $request) {
        $request->validate([
            'medical_record_id' => 'required|numeric',
            'title' => 'required|string',
            'details' => 'required|string',
        ]);

        $medicalRecord = MedicalRecord::find($request->medical_record_id);
        $medicalRecord->title = $request->title;
        $medicalRecord->details = $request->details;
        $medicalRecord->update();

        $user = User::find($medicalRecord['user_id']);

        return response()->json([
            'user' => $user->data()
        ]);
    }

    public function deleteMedicalRecord(Request $request) {
        $request->validate([
            'medical_record_id' => 'required|numeric'
        ]);

        $medicalRecord = MedicalRecord::find($request->medical_record_id);
        $medicalRecord->delete();

        $user = User::find($medicalRecord['user_id']);

        return response()->json([
            'user' => $user->data()
        ]);
    }
}
