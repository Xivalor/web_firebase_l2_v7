import { Routes } from '@angular/router';

import { SERVICE_ROUTES } from './services/service.routes';

export const routes: Routes = [
    {
        path: 'services',
        children: SERVICE_ROUTES
    },
    {
        path: '',
        redirectTo: 'services',
        pathMatch: 'full'
    }
];