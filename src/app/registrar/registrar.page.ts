import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import imageCompression from 'browser-image-compression';

import { AuthenticateService } from '../services/auth.service'; // Nome correto do serviço
import { CrudService } from '../services/crud.service';
import { StorageService } from '../services/storage.service';

@Component({
  selector: 'app-registrar',
  templateUrl: './registrar.page.html',
  styleUrls: ['./registrar.page.scss'],
})
export class RegistrarPage implements OnInit {

  registroForm!: FormGroup;
  isLoading = false;
  fotoPreview: string | null = null;
  private fotoFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthenticateService,
    private crudService: CrudService,
    private storageService: StorageService,
    private router: Router,
    private alertCtrl: AlertController
  ) { }

  ngOnInit() {
    this.registroForm = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      telefone: [''],
      cidade: ['', [Validators.required]],
      senha: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  async onFileSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 800,
      useWebWorker: true,
      fileType: 'image/webp'
    };

    try {
      const compressedFile = await imageCompression(file, options);
      this.fotoFile = compressedFile;
      
      const reader = new FileReader();
      reader.onload = () => { this.fotoPreview = reader.result as string; };
      reader.readAsDataURL(compressedFile);
    } catch (error) {
      console.error("Erro ao comprimir a imagem:", error);
    }
  }

  async registrar() {
    if (this.registroForm.invalid) return;
    this.isLoading = true;

    const { email, senha, nome, telefone, cidade } = this.registroForm.value;

    try {
      // 1. Cria o usuário no Firebase Auth (usando o método 'register')
      const userCredential = await this.authService.register(email, senha);
      if (!userCredential?.user) throw new Error('Falha ao criar usuário.');

      const uid = userCredential.user.uid;
      let fotoUrl = '';

      // 2. Faz o upload da foto para o Storage, se houver
      if (this.fotoFile) {
        fotoUrl = await this.storageService.uploadFotoPerfil(uid, this.fotoFile);
      }
      
      // 3. Monta o objeto do perfil
      const perfilData = {
        nome, email, telefone, cidade, fotoUrl,
        ultimoLogin: new Date()
      };
      
      // 4. Salva os dados do perfil no Firestore
      await this.crudService.setDocument('usuarios', uid, perfilData);

      await this.showAlert('Sucesso!', 'Sua conta foi criada. Faça o login para continuar.');
      this.router.navigate(['/login']);

    } catch (error: any) {
      console.error("Erro no registro:", error);
      await this.showAlert('Erro', 'Não foi possível criar a conta. Verifique se o e-mail já está em uso.');
    } finally {
      this.isLoading = false;
    }
  }

  async loginComGoogle() {
    const userCredential = await this.authService.loginComGoogle();

    if (userCredential?.user) {
      const user = userCredential.user;
      
      // Verifica se o perfil já existe e cria se for o primeiro login
      const perfilExistente = await this.crudService.fetchById('usuarios', user.uid);
      if (!perfilExistente) {
        // Lógica para criar o perfil no Firestore...
        const perfilData = { nome: user.displayName, email: user.email, fotoUrl: user.photoURL };
        await this.crudService.setDocument('usuarios', user.uid, perfilData);
      }

      // Redireciona para a página principal
      this.router.navigate(['/meu-perfil']);
    }
  }
  
  async showAlert(header: string, message: string) {
    const alert = await this.alertCtrl.create({ header, message, buttons: ['OK'] });
    await alert.present();
  }
}