let appUrl;
let currentRouteName;

let pageOnload = async function() {
    await allOnload();

    if(currentRouteName === "dashboard.index") {
        homeOnload();
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
    $('.data-table').DataTable({
        order: []
    });
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
