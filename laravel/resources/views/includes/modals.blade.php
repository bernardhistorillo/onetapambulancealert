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

@if(Auth::check())
    @if(Route::currentRouteName() == "users.index")
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

    @if(Route::currentRouteName() == "responders.index")
    <div class="modal fade" id="modal-add-responder" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content" style="border-radius:20px">
                <div class="modal-header align-items-center justify-content-between" style="z-index:1">
                    <h5 class="modal-title mt-1">Add Responder</h5>
                    <button type="button" class="bg-white font-size-140 text-black-50" data-bs-dismiss="modal" aria-label="Close" style="border:0">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <form id="add-responder-form" action="{{ route('responders.add') }}">
                    <div class="modal-body py-4">
                        <label for="add-name">Type</label>
                        <div class="d-flex mb-3">
                            <div class="custom-control custom-radio custom-control-inline">
                                <input type="radio" id="responder-type-1" name="type" class="custom-control-input" value="Human" checked>
                                <label class="custom-control-label mr-2" for="responder-type-1">Human</label>
                            </div>
                            <div class="custom-control custom-radio custom-control-inline">
                                <input type="radio" id="responder-type-2" name="type" class="custom-control-input" value="Veterinary">
                                <label class="custom-control-label" for="responder-type-2">Veterinary</label>
                            </div>
                        </div>

                        <div class="mb-3">
                            <label for="add-name">Name</label>
                            <input type="text" name="name" class="form-control py-2 px-3" id="add-name" placeholder="Name" required />
                        </div>

                        <div class="d-flex mb-2">
                            <div class="mr-2">
                                <label for="add-latitude">Latitude</label>
                                <input type="number" name="latitude" class="form-control py-2 px-3" id="add-latitude" placeholder="Latitude" step="any" required />
                            </div>

                            <div class="ml-2">
                                <label for="add-longitude">Longitude</label>
                                <input type="number" name="longitude" class="form-control py-2 px-3" id="add-longitude" placeholder="Longitude" step="any" required />
                            </div>
                        </div>
                    </div>

                    <div class="modal-footer justify-content-center">
                        <button type="button" class="btn btn-outline-primary font-weight-500 px-4" data-bs-dismiss="modal">Cancel</button>
                        <button type="submit" class="btn btn-primary font-weight-500 px-4">Submit</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <div class="modal fade" id="modal-edit-responder" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content" style="border-radius:20px">
                <div class="modal-header align-items-center justify-content-between" style="z-index:1">
                    <h5 class="modal-title mt-1">Edit Responder</h5>
                    <button type="button" class="bg-white font-size-140 text-black-50" data-bs-dismiss="modal" aria-label="Close" style="border:0">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <form id="edit-responder-form" action="{{ route('responders.edit') }}">
                    <input type="hidden" name="responder_id" />

                    <div class="modal-body py-4">
                        <label for="add-name">Type</label>
                        <div class="d-flex mb-3">
                            <div class="custom-control custom-radio custom-control-inline">
                                <input type="radio" id="edit-responder-type-1" name="type" class="custom-control-input" value="Human" checked>
                                <label class="custom-control-label mr-2" for="edit-responder-type-1">Human</label>
                            </div>
                            <div class="custom-control custom-radio custom-control-inline">
                                <input type="radio" id="edit-responder-type-2" name="type" class="custom-control-input" value="Veterinary">
                                <label class="custom-control-label" for="edit-responder-type-2">Veterinary</label>
                            </div>
                        </div>

                        <div class="mb-3">
                            <label for="edit-name">Name</label>
                            <input type="text" name="name" class="form-control py-2 px-3" id="edit-name" placeholder="Name" required />
                        </div>

                        <div class="d-flex mb-2">
                            <div class="mr-2">
                                <label for="edit-latitude">Latitude</label>
                                <input type="number" name="latitude" class="form-control py-2 px-3" id="edit-latitude" placeholder="Latitude" step="any" required />
                            </div>

                            <div class="ml-2">
                                <label for="edit-longitude">Longitude</label>
                                <input type="number" name="longitude" class="form-control py-2 px-3" id="edit-longitude" placeholder="Longitude" step="any" required />
                            </div>
                        </div>
                    </div>

                    <div class="modal-footer justify-content-center">
                        <button type="button" class="btn btn-outline-primary font-weight-500 px-4" data-bs-dismiss="modal">Cancel</button>
                        <button type="submit" class="btn btn-primary font-weight-500 px-4">Submit</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
    @endif
@endif
