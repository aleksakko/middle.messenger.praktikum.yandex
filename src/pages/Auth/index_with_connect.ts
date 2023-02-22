import Connect from "../../../../trening/storeN/Connect";
import AuthPage from "./";

export default Connect(
    AuthPage,
    (state) => { 
        console.log(state);
        console.log('AuthPage Connect сработал');
        return {text: 'mama'} 
    }
)

