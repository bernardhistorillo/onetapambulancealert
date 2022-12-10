@extends('layouts.app')

@section('title', 'Alerts')

@section('content')
<div class="d-sm-flex align-items-center justify-content-between mb-4">
    <h1 class="h3 mb-0 text-gray-800 d-flex align-items-center">Alerts</h1>
</div>

<div class="py-2">
    <div class="table-responsive">
        <table class="table table-striped table-bordered data-table invisible">
            <thead>
            <tr>
                <th class="align-middle">Name</th>
                <th class="align-middle">Type</th>
                <th class="align-middle">Responder</th>
                <th class="align-middle">Status</th>
                <th class="align-middle"></th>
            </tr>
            </thead>
            <tbody>
                @foreach($alerts as $alert)
                <tr>
                    <td class="align-middle">
                        <div>{{ $alert['sub_account_name'] }}</div>
                        <div class="font-size-80">User: {{ $alert['firstname'] . ' ' . $alert['middlename'] . ' ' . $alert['lastname'] }}</div>
                    </td>
                    <td class="align-middle">{{ $alert['type'] }}</td>
                    <td class="align-middle">{!! ($alert['responder_name']) ?? '<span class="font-italic">Pending</span>' !!}</td>
                    <td class="align-middle">
                        <div>{{ $alert['status'] }}</div>
                        <div class="font-size-80">Duration: {{ \Carbon\Carbon::parse($alert['created_at'])->longAbsoluteDiffForHumans(\Carbon\Carbon::parse($alert['alert_responder_updated_at']), 2) }}</div>
                    </td>
                    <td class="align-middle text-center">
                        <a href="https://www.google.com/maps/search/?api=1&query={{ $alert['latitude'] }}%2C{{ $alert['longitude'] }}" target="_blank" class="btn btn-sm btn-outline-primary">View Location</a>
                    </td>
                </tr>
                @endforeach
            </tbody>
        </table>
    </div>
</div>
@endsection
