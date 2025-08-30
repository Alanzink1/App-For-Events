// Em src/app/meu-perfil/meu-perfil.page.ts

import { Component, OnInit } from '@angular/core';
import { Auth, onAuthStateChanged, User } from '@angular/fire/auth'; // Importa onAuthStateChanged
import { doc, getDoc, Firestore } from '@angular/fire/firestore';

interface Perfil {
  id: string;
  cidade: string;
  email: string;
  fotoUrl: string;
  nome: string;
  telefone: string;
  organizador: boolean;
  ultimoLogin: any;
}

@Component({
  selector: 'app-meu-perfil',
  templateUrl: './meu-perfil.page.html',
  styleUrls: ['./meu-perfil.page.scss'],
})
export class MeuPerfilPage implements OnInit {

  isLoading: boolean = true;
  perfil: Perfil | null = null;
  usuarioLogado: User | null = null;

  constructor(
    private auth: Auth,
    private firestore: Firestore
  ) {}

  ngOnInit() {
    // A melhor prática é usar o onAuthStateChanged.
    // Ele é um "ouvinte" que dispara sempre que o status de login muda.
    onAuthStateChanged(this.auth, (user) => {
      this.usuarioLogado = user;
      this.buscaPerfil();
    });
  }

  async buscaPerfil() {
    this.isLoading = true;

    // Se não houver usuário, definimos como deslogado e paramos.
    if (!this.usuarioLogado) {
      this.perfil = null;
      this.isLoading = false;
      return;
    }

    try {
      // 1. Montamos a referência para o documento EXATO do usuário
      const docRef = doc(this.firestore, `usuarios/${this.usuarioLogado.uid}`);
      
      // 2. Buscamos APENAS esse único documento
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        // 3. Se existir, preenchemos o perfil
        this.perfil = { id: docSnap.id, ...docSnap.data() } as Perfil;
      } else {
        // O usuário está autenticado mas não tem perfil no banco
        console.warn("Usuário autenticado, mas sem documento de perfil no Firestore.");
        this.perfil = null;
      }
    } catch (error) {
      console.error("Erro ao buscar perfil:", error);
      this.perfil = null;
    }

    this.isLoading = false;
  }
}