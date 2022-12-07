<div class="modal fade" id="modal-success" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered modal-sm">
        <div class="modal-content" style="border-radius:20px">
            <div class="modal-body">
                <div class="text-center mt-3 mb-4">
                    <i class="fas fa-circle-check font-size-400 text-success"></i>
                </div>
                <div class="text-center font-weight-600 mb-1 message">Success!</div>
            </div>
            <div class="modal-footer justify-content-center">
                <button type="button" class="btn btn-success font-weight-500 px-4" data-bs-dismiss="modal">Okay</button>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="modal-error" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered modal-sm">
        <div class="modal-content" style="border-radius:20px">
            <div class="modal-body">
                <div class="text-center mt-3 mb-3">
                    <i class="fas fa-exclamation-circle font-size-400 text-danger"></i>
                </div>
                <h5 class="text-center font-weight-600 message mb-1">Failed</h5>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-danger px-4" data-bs-dismiss="modal">Close</button>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="modal-warning" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered modal-sm">
        <div class="modal-content" style="border-radius:20px">
            <div class="modal-header justify-content-end" style="z-index:1; border:0">
                <button type="button" class="bg-white font-size-140 text-black-50" data-bs-dismiss="modal" aria-label="Close" style="border:0">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body" style="margin-top:-45px">
                <div class="text-center mt-3 mb-4">
                    <i class="fas fa-circle-exclamation font-size-400 text-color-2"></i>
                </div>
                <div class="text-center font-weight-600 mb-1">Proceed?</div>
            </div>
            <div class="modal-footer justify-content-center">
                <button type="button" class="btn btn-outline-warning font-weight-500 px-4" data-bs-dismiss="modal">Cancel</button>
                <button type="button" class="btn btn-warning font-weight-500 px-4 confirm">Confirm</button>
            </div>
        </div>
    </div>
</div>

@if(Auth::check() && Route::currentRouteName() == "users.index")
<div class="modal fade" id="modal-edit-role" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content" style="border-radius:20px">
            <div class="modal-header align-items-center justify-content-between" style="z-index:1">
                <h5 class="modal-title mt-1">Edit Role</h5>
                <button type="button" class="bg-white font-size-140 text-black-50" data-bs-dismiss="modal" aria-label="Close" style="border:0">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <form id="edit-role-form" action="{{ route('users.editRole') }}">
                <input type="hidden" name="user_id" />

                <div class="modal-body py-4">
                    <div class="d-flex justify-content-center mb-3">
                        <div class="custom-control custom-radio custom-control-inline">
                            <input type="radio" id="user-role-1" name="user_role" class="custom-control-input" value="End-User">
                            <label class="custom-control-label" for="user-role-1">End-User</label>
                        </div>
                        <div class="custom-control custom-radio custom-control-inline">
                            <input type="radio" id="user-role-2" name="user_role" class="custom-control-input" value="Responder">
                            <label class="custom-control-label" for="user-role-2">Responder</label>
                        </div>
                    </div>

                    <select class="form-control" name="responder_id">
                        @foreach($responders as $responder)
                        <option value="{{ $responder['id'] }}">{{ $responder['name'] }}</option>
                        @endforeach
                    </select>
                </div>

                <div class="modal-footer justify-content-center">
                    <button type="button" class="btn btn-outline-warning font-weight-500 px-4" data-bs-dismiss="modal">Cancel</button>
                    <button type="submit" class="btn btn-warning font-weight-500 px-4">Submit</button>
                </div>
            </form>
        </div>
    </div>
</div>
@endif
