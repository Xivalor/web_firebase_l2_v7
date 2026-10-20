import { Injectable } from '@angular/core';
import {
  type CollectionReference,
  type DocumentData,
  type DocumentReference,
  type Firestore as FirestoreInstance,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getFirestore,
  onSnapshot,
  updateDoc,
} from 'firebase/firestore';
import { Observable } from 'rxjs';

import { app } from '../app.config';

/**
 * Запись услуги.
 * id - идентификатор документа в Firestore (строка),
 * либо числовой id, если данные взяты из mock-списка.
 */
export interface ServiceRecord {
  id: string | number;
  description: string;
  price: number;
}

/**
 * Сервис для работы с коллекцией `list-services` в Cloud Firestore.
 *
 * Документы коллекции имеют поля:
 *  - description (string) - описание услуги,
 *  - price (number)       - цена услуги.
 */
@Injectable({
  providedIn: 'root',
})
export class Firestore {
  private readonly db: FirestoreInstance = getFirestore(app);
  private readonly servicesCollection: CollectionReference<DocumentData> =
    collection(this.db, 'list-services');

  /** Подписка на всю коллекцию: список обновляется при каждом изменении базы. */
  getServices(): Observable<ServiceRecord[]> {
    return new Observable<ServiceRecord[]>((subscriber) => {
      const unsubscribe = onSnapshot(
        this.servicesCollection,
        (snapshot) =>
          subscriber.next(
            snapshot.docs.map((document) => this.toRecord(document.id, document.data()))
          ),
        (error) => subscriber.error(error)
      );

      return () => unsubscribe();
    });
  }

  /** Чтение одного документа по его id. */
  async getServiceById(id: string): Promise<ServiceRecord | undefined> {
    const snapshot = await getDoc(doc(this.db, 'list-services', id));

    return snapshot.exists()
      ? this.toRecord(snapshot.id, snapshot.data())
      : undefined;
  }

  /** Добавление документа (id документа генерируется автоматически). */
  addService(service: Omit<ServiceRecord, 'id'>): Promise<DocumentReference<DocumentData>> {
    return addDoc(this.servicesCollection, {
      description: service.description,
      price: service.price,
    });
  }

  /** Обновление полей документа. */
  updateService(
    id: string,
    data: Partial<Pick<ServiceRecord, 'description' | 'price'>>
  ): Promise<void> {
    return updateDoc(doc(this.db, 'list-services', id), data);
  }

  /** Удаление документа. */
  deleteService(id: string): Promise<void> {
    return deleteDoc(doc(this.db, 'list-services', id));
  }

  private toRecord(id: string, data: DocumentData): ServiceRecord {
    return {
      id,
      description: String(data['description'] ?? ''),
      price: Number(data['price'] ?? 0),
    };
  }
}
