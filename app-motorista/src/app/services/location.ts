// src/app/services/location.service.ts

import { Injectable, NgZone } from '@angular/core';
import { Geolocation, Position } from '@capacitor/geolocation';
import { Socket } from 'ngx-socket-io'; // Assumindo que você usará ngx-socket-io para o cliente

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  private watchId: string | null = null;
  public isTracking = false;

  constructor(private socket: Socket, private ngZone: NgZone) {}

  async startTracking() {
    // 1. Pedir permissão para usar o GPS
    const permissions = await Geolocation.requestPermissions();
    if (permissions.location !== 'granted') {
      // O que fazer se o usuário negar a permissão
      console.error('Permissão de localização negada');
      return;
    }

    this.isTracking = true;

    // 2. Começar a "escutar" a posição do GPS
    this.watchId = await Geolocation.watchPosition(
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      },
      (position) => {
        if (position) {
          // ⭐ Pulo do gato do NgZone:
          // Garante que a atualização aconteça dentro do "mundo" do Angular,
          // evitando problemas de detecção de mudanças.
          this.ngZone.run(() => {
            const coords = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            };

            console.log('Enviando coordenadas:', coords);

            // 3. Enviar as coordenadas para o backend via Socket.IO
            this.socket.emit('updateLocation', coords);
          });
        }
      }
    );
  }

  async stopTracking() {
    if (this.watchId) {
      await Geolocation.clearWatch({ id: this.watchId });
      this.watchId = null;
      this.isTracking = false;
      console.log('Rastreamento parado.');
      // Opcional: avisar ao backend que a viagem terminou
      // this.socket.emit('stopTracking');
    }
  }
}
