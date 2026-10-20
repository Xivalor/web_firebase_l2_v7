import { Routes } from '@angular/router';

import { ServiceCenter } from './service-center/service-center';
import { ServiceList } from './service-list/service-list';
import { ServiceDetails } from './service-details/service-details';
import { ServiceForm } from './service-form/service-form';

export const SERVICE_ROUTES: Routes = [
    {
        path: '',
        component: ServiceCenter,
        children: [
            {
                path: '',
                component: ServiceList
            },
            {
                path: 'manage',
                component: ServiceForm
            },
            {
                path: ':id',
                component: ServiceDetails
            }
        ]
    }
];