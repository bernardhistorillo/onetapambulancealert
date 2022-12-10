let appUrl;
let currentRouteName;

let pageOnload = async function() {
    await allOnload();

    if(currentRouteName === "dashboard.index") {
        homeOnload();
    } else if(currentRouteName === "users.index") {
        usersOnload();
    } else if(currentRouteName === "responders.index") {
        respondersOnload();
    } else if(currentRouteName === "alerts.index") {
        alertsOnload();
    }
};
let allOnload = async function() {
    appUrl = $("input[name='app_url']").val();
    currentRouteName = $("input[name='route_name']").val();

    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });
};
let homeOnload = function() {

};
let usersOnload = function() {
    $('.data-table').DataTable({order:[]});
    $('.data-table').removeClass("invisible");
};
let respondersOnload = function() {
    $('.data-table').DataTable({order:[]});
    $('.data-table').removeClass("invisible");
};
let alertsOnload = function() {
    $('.data-table').DataTable({order:[]});
    $('.data-table').removeClass("invisible");
};
let numberFormat = function(x, decimal) {
    x = parseFloat(x);
    let parts = x;

    if(decimal !== false) {
        parts = parts.toFixed(decimal)
    }

    parts = parts.toString().split(".");

    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    if(decimal !== 0) {
        return parts.join(".");
    } else {
        return parts[0];
    }
};
let initializeReloadButton = function(link) {
    let modalSuccess = $("#modal-success");

    modalSuccess.attr("data-bs-backdrop", "static");
    modalSuccess.attr("data-bs-keyboard", "false");

    modalSuccess.find("button").removeAttr("data-bs-dismiss");
    modalSuccess.find("button").addClass("reload-page");

    modalSuccess.find("button").attr("data-link", link);
};
let showErrorFromAjax = function(error) {
    let content = "Something went wrong.";

    if(error.responseJSON) {
        content = error.responseJSON.message;
        for (let prop in error.responseJSON.errors) {
            if (Object.prototype.hasOwnProperty.call(error.responseJSON.errors, prop)) {
                content += ' ' + error.responseJSON.errors[prop];
            }
        }
    }

    $("#modal-error .message").html(content);
    $("#modal-error").modal("show");
};

$(document).ready(function() {
    pageOnload();
});

$(document).on("click", ".reload-page", function() {
    $(this).prop("disabled", true);
    let link = $(this).attr("data-link");

    if(link) {
        $(this).text("Redirecting");
        window.location.href = link;
    } else {
        $(this).text("Reloading Page");
        window.location.reload();
    }
});

// Home Page
let findGetParameter = (parameterName) => {
    let result = null,
        tmp = [];
    let items = location.search.substr(1).split("&");
    for (let index = 0; index < items.length; index++) {
        tmp = items[index].split("=");
        if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
    }
    return result;
};

// Auth
$(document).on("submit", "#login-form", function(e) {
    e.preventDefault();

    let button = $(this).find("input[type='submit']");
    button.prop("disabled", true);
    button.html("Processing");

    let url = $(this).attr("action");
    let formData = new FormData($(this)[0]);

    $.ajax({
        url: url,
        method: "POST",
        cache: false,
        contentType: false,
        processData: false,
        data: formData
    }).done(function(response) {
        if(response.data.is_authenticated) {
            button.html("Logging In");
            location.href = "/";
        } else {
            $("#modal-error .message").html(response.data.message);
            $("#modal-error").modal("show");
        }
    }).fail(function(error) {
        showErrorFromAjax(error);
    }).always(function() {
        button.prop("disabled", false);
        button.html("Submit");
    });
});

// Users
$(document).on("click", ".edit-role-confirm", function() {
    let userRole = $(this).attr("data-user-role");
    $("input[name='user_role'][value='" + userRole + "']").prop("checked", true);
    $("input[name='user_id']").val($(this).val());

    console.log($(this).attr("data-responder-id"));
    $("select[name='responder_id']").prop("disabled", !(userRole === "Responder"));
    $("select[name='responder_id']").val($(this).attr("data-responder-id"));

    $("#modal-edit-role").modal("show");
});

$(document).on("input", "input[name='user_role']", function() {
    $("select[name='responder_id']").prop("disabled", !($(this).val() === "Responder"));
});

