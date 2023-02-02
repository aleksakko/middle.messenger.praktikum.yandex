import Handlebars from 'handlebars';
Handlebars.registerHelper('startsWith', function (str, prefix) {
    return str.startsWith(prefix);
});
Handlebars.registerHelper('get', function (root, ...keys) {
    // геттер получает значение из пропса по пути root[key1][key2][...][keyEnd] внутри .hbs
    let val = root;
    keys.forEach((key, index) => {
        if (index !== (keys.length - 1)) val = val[key];
    })    
    return val;
});
