import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  username = '';
  password = '';
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    this.authService.login(this.username, this.password).subscribe({
      next: (response: any) => {
        const token = response.data.login.token;
        console.log('Token received:', token); // Debug log to verify token
        localStorage.setItem('token', token); // Store the token in localStorage
        this.router.navigate(['/employees']); // Navigate to the employee list
      },
      error: (error: any) => {
        this.errorMessage = error.message;
      },
    });
  }
}
