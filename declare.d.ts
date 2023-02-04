declare module "*.ts";
declare module "*.json";
declare module "*.scss";
declare module "*.mytpl";
declare module '*.hbs' {
    import { TemplateDelegate } from 'handlebars';

    declare const template: TemplateDelegate;

    export default template;
}
