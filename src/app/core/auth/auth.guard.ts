import { inject} from '@angular/core'
import {Router, CanActivateFn } from '@angular/router'
import { AuthStore } from './auth.store'


/*{
  path: 'school',
  component: SchoolComponent,
  canActivate: [authGuard],
  data: { claims: ['admin', 'teacher'] }
}*/
export const authGuard: CanActivateFn = (route, state)=> {

  const router= inject(Router);
  const store = inject(AuthStore);


  if (store.isAuthenticated()) {
      return true;
  };

  return router.createUrlTree(["/login"], {
    queryParams: {
      reason: "not_authenticated",
      returnUrl: state.url
    }
  });
}




