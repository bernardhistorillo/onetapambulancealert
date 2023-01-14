@extends('layouts.app')

@section('title', 'Reset Password Successful')

@section('content')
<div class="min-vh-100">
    <div class="container">
        <div class="row justify-content-center align-items-center min-vh-100">
            <div class="col-md-10 col-lg-8 col-xl-6 py-5">
                <div class="alert alert-success py-3 mb-4 shadow-sm p-4">
                    <div class="text-center mb-3">
                        <i class="far fa-check-circle fa-4x"></i>
                    </div>
                    <p class="text-center font-size-110 mb-0">You have successfully updated your password. You may now login through the mobile app with your new password.</p>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection
