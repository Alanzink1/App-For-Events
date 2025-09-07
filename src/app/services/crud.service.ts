import { DocumentReference, FieldPath, orderBy, setDoc } from '@firebase/firestore';
import { Injectable } from '@angular/core';
import { addDoc, getDocs, doc, updateDoc, collection, Firestore, deleteDoc, query, where, WhereFilterOp, startAt, endAt } from '@angular/fire/firestore';
import { AuthenticateService } from 'src/app/services/auth.service';
import { MessageService } from 'src/app/services/message.service';
import { AlertController } from '@ionic/angular';
import { getDoc } from '@angular/fire/firestore';
import { getDownloadURL, ref, uploadBytes, Storage } from '@angular/fire/storage';

@Injectable({
    providedIn: 'root',
})

export class CrudService {
    isLoading: boolean = false;
    handlerMessage = '';
    roleMessage = '';
    
    constructor(
        public firestore: Firestore,
        private _message: MessageService,
        private storage: Storage,
        private _auth: AuthenticateService,
        private _alertController: AlertController
    ) {}

    /*
    * @description: Inserir um novo registro no banco de dados
    * @param item: any
    * @param collection: string
    */
    async insert(item: any, remoteCollectionName: string): Promise<string> {
  if (!item) {
    this._message.show('Não foi possível salvar');
    throw new Error("Item inválido");
  }

  try {
    this.isLoading = true;
    const dbInstance = collection(this.firestore, remoteCollectionName);
    const docRef: DocumentReference = await addDoc(dbInstance, item);

    this._message.show('Salvo com sucesso.');
    return docRef.id; // 🔥 Retorna só o ID do documento
  } catch (error) {
    this._message.show('Erro ao salvar.');
    throw error;
  } finally {
    this.isLoading = false;
  }
}

    setDocument(collectionName: string, docId: string, data: any) {
            const docRef = doc(this.firestore, collectionName, docId);
            return setDoc(docRef, data);
        }


