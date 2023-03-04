export default function httpData(
    url: string,
    cback: (result: string | ArrayBuffer | null) => void
) {
    const xhr = new XMLHttpRequest();
    xhr.onload = function() {
        const reader = new FileReader();
        reader.onload = function() {
            cback(reader.result);
        }
        const blob = new Blob([xhr.response], { type: 'image/gif'})
        reader.readAsDataURL(blob);
    };
    xhr.withCredentials = true;
    xhr.open('GET', url);
    xhr.responseType = 'arraybuffer';
    xhr.send();
}
