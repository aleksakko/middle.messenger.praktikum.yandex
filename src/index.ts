import './index.scss';

// создано несколько хелперов для handlebars
import './utils/handlebarsHelpers.ts';

import AuthController from './services/controllers/AuthController';
import router, { Routes } from './services/router';


window.addEventListener('DOMContentLoaded', async () => {
    
    let isProtectedRoute = true;

    switch (window.location.pathname) {
        case Routes.Auth:
        case Routes.Reg: isProtectedRoute = false; break;
    }

    try {
        await AuthController.getUser();

        if (!isProtectedRoute) {
            router.go(Routes.Profile)
        }

        router.start();
    } catch (err) {
        router.start();

        isProtectedRoute && router.go(Routes.Auth)
    }
})