    async fetchWhereIn<T>(collectionName: string, field: string, values: any[]): Promise<T[]> {
  
    if (!values || values.length === 0) {
        return [];
    }
    
    const q = query(collection(this.firestore, collectionName), where(field, 'in', values));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => {
        return { id: doc.id, ...doc.data() } as T;
    });
    }

    async fetchWhereIsIn<T>(
        collectionName: string,
        field: string | FieldPath,
        values: string[]
    ): Promise<T[]> {
        const ref = collection(this.firestore, collectionName);
        const q = query(ref, where(field, 'in', values));
        const snapshot = await getDocs(q);
        return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as T));
    }

    /*
    * @description: Pegar todos os itens do banco de dados
    * @param remoteCollection: string
    */
    fetchAll(remoteCollectionName: string): Promise<any> {
        //this._auth.isAdmin();
        this.isLoading = true;
        let data: any = [];

        const dbInstance = collection(this.firestore, remoteCollectionName);
        
        data = getDocs(dbInstance)
            .then((response) => {
                return [
                    ...response.docs.map((item) => {
                        return { ...item.data(), id: item.id 
                    }; 
                })];
            })
            .catch((_: any) => {
                this._message.show('Erro ao buscar item.');
                return [];
            })
            .finally(() => {
                this.isLoading = false;
            });

        return data;
    }

    async fetchAllGeneric<T>(collectionName: string): Promise<T[]> {
    const querySnapshot = await getDocs(collection(this.firestore, collectionName));
    return querySnapshot.docs.map(doc => {
      return { id: doc.id, ...doc.data() } as T;
    });
  }

    /*
    * @description: Pegar um item usando um operador específico como = < > <> >= <=
    * @param collection: string
    */
    async fetchByOperatorParam(fieldName: string, operator: WhereFilterOp, fieldValue: any, remoteCollectionName: string): Promise<any> {
        //this._auth.isAdmin();
        this.isLoading = true;
        let data: any = [];

        const dbInstance = query(collection(this.firestore, remoteCollectionName), where(fieldName, operator, fieldValue));
        
        data = getDocs(dbInstance)
            .then((response) => {
                return [
                    ...response.docs.map((item) => {
                        return { ...item.data(), id: item.id 
                    };
                })];
            })
            .catch((_: any) => {
                this._message.show('Erro ao buscar item.');
                return [];
            })
            .finally(() => {
                this.isLoading = false;
            });

        return data;
    }

    async uploadFile(collectionName: string, uid: string, file: File): Promise<string> {
    try {
      const storageRef = ref(this.storage, `${collectionName}/${uid}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      return url;
    } catch (err) {
      this._message.show('Erro ao enviar arquivo.');
      return '';
    }
  }

    async fetchById(id: string, remoteCollectionName: string): Promise<any> {
    this.isLoading = true;
    const docRef = doc(this.firestore, remoteCollectionName, id);

    const docSnap = await getDoc(docRef)
        .catch(() => {
        this._message.show('Erro ao buscar item.');
        return null;
        })
        .finally(() => {
        this.isLoading = false;
        });

    return docSnap?.exists() ? { ...docSnap.data(), id: docSnap.id } : null;
    }


    /*
    * @description: Pegar os itens utilizando o operador Like para consulta
    * @param collection: string
    */
    async fetchByLike(fieldName: string, fieldValue: string, remoteCollectionName: string): Promise<any> {
        //this._auth.isAdmin();
        this.isLoading = true;
        let data: any = [];

        const dbInstance = query(collection(this.firestore, remoteCollectionName), orderBy(fieldName), startAt(fieldValue), endAt(fieldValue + '\uf8ff'));
        
        data = getDocs(dbInstance)
            .then((response) => {
                return [
                    ...response.docs.map((item) => {
                        return { ...item.data(), id: item.id 
                    };
                })];
            })
            .catch((_: any) => {
                this._message.show('Erro ao buscar item.');
                return [];
            })
            .finally(() => {
                this.isLoading = false;
            });

        return data;
    }
    

    /*
    * @description: Atualizar um item do banco de dados
    * @param id: item id string to locate and update record
    * @param data: Object data to update
    */
    update(id: string, data: any, remoteCollectionName: string): boolean {
        //this._auth.isAdmin();
        this.isLoading = true;
        let result = false;
        
        const dataToUpdate = doc(this.firestore, remoteCollectionName, id);

        updateDoc(dataToUpdate, {
            ...data
        })
            .then(() => {
                this._message.show('Informação Atualizada!');
                result = true;
                
            })
            .catch((_: any) => {
                this._message.show('Erro ao atualizar.');
                return [];
            })
            .finally(() => {
                this.isLoading = false;
            });

        return result;
    }

    async updateProfile(id: string, data: any, remoteCollectionName: string): Promise<boolean> {
    try {
        const docRef = doc(this.firestore, remoteCollectionName, id);
        await updateDoc(docRef, data);
        this._message.show('Informações atualizadas!');
        return true;
    } catch (err) {
        this._message.show('Erro ao atualizar.');
        return false;
    }
    }


    /*
    * @description: Remover um item do banco de dados
    * @param id: item id string to locate and remove document
    */
    async remove(id: string, remoteCollectionName: string) {
        //this._auth.isAdmin();

        const alert = await this._alertController.create({
            header: 'Essa ação não poderá ser revertida!',
            buttons: [
                {
                text: 'Cancelar',
                role: 'cancel',
                },
                {
                text: 'Confirmar Exclusão',
                role: 'confirm',
                }
            ]
            });
        
            await alert.present();
        
            const { role } = await alert.onDidDismiss();

            if (role == 'confirm') {
                this.isLoading = true;
                const dataToDelete = doc(this.firestore, remoteCollectionName, id)
                deleteDoc(dataToDelete)
                    .then(() => {
                        this._message.show('Registro removido!');
                    })
                    .catch(()=> {
                        this._message.show('Erro ao remover!');
                    })
                    .finally(()=> {
                        this.isLoading = false;
                    });
            }
        }


}
