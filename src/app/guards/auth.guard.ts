import { CanActivateChildFn, Router } from '@angular/router';
import { BackendApiService } from '../services/backend-api.service';
import { inject } from '@angular/core';
// import { inject } from '@angular/core';

export const authGuard: CanActivateChildFn = (childRoute, state) => {
    console.log('authGard - Info:', childRoute, state);
    const token = inject(BackendApiService).token;
    console.log('authGuard - Token: ' + token, childRoute.url);
    

    if (state.url.includes('/home') && token != undefined && token != "") {
        return true;
    }
    
    return inject(Router).createUrlTree(['/login']);
};

