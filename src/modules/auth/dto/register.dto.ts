export interface RegisterDto {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role?: string;
    accountType?: string;
}
