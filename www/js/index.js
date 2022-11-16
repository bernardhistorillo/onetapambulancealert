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
document.addEventListener('deviceready', onDeviceReady, false);

let host = 'http://127.0.0.1:8000';
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
        path: '/signup/',
        url: './signup.html',
        name: 'signup'
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

function onDeviceReady() {
    document.addEventListener("backbutton", onBackKeyDown, false);
}

let onBackKeyDown = function() {
    view.router.back();
};

// app.views.main.router.navigate('/signup/', {reloadCurrent: true});

// localStorage.removeItem("hasAgreedToAgreement");
// localStorage.removeItem("authUser");

let hasAgreedToTNC = localStorage.getItem("hasAgreedToAgreement");
let authUser = (localStorage.getItem("authUser")) ? JSON.parse(localStorage.getItem("authUser")) : null;
if(hasAgreedToTNC !== "true") {
    app.views.main.router.navigate('/terms/');
} else {
    if(!authUser) {
        app.views.main.router.navigate('/signup/');
    }
}
console.log(authUser);
$$(document).on("click", "#agree-tnc", function() {
    localStorage.setItem("hasAgreedToAgreement", "true");
    app.views.main.router.back();
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
            app.views.main.router.back();
        },
        error: function(xhr, status) {
            app.dialog.close();
            app.dialog.alert("Unable to connect to server.", "Network Error");
        }
    });

    // $.ajax({
    //     url: host + form.attr("action"),
    //     method: "POST",
    //     cache: false,
    //     contentType: false,
    //     processData: false,
    //     data: formData
    // }).done(async function(response) {
    //     response = JSON.parse(response);
    //     console.log(response);
    // }).fail(function(error) {
    //     app.dialog.close();
    //     app.dialog.alert("Unable to connect to server.", "Network Error");
    // }).always(function() {
    //     app.dialog.close();
    // });
});

