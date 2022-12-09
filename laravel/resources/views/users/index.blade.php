@extends('layouts.app')

@section('title', 'Users')

@section('content')
<div class="d-sm-flex align-items-center justify-content-between mb-4">
    <h1 class="h3 mb-0 text-gray-800 d-flex align-items-center">Users</h1>
</div>

<div class="py-2">
    <div class="table-responsive">
        <table class="table table-striped table-bordered data-table invisible">
            <thead>
                <tr>
                    <th class="align-middle">Name</th>
                    <th class="align-middle">Birthdate</th>
                    <th class="align-middle">Email Address</th>
                    <th class="align-middle">Contact Number</th>
                    <th class="align-middle">Address</th>
                    <th class="align-middle">Role</th>
                    <th class="align-middle"></th>
                </tr>
            </thead>
            <tbody>
                @foreach($users as $user)
                <tr>
                    <td class="align-middle">{{ $user->fullName() }}</td>
                    <td class="align-middle">{{ \Carbon\Carbon::parse($user['birthdate'])->format('F n, Y') }}</td>
                    <td class="align-middle">{{ $user['email'] }}</td>
                    <td class="align-middle">{{ $user['contact_number'] }}</td>
                    <td class="align-middle">{{ $user['address'] }}</td>
                    <td class="align-middle user-role">
                        {{ $user->role() }}
                        @if($user->responder())
                        <div class="font-size-80">{{ $user->responder()['name'] }}</div>
                        @endif
                    </td>
                    <td class="align-middle">
                        @if($user->role() != 'Admin')
                        <button class="btn btn-outline-primary btn-sm edit-role-confirm" value="{{ $user['id'] }}" data-user-role="{{ $user->role() }}" data-responder-id="{{ $user['responder_id'] }}">Edit&nbsp;Role</button>
                        @endif
                    </td>
                </tr>
                @endforeach
            </tbody>
        </table>
    </div>
</div>
@endsection
