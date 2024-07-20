import { HttpInterceptorFn } from '@angular/common/http';
import { catchError, tap } from 'rxjs';
import Swal from 'sweetalert2';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token: string | null = localStorage.getItem('token');

    let request = req;

    if (token !== null && token !== undefined) {
      request = req.clone({
        setHeaders: {
          authorization: `Bearer ${ token }`
        }
      });
    }

    return next(request).pipe(catchError((error) => {
      // console.error(error.error.error);
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'error',
        title: `${error.error.error}`,
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        customClass: {
          popup: 'colored-toast'
        }
      })
      throw error;
    })
  );
};
