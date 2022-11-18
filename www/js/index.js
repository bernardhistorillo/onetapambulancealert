/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

// Wait for the deviceready event before using any of Cordova's device APIs.
// See https://cordova.apache.org/docs/en/latest/cordova/events/events.html#deviceready

let env = "local"; // prod or local
let routes = [
    {
        path: '/',
        url: './index.html',
        name: 'home'
    }, {
        path: '/terms/',
        url: './terms.html',
        name: 'terms'
    }, {
        path: '/authentication/',
        url: './authentication.html',
        name: 'authentication'
    }
];
let app = new Framework7({
    el: '#app',
    name: 'One Tap Ambulance Alert',
    id: 'com.onetapambulancealert.test',
    panel: {
        swipe: true,
    },
    routes: routes,
});
let $$ = Dom7;
let view = app.views.create('.view-main');
let host = (env === "local") ? 'http://127.0.0.1:8000' : 'https://otaa.mxtrade.io';
let hasAgreedToTNC;
let authUser;

let onDeviceReady = function() {
    document.addEventListener("backbutton", onBackKeyDown, false);
    onLoad();
};
let onBackKeyDown = function() {
    view.router.back();
};
let onLoad = function() {
    // localStorage.removeItem("hasAgreedToAgreement");
    // localStorage.removeItem("authUser");

    hasAgreedToTNC = localStorage.getItem("hasAgreedToAgreement");
    authUser = (localStorage.getItem("authUser")) ? JSON.parse(localStorage.getItem("authUser")) : null;

    if(hasAgreedToTNC !== "true") {
        view.router.navigate('/terms/');
    } else {
        if(!authUser) {
            view.router.navigate('/authentication/');
        } else {
            loadHomePage();
        }
    }
};
let loadHomePage = function() {
    authUser = (localStorage.getItem("authUser")) ? JSON.parse(localStorage.getItem("authUser")) : null;

    if(authUser) {
        $$(".user-id").val(authUser.id);
        $$("#firstname").val(authUser.firstname);
        $$("#middlename").val(authUser.middlename);
        $$("#lastname").val(authUser.lastname);
        $$("#birthdate").val(authUser.formattedBirthdate);

        $$("#email").val(authUser.email);
        $$("#contact_number").val(authUser.contact_number);
        $$("#address").val(authUser.address);

        if(authUser.medicalRecords.length === 0) {
            $$("#no-medical-records").removeClass("display-none");
            $$("#medical-records-container").addClass("display-none");
        } else {
            $$("#no-medical-records").addClass("display-none");
            $$("#medical-records-container").removeClass("display-none");

            let medicalRecords = authUser.medicalRecords;
            let content = '';

            for(let i = 0; i < medicalRecords.length; i++) {
                content += '    <li>';
                content += '        <a href="#" class="item-link item-content view-medical-record" data-medical-record-id="' + medicalRecords[i].id + '">';
                content += '            <div class="item-inner">';
                content += '                <div class="item-title-row">';
                content += '                    <div class="item-title">' + medicalRecords[i].title + '</div>';
                content += '                </div>';
                if(medicalRecords[i].details) {
                    content += '            <div class="item-text">' + medicalRecords[i].details + '</div>';
                }
                content += '            </div>';
                content += '        </a>';
                content += '    </li>';
            }

            $$("#medical-records-container ul").html(content);
        }
    }
};

document.addEventListener('deviceready', onDeviceReady, false);

// Onload
if(env === "local") {
    onLoad();
}

$$(document).on("page:init", function(page) {
    page = page.detail;

    if(page.name === "home") {
        loadHomePage();
    }
});

// terms & Conditions
$$(document).on("click", "#agree-tnc", function() {
    // localStorage.setItem("hasAgreedToAgreement", "true");
    app.views.main.router.back();
    app.dialog.preloader("Loading");

    setTimeout(function() {
        if(!authUser) {
            view.router.navigate('/authentication/');
        }
        app.dialog.close();
    }, 500);
});

