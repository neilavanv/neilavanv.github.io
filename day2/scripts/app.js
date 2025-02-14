 "use strict";

// IIFE - Immediately Invoked Functional Expression
// AKA - Anonymous Self-Executing Function
(function(){

    function CheckLogin(){
        console.log("[INFO] Checking user login status");

        const loginNav = document.getElementById("login");

        if(!loginNav){
            console.warn("[WARNING] loginNav element not found. Skipping CheckLogin().");
            return;
        }

        const userSession = sessionStorage.getItem("user");

        if(userSession){
            loginNav.innerHTML = `<i class = "fas fa-sign-out-alt"></i> Logout`;
            loginNav.href = "#";
            loginNav.addEventListener("click", (event) => {
                event.preventDefault();
                sessionStorage.removeItem("user");
                location.href = "login.html";
            });
        }
    }

    function updateActiveNavLink() {
        console.log("[INFO] updateActiveNavLink called...");

        const currentPage = document.title.trim();
        const navLinks = document.querySelectorAll("nav a");

        navLinks.forEach(link =>{

            if(link.textContent.trim() === currentPage){
                link.classList.add('active');
            }else{
                link.classList.remove('active');
            }
        });

    }

    /**
     * Load the navbar into the current page
     * @returns {Promise<void>}
     */
    async function LoadHeader() {
        console.log("[INFO] LoadHeader Called ...");

        return fetch ("header.html")
            .then(response => response.text())
            .then(data => {
                document.querySelector("header").innerHTML = data;
                updateActiveNavLink();
            })
            .catch(error => console.error ("[ERROR] Unable to load header!"));
    }

    function DisplayLoginPage() {
        console.log("[INFO] DisplayLoginPage called...");

        const messageArea = document.getElementById("messageArea");
        const loginButton = document.getElementById("loginButton");
        const cancelButton = document.getElementById("cancelButton");

        // Hide message area initially
        messageArea.style.display = "none";

        if(!loginButton){
            console.error("[ERROR] loginButton not found in the DOM");
            return;
        }

        loginButton.addEventListener("click", async (event)=> {
            event.preventDefault();

            const username = document.getElementById("username").value.trim();
            const password = document.getElementById("password").value.trim();

            try{

                const response = await fetch("data/users.json");
                if(!response.ok){
                    throw new Error(`[ERROR] HTTP Error!. Status: ${response.status}`);
                }

                const jsonData = await response.json();
                // console.log("[DEBUG] Fetched JSON data", jsonData);

                const users = jsonData.users;
                if(!Array.isArray(users)){
                    throw new Error("[ERROR] JSON data does not contain a valid array");
                }

                let success = false;
                let authenticatedUser = null;

                for(const user of users){

                    if(user.Username === username && user.Password === password) {
                        success = true;
                        authenticatedUser = user;
                        break;
                    }
                }

                if(success){
                    sessionStorage.setItem("user", JSON.stringify({
                        DisplayName: authenticatedUser.DisplayName,
                        EmailAddress: authenticatedUser.EmailAddress,
                        Username: authenticatedUser.Username,
                    }));

                    messageArea.style.display = "none";
                    messageArea.classList.remove("alert", "alert-danger");
                    location.href = "contact-list.html";
                }else{
                    messageArea.style.display = "block";
                    messageArea.classList.add("alert", "alert-danger");
                    messageArea.textContent = "Invalid username or password. Please try again";

                    document.getElementById("username").focus();
                    document.getElementById("username").select();
                }

            }catch(error){
                console.error("[ERROR] Login failed!", error)
            }
        });

        cancelButton.addEventListener("click", (event)=> {
            document.getElementById("loginForm").reset();
            location.href = "index.html";

        });
    }

    function DisplayRegisterPage() {
        console.log("[INFO] DisplayRegisterPage called...");
    }

    /**
     * Redirects user back to the contact-list page
     */
    function handleCancelClick() {
        location.href = "contact-list.html";
    }

    /**
     * Handles the process of editing an existing contact
     * @param event - the event object to prevent default form submission
     * @param contact - contact to update
     * @param page - unique contact identifier
     */
    function handleEditClick(event, contact, page) {
        // Prevents default form submission behaviour
        event.preventDefault();

        if (!validateForm()) {
            alert("Form contains errors, please correct them before submitting");
            return;
        }

        const fullName = document.getElementById("fullName").value;
        const contactNumber = document.getElementById("contactNumber").value;
        const emailAddress = document.getElementById("emailAddress").value;

        // Update the contact object with the new values
        contact.fullName = fullName;
        contact.contactNumber = contactNumber;
        contact.emailAddress = emailAddress;

        // Save the updated contact (in localStorage) with the updated csv
        localStorage.setItem(page, contact.serialize());

        // Redirect upon success
        location.href = "contact-list.html";

    }

    /**
     * Handles the process of adding a new contact
     * @param event - the event object to prevent default form submission
     */
    function handleAddClick(event) {
        // Prevents default form submission behaviour
        event.preventDefault();

        if (!validateForm()) {
            alert("Form contains errors, please correct them before submitting");
            return;
        }

        const fullName = document.getElementById("fullName").value;
        const contactNumber = document.getElementById("contactNumber").value;
        const emailAddress = document.getElementById("emailAddress").value;

        // Create the contact in localStorage
        AddContact(fullName, contactNumber, emailAddress);

        // Redirection
        location.href = "contact-list.html";

    }

    /**
     * Validates the entire form by checking the validity of each input
     * @returns {boolean}
     */
    function validateForm() {

        return (
            validateInput("fullName") &&
            validateInput("contactNumber") &&
            validateInput("emailAddress")
        );

    }

    /**
     * Attaches validation event listeners to form fields dynamically
     * @param elementId
     * @param event
     * @param handler
     */
    function addEventListenerOnce(elementId, event, handler) {

        const element = document.getElementById(elementId); // Retrieve element from DOM

        if (element) {
            // Removes any existing event listeners of the same type
            element.removeEventListener(event, handler);

            // Attach the new (latest) event for that element
            element.addEventListener(event, handler);
        } else {
            console.warn(`[WARN] Element with id '${elementId}' not found`);
        }

    }

    function attachValidationListeners() {
        console.log("[INFO] Attaching validation listeners...");

        Object.keys(VALIDATION_RULES).forEach((fieldId) => {

            const field = document.getElementById(fieldId);

            if (!field) {
                console.warn(`[WARN] field ${fieldId} not found, Skipping listener`);
                return;
            }

            // Attach event listener using a centralized validation method
            addEventListenerOnce(fieldId, "input", () => validateInput(field));

        });

    }

    /**
     * Validates an input based on a predefined validation rule
     * @param fieldId
     * @returns {boolean} - Returns true if valid, false otherwise
     */
    function validateInput(fieldId) {

        const field = document.getElementById(fieldId);
        const errorElement = document.getElementById(`${fieldId}-error`);
        const rule = VALIDATION_RULES[fieldId];

        if (!field || !errorElement || !rule) {
            console.warn(`[WARN] Validation rules not found for: ${fieldId}`);
            return false;
        }

        // Check if the input is empty
        if (field.value.trim() === "") {
            errorElement.textContent = "This field is required";
            errorElement.style.display = "block";
            return false;
        }

        // Check field against regular expression
        if (!rule.regex.test(field.value)) {
            errorElement.textContent = rule.errorMessage;
            errorElement.style.display = "block";
            return false;
        }

        errorElement.textContent = "";
        errorElement.style.display = "none";
        return true;

    }

    /**
     * Centralized validation rules for input fields
     * @type {{fullName: {regex: RegExp, errorMessage: string}, contactNumber: {regex: RegExp, errorMessage: string}, emailAddress: {regex: RegExp, errorMessage: string}}}
     */
    const VALIDATION_RULES = {
        fullName: {
            regex: /^[A-Za-z\s]+$/, // Allows for only letters, and spaces
            errorMessage: "Full Name must contain only letters and spaces"
        },
        contactNumber: {
            regex: /^\d{3}-\d{3}-\d{4}$/,
            errorMessage: "Contact number must be in the format of ###-###-####"
        },
        emailAddress: {
            // Email regex gotten from: https://stackoverflow.com/questions/46155/how-can-i-validate-an-email-address-in-javascript
            regex: /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            errorMessage: "Invalid email address"
        }
    }

    async function DisplayWeather() {

        const apiKey = "24f8178a77ac811fcb4d5f4ee1be4dbc";
        const city = "Oshawa";
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

        try {

            const response = await fetch(url);

            if (!response.ok) {
                throw new Error("Failed to fetch the weather data");
            }

            const data = await response.json();
            console.log(data);

            const weatherDataElement = document.getElementById("weather-data");
            weatherDataElement.innerHTML = `<strong>City: </strong> ${data.name}<br>
                                            <strong>Temperature: </strong> ${data.main.temp}°C<br>
                                            <strong>Weather: </strong> ${data.weather[0].description}<br>`;

        } catch (error) {

            console.error("Error calling openweathermap for Weather");
            document.getElementById("weather-data").textContent = "Unable to fetch weather data at this time";

        }

    }

    function AddContact(fullName, contactNumber, emailAddress) {
        console.log("[DEBUG] AddContact() triggered...");

        if (!validateForm()) {
            alert("Form contains errors, please correct them before submitting");
            return;
        }

        let contact = new core.Contact(fullName, contactNumber, emailAddress);
        if (contact.serialize()) {

            let key = `contact_${Date.now()}`;
            localStorage.setItem(key, contact.serialize());
            console.log(`[INFO] Contact added: ${key}`);

        } else {
            console.log("[ERROR] Contact serialization failed");
        }

        // Redirection
        location.href = "contact-list.html";
    }

    function DisplayEditPage() {
        console.log("Calling EditPage...");

        const page = location.hash.substring(1);
        const editButton = document.getElementById("editButton");

        addEventListenerOnce("cancelButton", "click", handleCancelClick);

        switch (page)
        {
            case "add":
            {
                document.title = "Add Contact";
                document.querySelector("main > h1").textContent = "Add Contact";

                if (editButton) {
                    editButton.innerHTML = "<i class=\"fa-solid fa-plus\"></i> Add Contact";
                    editButton.classList.remove("btn-primary");
                    editButton.classList.add("btn-success");
                }

                // Attach event listeners
                addEventListenerOnce("editButton", "click", handleAddClick);

                break;
            }
            default:
            {
                const contact = new core.Contact();
                const contactData = localStorage.getItem(page);

                if (contactData) {
                    contact.deserialize(contactData);
                }

                // Pre-population the form with current values
                document.getElementById("fullName").value = contact.fullName;
                document.getElementById("contactNumber").value = contact.contactNumber;
                document.getElementById("emailAddress").value = contact.emailAddress;

                if (editButton) {
                    editButton.innerHTML = "<i class=\"fa-solid fa-pen-to-square\"></i> Edit Contact";
                    editButton.classList.remove("btn-success");
                    editButton.classList.add("btn-primary");
                }

                // Attach event listeners
                addEventListenerOnce("editButton", "click",
                    (event) => handleEditClick(event, contact, page));

                break;
            }
        }

    }

    function DisplayContactListPage() {
        console.log("Calling ContactListPage...");

        if (localStorage.length > 0) {
            let contactList = document.getElementById("contactList");
            let data = "";

            let keys = Object.keys(localStorage);
            // console.log(keys); // Used to see all the keys

            let index = 1;
            for (const key of keys) {

                if (key.startsWith("contact_")) {

                    let contactData = localStorage.getItem(key);

                    try {
                        // console.log(contactData); // Used to inspect contact information
                        let contact = new core.Contact()
                        contact.deserialize(contactData); // Re-construct the contact object
                        data += `<tr>
                                    <th scope="row" class="text-center">${index}</th>
                                    <td>${contact.fullName}</td>
                                    <td>${contact.contactNumber}</td>
                                    <td>${contact.emailAddress}</td>
                                    <td class="text-center">
                                        <button value="${key}" class="btn btn-warning btn-sm edit">
                                            <i class="fa-solid fa-pen"></i> Edit
                                        </button>
                                    </td>
                                    <td>
                                        <button value="${key}" class="btn btn-danger btn-sm delete">
                                            <i class="fa-solid fa-dumpster-fire"></i> Delete
                                        </button>
                                    </td>
                                 </tr>`;
                        index++;
                    } catch(error) {
                        console.error("Error deserializing contact data");
                    }

                } else {
                    console.warn(`Skipping non-contact key: ${key}`);
                }

            }
            contactList.innerHTML = data;

        }

        const addButton = document.getElementById("addButton");
        addButton.addEventListener("click", ()=>{
            location.href = "edit.html#add";
        });

        const deleteButtons = document.querySelectorAll("button.delete");
        deleteButtons.forEach((button) => {

            button.addEventListener("click", function() {

                if(confirm("Delete contact, please confirm")) {
                    localStorage.removeItem(this.value);
                    location.href = "contact-list.html";
                }

            });

        });

        const editButtons = document.querySelectorAll("button.edit");
        editButtons.forEach((button) => {

            button.addEventListener("click", function() {

                location.href = "edit.html#" + this.value;

            });

        });

    }

    function DisplayHomePage() {
        console.log("Calling DisplayHomePage...");

        let aboutUsButton = document.getElementById("AboutUsBtn");
        aboutUsButton.addEventListener("click", () => {
            location.href = "about.html";
        });

        DisplayWeather();

        document.querySelector("main").insertAdjacentHTML(
            'beforeend',
            `<p id="MainParagraph" class="mt-5">This is my first main paragraph!</p>`
        );

        document.body.insertAdjacentHTML(
            'beforeend',
            `<article class="container">
                       <p id="ArticleParagraph" class="mt-3">This is my first article paragraph</p>
                   </article>`
        );

    }

    function DisplayProductsPage() {
        console.log("Calling DisplayProductsPage...");
    }

    function DisplayServicesPage() {
        console.log("Calling DisplayServicesPage...");
    }

    function DisplayAboutPage() {
        console.log("Calling DisplayAboutPage...");
    }

    function DisplayContactsPage() {
        console.log("Calling DisplayContactsPage...");

        let sendButton = document.getElementById("sendButton");
        let subscribeCheckBox = document.getElementById("subscribeCheckBox");

        sendButton.addEventListener("click", function(){

            if (subscribeCheckBox.checked) {

                AddContact(
                    document.getElementById("fullName").value,
                    document.getElementById("contactNumber").value,
                    document.getElementById("emailAddress").value
                );

            }
            alert("Form successfully submitted!");

        });
    }

    // This function prints "App Started!" when called
    async function Start()
    {
        console.log("App Starting...");
        console.log(`Current document title: ${document.title}`);

        // Load header first then run CheckLogin
        LoadHeader().then( () => {
            CheckLogin();
        });

        switch(document.title) {
            case "Home":
                DisplayHomePage();
                break;
            case "Products":
                DisplayProductsPage();
                break;
            case "Services":
                DisplayServicesPage();
                break;
            case "About":
                DisplayAboutPage();
                break;
            case "Contacts":
                attachValidationListeners();
                DisplayContactsPage();
                break;
            case "Contact List":
                DisplayContactListPage();
                break;
            case "Edit Contact":
                attachValidationListeners();
                DisplayEditPage();
                break;
            case "Login":
                DisplayLoginPage();
                break;
            case "Register":
                DisplayRegisterPage();
                break;
            default:
                console.error("No matching page title found in switch case");
        }
    }
    // Listens for the "load" event, calls the Start function when it does
    window.addEventListener("DOMContentLoaded", () => {
        console.log("DOM fully loaded and parsed");
        Start();
    });

})();