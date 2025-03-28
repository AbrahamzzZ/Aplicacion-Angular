import { inject } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { CanDeactivateFn } from "@angular/router";
import { Observable } from "rxjs";
import { DialogoFormularioCompletoComponent } from "../components/dialogo-formulario-completo/dialogo-formulario-completo.component";

export interface CanComponentDeactive{
    canDeactive: () =>Observable<boolean> | boolean;
}

export const FormularioIncompleto: CanDeactivateFn<CanComponentDeactive> = (component: CanComponentDeactive)=>{
    const formularioValido = component.canDeactive();

    if(formularioValido){
        const dialogo = inject(MatDialog);
        const reference = dialogo.open(DialogoFormularioCompletoComponent);
        return reference.afterClosed();
    }
    return true;
};