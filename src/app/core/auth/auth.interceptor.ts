import { HttpInterceptorFn }      from "@angular/common/http";
import { inject }                 from "@angular/core";
import { MatSnackBar }            from '@angular/material/snack-bar';
import { Router }                 from "@angular/router";
import { catchError, NEVER, of, throwError } from 'rxjs';
import { AuthStore }              from "../auth/auth.store"
import { InternalErrorException } from "./internal-error.exception";




 /*
  *
  *
  *
  */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const store = inject(AuthStore);
  const router= inject(Router);
  const snackBar: MatSnackBar = inject(MatSnackBar);

  //set header
  if(store.isAuthenticated()) {
    req = req.clone({
      setHeaders: {
          Authorization: `Bearer ${store.token()}`
      }
    });
  }

  return next(req).pipe(
      catchError((error) => {
        if (error.status === 401) {
          //clear session
          store.ClearSession();

          //diff log mechanism
          console.log("user session is expired");
          //navigate to login
          router.navigate(["/login"], {queryParams: {
              returnUrl: router.url,
              reason: "session_expired"
            }
          })
          // By returning NEVER, we gracefully cancel the ongoing request
          // and prevent the error from propagating to the caller.
          return NEVER;
        }

        // For all other errors, re-throw them to be handled by the caller.
        return throwError(() => error);
      })
    );
}
