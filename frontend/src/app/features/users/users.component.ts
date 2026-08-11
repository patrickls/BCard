import { Component, inject, signal } from "@angular/core";
import { UsersService } from "./users.service";
import { User } from "./users.model";

@Component({
  selector: "app-users",
  standalone: true,
  templateUrl: "./users.component.html",
})
export class UsersComponent {
  private usersService = inject(UsersService);

  users = signal<User[]>([]);
  loading = signal(false);

  ngOnInit() {
    this.loading.set(true);
    this.usersService.list().subscribe({
      next: (users) => this.users.set(users),
      complete: () => this.loading.set(false),
      error: () => this.loading.set(false),
    });
  }
}
