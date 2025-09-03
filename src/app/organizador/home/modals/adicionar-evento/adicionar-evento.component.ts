import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import imageCompression from 'browser-image-compression';

@Component({
  selector: 'app-adicionar-evento',
  templateUrl: './adicionar-evento.component.html',
  styleUrls: ['./adicionar-evento.component.scss'],
})
export class AdicionarEventoComponent  implements OnInit {

  isLoading = false;
  adicionarEventoForm!: FormGroup;
  fotoPreview: string | null = null;
  private fotoFile: File | null = null;
  filtro: string = '';
  categorias = [
    'Cultural',
    'Geek',
    'Show',
    'Esportivo',
    'Religioso',
    'Comunitário',
    'Corporativo',
    'Social',
    'Digital'
  ];

  categoriasSelecionadas: string[] = [];
  categoriasFiltradas: string[] = [];

  constructor(private modalCtrl: ModalController, private fb: FormBuilder,) {
    this.adicionarEventoForm = this.fb.group({
      titulo: ['', [Validators.required, Validators.minLength(3)]],
      categoria: ['', [Validators.required, Validators.minLength(3)]],
      localizacao: ['', [Validators.required, Validators.minLength(3)]],
      descricao: ['', [Validators.required, Validators.minLength(3)]],
      regras: ['', [Validators.required, Validators.minLength(3)]],
      valor: ['', [Validators.required, Validators.minLength(3)]],
      data: ['', [Validators.required, Validators.minLength(3)]],
      nomeLocal: ['', [Validators.required, Validators.minLength(3)]],
      chavePix: ['', [Validators.required, Validators.minLength(3)]],
      titularPix: ['', [Validators.required, Validators.minLength(3)]],
      limiteIngressos: ['', [Validators.required, Validators.minLength(1)]],
    });
  }

  ngOnInit() {}

  adicionarEvento() {}

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

  filtrarCategorias(event: any) {
    const valor = event.target.value.toLowerCase();

    if (valor && valor.trim() !== '') {
      this.categoriasFiltradas = this.categorias.filter(cat =>
        cat.toLowerCase().includes(valor) &&
        !this.categoriasSelecionadas.includes(cat)
      );
    } else {
      this.categoriasFiltradas = [];
    }
  }


  adicionarCategoria(cat: string) {
    this.categoriasSelecionadas.push(cat);
    this.filtro = '';
    this.categoriasFiltradas = [];
  }

  removerCategoria(index: number) {
    this.categoriasSelecionadas.splice(index, 1);
  }

  fechar() {
    this.modalCtrl.dismiss();
  }

}
