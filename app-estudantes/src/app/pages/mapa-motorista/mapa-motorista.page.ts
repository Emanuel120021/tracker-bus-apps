// src/app/mapa-motorista/mapa-motorista.page.ts

import { Component } from '@angular/core';
// import { LocationService } from 'src/app/services/location';
import { IonicModule } from '@ionic/angular'; // 👈 1. IMPORTE O IONIC MODULE
import { CommonModule } from '@angular/common'; // 👈 2. IMPORTE O COMMON MODULE
import * as L from 'leaflet';
import { addIcons } from 'ionicons';
import { locateOutline, refreshOutline } from 'ionicons/icons';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonSpinner,
  IonButton,
  IonButtons,
  IonIcon,
} from '@ionic/angular/standalone';
import { Geolocation } from '@capacitor/geolocation';

@Component({
  selector: 'app-mapa-motorista',
  templateUrl: './mapa-motorista.page.html',
  styleUrls: ['./mapa-motorista.page.scss'],
  standalone: true, // Se o seu componente for standalone
  imports: [
    CommonModule,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonSpinner,
    IonButton,
    IonButtons,
    IonIcon,
  ], // 👈 3. ADICIONE AQUI
})
export class MapaMotoristaPage {
  // Dados que viriam do login no futuro
  aluno = { nome: 'Emanuel', rota: 'Rota Dunas' };
  map!: L.Map;
  isLoading = true;
  userMarker?: L.Marker;

  constructor() {
    addIcons({ locateOutline, refreshOutline });
  }

  ngOnInit() {}

  ionViewDidEnter() {
    // Aguarda DOM renderizar
    setTimeout(() => {
      this.initMap();
    }, 200);
  }

  ionViewWillLeave() {
    if (this.map) {
      this.map.remove();
    }
  }

  initMap() {
    // Inicializa o mapa com otimizações
    this.map = L.map('map', {
      preferCanvas: true, // Usa Canvas (mais rápido)
      zoomControl: true,
      fadeAnimation: false,
      markerZoomAnimation: false,
      zoomSnap: 0.5,
      tapTolerance: 15,
    }).setView([-5.7945, -35.211], 13);

    // Tile layer otimizado
    const tileLayer = L.tileLayer(
      'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
      {
        attribution: '© OpenStreetMap, © CARTO',
        subdomains: 'abcd',
        maxZoom: 19,
        minZoom: 3,
        // OTIMIZAÇÕES CRÍTICAS:
        updateWhenIdle: true, // Só carrega quando parar
        updateWhenZooming: false, // Não carrega durante zoom
        keepBuffer: 4, // Mantém mais tiles em cache
        tileSize: 256,
        detectRetina: false, // Economiza banda
        crossOrigin: true,
      }
    ).addTo(this.map);

    // Quando terminar de carregar os tiles
    tileLayer.on('load', () => {
      this.isLoading = false;
      console.log('✅ Mapa carregado!');
    });

    // Evento de erro ao carregar tiles
    tileLayer.on('tileerror', (error) => {
      console.error('❌ Erro ao carregar tile:', error);
    });

    // Se demorar muito, força parar loading (5 segundos)
    setTimeout(() => {
      this.isLoading = false;
    }, 5000);

    // Adiciona um marcador de exemplo
    const marker = L.marker([-5.7945, -35.211]).addTo(this.map);
    marker.bindPopup('<b>Natal</b><br>Rio Grande do Norte');

    // Força recalcular tamanho do mapa
    setTimeout(() => {
      this.map.invalidateSize();
    }, 300);

    // Evento de clique no mapa
    this.map.on('click', (e: L.LeafletMouseEvent) => {
      console.log('Clicou em:', e.latlng);
      this.addMarker(e.latlng.lat, e.latlng.lng, 'Novo local');
    });
  }

  // Adiciona marcador
  addMarker(lat: number, lng: number, titulo: string) {
    const marker = L.marker([lat, lng]).addTo(this.map);
    marker.bindPopup(titulo).openPopup();
  }

  // Pega localização do usuário
  async getMyLocation() {
    try {
      const position = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      });

      const lat = position.coords.latitude;
      const lng = position.coords.longitude;

      console.log('📍 Localização:', lat, lng);

      // Remove marcador anterior se existir
      if (this.userMarker) {
        this.map.removeLayer(this.userMarker);
      }

      // Cria ícone customizado para localização do usuário
      const userIcon = L.divIcon({
        className: 'user-location-icon',
        html: '<div class="pulse"></div>',
        iconSize: [20, 20],
      });

      // Adiciona marcador da localização do usuário
      this.userMarker = L.marker([lat, lng], { icon: userIcon })
        .addTo(this.map)
        .bindPopup('Você está aqui!')
        .openPopup();

      // Centraliza o mapa na localização
      this.map.setView([lat, lng], 15);
    } catch (error) {
      console.error('Erro ao obter localização:', error);
      alert('Não foi possível obter sua localização. Verifique as permissões.');
    }
  }

  // Recarrega o mapa
  reloadMap() {
    this.isLoading = true;

    if (this.map) {
      this.map.remove();
    }

    setTimeout(() => {
      this.initMap();
    }, 200);
  }
}
