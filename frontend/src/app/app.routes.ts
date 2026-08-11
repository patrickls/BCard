import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'flashcards',
    loadComponent: () =>
      import('./features/flashcards/flashcards.component').then((m) => m.FlashcardsComponent),
  },
  {
    path: 'users',
    canActivate: [authGuard],
    loadComponent: () => import('./features/users/users.component').then((m) => m.UsersComponent),
  },
  { path: '', pathMatch: 'full', redirectTo: 'flashcards' },
];
