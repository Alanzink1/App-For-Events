// ✅ ALTERAÇÃO: Importe IonInput e mude a declaração do google
import { Component, ElementRef, OnInit, ViewChild, AfterViewInit, Renderer2 } from '@angular/core';
import { IonInput } from '@ionic/angular';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';
import { doc, serverTimestamp, updateDoc, arrayUnion, Firestore, setDoc, addDoc, collection } from '@angular/fire/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import imageCompression from 'browser-image-compression';
import { CrudService } from 'src/app/services/crud.service';
import { StorageService } from 'src/app/services/storage.service';
import { environment } from 'src/environments/environment';

// ✅ ALTERAÇÃO: Declare o google globalmente para o TypeScript
declare var google: any;

@Component({
  selector: 'app-adicionar-evento',
  templateUrl: './adicionar-evento.component.html',
  styleUrls: ['./adicionar-evento.component.scss'],
})
export class AdicionarEventoComponent implements OnInit, AfterViewInit {

  // ✅ ALTERAÇÃO: Referência para o mapa
  @ViewChild('mapElement', { static: false }) mapElement!: ElementRef;
  // ✅ ALTERAÇÃO: Referência específica para o IonInput do autocomplete
  @ViewChild('autocomplete', { static: false }) autocompleteInput!: IonInput;

  map: any;
  marker: any;
  autocomplete: any;
  
  private mapsScriptLoaded = false;
  
  adicionarEventoForm!: FormGroup;
  latLng: { lat: number; lng: number } | null = null;
  isLoading = false;
  fotoPreview: string | null = null;
  private fotoFile: File | null = null;
  userId: string | null = null;
  filtro: string = '';

  categorias = [ 'Cultural', 'Geek', 'Show', 'Esportivo', 'Religioso', 'Comunitário', 'Corporativo', 'Social', 'Digital' ];
  categoriasSelecionadas: string[] = [];
  categoriasFiltradas: string[] = [];

  constructor(
    private modalCtrl: ModalController,
    private fb: FormBuilder,
    private crudService: CrudService,
    private storageService: StorageService,
    private auth: Auth,
    private firestore: Firestore,
    private renderer: Renderer2 
  ) {
    this.adicionarEventoForm = this.fb.group({
      titulo: ['', Validators.required],
      localizacao: ['', Validators.required],
      descricao: ['', Validators.required],
      regras: ['', Validators.required],
      valorIngresso: ['', [Validators.required, Validators.min(0)]],
      data: ['', Validators.required],
      local: ['', Validators.required],
      chavePix: ['', Validators.required],
      titularPix: ['', Validators.required],
      limiteIngressos: ['', [Validators.required, Validators.min(1)]],
      categorias: [[]]
    });
  }

