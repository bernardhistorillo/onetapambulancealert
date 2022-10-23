@extends('layouts.app')

@section('title', 'Log In')

@section('content')
<div class="min-vh-100">
    <div class="container">
        <div class="row justify-content-center align-items-center min-vh-100">
            <div class="col-md-10 col-lg-8 col-xl-6 py-5">
                <div class="card py-3 mb-4 shadow-sm">
                    <div class="card-body p-4">
                        <h1 class="text-center font-weight-700 font-size-160 text-color-1">Log In</h1>

                        <form class="pt-2" id="login-form" action="{{ route('auth.login') }}">
                            <div class="mb-2">
                                <input type="text" name="email" class="form-control py-2 px-3" placeholder="Email" required />
                            </div>
                            <div class="mb-2 position-relative">
                                <input type="password" name="password" class="form-control py-2 px-3" placeholder="Password" required />
                            </div>

                            <div class="text-center mt-4 pt-2">
                                <button type="submit" class="btn btn-primary w-100 font-weight-500 text-white px-5 py-2">
                                    <span class="px-5">Submit</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection
