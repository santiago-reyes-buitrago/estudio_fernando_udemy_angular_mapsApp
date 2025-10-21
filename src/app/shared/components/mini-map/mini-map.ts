import {AfterViewInit, Component, ElementRef, input, viewChild} from '@angular/core';
import {MapService} from '../../../core/services/map.service';
import {MarkerInterface} from '../../../core/interfaces/marker.interface';

@Component({
  selector: 'app-mini-map',
  imports: [],
  templateUrl: './mini-map.html',
  styleUrl: './mini-map.css'
})
export class MiniMap implements AfterViewInit{
  divElement = viewChild<ElementRef>('map');
  mapboxService = new MapService();
  initialMarkers = input<MarkerInterface>();

  async ngAfterViewInit() {
    await this.mapboxService.initMap(this.divElement()!, {interactive: false});
    this.mapboxService.mapListeners(this.mapboxService.map()!);
    this.mapboxService.mapControls(this.mapboxService.map()!);
    if (this.initialMarkers()){
      this.mapboxService.addMarker(this.mapboxService.map()!, this.initialMarkers()!)
      this.mapboxService.flyToMarker(this.initialMarkers()!)
    }
  }
}
