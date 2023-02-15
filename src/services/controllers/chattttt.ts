const host = 'https://ya-praktikum.tech';

fetch(`${host}/api/v2/chats/token/1`, {
    method: 'POST',
    mode: 'cors',
    credentials: 'include'
})
.then(r => r.json())
.then(data => {
    console.log('token', data.token); // получаем строку
})

const socket = new WebSocket('wss://ya-praktikum.tech/ws/chats/<USER_ID>/<CHAT_ID>/<TOKEN_VALUE>');

socket.addEventListener('open', () => {
    console.log('Соединение установлено');

    socket.send(JSON.stringify({
        content: 'Моё первое сообщение миру!',
        type: 'message'
    }))
});

socket.addEventListener('close', e => {
    if (e.wasClean) {
        console.log('Соединение закрыто чисто');
    } else {
        console.log('Обрыв соединения');
    }

    console.log(`Код: ${e.code} | Причина: ${e.reason}`);
})

socket.addEventListener('message', e => {
    console.log('Получены данные', e.data);
})

socket.addEventListener('error', e => {
    console.log('Ошибка', e.message);
})

socket.send(JSON.stringify({
    content: '0',
    type: 'get old'
}))
