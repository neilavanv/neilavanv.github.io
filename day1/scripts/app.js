"use strict";

// IIFE  - Immediate Invoked Functional Expression
(function(){

    function DisplayHomePage() {
        console.log("calling DisplayHomePage...");

        // Set up the "About Us" button click event
        let AboutUsbtn = document.getElementById("AboutUsBtn");
        AboutUsbtn.addEventListener("click", function () {
            location.href = "about.html";
        });

        // Dynamically add content to the <main> tag
        let MainContent = document.getElementsByTagName("main")[0];

        // Dynamically create the <p> element
        let MainParagraph = document.createElement("p");
        MainParagraph.setAttribute("id", "MainParagraph");
        MainParagraph.setAttribute("class", "mt-3");
        MainParagraph.textContent = "This is my first paragraph.";

        MainContent.append(MainParagraph);

        // Fixing string interpolation
        let FirstString = "this is ";
        // This is a string literal
        let SecondString = `${FirstString} my second string`;

        // Appending to MainParagraph
        MainParagraph.textContent = SecondString;
        MainContent.append(MainParagraph);

        // Create an article element
        let DocumentBody = document.body;

        let Article = document.createElement("article");

        let ArticleParagraph = document.createElement("p");
        ArticleParagraph.id = "ArticleParagraph";
        ArticleParagraph.classList.add("mt-3");
        ArticleParagraph.textContent = "This is my first article paragraph";

        Article.setAttribute("class", "container");
        Article.appendChild(ArticleParagraph);
        DocumentBody.appendChild(Article);


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