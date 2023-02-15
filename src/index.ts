import './index.scss';

// создано несколько хелперов для handlebars
import './utils/handlebarsHelpers.ts';

// старый роутер
// import goRouter from './router';
//goRouter();

import router from './services/router/Router';
router.start();
