"use strict";

// IIFE  - Immediate Invoked Functional Expression
(function(){

    function DisplayHomePage(){
        console.log("Calling DisplayHomePage...");

        let aboutUsButton = document.getElementById("aAboutUsBtn");
        aboutUsButton.addEventListener("click", function () {
            location.href = "about.html";
        });
    }

    function DisplayAboutPage(){
        console.log("Calling DisplayAboutPage...");
    }

    function DisplayProductPage(){
        console.log("Calling DisplayProductsPage...");
    }

    function DisplayServicesPage(){
        console.log("Calling DisplayServicesPage...");
    }

    function DisplayContactPage(){
        console.log("Calling DisplayContactPage...");
    }

    function Start() {
        console.log("Booting App.....");

        switch(document.title){
            case "Home":
                DisplayHomePage();
                break;

            case "About":
                DisplayAboutPage();
                break;

            case "Products":
                DisplayProductPage();
                break;

            case "Services":
                DisplayServicesPage();
                break;

            case "Contact":
                DisplayContactPage();
                break;
        }

    }
    window.addEventListener("load", Start);

})()