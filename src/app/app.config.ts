import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { initializeApp, FirebaseApp } from 'firebase/app';

export const firebaseConfig = {
  apiKey: 'AIzaSyAPxhnrPr7K_Z3Nyuu49P7njcre32spUlo',
  authDomain: 'webl2v7.firebaseapp.com',
  projectId: 'webl2v7',
  storageBucket: 'webl2v7.firebasestorage.app',
  messagingSenderId: '76916004276',
  appId: '1:76916004276:web:676be67c2465d31bdd0ee1',
  measurementId: 'G-CF91WXGL1R',
};

export const app: FirebaseApp = initializeApp(firebaseConfig);

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes)],
};
