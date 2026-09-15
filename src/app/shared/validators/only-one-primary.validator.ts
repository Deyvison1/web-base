import { AbstractControl, FormArray, ValidationErrors, ValidatorFn } from '@angular/forms';

export function onlyOnePrimaryValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const contacts = control as FormArray;

    const primaryContacts = contacts.controls.filter(
      (contact) => contact.get('primaryContact')?.value === true,
    ).length;

    return primaryContacts > 1 ? { multiplePrimaryContacts: true } : null;
  };
}
