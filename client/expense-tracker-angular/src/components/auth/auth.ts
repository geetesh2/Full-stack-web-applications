import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth-service';
import { user } from '../../models/user.model';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="auth-container">
      <div class="container">
        <div class="row align-items-center justify-content-center min-vh-100">
          <!-- Left Side: Brand/Graphic -->
          <div
            class="col-lg-6 d-none d-lg-flex flex-column align-items-center justify-content-center auth-graphic-side"
          >
            <i class="fas fa-wallet fa-7x mb-4 text-primary"></i>
            <h1 class="display-4 fw-bold text-white">Track Every Rupee</h1>
            <p class="lead text-white-50 text-center">
              Gain control of your finances with a clear, simple, and powerful
              expense tracker.
            </p>
          </div>

          <!-- Right Side: Form -->
          <div class="col-lg-6 col-md-9">
            <div class="auth-form-wrapper">
              <div class="auth-form">
                <h2 class="fw-bold mb-4 text-center">
                  {{ login ? 'Sign In' : 'Create Account' }}
                </h2>

                <form [formGroup]="loginForm" (ngSubmit)="onLogin()">
                  <!-- Email Input -->
                  <div class="form-floating mb-3">
                    <input
                      type="email"
                      class="form-control"
                      id="emailInput"
                      placeholder="name@example.com"
                      formControlName="email"
                      [class.is-invalid]="
                        loginForm.get('email')?.invalid &&
                        loginForm.get('email')?.touched
                      "
                    />
                    <label for="emailInput">Email address</label>
                  </div>

                  <!-- Password Input -->
                  <div class="form-floating mb-3">
                    <input
                      type="password"
                      class="form-control"
                      id="passwordInput"
                      placeholder="Password"
                      formControlName="password"
                      [class.is-invalid]="
                        loginForm.get('password')?.invalid &&
                        loginForm.get('password')?.touched
                      "
                    />
                    <label for="passwordInput">Password</label>
                  </div>

                  <!-- Submit Button -->
                  <button
                    class="btn btn-primary w-100 btn-lg fw-semibold"
                    type="submit"
                    [disabled]="!loginForm.valid"
                  >
                    {{ login ? 'Sign In' : 'Sign Up' }}
                  </button>
                </form>

                <!-- Toggle Link -->
                <div class="text-center mt-4">
                  <a (click)="toggle()" class="toggle-link">
                    {{
                      login
                        ? "Don't have an account? Sign Up"
                        : 'Already have an account? Sign In'
                    }}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .auth-container {
        background-color: #121212;
        color: #e0e0e0;
      }

      .auth-graphic-side {
        padding: 3rem;
      }

      .text-primary {
        color: #6a11cb !important;
      }

      .auth-form-wrapper {
        background-color: rgba(38, 38, 38, 0.8);
        border: 1px solid rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(10px);
        border-radius: 1rem;
        padding: 2.5rem;
        box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
      }

      .form-control {
        background-color: #2c2c2c;
        border-color: #444;
        color: #e0e0e0;
        padding: 1rem;
      }

      .form-control:focus {
        background-color: #2c2c2c;
        border-color: #6a11cb;
        color: #e0e0e0;
        box-shadow: 0 0 0 0.25rem rgba(106, 17, 203, 0.25);
      }

      .form-floating > label {
        color: #888;
      }

      .form-floating > .form-control:focus ~ label,
      .form-floating > .form-control:not(:placeholder-shown) ~ label {
        color: #6a11cb;
      }

      .btn-primary {
        background-color: #6a11cb;
        border-color: #6a11cb;
        padding: 0.75rem;
        transition: background-color 0.2s ease-in-out;
      }

      .btn-primary:hover,
      .btn-primary:focus {
        background-color: #5e0fa8;
        border-color: #5e0fa8;
      }

      .btn-primary:disabled {
        background-color: #3a2951;
        border-color: #3a2951;
      }

      .toggle-link {
        color: #adb5bd;
        cursor: pointer;
        text-decoration: none;
        transition: color 0.2s ease-in-out;
      }

      .toggle-link:hover {
        color: #ffffff;
        text-decoration: underline;
      }
    `,
  ],
})
export class AuthComponent {
  loginForm: FormGroup;
  login = true; // Default to login screen

  private authService = inject(AuthService);
  private router = inject(Router);

  constructor(private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  onLogin() {
    if (this.loginForm.invalid) {
      return;
    }

    const user: user = this.loginForm.value;

    if (this.login) {
      this.authService.login(user).subscribe(() => {
        this.router.navigate(['/home']);
      });
    } else {
      this.authService.singUp(user).subscribe(() => {
        this.authService.login(user).subscribe(() => {
          this.router.navigate(['/home']);
        });
      });
    }
  }

  toggle() {
    this.login = !this.login;
  }
}
