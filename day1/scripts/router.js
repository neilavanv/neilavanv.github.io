"use strict";

import {LoadHeader} from "./header.js";

export class Router {

    constructor(routes){
        this.routes = routes;
        this.init();
    }

    init(){
        window.addEventListener("DOMContentLoaded", () => {
           const path = location.hash.slice(1) || "/";
           this.loadRoute(path);
           console.log(`[INFO] Initial Page Load: ${path}`);
        });

        window.addEventListener("popstate", () => {
            console.log(`[INFO] Navigating to: ${location.hash.slice(1)}`);
            this.loadRoute(location.hash.slice(1));
        });
    }

    navigate(path){
        location.hash = path;
    }

    loadRoute(path){
        console.log(`[INFO] Loading Route: ${path}`);

        // basePath = "/edit#contact_121344"
        const basePath = path.split("#")[0];
        if(!this.routes[basePath]){
            console.log(`[WARNING] Route not found ${basePath}, redirecting to 404`);
            location.hash = "/404";
            path = "/404";
        }

        fetch(this.routes[basePath])
        .then(response => {
            if (!response.ok) throw new Error(`Failed to load ${this.routes[basePath]}`);
            return response.text();
        })
            .then(html => {
                document.querySelector("main").innerHTML = html;
                LoadHeader().then( () => {
                    // Dispatch a custom event to notify that a new route has successfully loaded
                    document.dispatchEvent( new CustomEvent("routeLoaded", {detail: basePath}));
                });
            })
            .catch(error => {
                console.error("[ERROR] Error loading page: ", error);
        })
    }
}