// Authentication
$$(document).on("submit", "#signup-form", function(e) {
    e.preventDefault();

    let form = $$(this);
    app.dialog.preloader("Signing Up");

    let formData = new FormData(form[0]);

    app.request({
        method: "POST",
        url: host + form.attr("action"),
        data: formData,
        timeout: 30000,
        success: function(response, status, xhr) {
            response = JSON.parse(response);
            localStorage.setItem("authUser", JSON.stringify(response.user));

            app.dialog.close();
            view.router.back();

            loadHomePage();
        },
        error: function(xhr, status) {
            let error = JSON.parse(xhr.response);
            let errorMessage = (error.errors) ? error.errors : "Unable to connect to server.";

            app.dialog.close();
            app.dialog.alert(errorMessage, "Error");
        }
    });
});

$$(document).on("submit", "#login-form", function(e) {
    e.preventDefault();

    let form = $$(this);
    app.dialog.preloader("Logging In");

    let formData = new FormData(form[0]);

    app.request({
        method: "POST",
        url: host + form.attr("action"),
        data: formData,
        timeout: 30000,
        success: function(response, status, xhr) {
            response = JSON.parse(response);
            localStorage.setItem("authUser", JSON.stringify(response.user));

            app.dialog.close();
            view.router.back();

            loadHomePage();
        },
        error: function(xhr, status, message) {
            let error = JSON.parse(xhr.response);
            let errorMessage = (error.errors) ? error.errors : "Unable to connect to server.";

            app.dialog.close();
            app.dialog.alert(errorMessage, "Error");
        }
    });
});

$$(document).on("click", "#logout", function() {
    authUser = null;
    localStorage.removeItem("authUser");
    view.router.navigate('/authentication/');
});

// Medical Records
$$(document).on("submit", "#medical-record-form", function(e) {
    e.preventDefault();

    let form = $$(this);
    app.dialog.preloader("Adding Record");

    let formData = new FormData(form[0]);

    app.request({
        method: "POST",
        url: host + form.attr("action"),
        data: formData,
        timeout: 30000,
        success: function(response, status, xhr) {
            response = JSON.parse(response);
            localStorage.setItem("authUser", JSON.stringify(response.user));

            form.find("[name='title']").val("");
            form.find("[name='details']").val("");

            app.dialog.close();
            app.dialog.alert("Medical record successfully added.", "Success");

            loadHomePage();
        },
        error: function(xhr, status) {
            let error = JSON.parse(xhr.response);
            let errorMessage = (error.errors) ? error.errors : "Unable to connect to server.";

            app.dialog.close();
            app.dialog.alert(errorMessage, "Error");
        }
    });
});

