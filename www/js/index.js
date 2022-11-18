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
    if(authUser) {
        $$("#user-id").val(authUser.id);
        $$("#firstname").val(authUser.firstname);
        $$("#middlename").val(authUser.middlename);
        $$("#lastname").val(authUser.lastname);
        $$("#birthdate").val(authUser.formattedBirthdate);

        $$("#email").val(authUser.email);
        $$("#contact_number").val(authUser.contact_number);
        $$("#address").val(authUser.address);
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
            $$(".dialog-inner").css('padding-bottom', '5px');

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