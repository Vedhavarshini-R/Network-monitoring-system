import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  username = '';
  password = '';
  error = '';

  rememberMe = false;
  showPassword = false;

  // 🔥 shake animation trigger
  shake = false;

  constructor(private auth: AuthService, private router: Router) {}

  login(): void {

    const success = this.auth.login(this.username, this.password);

    if (success) {

      // Remember Me feature
      if (this.rememberMe) {
        localStorage.setItem('rememberUser', this.username);
      } else {
        localStorage.removeItem('rememberUser');
      }

      this.router.navigate(['/']);

    } else {

      this.error = 'Invalid username or password';

      this.triggerShake();
    }
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  triggerShake(): void {
    this.shake = true;

    setTimeout(() => {
      this.shake = false;
    }, 500);
  }
}