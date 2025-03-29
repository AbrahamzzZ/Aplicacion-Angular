import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export class Validaciones{

    static soloLetras(): ValidatorFn{
        return (control:AbstractControl): ValidationErrors| null =>{
            const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
            return regex.test(control.value) ? null: {soloLetras:true};
        };
    }

    static soloNumeros(): ValidatorFn{
        return (control: AbstractControl): ValidationErrors | null =>{
            const regex =  /^\d{10}$/;
            return regex.test(control.value) ? null: {soloNumeros: true};
        };
    }

    static stockValido(): ValidatorFn{
        return (control: AbstractControl): ValidationErrors | null => {
            if (control.value === null || control.value === undefined || control.value === '') {
                return { stockValido: true }; // Evita valores vacíos
            }
            const valor = Number(control.value);
            return Number.isInteger(valor) && valor >= 0 ? null : { stockValido: true };
        };
    }

    static formatoPrecio(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            const regex = /^(?:\d+|\d*\.\d{1,2})$/; // Permite enteros o hasta 2 decimales
            return regex.test(control.value) ? null : { formatoPrecio: true };
        };
    }

    static formatoClave(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&+./_\-])[A-Za-z\d@$!%*?&+./_\-]{8,}$/;

            return regex.test(control.value) ? null : { formatoClave: true };
        };
    }
}