import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { user } from '../../models/user.model';
import { AuthService } from '../../services/auth-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  standalone: true,
  templateUrl: './auth.html',
  styleUrl: './auth.css',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule]
})
export class AuthComponent {
  loginForm: FormGroup;
  private authService = inject(AuthService);
  private router = inject(Router);
  login = false;
  constructor(private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onLogin() {
    if (this.loginForm.valid) {

      const user:user = this.loginForm.value;

      if(this.login){
        this.authService.login(user).subscribe((token)=>{
          this.router.navigate(['/home']);
      })
      }else{
        this.authService.singUp(user).subscribe(()=>{
          this.authService.login(user).subscribe((token) => {
          this.router.navigate(['/home']);
          })
      });
    }
  }}



  toggle(){
    this.login = !this.login;
  }
}
