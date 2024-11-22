import { CanActivateChildFn, Router } from '@angular/router';
import { BackendApiService } from '../services/backend-api.service';
import { inject } from '@angular/core';
// import { inject } from '@angular/core';

export const authGuard: CanActivateChildFn = (childRoute, state) => {
    const token = inject(BackendApiService).token;
    if (state.url.includes('/home') && token != undefined && token != "") {
        return true;
    }
    return inject(Router).createUrlTree(['/login']);
};

