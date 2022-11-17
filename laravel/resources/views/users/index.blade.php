@extends('layouts.app')

@section('title', 'Users')

@section('content')
<div class="py-2">
    <div class="table-responsive">
        <table class="table table-striped table-bordered data-table invisible">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Birthdate</th>
                    <th>Email Address</th>
                    <th>Contact Number</th>
                    <th>Address</th>
                    <th>Type</th>
                </tr>
            </thead>
            <tbody>
                @foreach($users as $user)
                <tr>
                    <td>{{ $user->fullName() }}</td>
                    <td>{{ \Carbon\Carbon::parse($user['birthdate'])->format('F n, Y') }}</td>
                    <td>{{ $user['email'] }}</td>
                    <td>{{ $user['contact_number'] }}</td>
                    <td>{{ $user['address'] }}</td>
                    <td>{{ $user->role() }}</td>
                </tr>
                @endforeach
            </tbody>
        </table>
    </div>
</div>
@endsection
