import { Component, OnInit, AfterViewInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Firestore, doc, updateDoc, serverTimestamp, collection, query, where, getDocs, deleteDoc, DocumentData } from '@angular/fire/firestore';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';
import { ModalController, AlertController } from '@ionic/angular';
import { StorageService } from 'src/app/services/storage.service';

declare var google: any;

@Component({
  selector: 'app-editar-evento',
  templateUrl: './editar-evento.component.html',
  styleUrls: ['./editar-evento.component.scss'],
})
export class EditarEventoComponent implements OnInit, AfterViewInit {

  @Input() evento: any; // recebe o evento do modal
  eventoId!: string;

  editarEventoForm!: FormGroup;
  fotoPreview: string | null = null;
  fotoFile: File | null = null;
  isLoading: boolean = false;
  categoriasSelecionadas: string[] = [];

  filtro: string = '';
  categoriasFiltradas: string[] = [];
  categoriasDisponiveis: string[] = [
    'Música', 'Teatro', 'Esporte', 'Arte', 'Tecnologia', 'Cinema'
  ];

  userId: string | null = null;
  map: any;
  marker: any;
  latLng: { lat: number, lng: number } | null = null;

  constructor(
    private fb: FormBuilder,
    private firestore: Firestore,
    private auth: Auth,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private storageService: StorageService,
  ) {
    this.editarEventoForm = this.fb.group({
      titulo: ['', Validators.required],
      localizacao: ['', Validators.required],
      descricao: ['', Validators.required],
      regras: ['', Validators.required],
      valorIngresso: ['', Validators.required],
      data: ['', Validators.required],
      local: ['', Validators.required],
      chavePix: ['', Validators.required],
      titularPix: ['', Validators.required],
      limiteIngressos: ['', [Validators.required, Validators.min(1)]],
      categorias: [[], Validators.required]
    });
  }

