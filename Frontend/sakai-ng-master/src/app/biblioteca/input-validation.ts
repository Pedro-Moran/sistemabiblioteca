import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
    selector: 'app-input-validation',
    standalone: true,
    template: ` <div class="invalid-feedback">
    @for (error of errores; track error.error) {
      @if (form?.get(modelo)?.hasError(error.error) &&
          (form?.get(modelo)?.touched || form?.get(modelo)?.dirty)) {
        <div class="text-red-500">{{ error.mensaje }}</div>
      }
    }
  </div>
  `
})
export class InputValidation {

    @Input() form: FormGroup | undefined;
    @Input() modelo: string = '';
    @Input() ver: string = '';
    errores = <any>[];
    constructor() { }

    ngOnInit(): void {
    }
  
    ngDoCheck() {
      this.errores = [
        { error: "required", mensaje: `El campo ${this.ver ? this.ver : this.modelo} es requerido.` },
        { error: "minlength", mensaje: `El campo ${this.ver ? this.ver : this.modelo} debe tener al menos ${this.form!.get(this.modelo)!.errors ? this.form!.get(this.modelo)!.errors!['minlength'] ? this.form!.get(this.modelo)!.errors!['minlength'].requiredLength : '' : ''} caracteres.` },
        { error: "maxlength", mensaje: `El campo ${this.ver ? this.ver : this.modelo} no debe tener más de ${this.form!.get(this.modelo)!.errors ? this.form!.get(this.modelo)!.errors!['maxlength'] ? this.form!.get(this.modelo)!.errors!['maxlength'].requiredLength : '' : ''} caracteres.` },
        { error: "min", mensaje: `El campo ${this.ver ? this.ver : this.modelo} debe ser mayor que ${this.form!.get(this.modelo)!.errors ? this.form!.get(this.modelo)!.errors!['min'] ? this.form!.get(this.modelo)!.errors!['min'].min : '' : ''}.` },
        { error: "max", mensaje: `El campo ${this.ver ? this.ver : this.modelo} debe ser menor que ${this.form!.get(this.modelo)!.errors ? this.form!.get(this.modelo)!.errors!['max'] ? this.form!.get(this.modelo)!.errors!['max'].max : '' : ''}.` },
        { error: "pattern", mensaje: `El campo ${this.ver ? this.ver : this.modelo} no tiene un formato válido.` },
        { error: "email", mensaje: `Ingrese un email válido. Ejemplo: minombre@gmail.com` },
        { error: "text", mensaje: `Solo se admiten letras, números, espacios, puntos y guiones.` },
        { error: "dni", mensaje: `Solo se admiten 8 números.` },
        { error: "ConfirmPasswordValidator", mensaje: `Las contraseñas no coinciden.` },
        { error: "noWhiteSpace", mensaje: `No se permiten solo espacios.` },
        { error: "customInvalidEmail", mensaje: `Ingrese un email válido. Ejemplo: minombre@gmail.com` },
      ];
    }
  
}
