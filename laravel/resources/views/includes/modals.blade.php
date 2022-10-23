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
