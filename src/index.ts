import './index.scss';
import goRouter from './router';
goRouter();



import { MainPage } from './pages/Main';

window.addEventListener('DOMContentLoaded', () => {
    const root: HTMLElement = <HTMLElement>document.getElementById('app2');

    const mainPage = new MainPage();

    root.append(mainPage.getContent());
})
 