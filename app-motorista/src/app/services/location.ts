// src/app/services/location.service.ts

import { Injectable, NgZone } from '@angular/core';
import {
  Geolocation,
  Position,
  PermissionStatus,
} from '@capacitor/geolocation'; // <-- Importei PermissionStatus
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  private watchId: string | null = null;
  public isTracking = false;

  constructor(private socket: Socket, private ngZone: NgZone) {}

  async startTracking() {
    // --- AJUSTE 1: Fluxo de Permissão Aprimorado ---
    // 1. Primeiro, checamos o status da permissão
    let permStatus: PermissionStatus;
    try {
      permStatus = await Geolocation.checkPermissions();
    } catch (e) {
      console.error('Erro ao checar permissões', e);
      throw new Error('Falha ao verificar permissões de localização.');
    } // 2. Se a permissão foi negada no passado, o usuário precisa ir às configurações

    if (permStatus.location === 'denied') {
      console.error('Permissão de localização negada permanentemente'); // Lançamos um erro para a Página (Component) poder mostrar um alerta
      throw new Error(
        'Permissão negada. Por favor, ative a localização nas configurações do app.'
      );
    } // 3. Se a permissão ainda não foi pedida (prompt), pedimos agora

    if (permStatus.location === 'prompt') {
      const permResult = await Geolocation.requestPermissions();
      if (permResult.location !== 'granted') {
        console.error('Permissão de localização negada pelo usuário');
        throw new Error(
          'Você precisa aceitar a permissão de localização para continuar.'
        );
      }
    } // Se chegamos aqui, a permissão está 'granted' // Evita iniciar múltiplos "watches" se startTracking for chamado por engano
    if (this.isTracking) {
      return;
    }

    this.isTracking = true; // 4. Começar a "escutar" a posição do GPS

    try {
      this.watchId = await Geolocation.watchPosition(
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }, // Callback unified (position, err)
        (position, err: any) => {
          if (err) {
            console.error('Erro no watchPosition:', err); // Se o GPS falhar (ex: usuário desligou), paramos o tracking
            this.ngZone.run(() => {
              this.stopTracking();
            });
            return;
          }

          if (position) {
            this.ngZone.run(() => {
              const coords = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
              };
              console.log('Enviando coordenadas:', coords);
              this.socket.emit('updateLocation', coords);
            });
          }
        }
      );
    } catch (e) {
      console.error('Falha ao iniciar o watchPosition', e);
      this.isTracking = false;
      throw new Error('Não foi possível iniciar o rastreamento GPS.');
    }
  }

  async stopTracking() {
    if (this.watchId) {
      // O clearWatch pode falhar se o watchId for inválido
      try {
        await Geolocation.clearWatch({ id: this.watchId });
      } catch (e) {
        console.error('Erro ao parar o watch, talvez já estivesse parado.', e);
      }
      this.watchId = null;
      this.isTracking = false;
      console.log('Rastreamento parado.'); // this.socket.emit('stopTracking');
    }
  }
}
