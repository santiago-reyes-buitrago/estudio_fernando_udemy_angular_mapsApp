import {AfterViewInit, Component, effect, ElementRef, inject, viewChild} from '@angular/core';
import {MapService} from '../../core/services/map.service';


@Component({
  selector: 'app-markers-page',
  imports: [],
  templateUrl: './markers-page.html',
  styleUrl: './markers-page.css'
})
export class MarkersPage implements AfterViewInit{
  divElement = viewChild<ElementRef>('map');
  mapboxService = inject(MapService);

  async ngAfterViewInit() {
    await this.mapboxService.initMap(this.divElement()!);
    this.mapboxService.mapListeners(this.mapboxService.map()!);
    this.mapboxService.mapControls(this.mapboxService.map()!);
    this.mapboxService.addMarker(this.mapboxService.map()!,{lng: -74.5, lat: 40,color: 'orange'})
  }

  readonly zoomEffect = effect(() => {
    if (!this.mapboxService.map()) return;
    this.mapboxService.map()?.setZoom(this.mapboxService.zoom())
  })


}
