// Em src/app/services/maps.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

// Interfaces para ajudar com a tipagem das respostas da API
export interface GeocodingResult {
  lat: number;
  lng: number;
}

@Injectable({ providedIn: 'root' })
export class MapsService {
  private apiKey = environment.googleMapsApiKey;

  constructor(private http: HttpClient) { }

  // MÉTODO 1: Busca por texto (para pegar cidades em um raio)
  findCitiesByTextSearch(coords: GeocodingResult, radius: number = 50000): Observable<any[]> {
    const url = `/maps/api/place/textsearch/json?query=cidades&location=${coords.lat},${coords.lng}&radius=${radius}&key=${this.apiKey}`;
    return this.http.get(url).pipe(
      map((response: any) => response.status === 'OK' ? response.results : [])
    );
  }

  // MÉTODO 2: Reverse Geocoding (para pegar a cidade atual exata)
  getCityFromCoords(coords: GeocodingResult): Observable<string | null> {
    const url = `/maps/api/geocode/json?latlng=${coords.lat},${coords.lng}&key=${this.apiKey}`;
    return this.http.get(url).pipe(
      map((response: any) => {
        if (response.status === 'OK' && response.results.length > 0) {
          for (const component of response.results[0].address_components) {
            if (component.types.includes('administrative_area_level_2')) {
              return component.long_name;
            }
          }
          for (const component of response.results[0].address_components) {
            if (component.types.includes('locality')) {
                return component.long_name;
            }
          }
        }
        return null;
      })
    );
  }
}