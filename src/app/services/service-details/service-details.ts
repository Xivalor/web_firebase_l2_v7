import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { ServiceRecord, Firestore } from '../firestore';
import { Services } from '../mock-service-list';

/** Состояние страницы: undefined - грузим, null - не найдено, объект - найдено. */
type ServiceState = ServiceRecord | null | undefined;

@Component({
  selector: 'app-service-details',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './service-details.html',
  styleUrl: './service-details.css'
})
export class ServiceDetails {

  private route = inject(ActivatedRoute);
  private firestore = inject(Firestore);

  /**
   * Услуга. Одно состояние на всё: undefined - загрузка, null - не найдено.
   * Сигнал сам запускает перерисовку (приложение zoneless).
   */
  state = signal<ServiceState>(undefined);

  constructor() {
    // Реагируем на изменение id в адресе (в т.ч. переход между услугами)
    this.route.paramMap.subscribe(params => {
      this.loadService(params.get('id') ?? '');
    });
  }

  private async loadService(id: string): Promise<void> {
    this.state.set(undefined);

    try {
      const service = await this.firestore.getServiceById(id);

      this.state.set(service ?? this.findMock(id) ?? null);
    } catch (error) {
      console.error('Не удалось загрузить услугу из Firestore:', error);

      this.state.set(this.findMock(id) ?? null);
    }
  }

  private findMock(id: string): ServiceRecord | undefined {
    return Services.find(service => String(service.id) === id);
  }

}
