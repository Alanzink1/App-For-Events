import { Injectable } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  User,
  UserCredential
} from '@angular/fire/auth';
import { Router } from '@angular/router';
import { MessageService } from './message.service';
import { Observable } from 'rxjs';
import { NativeBiometric } from 'capacitor-native-biometric';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root',
})
export class AuthenticateService {
  isLoading = false;
  private storageInit = false;

  constructor(
    public auth: Auth,
    private _message: MessageService,
    private _router: Router,
    private storage: Storage
  ) {
    this.initStorage();
  }

  // -----------------------------
  // FIREBASE AUTH
  // -----------------------------
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

  async loginComGoogle(): Promise<UserCredential | null> {
    this.isLoading = true;
    try {
      return await signInWithPopup(this.auth, new GoogleAuthProvider());
    } catch (error: any) {
      this.showErro(error);
      return null;
    } finally {
      this.isLoading = false;
    }
  }

  async logout(): Promise<void> {
    try {
      await signOut(this.auth);
      this.redirectTo('/login');
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  }

  getAuthState(): Observable<User | null> {
    return new Observable(subscriber => {
      onAuthStateChanged(this.auth, user => {
        subscriber.next(user);
      });
    });
  }

  // -----------------------------
  // STORAGE + BIOMETRIA
  // -----------------------------
  private async initStorage() {
    if (!this.storageInit) {
      await this.storage.create();
      this.storageInit = true;
    }
  }

  async ativarBiometria() {
    await this.initStorage();
    await this.storage.set('usarBiometria', 'true');
  }

  async desativarBiometria() {
    await this.initStorage();
    await this.storage.set('usarBiometria', 'false');
  }

  async biometriaAtiva(): Promise<boolean> {
    await this.initStorage();
    const valor = await this.storage.get('usarBiometria');
    return valor === 'true';
  }

  async autenticarComBiometria(): Promise<boolean> {
    try {
      await NativeBiometric.verifyIdentity({
        reason: 'Confirme sua identidade',
        title: 'Login Biométrico',
      });
      return true; // se não lançar erro, biometria validada
    } catch (e) {
      console.error('Erro na biometria:', e);
      return false;
    }
  }

  // -----------------------------
  // AUXILIARES
  // -----------------------------
  redirectTo(page: string): void {
    this._router.navigate([page]);
  }

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