$(document).on("submit", "#edit-role-form", function(e) {
    e.preventDefault();

    let cancelButton = $(this).find("button[data-bs-dismiss='modal']");
    cancelButton.addClass("d-none")

    let button = $(this).find("button[type='submit']");
    button.prop("disabled", true);
    button.html("Processing");

    let url = $(this).attr("action");
    let formData = new FormData($(this)[0]);

    let userRole = $(this).find("input[name='user_role']:checked").val();
    let userId = $(this).find("input[name='user_id']").val();
    let responderId = $(this).find("select[name='responder_id']").val();
    let editRoleButton = $(".edit-role-confirm[value='" + userId + "']");

    $.ajax({
        url: url,
        method: "POST",
        cache: false,
        contentType: false,
        processData: false,
        data: formData
    }).done(function(response) {
        editRoleButton.attr('data-user-role', userRole);

        if(userRole === "Responder") {
            editRoleButton.closest('tr').find('.user-role').html(userRole + '<div class="font-size-80">' + response.responder.name + '</div>');
            editRoleButton.attr('data-responder-id', responderId);
        } else {
            editRoleButton.closest('tr').find('.user-role').html(userRole);
        }

        let modalSuccess = $("#modal-success");
        modalSuccess.find(".message").html("Role Updated");
        modalSuccess.modal("show");
    }).fail(function(error) {
        showErrorFromAjax(error);
    }).always(function() {
        button.prop("disabled", false);
        button.html("Submit");

        cancelButton.removeClass("d-none");
        $("#modal-edit-role").modal("hide");
    });
});

$(document).on("click", "#add-responder-show-modal", function() {
    $("#modal-add-responder").modal("show");
});

$(document).on("submit", "#add-responder-form", function(e) {
    e.preventDefault();

    let cancelButton = $(this).find("button[data-bs-dismiss='modal']");
    cancelButton.addClass("d-none")

    let button = $(this).find("button[type='submit']");
    button.prop("disabled", true);
    button.html("Processing");

    let form = $(this);
    let url = form.attr("action");
    let formData = new FormData(form[0]);

    $.ajax({
        url: url,
        method: "POST",
        cache: false,
        contentType: false,
        processData: false,
        data: formData
    }).done(function(response) {
        $("#responders-table-container").html(response.content);
        $('.data-table').DataTable({order:[]});
        $('.data-table').removeClass("invisible");

        form.find("input[type='text']").val("");
        form.find("input[type='number']").val("");

        let modalSuccess = $("#modal-success");
        modalSuccess.find(".message").html("Responder Added");
        modalSuccess.modal("show");
    }).fail(function(error) {
        showErrorFromAjax(error);
    }).always(function() {
        button.prop("disabled", false);
        button.html("Submit");

        cancelButton.removeClass("d-none");
        $("#modal-add-responder").modal("hide");
    });
});

$(document).on("click", ".edit-responder-show-modal", function() {
    let form = $("#edit-responder-form");

    form.find("[name='responder_id']").val($(this).val());
    form.find("[name='type'][value='" + $(this).attr("data-type") + "']").prop("checked", true);
    form.find("[name='name']").val($(this).attr("data-name"));
    form.find("[name='latitude']").val($(this).attr("data-latitude"));
    form.find("[name='longitude']").val($(this).attr("data-longitude"));

    $("#modal-edit-responder").modal("show");
});

$(document).on("submit", "#edit-responder-form", function(e) {
    e.preventDefault();

    let cancelButton = $(this).find("button[data-bs-dismiss='modal']");
    cancelButton.addClass("d-none")

    let button = $(this).find("button[type='submit']");
    button.prop("disabled", true);
    button.html("Processing");

    let form = $(this);
    let url = form.attr("action");
    let formData = new FormData(form[0]);

    $.ajax({
        url: url,
        method: "POST",
        cache: false,
        contentType: false,
        processData: false,
        data: formData
    }).done(function(response) {
        $("#responders-table-container").html(response.content);
        $('.data-table').DataTable({order:[]});
        $('.data-table').removeClass("invisible");

        form.find("input[type='text']").val("");
        form.find("input[type='number']").val("");

        let modalSuccess = $("#modal-success");
        modalSuccess.find(".message").html("Responder Saved");
        modalSuccess.modal("show");
    }).fail(function(error) {
        showErrorFromAjax(error);
    }).always(function() {
        button.prop("disabled", false);
        button.html("Submit");

        cancelButton.removeClass("d-none");
        $("#modal-edit-responder").modal("hide");
    });
});
