import {AfterViewInit, Component, effect, ElementRef, inject, viewChild} from '@angular/core';
import {DecimalPipe} from '@angular/common';
import {MapService} from '../../core/services/map.service'; // or "const mapboxgl = require('mapbox-gl');"



@Component({
  selector: 'app-fullscreen-map-page',
  imports: [
    DecimalPipe
  ],
  templateUrl: './fullscreen-map-page.html',
  styleUrl: './fullscreen-map-page.css'
})
export class FullscreenMapPage implements AfterViewInit {
  mapboxService = new MapService();
  divElement = viewChild<ElementRef>('map');

  async ngAfterViewInit() {
    await this.mapboxService.initMap(this.divElement()!);
    this.mapboxService.mapListeners(this.mapboxService.map()!);
    this.mapboxService.mapControls(this.mapboxService.map()!)
  }

  readonly zoomEffect = effect(() => {
    if (!this.mapboxService.map()) return;
    this.mapboxService.map()?.setZoom(this.mapboxService.zoom())
  })
}
