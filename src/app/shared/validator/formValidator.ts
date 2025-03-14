import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function alphabetsOnlyValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!value) return null;
    const valid = /^[A-Za-z]+(?: [A-Za-z]+)*$/.test(value);
    return valid ? null : { alphabetsOnly: true };
  };
}

export function repeatedCharacterValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!value) return null;
    const repeatedChars = /(.)\1/.test(value);
    return repeatedChars ? { repeatedCharacters: true } : null;
  };
}

export function emailFormatValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!value) return null;
    const emailPattern = /^(?!.*[@.]{2})[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const startsOrEndsWithInvalid = /^[.@]|[.@]$/.test(value);
    const containsMultipleAtSigns = (value.match(/@/g) || []).length > 1;
    if (!emailPattern.test(value) || startsOrEndsWithInvalid || containsMultipleAtSigns) {
      return { email: true };
    }
    return null;
  };
}

export function noAllSpacesValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (control.value != null && !control.value.length) {
      return null;
    }
    const isAllSpaces = control.value != null && control.value.trim().length === 0;
    return isAllSpaces ? { allSpaces: true } : null;
  };
}

export function mobileNumberValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }
    const phoneStr = control.value.toString();
    const valid = /^[0-9]{10}$/.test(phoneStr);
    return valid ? null : { invalidMobile: true };
  };
}

export function onlyNumbersValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value || control.value.length === 0) {
      return null;
    }
    const valid = /^[0-9]+$/.test(control.value);
    return valid ? null : { onlynumbers: true };
  };
}

export function passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
  const password = group.get('password')?.value;
  const confirmPassword = group.get('confirmPassword')?.value;
  console.log(confirmPassword, '1234567890');
  return password === confirmPassword ? null : { passwordMismatch: true };
}

export function strongPasswordValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (control.value != null && !control.value.length) {
      return null;
    }
    const value = control.value || '';
    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumber = /\d/.test(value);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);
    const hasMinLength = value.length >= 8;

    const isValid = hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar && hasMinLength;

    return isValid ? null : { strongPassword: true };
  };
}


export function startDateValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null; 
    }

    const inputDate = new Date(control.value);
    const today = new Date();
    
    today.setHours(0, 0, 0, 0);
    const minDate = new Date(today);
    minDate.setDate(today.getDate() + 10);
    return inputDate >= minDate ? null : { futureDate: { 
      required: minDate.toISOString().split('T')[0], 
      actual: control.value 
    }};
  };
}

export function dateRangeValidator(): ValidatorFn {
  return (formGroup: AbstractControl): ValidationErrors | null => {
    const startDateControl = formGroup.get('startDate');
    const endDateControl = formGroup.get('endDate');
    if (!startDateControl || !endDateControl || !startDateControl.value || !endDateControl.value) {
      return null;
    }

    const startDate = new Date(startDateControl.value);
    const endDate = new Date(endDateControl.value);
    if (endDate < startDate) {
      endDateControl.setErrors({ invalidDateRange: true });
      return { invalidDateRange: true };
    } else {
      if (endDateControl.errors) {
        const errors = { ...endDateControl.errors };
        delete errors['invalidDateRange'];
        endDateControl.setErrors(Object.keys(errors).length ? errors : null);
      }
      return null;
    }
  };
}

export function pincodeValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }
    const pincode = control.value.toString();
    const valid = /^[0-9]{6}$/.test(pincode);
    
    return valid ? null : { invalidPincode: true };
  };
}


// export function otpPattern(): ValidatorFn {
//   return (control: AbstractControl): ValidationErrors | null => {
//     if (!control.value || control.value.length === 0) {
//       return null;
//     }
//     const valid = /^[0-9]+$/.test(control.value);
//     return valid ? null : { pattern: true };
//   };
// }
