import {AfterViewInit, Component, effect, ElementRef, inject, viewChild} from '@angular/core';
import {MapService, Marker} from '../../core/services/map.service';
import {JsonPipe} from '@angular/common';
import {LngLatLike} from 'mapbox-gl';


@Component({
  selector: 'app-markers-page',
  imports: [
    JsonPipe,
  ],
  templateUrl: './markers-page.html',
  styleUrl: './markers-page.css'
})
export class MarkersPage implements AfterViewInit{
  divElement = viewChild<ElementRef>('map');
  mapboxService = new MapService();

  async ngAfterViewInit() {
    await this.mapboxService.initMap(this.divElement()!);
    this.mapboxService.mapListeners(this.mapboxService.map()!);
    this.mapboxService.mapControls(this.mapboxService.map()!);
  }

  readonly zoomEffect = effect(() => {
    if (!this.mapboxService.map()) return;
    this.mapboxService.map()?.setZoom(this.mapboxService.zoom())
  })

  handleClick(lngLat: LngLatLike) {
    this.mapboxService.flyToMarker(lngLat)
  }

  handleDbClick(marker: Marker) {
    this.mapboxService.deleteMarker(marker);
  }
}
