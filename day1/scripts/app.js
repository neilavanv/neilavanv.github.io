"use strict";

// IIFE  - Immediate Invoked Functional Expression
(function(){

    function DisplayHomePage() {
        console.log("calling DisplayHomePage...")
        let aboutUsbtn = document.getElementById("AboutUsbtn")
        aboutUsbtn.addEventListener("click", function (){})
        location.href= "about.html"

        let MainContent = document.getElementsByTagName("main")[0];
        let MainParagraph = document.getElementById("p");

        MainParagraph.setAttribute("id", "MainParagraph");
        MainParagraph.setAttribute("class", "mt-3");
        MainParagraph.textContent = "this is my first paragraph";

        MainContent.append(MainParagraph);


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