  ngOnInit(): void {
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        this.userId = user.uid;
      }
    });
  }

  ngAfterViewInit() {
    this.loadGoogleMapsScript().then(() => {
      this.initMap();
      this.initAutocomplete(); // só precisa chamar aqui
    }).catch(err => {
      console.error("❌ Erro ao carregar o script do Google Maps", err);
    });
  }


  loadGoogleMapsScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.mapsScriptLoaded) {
        resolve();
        return;
      }
      
      const googleMapsApiKey = environment.googleMapsApiKey;
      const script = this.renderer.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${googleMapsApiKey}&libraries=places`;
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        this.mapsScriptLoaded = true;
        resolve();
      };
      
      script.onerror = (error: any) => {
        reject(error);
      };

      this.renderer.appendChild(document.head, script);
    });
  }

  initMap() {
    const initialPosition = { lat: -23.55052, lng: -46.633308 };
    this.map = new google.maps.Map(this.mapElement.nativeElement, {
      center: initialPosition,
      zoom: 14,
    });

    this.marker = new google.maps.Marker({
      position: initialPosition,
      map: this.map,
      draggable: true,
    });
    
    this.latLng = initialPosition;

    google.maps.event.addListener(this.marker, 'dragend', () => {
      const position = this.marker.getPosition();
      this.latLng = { lat: position.lat(), lng: position.lng() };
      console.log("📍 Localização arrastada:", this.latLng);
    });
  }

  // ✅ ALTERAÇÃO: Método initAutocomplete corrigido
  async initAutocomplete() {
    // Usamos o método do Ionic para pegar o input nativo de forma segura
    const inputElement = await this.autocompleteInput.getInputElement();

    this.autocomplete = new google.maps.places.Autocomplete(inputElement);
    this.autocomplete.bindTo('bounds', this.map);

    this.autocomplete.addListener('place_changed', () => {
        const place = this.autocomplete.getPlace();
        if (!place.geometry || !place.geometry.location) {
            console.warn("❌ Detalhes do local não encontrados para o input:", place.name);
            return;
        }

        this.map.setCenter(place.geometry.location);
        this.map.setZoom(17);

        this.marker.setPosition(place.geometry.location);

        this.latLng = {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng()
        };

        // Preenche os campos do formulário
        this.adicionarEventoForm.patchValue({
            nomeLocal: place.name,
            localizacao: place.formatted_address // Opcional: preencher com o endereço completo
        });

        console.log("✅ Localização escolhida:", this.latLng);
    });
  }
  
  async adicionarEvento() {
    if (!this.userId) {
      console.error('❌ User ID indisponível. Não é possível adicionar o evento.');
      return;
    }
   
    if (!this.adicionarEventoForm.valid || !this.latLng) {
      console.warn("⚠ Formulário inválido ou localização não definida.");
      console.warn('Form inválido ou usuário não logado.');
      console.log("userId:", this.userId);
      console.log("Erros do form:", this.adicionarEventoForm.errors);
      console.log("Form values:", this.adicionarEventoForm.value);
      console.log("Form status:", this.adicionarEventoForm.status);
      this.adicionarEventoForm.markAllAsTouched();
      this.adicionarEventoForm.markAllAsTouched();
      return;
    }

    const latLng = {Lat: this.latLng.lat.toString(), Long: this.latLng.lng.toString()};
    
    const eventoData = {
      ...this.adicionarEventoForm.value,
      geolocalizacao: latLng,
      organizadorId: this.userId,
      createdAt: serverTimestamp()
    };
    
    // Opcional: o campo 'localizacao' pode ser redundante se você já tem 'geolocalizacao' e 'nomeLocal'
    // delete eventoData.localizacao; 

    this.isLoading = true;
    try {
      const eventoRef = await addDoc(collection(this.firestore, 'eventos'), eventoData);

      if (this.fotoFile) {
        const imageUrl = await this.storageService.uploadFotoEvento(eventoRef.id, this.fotoFile);
        await updateDoc(doc(this.firestore, 'eventos', eventoRef.id), { imagemUrl: imageUrl });
      }

      const organizadorRef = doc(this.firestore, 'organizadores', this.userId);
      await updateDoc(organizadorRef, {
        eventosId: arrayUnion(eventoRef.id)
      }).catch(async () => {
        await setDoc(organizadorRef, { eventosId: [eventoRef.id] }, { merge: true });
      });

      console.log('✅ Evento adicionado com sucesso!');
      this.isLoading = false;
      this.modalCtrl.dismiss({ sucesso: true });

    } catch (err) {
      console.error('❌ Erro ao adicionar evento:', err);
      this.isLoading = false;
    }
  }

  // ... resto do seu código (onFileSelected, filtrarCategorias, etc.) ...
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
    this.filtro = event.target.value.toLowerCase();

    if (this.filtro && this.filtro.trim() !== '') {
      this.categoriasFiltradas = this.categorias.filter(cat =>
        cat.toLowerCase().includes(this.filtro) &&
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
    this.adicionarEventoForm.get('categorias')?.setValue(this.categoriasSelecionadas);
    this.adicionarEventoForm.get('categorias')?.updateValueAndValidity();
  }

  removerCategoria(index: number) {
    this.categoriasSelecionadas.splice(index, 1);
    this.adicionarEventoForm.get('categorias')?.setValue(this.categoriasSelecionadas);
    this.adicionarEventoForm.get('categorias')?.updateValueAndValidity();
  }

  fechar() {
    this.modalCtrl.dismiss();
  }
}