  ngOnInit(): void {
    if (this.evento) {
      this.eventoId = this.evento.id;
      this.editarEventoForm.patchValue({
        titulo: this.evento.titulo,
        localizacao: this.evento.localizacao,
        descricao: this.evento.descricao,
        regras: this.evento.regras,
        valorIngresso: this.evento.valorIngresso,
        data: this.evento.data,
        local: this.evento.local,
        chavePix: this.evento.chavePix,
        titularPix: this.evento.titularPix,
        limiteIngressos: this.evento.limiteIngressos,
        categorias: this.evento.categorias || []
      });

      this.categoriasSelecionadas = this.evento.categorias || [];
      this.fotoPreview = this.evento.imagemUrl || null;

      if (this.evento.geolocalizacao) {
        this.latLng = {
          lat: parseFloat(this.evento.geolocalizacao.Lat),
          lng: parseFloat(this.evento.geolocalizacao.Long),
        };
      }
    }

    onAuthStateChanged(this.auth, (user) => {
      if (user) this.userId = user.uid;
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.initMap(), 500);
  }

  private initMap() {
    const mapElement = document.getElementById('map');
    if (!mapElement) return;

    this.map = new google.maps.Map(mapElement, {
      center: this.latLng || { lat: -23.55052, lng: -46.633308 },
      zoom: 12,
    });

    if (this.latLng) {
      this.marker = new google.maps.Marker({
        position: this.latLng,
        map: this.map,
        draggable: true,
      });
    }

    this.map.addListener("click", (event: any) => this.placeMarker(event.latLng));
  }

  private placeMarker(latLng: any) {
    if (this.marker) this.marker.setPosition(latLng);
    else this.marker = new google.maps.Marker({ position: latLng, map: this.map, draggable: true });

    this.latLng = { lat: latLng.lat(), lng: latLng.lng() };
    this.getAddressFromLatLng(latLng);
  }

  private getAddressFromLatLng(latLng: any) {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ location: latLng }, (results: any, status: any) => {
      if (status === "OK" && results[0]) {
        this.editarEventoForm.patchValue({ localizacao: results[0].formatted_address });
      }
    });
  }

  onFileSelected(event: any) {
    this.fotoFile = event.target.files[0];
    if (this.fotoFile) {
      const reader = new FileReader();
      reader.onload = () => this.fotoPreview = reader.result as string;
      reader.readAsDataURL(this.fotoFile);
    }
  }

  filtrarCategorias(event: any) {
    const valor = event.detail.value.toLowerCase();
    this.filtro = valor;
    this.categoriasFiltradas = this.categoriasDisponiveis.filter(cat =>
      cat.toLowerCase().includes(valor)
    );
  }

  adicionarCategoria(cat: string) {
    this.toggleCategoria(cat);
    this.filtro = '';
    this.categoriasFiltradas = [];
  }

  toggleCategoria(categoria: string) {
    if (this.categoriasSelecionadas.includes(categoria)) {
      this.categoriasSelecionadas = this.categoriasSelecionadas.filter(cat => cat !== categoria);
    } else {
      this.categoriasSelecionadas.push(categoria);
    }
    this.editarEventoForm.patchValue({ categorias: this.categoriasSelecionadas });
  }

  async editarEvento() {
    if (!this.userId || !this.eventoId || !this.editarEventoForm.valid || !this.latLng) {
      this.editarEventoForm.markAllAsTouched();
      return;
    }

    const eventoData = {
      ...this.editarEventoForm.value,
      geolocalizacao: { Lat: this.latLng.lat.toString(), Long: this.latLng.lng.toString() },
      organizadorId: this.userId,
      updatedAt: serverTimestamp()
    };

    this.isLoading = true;
    try {
      const eventoRef = doc(this.firestore, 'eventos', this.eventoId);
      await updateDoc(eventoRef, eventoData);

      if (this.fotoFile) {
        const imageUrl = await this.storageService.uploadFotoEvento(this.eventoId, this.fotoFile);
        await updateDoc(eventoRef, { imagemUrl: imageUrl });
      }

      this.isLoading = false;
      this.modalCtrl.dismiss({ sucesso: true });
    } catch (err) {
      console.error('Erro ao editar evento:', err);
      this.isLoading = false;
    }
  }

  async confirmarExcluir() {
  const alert = await this.alertCtrl.create({
    header: 'Excluir Evento',
    message: `Digite o nome do evento para confirmar a exclusão: <strong>${this.evento.titulo}</strong>`,
    inputs: [
      {
        name: 'confirmNome',
        type: 'text',
        placeholder: 'Nome do evento'
      }
    ],
    buttons: [
      { text: 'Cancelar', role: 'cancel' },
      {
        text: 'Excluir',
        cssClass: 'btn-danger',
        handler: (data) => {
          if (data.confirmNome === this.evento.titulo) {
            this.excluirEvento();
            return true; // permite fechar o alert
          } else {
            alert.message = 'Nome incorreto. Digite corretamente para excluir.';
            return false; // mantém o alert aberto
          }
        }
      }
    ]
  });

  await alert.present();
}


  async excluirEvento() {
    if (!this.eventoId) return;

    const ingressosRef = collection(this.firestore, 'ingressos');
    const q = query(ingressosRef, where('eventoId', '==', this.eventoId));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const aviso = await this.alertCtrl.create({
        header: 'Não é possível excluir',
        message: 'Existem ingressos vinculados a este evento.',
        buttons: ['OK']
      });
      await aviso.present();
      return;
    }

    try {
      await deleteDoc(doc(this.firestore, 'eventos', this.eventoId));
      this.modalCtrl.dismiss({ excluido: true });
    } catch (err) {
      console.error('Erro ao excluir evento:', err);
      const erroAlert = await this.alertCtrl.create({
        header: 'Erro',
        message: 'Não foi possível excluir o evento.',
        buttons: ['OK']
      });
      await erroAlert.present();
    }
  }

  fechar() {
    this.modalCtrl.dismiss();
  }
}
