import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, User, UserCredential } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { MessageService } from './message.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthenticateService {
  isLoading = false;

  constructor( 
    public auth: Auth,
    private _message: MessageService,
    private _router: Router,
  ) {}
  
  /**
   * Registra um novo usuário. Retorna o UserCredential em caso de sucesso ou null em caso de falha.
   */
  public async register(email: string, password: string) {
    this.isLoading = true;
    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      this._message.show('Conta criada com sucesso! Realize o Login!');
      return userCredential;
    } catch (error: any) {
      this.showErro(error);
      return null;
    } finally {
      this.isLoading = false;
    }
  }

  /**
   * Efetua login com e-mail e senha.
   */
  public async login(email: string, password: string) {
    this.isLoading = true;
    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      this._message.show('Login Realizado com Sucesso!');
      this.redirectTo('/home');
      return userCredential;
    } catch (error: any) {
      this.showErro(error);
      return null;
    } finally {
      this.isLoading = false;
    }
  }

  /**
   * Efetua login com uma conta Google.
   */
  async loginComGoogle(): Promise<UserCredential | null> {
  this.isLoading = true;
  try {
    // Apenas faz o login e retorna o resultado
    return await signInWithPopup(this.auth, new GoogleAuthProvider());
  } catch (error: any) {
    this.showErro(error);
    return null;
  } finally {
    this.isLoading = false;
  }
}

  /**
   * Efetua logout do usuário.
   */
  async logout(): Promise<void> {
    try {
      await signOut(this.auth);
      this.redirectTo('/login');
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  }

  /**
   * Retorna um Observable com o estado de autenticação (usuário logado ou null).
   * Essencial para o resto do app saber se o usuário está logado.
   */
  getAuthState(): Observable<User | null> {
    return new Observable(subscriber => {
      onAuthStateChanged(this.auth, user => {
        subscriber.next(user);
      });
    });
  }
  
  /**
   * Redireciona o usuário para outra página.
   */
  redirectTo(page: string): void {
    this._router.navigate([page]);
  }

  /**
   * Exibe a mensagem de erro com base no código do Firebase.
   */
  private showErro(error: any): void {
    let message: string = 'Ocorreu um erro inesperado. Tente novamente.';
    
    switch (error.code) {
      case 'auth/too-many-requests':
        message = 'Muitas tentativas de login. Tente novamente mais tarde.';
        break;
      case 'auth/user-not-found':
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        message = 'E-mail ou senha inválidos.';
        break;
      case 'auth/weak-password':
        message = 'A senha deve conter no mínimo 6 caracteres.';
        break;
      case 'auth/email-already-in-use':
        message = 'Este e-mail já está em uso por outra conta.';
        break;
    }
    this._message.show(message, 2000);
  }
}