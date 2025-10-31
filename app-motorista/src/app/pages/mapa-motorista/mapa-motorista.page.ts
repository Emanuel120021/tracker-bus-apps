// src/app/mapa-motorista/mapa-motorista.page.ts

import { Component } from '@angular/core';
import { LocationService } from 'src/app/services/location';
import { IonicModule } from '@ionic/angular'; // 👈 1. IMPORTE O IONIC MODULE
import { CommonModule } from '@angular/common'; // 👈 2. IMPORTE O COMMON MODULE

@Component({
  selector: 'app-mapa-motorista',
  templateUrl: './mapa-motorista.page.html',
  styleUrls: ['./mapa-motorista.page.scss'],
  standalone: true, // Se o seu componente for standalone
  imports: [IonicModule, CommonModule], // 👈 3. ADICIONE AQUI
})
export class MapaMotoristaPage {
  // Dados que viriam do login no futuro
  motorista = { nome: 'Emanuel', rota: 'Rota Dunas' };

  constructor(public locationService: LocationService) {} // Deixando público para usar no template

  toggleTracking() {
    if (this.locationService.isTracking) {
      this.locationService.stopTracking();
    } else {
      this.locationService.startTracking();
    }
  }
}
