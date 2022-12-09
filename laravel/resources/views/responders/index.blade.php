@extends('layouts.app')

@section('title', 'Responders')

@section('content')
<div class="d-sm-flex align-items-center justify-content-between mb-4">
    <h1 class="h3 mb-0 text-gray-800 d-flex align-items-center">Responders</h1>

    <div class="">
        <button class="btn btn-primary" id="add-responder-show-modal">Add Responder</button>
    </div>
</div>

<div class="pt-2 pb-5" id="responders-table-container">
    @include('responders.table')
</div>
@endsection
