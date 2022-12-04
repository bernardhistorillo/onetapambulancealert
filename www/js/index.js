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
    }, {
        path: '/emergency/',
        url: './emergency.html',
        name: 'emergency'
    }, {
        path: '/history/',
        url: './history.html',
        name: 'history'
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
    let authUser = getUser();

    if(hasAgreedToTNC !== "true") {
        view.router.navigate('/terms/');
    } else {
        if(!authUser) {
            view.router.navigate('/authentication/');
        } else {
            loadHomePage();
        }
    }

    $$("body").css("opacity", "initial");
};

// Onload
document.addEventListener('deviceready', onDeviceReady, false);

if(env === "local") {
    window.onload = function(){
        onLoad();
    }
}

// On Initialize Pages
$$(document).on("page:beforein", function(page) {
    page = page.detail;

    if(page.name === "home") {
        loadHomePage();
    } else if(page.name === "responders") {
        loadRespondersPage();
    } else if(page.name === "sub-accounts") {
        loadSubAccountsPage();
    } else if(page.name === "alert") {
        loadAlertPage();
    } else if(page.name === "emergency") {
        loadEmergencyPage();
    } else if(page.name === "history") {
        loadHistoryPage();
    }
});
$$(document).on("page:beforeout", function(page) {
    page = page.detail;

    if(page.name === "alert") {
        exitAlertPage();
    } else if(page.name === "emergency") {
        exitEmergencyPage();
    } else if(page.name === "home") {
        exitHomePage();
    }
});

// GPS Location
let cooordinates;
let gpsDialog;
let getLocation = function() {
    if(env === "prod") {
        navigator.geolocation.getCurrentPosition(getLocationOnSuccess, getLocationOnError, {
            maximumAge: 3000,
            timeout: 5000,
            enableHighAccuracy: true
        });
    } else {
        getLocationOnSuccess();
    }
};
let getMapAssets = function() {
    return {
        markerHuman: {
            url: "img/marker-human.png",
            scaledSize: new google.maps.Size(44, 62)
        },
        markerVeterinary: {
            url: "img/marker-veterinary.png",
            scaledSize: new google.maps.Size(44, 62)
        },
        markerUser: {
            url: "img/marker-user.png",
            scaledSize: new google.maps.Size(44, 62)
        },
        mapStyles: [
            {
                "featureType": "poi",
                "elementType": "all",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            }, {
                "featureType": "transit",
                "elementType": "all",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            }
        ]
    }
};
let getLocationOnSuccess = function(position) {
    if(gpsDialog.opened) {
        gpsDialog.close();
    }

    if(env === "prod") {
        cooordinates = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        };
    } else {
        let authUser = getUser();

        if(authUser.responder) {
            cooordinates = {
                latitude: 14.1144898,
                longitude: 122.9567868
            };
        } else {
            cooordinates = {
                latitude: 14.1141255,
                longitude: 122.9548469
            };
        }
    }

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

