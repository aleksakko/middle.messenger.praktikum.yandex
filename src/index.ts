import './index.scss';

// создано несколько хелперов для handlebars
import './utils/handlebarsHelpers.ts';

// старый роутер
// import goRouter from './router';
//goRouter();

import AuthController from './services/controllers/AuthController';
import router from './services/router';

window.addEventListener('DOMContentLoaded', async () => {
    try {
        await AuthController.getUser();

        router.start();
    } catch (err) {
        router.start();
    }
})

