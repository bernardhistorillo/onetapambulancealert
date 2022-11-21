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
let version = "1_0_1"; // prod or local

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
    }, {
        path: '/responders/',
        url: './responders.html',
        name: 'responders'
    }, {
        path: '/sub-accounts/',
        url: './sub-accounts.html',
        name: 'sub-accounts'
    }, {
        path: '/alert/',
        url: './alert.html',
        name: 'alert'
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
let gpsDialog;

let onDeviceReady = function() {
    document.addEventListener("backbutton", onBackKeyDown, false);
    onLoad();
};

let onBackKeyDown = function() {
    view.router.back();
};
let onLoad = function() {
    // localStorage.removeItem("hasAgreedToAgreement" + version);
    // localStorage.removeItem("selectedSubAccount" + version);
    // localStorage.removeItem("authUser" + version);

    let hasAgreedToTNC = localStorage.getItem("hasAgreedToAgreement" + version);
    let authUser = (localStorage.getItem("authUser" + version)) ? JSON.parse(localStorage.getItem("authUser" + version)) : null;

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
    clockAudio = (env === "prod") ? new Media('https://otaa.mxtrade.io/img/clock.mp3') : new Audio("audio/clock.mp3");

    let authUser = (localStorage.getItem("authUser" + version)) ? JSON.parse(localStorage.getItem("authUser" + version)) : null;

    if(authUser) {
        $$(".user-id").val(authUser.id);
        $$("#firstname").val(authUser.firstname);
        $$("#middlename").val(authUser.middlename);
        $$("#lastname").val(authUser.lastname);
        $$("#birthdate").val(authUser.formattedBirthdate);

        $$("#email").val(authUser.email);
        $$("#contact_number").val(authUser.contact_number);
        $$("#address").val(authUser.address);

        let selectedSubAccount = (localStorage.getItem("selectedSubAccount" + version)) ? JSON.parse(localStorage.getItem("selectedSubAccount" + version)) : null;
        if(!selectedSubAccount) {
            selectedSubAccount = authUser.subAccounts[0];
            localStorage.setItem("selectedSubAccount" + version, JSON.stringify(selectedSubAccount));
        }

        for(let i = 0; i < authUser.subAccounts.length; i++) {
            if(authUser.subAccounts[i].id === selectedSubAccount.id) {
                selectedSubAccount = authUser.subAccounts[i];
                localStorage.setItem("selectedSubAccount" + version, JSON.stringify(selectedSubAccount));
                break;
            }
        }

        $$("[name='sub_account_id']").val(selectedSubAccount.id);
        $$(".selected-sub-account-name").html(selectedSubAccount.name);

        if(selectedSubAccount.medicalRecords.length === 0) {
            $$("#no-medical-records").removeClass("display-none");
            $$("#medical-records-container").addClass("display-none");
        } else {
            $$("#no-medical-records").addClass("display-none");
            $$("#medical-records-container").removeClass("display-none");

            let medicalRecords = selectedSubAccount.medicalRecords;
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

    gpsDialog = app.dialog.create({
        title: "Turn on GPS Location",
        text: "Please turn on your GPS in your location settings."
    });

    getLocation();
};

document.addEventListener('deviceready', onDeviceReady, false);

// Onload
if(env === "local") {
    onLoad();
}

// On Initialize Pages
$$(document).on("page:init", function(page) {
    page = page.detail;

    if(page.name === "home") {
        loadHomePage();
    } else if(page.name === "responders") {
        loadRespondersPage();
    } else if(page.name === "sub-accounts") {
        loadSubAccountsPage();
    } else if(page.name === "alert") {
        app.dialog.preloader("Loading");

        if(!clockAudio) {
            clockAudio = (env === "prod") ? new Media('https://otaa.mxtrade.io/img/clock.mp3', loadAlertPage()) : new Audio("audio/clock.mp3", loadAlertPage());
        } else {
            loadAlertPage()
        }
    }
});

$$(document).on("page:beforeout", function(page) {
    page = page.detail;

    if(page.name === "alert") {
        exitAlertPage();
    }
});

// terms & Conditions
$$(document).on("click", "#agree-tnc", function() {
    localStorage.setItem("hasAgreedToAgreement" + version, "true");
    app.views.main.router.back();
    app.dialog.preloader("Loading");

    setTimeout(function() {
        let authUser = (localStorage.getItem("authUser" + version)) ? JSON.parse(localStorage.getItem("authUser" + version)) : null;

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
            localStorage.setItem("authUser" + version, JSON.stringify(response.user));

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
            localStorage.setItem("authUser" + version, JSON.stringify(response.user));

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
    localStorage.removeItem("authUser");
    localStorage.removeItem("selectedSubAccount");
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
            localStorage.setItem("authUser" + version, JSON.stringify(response.user));

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
    let details = ($$(this).find('.item-text').html()) ? $$(this).find('.item-text').html() : '';

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
                                            localStorage.setItem("authUser" + version, JSON.stringify(response.user));

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
                                            localStorage.setItem("authUser" + version, JSON.stringify(response.user));

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
            localStorage.setItem("authUser" + version, JSON.stringify(response.user));

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

// Sub Accounts
let loadSubAccountsPage = async function() {
    let authUser = (localStorage.getItem("authUser" + version)) ? JSON.parse(localStorage.getItem("authUser" + version)) : null;
    let selectedSubAccount = (localStorage.getItem("selectedSubAccount" + version)) ? JSON.parse(localStorage.getItem("selectedSubAccount" + version)) : null;

    if(authUser) {
        $$("[name='user_id']").val(authUser.id);

        let content = '';

        for(let i = 0; i < authUser.subAccounts.length; i++) {
            content += '    <li>';
            content += '        <label class="item-radio item-radio-icon-end item-content">';
            content += '            <input type="radio" name="sub_accounts" value="' + authUser.subAccounts[i].id + '" ' + ((authUser.subAccounts[i].id === selectedSubAccount.id) ? 'checked' : '') + '>';
            content += '            <i class="icon icon-radio"></i>';
            content += '            <div class="item-media">';
            if(authUser.subAccounts[i].type === 'Human') {
                content += '            <i class="f7-icons">person_alt</i>';
            } else {
                content += '            <i class="f7-icons">paw</i>';
            }
            content += '            </div>';
            content += '            <div class="item-inner">';
            content += '                <div class="item-title" id="sub-account-name">' + authUser.subAccounts[i].name + '</div>';
            content += '            </div>';
            content += '        </label>';
            content += '    </li>';
        }

        $$("#sub-accounts-container").html(content);
    }
};

$$(document).on("submit", "#add-account-form", function(e) {
    e.preventDefault();

    let form = $$(this);
    app.dialog.preloader("Adding Sub-Account");

    let formData = new FormData(form[0]);

    app.request({
        method: "POST",
        url: host + form.attr("action"),
        data: formData,
        timeout: 30000,
        success: function(response, status, xhr) {
            response = JSON.parse(response);
            localStorage.setItem("authUser" + version, JSON.stringify(response.user));

            form.find("[name='name']").val("");
            form.find("[name='type'][value='Human']").prop("checked", true);

            app.dialog.close();
            app.dialog.alert("Sub-account added.", "Success");

            loadHomePage();
            loadSubAccountsPage();
        },
        error: function(xhr, status) {
            let error = JSON.parse(xhr.response);
            let errorMessage = (error.errors) ? error.errors : "Unable to connect to server.";

            app.dialog.close();
            app.dialog.alert(errorMessage, "Error");
        }
    });
});

$$(document).on("click", "#switch-account", function() {
    app.dialog.preloader("Switching");

    setTimeout(function() {
        let subAccountId = $$("[name='sub_accounts']:checked").val();
        let authUser = (localStorage.getItem("authUser" + version)) ? JSON.parse(localStorage.getItem("authUser" + version)) : null;

        for(let i = 0; i < authUser.subAccounts.length; i++) {
            if(authUser.subAccounts[i].id === parseInt(subAccountId)) {
                localStorage.setItem("selectedSubAccount" + version, JSON.stringify(authUser.subAccounts[i]));
                loadHomePage();

                break;
            }
        }

        app.dialog.close();
        view.router.back();
    }, 500);
});

// Responders
let responders;
let loadRespondersPage = async function() {
    if(!responders) {
        app.dialog.preloader("Fetching Responders");

        await app.request({
            method: "POST",
            url: host + "/api/getResponders",
            timeout: 30000,
            success: function(response, status, xhr) {
                response = JSON.parse(response);
                responders = response.responders;

                app.dialog.close();
            },
            error: function(xhr, status) {
                let error = JSON.parse(xhr.response);
                let errorMessage = (error.errors) ? error.errors : "Unable to connect to server.";

                app.dialog.close();
                app.dialog.alert(errorMessage, "Error");
            }
        });
    }

    const center = { lat: 14.115669, lng: 122.947139};

    const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 14,
        center: center,
        styles: [
            {
                "featureType": "poi",
                "elementType": "all",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "transit",
                "elementType": "all",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            }
        ]
    });

    const markerHuman = {
        url: "img/marker-human.png",
        scaledSize: new google.maps.Size(35, 50)
    };

    const markerVeterinary = {
        url: "img/marker-veterinary.png",
        scaledSize: new google.maps.Size(35, 50)
    };

    const markerUser = {
        url: "img/marker-user.png",
        scaledSize: new google.maps.Size(35, 50)
    };

    let bounds = new google.maps.LatLngBounds();
    let markers = [];
    for(let i = 0; i < responders.length; i++) {
        markers[i] = new google.maps.Marker({
            position: {
                lat: parseFloat(responders[i].latitude),
                lng: parseFloat(responders[i].longitude)
            },
            map: map,
            // animation: google.maps.Animation.BOUNCE,
            icon: (responders[i].type === "Human") ? markerHuman : markerVeterinary
        });

        bounds.extend(markers[i].position);
    }

    map.fitBounds(bounds);
};

// Alert
let alertInterval;
let gauge;
let totalSeconds = 8;
let remainingSeconds;
let clockAudio;
let loadAlertPage = function() {
    app.dialog.close();

    let content = ' <div class="width-100" style="position:absolute; top:56px; left:0">';
    content += '        <img src="img/ambulance-lights-2.png" style="width:130px" />';
    content += '    </div>';
    content += '    <div class="width-100" id="ambulance-light" style="position:absolute; top:56px; left:0; transition:1s">';
    content += '        <img src="img/ambulance-lights.png" style="width:130px" />';
    content += '    </div>';
    content += '    <div class="width-100" id="remaining-seconds" style="position:absolute; top:94px; left:0; font-size:2.6em; font-weight:bold">8</div>';

    $$(".gauge").append(content);

    gauge = app.gauge.create({
        el: '.gauge',
        value: 0,
        size: 250,
        borderColor: "#ff3b30",
        borderWidth: 20,
        borderBgColor: "#eeeeee"
    })

    remainingSeconds = totalSeconds;
    $$("#update-alert-countdown").html("Pause");
    $$("#update-alert-countdown").attr("data-action", "pause");

    loadAlertInterval();
};
let loadAlertInterval = function() {
    if(remainingSeconds >= 0) {
        alertInterval = setInterval(function() {
            if(env === "prod") { clockAudio.stop(); } else { clockAudio.load(); }
            clockAudio.play();

            let percentage = (totalSeconds - (--remainingSeconds)) / totalSeconds;

            $$("#remaining-seconds").html(remainingSeconds);

            gauge.update({
                value: percentage,
                borderColor: (remainingSeconds % 2 === 0) ? "#ff3b30" : "#b15050",
            });

            $$("#ambulance-light").css("opacity", (remainingSeconds % 2 === 0) ? 1 : 0);

            if(remainingSeconds <= 0) {
                clearInterval(alertInterval);
            }
        }, 1000);
    }
};
let exitAlertPage = function() {
    clearInterval(alertInterval);
    if(env === "prod") { clockAudio.stop(); } else { clockAudio.load(); }
};

$$(document).on("click", ".gauge", function() {
    $$("#update-alert-countdown").trigger("click");
});

$$(document).on("click", "#update-alert-countdown", function() {
    if(remainingSeconds > 0) {
        let action = $$(this).attr("data-action");

        if(action === "pause") {
            clearInterval(alertInterval);
            if(env === "prod") { clockAudio.stop(); } else { clockAudio.load(); }

            $$(this).html("Resume");
            $$(this).attr("data-action", "resume");
        } else {
            loadAlertInterval();

            $$(this).html("Pause");
            $$(this).attr("data-action", "pause");
        }
    }
});

// Emergency Response
let cooordinates;

let getLocation = function() {
    navigator.geolocation.getCurrentPosition(getLocationOnSuccess, getLocationOnError, {
        maximumAge: 3000,
        timeout: 5000,
        enableHighAccuracy: true
    });
};

let getLocationOnSuccess = function(position) {
    if(gpsDialog.opened) {
        gpsDialog.close();
    }

    cooordinates = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
    };

    console.log("latitude: " + cooordinates.latitude);
    console.log("longitude: " + cooordinates.longitude);

    setTimeout(function() {
        getLocation();
    }, 2000);
};

function getLocationOnError(error) {
    gpsDialog.open();

    setTimeout(function() {
        getLocation();
    }, 2000);
}
