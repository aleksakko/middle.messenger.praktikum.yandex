// генератор случайной строки. 
// Принимает 2 параметра{
//      !количество символов id-строки 
//      ?свой алфавит
// }
function randomID (numOfChars: number, customChars: string | null = null): string {
    const chars = customChars || 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_';
    let res = "";
    for (let i = 0; i < numOfChars; i++) {
        res += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return res;
}

export default randomID;
