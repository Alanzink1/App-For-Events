import { Injectable } from '@angular/core';
import { getDownloadURL, ref, uploadBytes } from '@angular/fire/storage';
import { Storage } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(private storage: Storage) {}

  // 📌 Upload para foto de perfil (já existia)
  async uploadFotoPerfil(userId: string, file: File): Promise<string> {
    const path = `usuarios/${userId}/perfil/${file.name}`;
    const storageRef = ref(this.storage, path);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  }

  // 📌 Novo: upload para foto de evento
  async uploadFotoEvento(eventoId: string, file: File): Promise<string> {
    const path = `eventos/${eventoId}/${file.name}`;
    const storageRef = ref(this.storage, path);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  }
}
