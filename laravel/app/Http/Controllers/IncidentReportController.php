<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class IncidentReportController extends Controller
{
    public function index(Request $request) {
        return view('incident_reports.index');
    }
}