// Home Page
let clockAudio;
let notificationAudio;
let hasDomInteracted = false;
let getUser = function() {
    return (localStorage.getItem("authUser" + version)) ? JSON.parse(localStorage.getItem("authUser" + version)) : null;
}
let getSelectedSubAccount = function() {
    let authUser = getUser();
    let selectedSubAccount = (localStorage.getItem("selectedSubAccount" + version)) ? JSON.parse(localStorage.getItem("selectedSubAccount" + version)) : null;

    if(!selectedSubAccount) {
        selectedSubAccount = authUser.subAccounts[0];
    } else {
        for(let i = 0; i < authUser.subAccounts.length; i++) {
            if(authUser.subAccounts[i].id === selectedSubAccount.id) {
                selectedSubAccount = authUser.subAccounts[i];
                break;
            }
        }
    }

    localStorage.setItem("selectedSubAccount" + version, JSON.stringify(selectedSubAccount));

    return selectedSubAccount;
}
let loadHomePage = async function() {
    clockAudio = (env === "prod") ? new Media('https://otaa.mxtrade.io/img/clock.mp3') : new Audio("audio/clock.mp3");
    notificationAudio = (env === "prod") ? new Media('https://otaa.mxtrade.io/img/notification.wav') : new Audio("audio/notification.wav");

    let authUser = getUser();

    if(authUser) {
        $$(".user-id").val(authUser.id);
        $$("#firstname").val(authUser.firstname);
        $$("#middlename").val(authUser.middlename);
        $$("#lastname").val(authUser.lastname);
        $$("#birthdate").val(authUser.formattedBirthdate);

        $$("#email").val(authUser.email);
        $$("#contact_number").val(authUser.contact_number);
        $$("#address").val(authUser.address);

        let selectedSubAccount = getSelectedSubAccount();

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

        gpsDialog = app.dialog.create({
            title: "Turn on GPS Location",
            text: "Please turn on your GPS in your location settings."
        });

        getLocation();

        if(authUser.responder) {
            $$(".end-user-element").addClass("display-none");
            $$(".responder-element").removeClass("display-none");

            $$("#home-container").removeClass("text-align-center");

            $$("#home-page-tab-highlight").css("width", "50%");

            if(!hasDomInteracted) {
                await app.dialog.alert("“Next to creating a life, the finest thing a man can do is save one.” -Abraham Lincoln", "", function() {
                    hasDomInteracted = true;

                    // Start: Should be the same below
                    isLoadingAlerts = true;
                    loadAlerts();
                    loadNotificationInterval();
                    // End: Should be the same below
                });
            } else {
                // Start: Should be the same above
                isLoadingAlerts = true;
                loadAlerts();
                loadNotificationInterval();
                // End: Should be the same above
            }
        } else {
            $$(".end-user-element").removeClass("display-none");
            $$(".responder-element").addClass("display-none");

            $$("#home-page-tab-highlight").css("width", "33.33%");

            $$("#home-container").addClass("text-align-center");
        }
    }
};
let exitHomePage = function() {
    isLoadingAlerts = false;
    clearInterval(notificationInterval);
};

// terms & Conditions
$$(document).on("click", "#agree-tnc", function() {
    localStorage.setItem("hasAgreedToAgreement" + version, "true");
    app.views.main.router.back();
    app.dialog.preloader("Loading");

    setTimeout(function() {
        let authUser = getUser();

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
    localStorage.removeItem("authUser" + version);
    localStorage.removeItem("selectedSubAccount" + version);
    localStorage.removeItem("hasAgreedToAgreement" + version);

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
    let authUser = getUser();
    let selectedSubAccount = getSelectedSubAccount();

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
        let authUser = getUser();

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

    try {
        const map = new google.maps.Map(document.getElementById("map-responders"), {
            zoom: 14,
            styles: getMapAssets().mapStyles
        });

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
                icon: (responders[i].type === "Human") ? getMapAssets().markerHuman : getMapAssets().markerVeterinary
            });

            bounds.extend(markers[i].position);
        }

        map.fitBounds(bounds);
    } catch (e) {
        app.dialog.create({
            title: "Google Maps Not Found",
            text: "Make sure you have internet connection to load Google Maps.",
            buttons: [
                {
                    text: "Reload",
                    onClick: function(dialog, e) {
                        location.reload();
                    }
                }
            ]
        }).open();
    }
};

