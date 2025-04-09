export interface ITokenData {
    nameid: number;         // id del usuario
    unique_name: string;    // nombre completo
    email: string;          // correo
    role: string;           // rol
    exp: number;            // tiempo de expiración
    iss: string;            // issuer
    aud: string;            // audience
}
