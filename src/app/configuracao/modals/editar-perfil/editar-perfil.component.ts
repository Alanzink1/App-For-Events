import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Auth, onAuthStateChanged, User } from '@angular/fire/auth';
import { CrudService } from 'src/app/services/crud.service';

@Component({
  selector: 'app-editar-perfil',
  templateUrl: './editar-perfil.component.html',
  styleUrls: ['./editar-perfil.component.scss'],
})
export class EditarPerfilComponent {
  @Input() nome: string = '';
  @Input() email: string = '';
  @Input() telefone: string = '';
  @Input() cidade: string = '';
  @Input() foto: string | null = null;

  userPerfil: User | null = null;
  fotoPreview: string | null = null;
  private fotoFile: File | null = null;

  constructor(private modalCtrl: ModalController, private auth: Auth, private crudService: CrudService) {}

  ngOnInit() {
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        this.userPerfil = user;
        this.carregarDados();
      }
    });
  }

  async carregarDados() {
    if (!this.userPerfil) return;
    const perfil = await this.crudService.fetchById(this.userPerfil.uid, 'usuarios');
    if (perfil) {
      this.nome = perfil.nome || '';
      this.cidade = perfil.cidade || '';
      this.email = perfil.email || '';
      this.telefone = perfil.telefone || '';
      this.foto = perfil.fotoUrl || null;
      this.fotoPreview = this.foto; // mostra a foto atual
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;
    this.fotoFile = file;

    const reader = new FileReader();
    reader.onload = () => (this.fotoPreview = reader.result as string);
    reader.readAsDataURL(file);
  }

  async salvar() {
    if (!this.userPerfil) return;

    let fotoUrl = this.foto;

    if (this.fotoFile) {
      fotoUrl = await this.crudService.uploadFile('usuarios', this.userPerfil.uid, this.fotoFile);
    }

    const dadosAtualizados = {
      nome: this.nome,
      email: this.email,
      telefone: this.telefone,
      cidade: this.cidade,
      fotoUrl: fotoUrl,
    };

    const sucesso = await this.crudService.update(this.userPerfil.uid, dadosAtualizados, 'usuarios');

    if (sucesso) {
      this.modalCtrl.dismiss(dadosAtualizados);
    }
  }



  fechar() {
    this.modalCtrl.dismiss();
  }
}
