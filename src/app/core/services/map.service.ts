import {computed, ElementRef, Injectable, signal} from '@angular/core';
import mapboxgl, {LngLatLike, MapboxOptions, MapOptions} from 'mapbox-gl';
import {environment} from '../../../environments/environment';
import {MarkerInterface} from '../interfaces/marker.interface';

mapboxgl.accessToken = environment.mapboxKey

export interface Marker {
  id: string,
  mapboxMarker: mapboxgl.Marker;
}

@Injectable({
  providedIn: 'root'
})
export class MapService {
  map = signal<mapboxgl.Map | null>(null);
  zoom = signal<number>(14);
  private coordinates = signal<LngLatLike>({
    lng: -74.5,
    lat: 40
  })
  coordinatesRead = computed<{ lng: number; lat: number }>(() => this.coordinates() as { lng: number; lat: number })
  markers = signal<Marker[]>([])

  async initMap(divElement: ElementRef,options?: Partial<MapOptions>) {
    if (!divElement) return;
    await new Promise((resolve) => setTimeout(resolve, 100))
    const element = divElement?.nativeElement;
    const map = new mapboxgl.Map({
      container: element, // container ID
      style: 'mapbox://styles/mapbox/streets-v12', // style URL
      center: this.coordinates(), // starting position [lng, lat]
      zoom: this.zoom(), // starting zoom
      ...options
    });
    this.map.set(map);
  }

  mapListeners(map: mapboxgl.Map) {
    map.on('zoomend', (event) => {
      const newZoom = event.target.getZoom();
      this.zoom.set(newZoom)
    })
    map.on('moveend', () => {
      const center = map.getCenter();
      this.coordinates.set(center)
    })
    map.on('click', (event) => {
      const valueConfirm = confirm('Quiere crear un marcador?');
      const color = '#xxxxxx'.replace(/x/g, (y) =>
        ((Math.random() * 16) | 0).toString(16)
      );
      valueConfirm ?
        this.addMarker(this.map()!, {color: color, lng: event.lngLat.lng, lat: event.lngLat.lat})
        : null
    })
  }

  mapControls(map: mapboxgl.Map) {
    map.addControl(new mapboxgl.FullscreenControl());
    map.addControl(new mapboxgl.NavigationControl());
  }

  addMarker(map: mapboxgl.Map, {color, draggable, lng, lat}: MarkerInterface) {
    const mapboxMarker = new mapboxgl.Marker({
      color,
      draggable
    }).setLngLat([lng, lat]).addTo(map)
    this.markers.update((oldValue) => [{id: `${this.markers().length + 1}`, mapboxMarker: mapboxMarker}, ...oldValue])
  }

  flyToMarker(lngLat: LngLatLike) {
    this.map()?.flyTo({
      center: lngLat
    })
  }

  deleteMarker(marker: Marker) {
    const confirmDelete = confirm('Desea eliminar este marcador');
    if (confirmDelete) {
      marker?.mapboxMarker?.remove()
      this.markers.update((Markers) => Markers.filter((item) => item.id !== marker.id))
    }
  }
}
