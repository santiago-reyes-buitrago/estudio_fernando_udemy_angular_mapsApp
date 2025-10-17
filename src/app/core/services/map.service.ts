import {computed, ElementRef, Injectable, signal} from '@angular/core';
import mapboxgl, {LngLatLike} from 'mapbox-gl';
import {environment} from '../../../environments/environment';
import {MarkerInterface} from '../interfaces/marker.interface';

mapboxgl.accessToken = environment.mapboxKey

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

  async initMap(divElement:ElementRef) {
    if (!divElement) return;
    await new Promise((resolve) => setTimeout(resolve, 100))
    const element = divElement?.nativeElement;
    const map = new mapboxgl.Map({
      container: element, // container ID
      style: 'mapbox://styles/mapbox/streets-v12', // style URL
      center: this.coordinates(), // starting position [lng, lat]
      zoom: this.zoom(), // starting zoom
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
  }

  mapControls(map: mapboxgl.Map) {
    map.addControl(new mapboxgl.FullscreenControl());
    map.addControl(new mapboxgl.NavigationControl());
  }

  addMarker(map:mapboxgl.Map, {color,draggable,lng,lat}: MarkerInterface) {
    new mapboxgl.Marker({
      color,
      draggable
    }).setLngLat([lng,lat]).addTo(map)
  }
}