// Alert
let alertInterval;
let gauge;
let totalSeconds = 8;
let remainingSeconds;
let loadAlertPage = function() {
    app.dialog.preloader("Loading");

    let authUser = getUser();
    let formData = new FormData();
    formData.append("user_id", authUser.id);

    app.request({
        method: "POST",
        url: host + "/api/getUser",
        data: formData,
        timeout: 30000,
        success: function(response, status, xhr) {
            response = JSON.parse(response);
            localStorage.setItem("authUser" + version, JSON.stringify(response.user));

            let alert = getOngoingAlert();

            if(!alert) {
                if(!clockAudio) {
                    clockAudio = (env === "prod") ? new Media('https://otaa.mxtrade.io/img/clock.mp3', loadAlertPageContent()) : new Audio("audio/clock.mp3", loadAlertPageContent());
                } else {
                    loadAlertPageContent()
                }
            } else {
                setTimeout(function() {
                    app.dialog.close();
                    view.router.navigate('/emergency/');
                },500);
            }
        },
        error: function(xhr, status) {
            let error = JSON.parse(xhr.response);
            let errorMessage = (error.errors) ? error.errors : "Unable to connect to server.";

            app.dialog.close();
            app.dialog.alert(errorMessage, "Error");
        }
    });
};
let getOngoingAlert = function() {
    let selectedSubAccount = getSelectedSubAccount();
    let alert = null;

    for(let i = 0; i < selectedSubAccount.alerts.length; i++) {
        if(selectedSubAccount.alerts[i].status === "Ongoing") {
            alert = selectedSubAccount.alerts[i];
            break;
        }
    }

    return alert;
};
let loadAlertPageContent = function() {
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
let exitAlertPage = function() {
    clearInterval(alertInterval);
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

// Emergency
let messages;
let messagebar;
let isLoadingAlert = false;
let emergencyMap;
let directionsService;
let directionsRenderer;
let emergencyMarkers = [];
let emergencyMarkerIndeces = [];
let directionsIsLoaded = false;
let isEmergencyPageFirstLoad = true;
let loadEmergencyPage = function() {
    try {
        emergencyMap = new google.maps.Map(document.getElementById("map-emergency"), {
            zoom: 17,
            mapTypeControl: false,
            streetViewControl: false,
            center: {
                lat: cooordinates.latitude,
                lng: cooordinates.longitude
            },
            styles: getMapAssets().mapStyles
        });

        directionsService = new google.maps.DirectionsService();
        directionsRenderer = new google.maps.DirectionsRenderer();

        messages = app.messages.create({
            el: '.messages',
            firstMessageRule: function (message, previousMessage, nextMessage) {
                if (message.isTitle) return false;
                return !previousMessage || previousMessage.type !== message.type || previousMessage.name !== message.name;

            },
            lastMessageRule: function (message, previousMessage, nextMessage) {
                if (message.isTitle) return false;
                return !nextMessage || nextMessage.type !== message.type || nextMessage.name !== message.name;

            },
            tailMessageRule: function (message, previousMessage, nextMessage) {
                if (message.isTitle) return false;
                return !nextMessage || nextMessage.type !== message.type || nextMessage.name !== message.name;
            }
        });

        messagebar = app.messagebar.create({
            el: '.messagebar'
        });

        isLoadingAlert = true;
        loadAlert();

        setTimeout(function() {
            $$("#map-tab").scrollTo(0, 0);
            $$(".messages").scrollTo(0, 100000);
        }, 100);
    } catch (e) {
        app.dialog.create({
            title: "Google Maps Not Found",
            text: "Make sure you have internet connection to load Google Maps.",
            buttons: [
                {
                    text: "Reload",
                    onClick: function(dialog, e) {
                        location.reload();
                    }
                }
            ]
        }).open();
    }
};
let loadAlert = function() {
    let authUser = getUser();

    let formData = new FormData();
    formData.append('alert_id', (authUser.responder) ? loadedAlertId : getOngoingAlert().id);

    app.request({
        method: "POST",
        url: host + "/api/loadAlert",
        data: formData,
        timeout: 30000,
        success: function(response, status, xhr) {
            response = JSON.parse(response);

            formatMessages(response.alert.messages);
            updateEmergencyMap(response.alert);

            if(isLoadingAlert) {
                setTimeout(function() {
                    loadAlert();
                }, 1000);
            } else {
                isEmergencyPageFirstLoad = true;
            }
        },
        error: function(xhr, status) {
            if(isLoadingAlert) {
                setTimeout(function() {
                    loadAlert();
                }, 1000);
            } else {
                isEmergencyPageFirstLoad = true;
            }
        }
    });
};
let exitEmergencyPage = function() {
    app.dialog.preloader("Loading");
    isLoadingAlert = false;

    setTimeout(function() {
        view.router.back();
        app.dialog.close();
    }, 500);
};
let formatMessages = function(_messages) {
    let authUser = getUser();
    let updatedMessages = [];


    for(let i = 0; i < _messages.length; i++) {
        let type;
        if(!authUser.responder) {
            type = (_messages[i].sub_account_id) ? "sent" : "received";
        } else {
            type = (_messages[i].responder_id) ? "sent" : "received";
        }

        updatedMessages.push({
            message_id: _messages[i].id,
            type: type,
            text: (_messages[i].type === "text") ? _messages[i].content : null,
            imageSrc: (_messages[i].type === "photo") ? _messages[i].content : null,
            name: (_messages[i].responder_id) ? _messages[i].name : null
        });
    }

    if(JSON.stringify(messages.messages) !== JSON.stringify(updatedMessages)) {
        messages.clear();
        messages.messages = updatedMessages;
        messages.renderMessages();
        messages.layout();

        $$("#map-tab").scrollTo(0, 0);
        $$(".messages").scrollTo(0, 100000);
    }
};
let updateEmergencyMap = function(alert) {
    let alertResponders = alert.alertResponders;
    let authUser = getUser();

    if(authUser.responder) {
        let content = '';
        content += '    <div class="item-media">';
        content += '        <i class="f7-icons">' + $$(".view-emergency[data-alert-id='" + loadedAlertId + "'] .f7-icons").html() + '</i>';
        content += '    </div>';
        content += '    <div class="item-inner">';
        content += '        <div class="item-title">';
        content += '            <div class="item-header">Name</div>';
        content += '                <div>' + $$(".view-emergency[data-alert-id='" + loadedAlertId + "'] .alert-sub-account-name").html() + '</div>';
        content += '                <div class="item-footer">' + $$(".view-emergency[data-alert-id='" + loadedAlertId + "'] .item-footer").html() + '</div>';
        content += '            </div>';
        content += '        <div class="item-after">View</div>';
        content += '    </div>';

        if($$("#view-alert-medical-records").html() !== content) {
            $$("#view-alert-medical-records").html(content);
        }

        $$("#selected-alert").removeClass("display-none");

        for(let i = 0; i < alertResponders.length; i++) {
            let content = '';

            if(alertResponders[i].responder_id === authUser.responder.id && alertResponders[i].status === "Responding") {
                content += '<div class="width-100" style="margin-right:10px"><button class="button button-outline button-round" id="stop-response">Stop Response</button></div>';
                content += '<div class="width-100"><button class="button button-fill button-round" id="complete-response">Set as Done</button></div>';
            } else {
                content += '<button class="button button-fill button-round" id="respond">Accept and Respond</button>';
            }

            if($$("#alert-responder-action").html() !== content) {
                $$("#alert-responder-action").html(content);
            }
        }
    } else {
        $$("#selected-alert").addClass("display-none");
    }

    if(alertResponders.length > 0) {
        $$("#alerting-responders").addClass("display-none");
        $$("#alert-responders-label").removeClass("display-none");

        let content = '';

        for(let i = 0; i < alertResponders.length; i++) {
            content += '    <li class="item-link item-content">';
            content += '        <div class="item-media">';
            content += '            <img src="img/ambulance.png" width="32">';
            content += '        </div>';
            content += '        <div class="item-inner">';
            content += '            <div class="item-title" id="sub-account-name">' + alertResponders[i].name + '</div>';
            content += '        </div>';
            content += '    </li>';
        }

        if($$("#alert-responders-container ul").html() !== content) {
            $$("#alert-responders-container ul").html(content);
        }

        $$("#alert-responders-container").removeClass("display-none");
    } else {
        if(authUser.responder) {
            $$("#alerting-responders").addClass("display-none");
        } else {
            $$("#alerting-responders").removeClass("display-none");
        }

        $$("#alert-responders-label").addClass("display-none");
        $$("#alert-responders-container").addClass("display-none");
    }

    let newEmergencyMarkerIndeces = [];
    let bounds = new google.maps.LatLngBounds();
    let boundsLength = 0;

    for(let i = 0; i < alertResponders.length; i++) {
        let index = "responder" + alertResponders[i].responder_id;

        newEmergencyMarkerIndeces.push(index);

        if(emergencyMarkerIndeces.includes(index)) {
            emergencyMarkers[index].setPosition({
                lat: parseFloat(alertResponders[i].latitude),
                lng: parseFloat(alertResponders[i].longitude)
            });

            emergencyMarkerIndeces.splice(index, 1);
        } else {
            emergencyMarkers[index] = new google.maps.Marker({
                position: {
                    lat: parseFloat(alertResponders[i].latitude),
                    lng: parseFloat(alertResponders[i].longitude)
                },
                map: emergencyMap,
                icon: (alertResponders[i].type === "Human") ? getMapAssets().markerHuman : getMapAssets().markerVeterinary
            });
        }

        bounds.extend(emergencyMarkers[index].position);
        boundsLength++;
        emergencyMarkers[index].setMap(emergencyMap);

        if(authUser.responder) {
            if(index === "responder" + authUser.responder.id) {
                if(!directionsIsLoaded) {
                    directionsRenderer.setMap(emergencyMap);

                    directionsService.route({
                        origin: new google.maps.LatLng(parseFloat(alertResponders[i].latitude), parseFloat(alertResponders[i].longitude)),
                        destination: new google.maps.LatLng(parseFloat(alert.latitude), parseFloat(alert.longitude)),
                        optimizeWaypoints: false,
                        travelMode: 'WALKING'
                    }, function(result, status) {
                        if (status === 'OK') {
                            directionsRenderer.setDirections(result);
                        }
                    });

                    directionsIsLoaded = true;
                }
            }
        }
    }

    if(authUser.responder) {
        let index = "responder" + authUser.responder.id;
        if(!newEmergencyMarkerIndeces.includes(index)) {
            newEmergencyMarkerIndeces.push(index);

            if(emergencyMarkerIndeces.includes(index)) {
                emergencyMarkers[index].setPosition({
                    lat: cooordinates.latitude,
                    lng: cooordinates.longitude
                });

                emergencyMarkerIndeces.splice(index, 1);
            } else {
                emergencyMarkers[index] = new google.maps.Marker({
                    position: {
                        lat: cooordinates.latitude,
                        lng: cooordinates.longitude
                    },
                    map: emergencyMap,
                    icon: (authUser.responder.type === "Human") ? getMapAssets().markerHuman : getMapAssets().markerVeterinary
                });
            }
            bounds.extend(emergencyMarkers[index].position);
            boundsLength++;
            emergencyMarkers[index].setMap(emergencyMap);
        }
    }

    let index = "subAccount" + loadedAlertId;
    newEmergencyMarkerIndeces.push(index);

    if(emergencyMarkerIndeces.includes(index)) {
        emergencyMarkers[index].setPosition({
            lat: parseFloat(alert.latitude),
            lng: parseFloat(alert.longitude)
        });

        emergencyMarkerIndeces.splice(index, 1);
    } else {
        emergencyMarkers[index] = new google.maps.Marker({
            position: {
                lat: parseFloat(alert.latitude),
                lng: parseFloat(alert.longitude)
            },
            map: emergencyMap,
            icon: getMapAssets().markerUser
        });
    }
    bounds.extend(emergencyMarkers[index].position);
    boundsLength++;
    emergencyMarkers[index].setMap(emergencyMap);

    if(isEmergencyPageFirstLoad && boundsLength > 1) {
        emergencyMap.fitBounds(bounds);
        isEmergencyPageFirstLoad = false;
    }

    for(let i = 0; i < emergencyMarkerIndeces.length; i++) {
        emergencyMarkers[emergencyMarkerIndeces[i]].setMap(null);
    }

    emergencyMarkerIndeces = newEmergencyMarkerIndeces;
};
let cameraSuccess = function(imageData) {
    let url = 'data:image/jpeg;base64,' + imageData;
    let message = {
        imageSrc: url
    };

    messages.addMessage(message);

    $$("#map-tab").scrollTo(0, 0);
    $$(".messages").scrollTo(0, 100000);

    let authUser = getUser();

    let sendMessage = function(formData) {
        app.request({
            method: "POST",
            url: host + "/api/sendMessage",
            data: formData,
            timeout: 30000,
            error: function(xhr, status) {
                sendMessage(formData);
            }
        });
    };

    fetch(url)
        .then(res => res.blob())
        .then(blob => {
            let formData = new FormData();
            formData.append('type', "photo");
            formData.append('message', blob);

            if(authUser.responder) {
                formData.append('responder_id', authUser.responder.id);
                formData.append('alert_id', loadedAlertId);
            } else {
                formData.append('sub_account_id', getSelectedSubAccount().id);
                formData.append('alert_id', getOngoingAlert().id);
            }

            sendMessage(formData);
        });
};
let cameraError = function(message) {
    alert('Failed because: ' + message);
};
$$(document).on("click", "#capture-photo", function() {
    navigator.camera.getPicture(cameraSuccess, cameraError, {
        destinationType: Camera.DestinationType.DATA_URL,
        correctOrientation: true
    });
});
$$(document).on("click", "#send-message", function() {
    let text = messagebar.getValue().replace(/\n/g, '<br>').trim();
    if (!text.length) return;

    messagebar.clear();
    messagebar.focus();

    messages.addMessage({
        type: "sent",
        text: text,
    });

    $$("#map-tab").scrollTo(0, 0);
    $$(".messages").scrollTo(0, 100000);

    let authUser = getUser();

    let formData = new FormData();
    formData.append('type', "text");
    formData.append('message', text);
    if(authUser.responder) {
        formData.append('responder_id', authUser.responder.id);
        formData.append('alert_id', loadedAlertId);
    } else {
        formData.append('sub_account_id', getSelectedSubAccount().id);
        formData.append('alert_id', getOngoingAlert().id);
    }

    let sendMessage = function(formData) {
        app.request({
            method: "POST",
            url: host + "/api/sendMessage",
            data: formData,
            timeout: 30000,
            error: function(xhr, status) {
                sendMessage(formData);
            }
        });
    };

    sendMessage(formData);
});

// Responder Home Page
let isLoadingAlerts = false;
let notificationInterval;
let isRinging = false;
let loadAlerts = function() {
    let authUser = getUser();

    let formData = new FormData();
    formData.append('responder_id', authUser.responder.id);

    app.request({
        method: "POST",
        url: host + "/api/loadAlerts",
        data: formData,
        timeout: 30000,
        success: function(response, status, xhr) {
            response = JSON.parse(response);
            let alerts = response.alerts;
            let content = '';

            // localStorage.removeItem("mutedAlerts" + version);
            let mutedAlerts = (localStorage.getItem("mutedAlerts" + version)) ? JSON.parse(localStorage.getItem("mutedAlerts" + version)) : [];
            let _isRinging = false;

            for(let i = 0; i < alerts.length; i++) {
                if(alerts[i].status === "Ongoing") {
                    if(!_isRinging) {
                        _isRinging = !mutedAlerts.includes(alerts[i].id);
                        isRinging = _isRinging;
                    }

                    content += '    <li>';
                    content += '        <div class="item-content">';
                    content += '            <div class="item-media view-emergency" data-alert-id="' + alerts[i].id + '">';
                    content += '                <i class="f7-icons">' + ((alerts[i].type === "Human") ? 'person_alt' : 'paw') + '</i>';
                    content += '            </div>';
                    content += '            <div class="item-inner">';
                    content += '                <div class="item-title view-emergency" data-alert-id="' + alerts[i].id + '">';
                    content += '                    <div class="item-header">Name</div>';
                    content += '                    <div class="alert-sub-account-name">' + alerts[i].name + '</div>';
                    content += '                    <div class="item-footer">Account: ' + alerts[i].firstname + ' ' + alerts[i].middlename + ' ' + alerts[i].lastname + '</div>';
                    content += '                </div>';
                    content += '                <div class="item-after">';
                    content += '                    <div>';
                    content += '                        <input type="checkbox" name="mute-alert" class="display-none" data-alert-id="' + alerts[i].id + '"' + ((!mutedAlerts.includes(alerts[i].id)) ? 'checked' : '') + '>';
                    content += '                        <i class="f7-icons mute-alert unmuted ' + ((mutedAlerts.includes(alerts[i].id)) ? 'display-none' : '') + '">speaker_3_fill</i>';
                    content += '                        <i class="f7-icons mute-alert muted ' + ((!mutedAlerts.includes(alerts[i].id)) ? 'display-none' : '') + '">speaker_slash_fill</i>';
                    content += '                    </div>';
                    content += '                </div>';
                    content += '            </div>';
                    content += '        </div>';
                    content += '    </li>';
                }
            }

            if(content !== '') {
                $$("#no-active-alerts").addClass("display-none");
                $$("#active-alerts-container").removeClass("display-none");

                if($$("#active-alerts-container ul").html() !== content) {
                    $$("#active-alerts-container ul").html(content);
                }
            } else {
                $$("#no-active-alerts").removeClass("display-none");
                $$("#active-alerts-container").addClass("display-none");
            }

            if(isLoadingAlerts) {
                setTimeout(function() {
                    loadAlerts();
                }, 1000);
            }
        },
        error: function(xhr, status) {
            if(isLoadingAlerts) {
                setTimeout(function() {
                    loadAlerts();
                }, 1000);
            }
        }
    });

    directionsIsLoaded = false;
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
                app.dialog.preloader("Loading");

                let selectedSubAccount = getSelectedSubAccount();

                let formData = new FormData();
                formData.append('sub_account_id', selectedSubAccount.id);
                formData.append('latitude', cooordinates.latitude);
                formData.append('longitude', cooordinates.longitude);
                formData.append('notes', $$("#alert-notes").val());

                $$("#alert-notes").val("");

                app.request({
                    method: "POST",
                    url: host + "/api/alert",
                    data: formData,
                    timeout: 30000,
                    success: function(response, status, xhr) {
                        response = JSON.parse(response);
                        localStorage.setItem("authUser" + version, JSON.stringify(response.user));

                        app.dialog.close();

                        view.router.navigate('/emergency/');
                    },
                    error: function(xhr, status) {
                        let error = JSON.parse(xhr.response);
                        let errorMessage = (error.errors) ? error.errors : "Unable to connect to server.";

                        app.dialog.close();
                        app.dialog.alert(errorMessage, "Error");
                    }
                });
            }
        }, 1000);
    }
};
let loadedAlertId;
let loadHistoryPage = function() {
    app.dialog.preloader("Loading");

    let authUser = getUser();

    let formData = new FormData();
    formData.append('responder_id', authUser.responder.id);

    app.request({
        method: "POST",
        url: host + "/api/loadAlerts",
        data: formData,
        timeout: 30000,
        success: function(response, status, xhr) {
            response = JSON.parse(response);
            let alerts = response.alerts;
            let content = '';

            for(let i = 0; i < alerts.length; i++) {
                if(alerts[i].status === "Completed") {
                    content += '    <li>';
                    content += '        <div class="item-content view-history-alert" data-alert-id="' + alerts[i].id + '">';
                    content += '            <div class="item-media">';
                    content += '                <i class="f7-icons">' + ((alerts[i].type === "Human") ? 'person_alt' : 'paw') + '</i>';
                    content += '            </div>';
                    content += '            <div class="item-inner">';
                    content += '                <div class="item-title">';
                    content += '                    <div class="item-header">Name</div>';
                    content += '                    <div class="alert-sub-account-name">' + alerts[i].name + '</div>';
                    content += '                    <div class="item-footer">Account: ' + alerts[i].firstname + ' ' + alerts[i].middlename + ' ' + alerts[i].lastname + '</div>';
                    content += '                    <div class="item-footer">Responder: ' + alerts[i].responder_name + '</div>';
                    content += '                    <div class="item-footer">Duration: ' + alerts[i].duration + '</div>';
                    content += '                </div>';
                    content += '            </div>';
                    content += '        </div>';
                    content += '    </li>';
                }
            }

            $$("#alerts-history-container ul").html(content);
            app.dialog.close();
        },
        error: function(xhr, status) {
            let error = JSON.parse(xhr.response);
            let errorMessage = (error.errors) ? error.errors : "Unable to connect to server.";

            app.dialog.close();
            app.dialog.alert(errorMessage, "Error");
        }
    });

    directionsIsLoaded = false;
};
let loadNotificationInterval = function() {
    $$("body").trigger("click");

    notificationInterval = setInterval(function() {
        if(isRinging) {
            if(env === "prod") { notificationAudio.stop(); } else { notificationAudio.load(); }
            notificationAudio.play();

            $$("#responder-ambulance-light").css("opacity", 1);

            setTimeout(function() {
                $$("#responder-ambulance-light").css("opacity", 0);
            }, 400);

            setTimeout(function() {
                $$("#responder-ambulance-light").css("opacity", 1);
            }, 800);

            setTimeout(function() {
                $$("#responder-ambulance-light").css("opacity", 0);
            }, 1200);

            setTimeout(function() {
                $$("#responder-ambulance-light").css("opacity", 1);
            }, 1600);

            setTimeout(function() {
                $$("#responder-ambulance-light").css("opacity", 0);
            }, 2000);
        }
    }, 2000);
};
$$(document).on("click", ".view-emergency", function() {
    loadedAlertId = $$(this).attr("data-alert-id");
    view.router.navigate('/emergency/');
});
$$(document).on("click", "#respond", function() {
    app.dialog.preloader("Loading");

    let authUser = getUser();

    let formData = new FormData();
    formData.append('alert_id', loadedAlertId);
    formData.append('responder_id', authUser.responder.id);
    formData.append('latitude', cooordinates.latitude);
    formData.append('longitude', cooordinates.longitude);

    app.request({
        method: "POST",
        url: host + "/api/respond",
        data: formData,
        timeout: 30000,
        success: function(response, status, xhr) {
            response = JSON.parse(response);

            let content = ' <button class="button button-outline button-round" style="margin-right:10px" id="stop-response">Stop Response</button>';
            content += '    <button class="button button-fill button-round" id="complete-response">Set as Done</button>';

            $$("#alert-responder-action").html(content);

            app.dialog.close();
        },
        error: function(xhr, status) {
            let error = JSON.parse(xhr.response);
            let errorMessage = (error.errors) ? error.errors : "Unable to connect to server.";

            app.dialog.close();
            app.dialog.alert(errorMessage, "Error");
        }
    });
});
$$(document).on("click", "#stop-response", function() {
    app.dialog.preloader("Loading");

    let authUser = getUser();

    let formData = new FormData();
    formData.append('alert_id', loadedAlertId);
    formData.append('responder_id', authUser.responder.id);

    app.request({
        method: "POST",
        url: host + "/api/stopResponse",
        data: formData,
        timeout: 30000,
        success: function(response, status, xhr) {
            response = JSON.parse(response);

            let content = '<button class="col button button-fill button-round" id="respond">Accept and Respond</button>';

            $$("#alert-responder-action").html(content);

            app.dialog.close();
        },
        error: function(xhr, status) {
            let error = JSON.parse(xhr.response);
            let errorMessage = (error.errors) ? error.errors : "Unable to connect to server.";

            app.dialog.close();
            app.dialog.alert(errorMessage, "Error");
        }
    });
});
$$(document).on("click", "#complete-response", function() {
    app.dialog.create({
        title: "Set as Done",
        text: "Do you want to set the response as done?",
        buttons: [
            {
                text: "Cancel"
            }, {
                text: "Confirm",
                onClick: function(dialog, e) {
                    app.dialog.preloader("Loading");

                    let authUser = getUser();

                    let formData = new FormData();
                    formData.append('alert_id', loadedAlertId);
                    formData.append('responder_id', authUser.responder.id);

                    app.request({
                        method: "POST",
                        url: host + "/api/completeResponse",
                        data: formData,
                        timeout: 30000,
                        success: function(response, status, xhr) {
                            response = JSON.parse(response);

                            $$("#alert-responder-action").html('');

                            app.dialog.close();
                            app.dialog.alert("Response is now completed and recorded.", "Response Completed", function() {
                                view.router.back();
                            });
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
    }).open();
});
$$(document).on("click", ".mute-alert", function() {
    $$(this).closest("div").find("input[name='mute-alert']").trigger("change");
});
$$(document).on("change", "input[name='mute-alert']", function() {
    $$(this).prop("checked", !$$(this).prop("checked"));

    let mutedAlerts = (localStorage.getItem("mutedAlerts" + version)) ? JSON.parse(localStorage.getItem("mutedAlerts" + version)) : [];
    let alertId = parseInt($$(this).attr("data-alert-id"));

    if($$(this).prop("checked")) {
        let index = mutedAlerts.indexOf(alertId);
        mutedAlerts.splice(index, 1);

        $$(this).closest("div").find(".unmuted").removeClass("display-none");
        $$(this).closest("div").find(".muted").addClass("display-none");
    } else {
        if(!mutedAlerts.includes(alertId)) {
            mutedAlerts.push(alertId);
        }

        $$(this).closest("div").find(".unmuted").addClass("display-none");
        $$(this).closest("div").find(".muted").removeClass("display-none");
    }

    localStorage.setItem("mutedAlerts" + version, JSON.stringify(mutedAlerts))
});