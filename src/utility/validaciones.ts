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
        return (control: AbstractControl): ValidationErrors | null =>{
            const regex = /^[1-9]\d*$/;
            return regex.test(control.value) ? null: {stockValido: true};
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

    static imagenRequerida(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            if (!control.value || control.value==='' || control.value === null) {
                return { imagenRequerida: true };
            }
            return null;
        };
    }

    static tamanoMaximo(maxSize: number): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
          const file = control.value as File;
          if (!file || file.size <= maxSize) {
            return null;
          }
          return { tamanoMaximo: true };
        };
    }
    
    static tipoArchivoPermitido(tiposPermitidos: string[]): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
          const file = control.value as File;
          if (!file || tiposPermitidos.includes(file.type)) {
            return null;
          }
          return { tipoInvalido: true };
        };
    }
}