import { ChangeDetectorRef, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ServiceRecord, Firestore } from '../firestore';
import { Services } from '../mock-service-list';

@Component({
  selector: 'app-service-list',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './service-list.html',
  styleUrl: './service-list.css'
})
export class ServiceList {

  services: ServiceRecord[] = Services;

  constructor(
    firestore: Firestore,
    private cdr: ChangeDetectorRef
  ) {

    firestore.getServices().subscribe({
      next: services => {
        this.services = services;
        // Приложение zoneless: без этого перерисовка не запустится
        this.cdr.markForCheck();
      },
      error: error => console.error(
        'Не удалось загрузить данные из Firestore:',
        error
      )
    });

  }

}