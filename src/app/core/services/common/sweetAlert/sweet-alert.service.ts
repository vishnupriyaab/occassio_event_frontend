import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class SweetAlertService {
  // Success Alert
  successAlert(title: string, text: string, confirmButtonText = 'OK') {
    return Swal.fire({
      title: title,
      text: text,
      icon: 'success',
      confirmButtonText: confirmButtonText,
    });
  }

  // Error Alert
  errorAlert(title: string, text: string, confirmButtonText = 'OK') {
    return Swal.fire({
      title: title,
      text: text,
      icon: 'error',
      confirmButtonText: confirmButtonText,
    });
  }

  // Confirmation Alert
  confirmationAlert(title: string, text: string, confirmButtonText = 'Yes', cancelButtonText = 'No') {
    return Swal.fire({
      title: title,
      text: text,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: confirmButtonText,
      cancelButtonText: cancelButtonText,
    });
  }
}