$$(document).on("click", ".view-medical-record", function() {
    let medicalRecordId = $$(this).attr('data-medical-record-id');
    let title = $$(this).find('.item-title').html();
    let details = $$(this).find('.item-text').html();

    app.dialog.create({
        title: title,
        text: details,
        buttons: [
            {
                text: "Delete",
                onClick: function(dialog, e) {
                    let deleteMedicalRecordDialog = app.dialog.create({
                        title: "Delete Medical Record",
                        text: "Are you sure you want to delete the selected medical record?",
                        buttons: [
                            {
                                text: "Cancel",
                            }, {
                                text: "Confirm",
                                onClick: function(dialog, e) {
                                    app.dialog.close();
                                    app.dialog.preloader("Saving Changes");

                                    let formData = new FormData();
                                    formData.append('medical_record_id', medicalRecordId);

                                    app.request({
                                        method: "POST",
                                        url: host + "/api/deleteMedicalRecord",
                                        data: formData,
                                        timeout: 30000,
                                        success: function(response, status, xhr) {
                                            response = JSON.parse(response);
                                            localStorage.setItem("authUser", JSON.stringify(response.user));

                                            app.dialog.close();
                                            app.dialog.alert("Medical record successfully deleted.", "Success");

                                            loadHomePage();
                                        },
                                        error: function(xhr, status) {
                                            let error = JSON.parse(xhr.response);
                                            let errorMessage = (error.errors) ? error.errors : "Unable to connect to server.";

                                            app.dialog.close();
                                            app.dialog.alert(errorMessage, "Error");
                                        }
                                    });
                                }
                            }
                        ]
                    });

                    deleteMedicalRecordDialog.open();
                }
            }, {
                text: "Edit",
                onClick: function(dialog, e) {
                    let content = ' <div class="list no-hairlines-md" style="margin:20px 0 0 0">';
                    content += '        <ul>';
                    content += '            <li class="item-content item-input">';
                    content += '                <div class="item-inner">';
                    content += '                    <div class="item-title item-label">Health Info / Condition</div>';
                    content += '                    <div class="item-input-wrap">';
                    content += '                        <input type="text" name="edit_title" placeholder="e.g. Diabetes" value="' + title + '" required/>';
                    content += '                        <span class="input-clear-button"></span>';
                    content += '                    </div>';
                    content += '                </div>';
                    content += '            </li>';
                    content += '            <li class="item-content item-input">';
                    content += '                <div class="item-inner">';
                    content += '                    <div class="item-title item-label">Details (Optional)</div>';
                    content += '                    <div class="item-input-wrap">';
                    content += '                        <textarea name="edit_details" class="resizable" placeholder="Add more details of this condition">' + details + '</textarea>';
                    content += '                        <span class="input-clear-button"></span>';
                    content += '                    </div>';
                    content += '                </div>';
                    content += '            </li>';
                    content += '        </ul>';
                    content += '    </div>';

                    let editMedicalRecordDialog = app.dialog.create({
                        title: "Edit Medical Record",
                        content: content,
                        buttons: [
                            {
                                text: "Cancel",
                            }, {
                                text: "Save",
                                onClick: function(dialog, e) {
                                    let title = $$("[name='edit_title']").val();
                                    let details = $$("[name='edit_details']").val();

                                    app.dialog.close();
                                    app.dialog.preloader("Saving Changes");

                                    let formData = new FormData();
                                    formData.append('medical_record_id', medicalRecordId);
                                    formData.append('title', title);
                                    formData.append('details', details);

                                    app.request({
                                        method: "POST",
                                        url: host + "/api/editMedicalRecord",
                                        data: formData,
                                        timeout: 30000,
                                        success: function(response, status, xhr) {
                                            response = JSON.parse(response);
                                            localStorage.setItem("authUser", JSON.stringify(response.user));

                                            app.dialog.close();
                                            app.dialog.alert("Medical record successfully saved.", "Success");

                                            loadHomePage();
                                        },
                                        error: function(xhr, status) {
                                            let error = JSON.parse(xhr.response);
                                            let errorMessage = (error.errors) ? error.errors : "Unable to connect to server.";

                                            app.dialog.close();
                                            app.dialog.alert(errorMessage, "Error");
                                        }
                                    });
                                }
                            }
                        ]
                    });

                    editMedicalRecordDialog.on("open", function() {
                        $$(".dialog-title").css("padding", "24px 16px 0 16px");
                        $$(".dialog-inner").css("padding", "0");
                        $$("[name='edit_details']").trigger("input");
                    });

                    editMedicalRecordDialog.open();
                }
            }, {
                text: "Close"
            }
        ]
    }).open();
});

// Account Settings
$$(document).on("submit", "#account-form", function(e) {
    e.preventDefault();

    let form = $$(this);
    app.dialog.preloader("Saving Changes");

    let formData = new FormData(form[0]);

    app.request({
        method: "POST",
        url: host + form.attr("action"),
        data: formData,
        timeout: 30000,
        success: function(response, status, xhr) {
            response = JSON.parse(response);
            localStorage.setItem("authUser", JSON.stringify(response.user));

            app.dialog.close();
            app.dialog.alert("Contact Information Saved", "Success");

            loadHomePage();
        },
        error: function(xhr, status) {
            let error = JSON.parse(xhr.response);
            let errorMessage = (error.errors) ? error.errors : "Unable to connect to server.";

            app.dialog.close();
            app.dialog.alert(errorMessage, "Error");
        }
    });
});