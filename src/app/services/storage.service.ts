// Em src/app/services/storage.service.ts
import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { firstValueFrom } from 'rxjs'; // 👈 1. Importe o firstValueFrom

@Injectable({ providedIn: 'root' })
export class StorageService {

  constructor(private storage: AngularFireStorage) { }

  async uploadFotoPerfil(userId: string, file: File): Promise<string> {
    const path = `fotos-perfil/${userId}`;
    const ref = this.storage.ref(path);
    
    await ref.put(file);

    // 2. Use firstValueFrom para converter o Observable em Promise
    return firstValueFrom(ref.getDownloadURL());
  }
}