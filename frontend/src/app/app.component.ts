import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common'; // Import CommonModule for *ngIf

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule], // Add CommonModule to imports
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'frontend';

  constructor(private authService: AuthService, private router: Router) {}

  logout() {
    this.authService.logout(); // Clear the session
    this.router.navigate(['/login']); // Redirect to login page
  }

  isLoggedIn(): boolean {
    const loggedIn = this.authService.isLoggedIn();
    console.log('Is Logged In:', loggedIn); // Debug log to verify the return value
    return loggedIn;
  }
}
