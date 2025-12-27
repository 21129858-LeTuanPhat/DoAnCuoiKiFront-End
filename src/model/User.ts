export interface User {
    id: string;
    name: string;
    type: number;
}



export interface UserLogin {
    username: string,
    password: string
}


export interface UserRegistry {
    username: string,
    password: string
}


export interface ReCodeInterface {
    RE_LOGIN_CODE: string
}