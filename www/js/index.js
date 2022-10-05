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

let routes = [{
    path: '/',
    url: './index.html',
    name: 'home',
    options: {
        browserHistory: true
    }
}, {
    path: '/signup/',
    url: './signup.html',
    name: 'signup',
    options: {
        browserHistory: true
    }
}];

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
let popupTNC = app.popup.create({
    el: '.popup-tnc',
});

function onDeviceReady() {
    document.addEventListener("backbutton", onBackKeyDown, false);
}

let onBackKeyDown = function() {
    view.router.back();
};

app.views.main.router.navigate('/signup/', {reloadCurrent: true});

// localStorage.removeItem("hasAgreedToAgreement");
let hasAgreedToTNC = localStorage.getItem("hasAgreedToAgreement");
if(hasAgreedToTNC !== "true") {
    popupTNC.open();
}

$$(document).on("click", "#agree-tnc", function() {
    localStorage.setItem("hasAgreedToAgreement", "true");
    popupTNC.close();
});
