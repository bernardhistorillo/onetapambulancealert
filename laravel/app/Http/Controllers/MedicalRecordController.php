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
            'sub_account_id' => 'required|numeric',
            'title' => 'required|string'
        ]);

        $medicalRecord = new MedicalRecord();
        $medicalRecord->sub_account_id = $request->sub_account_id;
        $medicalRecord->title = $request->title;
        $medicalRecord->details = $request->details;
        $medicalRecord->save();

        return response()->json([
            'user' => $medicalRecord->subAccount()->user()->data()
        ]);
    }

    public function editMedicalRecord(Request $request) {
        $request->validate([
            'medical_record_id' => 'required|numeric',
            'title' => 'required|string'
        ]);

        $medicalRecord = MedicalRecord::find($request->medical_record_id);
        $medicalRecord->title = $request->title;
        $medicalRecord->details = $request->details;
        $medicalRecord->update();

        return response()->json([
            'user' => $medicalRecord->subAccount()->user()->data()
        ]);
    }

    public function deleteMedicalRecord(Request $request) {
        $request->validate([
            'medical_record_id' => 'required|numeric'
        ]);

        $medicalRecord = MedicalRecord::find($request->medical_record_id);
        $medicalRecord->delete();

        return response()->json([
            'user' => $medicalRecord->subAccount()->user()->data()
        ]);
    }
}
