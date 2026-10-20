import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { ServiceRecord, Firestore } from '../firestore';
import { Services } from '../mock-service-list';

@Component({
  selector: 'app-service-form',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './service-form.html',
  styleUrl: './service-form.css'
})
export class ServiceForm {

  services: ServiceRecord[] = Services;

  model: ServiceRecord = {
    id: 0,
    description: '',
    price: 0
  };

  editing = false;

  constructor(
    private firestore: Firestore,
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

  async addService(): Promise<void> {
    const service = {
      description: this.model.description,
      price: this.model.price
    };

    try {
      // Документ создаётся в Cloud Firestore, id генерируется автоматически
      await this.firestore.addService(service);
    } catch (error) {
      console.error('Не удалось добавить услугу в Firestore:', error);

      // Запасной вариант - добавляем в локальный список
      const ids = this.services
        .map(existing => Number(existing.id))
        .filter(id => !Number.isNaN(id));

      this.services.push({
        id: ids.length > 0 ? Math.max(...ids) + 1 : 1,
        ...service
      });

      this.cdr.markForCheck();
    }

    this.clearForm();
  }

  editService(service: ServiceRecord): void {
    this.model = {
      id: service.id,
      description: service.description,
      price: service.price
    };

    this.editing = true;
  }

  async updateService(): Promise<void> {
    const changes = {
      description: this.model.description,
      price: this.model.price
    };

    try {
      // Обновляем документ в Cloud Firestore
      await this.firestore.updateService(String(this.model.id), changes);
    } catch (error) {
      console.error('Не удалось обновить услугу в Firestore:', error);

      // Запасной вариант - обновляем локальный список
      const service = this.services.find(
        service => service.id === this.model.id
      );

      if (service) {
        service.description = changes.description;
        service.price = changes.price;
      }

      this.cdr.markForCheck();
    }

    this.clearForm();
  }

  async deleteService(id: ServiceRecord['id']): Promise<void> {
    try {
      // Удаляем документ из Cloud Firestore
      await this.firestore.deleteService(String(id));
    } catch (error) {
      console.error('Не удалось удалить услугу из Firestore:', error);

      // Запасной вариант - удаляем из локального списка
      const index = this.services.findIndex(
        service => service.id === id
      );

      if (index !== -1) {
        this.services.splice(index, 1);
      }

      this.cdr.markForCheck();
    }

    if (this.model.id === id) {
      this.clearForm();
    }
  }

  clearForm(): void {
    this.model = {
      id: 0,
      description: '',
      price: 0
    };

    this.editing = false;
  }
}