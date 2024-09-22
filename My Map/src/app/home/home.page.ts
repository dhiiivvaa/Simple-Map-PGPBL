import { Component, OnInit } from '@angular/core';
import Map from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';
import { Geolocation } from '@capacitor/geolocation';
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer';
import Graphic from '@arcgis/core/Graphic';
import Point from '@arcgis/core/geometry/Point';
import SimpleMarkerSymbol from '@arcgis/core/symbols/SimpleMarkerSymbol';
import ImageryLayer from '@arcgis/core/layers/ImageryLayer';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  mapView!: MapView;
  userLocationGraphic!: Graphic;
  map!: Map;
  graphicsLayer!: GraphicsLayer; // Tambahan
  constructor() {}

  async ngOnInit() {
    this.map = new Map({
      basemap: 'topo-vector' // default basemap
    });

    this.mapView = new MapView({
      container: 'container',
      map: this.map,
      zoom: 5
    });

    // Tambahkan ImageryLayer untuk cuaca
    let weatherServiceFL = new ImageryLayer({ url: WeatherServiceUrl });
    this.map.add(weatherServiceFL);

    // Tambahkan GraphicsLayer untuk marker agar tetap di atas
    this.graphicsLayer = new GraphicsLayer();
    this.map.add(this.graphicsLayer);

    // Memulai dengan lokasi Atlanta
    let atlantaPoint = new Point({ latitude: 43.791004873912556, longitude: -84.93995115208739 });
    this.userLocationGraphic = new Graphic({
      symbol: new SimpleMarkerSymbol({
        color: 'red', // Mengatur warna simbol marker menjadi merah
        size: 8, // Ukuran marker
        outline: {
          color: 'black', // Warna outline marker
          width: 1 // Lebar outline marker
        }
      }),
      geometry: atlantaPoint,
    });

    // Tambahkan marker ke graphicsLayer, bukan ke mapView langsung
    this.graphicsLayer.add(this.userLocationGraphic);
    this.mapView.center = atlantaPoint;

    setInterval(this.updateUserLocationOnMap.bind(this), 10000);
  }

  async getLocationService(): Promise<number[]> {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition((resp) => {
        resolve([resp.coords.latitude, resp.coords.longitude]);
      });
    });
  }

  async updateUserLocationOnMap() {
    let latLng = await this.getLocationService();
    let geom = new Point({ latitude: latLng[0], longitude: latLng[1] });
    if (this.userLocationGraphic) {
      this.userLocationGraphic.geometry = geom;
    } else {
      this.userLocationGraphic = new Graphic({
        symbol: new SimpleMarkerSymbol({
          color: 'red', // Mengatur warna simbol marker menjadi merah
          size: 10, // Ukuran marker
          outline: {
            color: 'black', // Warna outline marker
            width: 1 // Lebar outline marker
          }
        }),
        geometry: geom,
      });
      this.graphicsLayer.add(this.userLocationGraphic); // Tambahkan ke graphicsLayer
    }
  }

  changeBasemap(event: any) {
    const selectedBasemap = event.target.value;
    this.map.basemap = selectedBasemap; // Mengganti basemap sesuai pilihan
  }
}

const WeatherServiceUrl =
  'https://mapservices.weather.noaa.gov/eventdriven/rest/services/radar/radar_base_reflectivity_time/ImageServer';



  // private longitude: number | any;
  // private latitude: number | any;

  // public async ngOnInit() {
  //   // const position = await Geolocation.getCurrentPosition();
  //   // this.longitude = position.coords.longitude;
  //   // this.latitude = position.coords.latitude;
  //   this.longitude = 110.37772145333969;
  //   this.latitude = -7.77155096191422;

  //   // Membuat peta
  //   const map = new Map({
  //     basemap: "topo-vector"
  //   });

  //   // Membuat tampilan peta
  //   const view = new MapView({
  //     container: "container",
  //     map: map,
  //     zoom: 14,
  //     center: [this.longitude, this.latitude]
  //   });

  //   // Membuat layer untuk grafik
  //   const graphicsLayer = new GraphicsLayer();
  //   map.add(graphicsLayer);

  //   // Menggunakan gambar sebagai simbol marker
  //   const markerSymbol = new PictureMarkerSymbol({
  //     url: '/assets/icon/file.png', // Ganti dengan URL gambar Anda
  //     width: "20px", // Sesuaikan ukuran gambar
  //     height: "32px"
  //   });

  //   // Membuat point untuk marker
  //   const point = new Point({
  //     longitude: this.longitude,
  //     latitude: this.latitude
  //   });

  //   // Membuat grafik untuk marker
  //   const pointGraphic = new Graphic({
  //     geometry: point,
  //     symbol: markerSymbol
  //   });

  //   // Menambahkan marker ke layer grafik
  //   graphicsLayer.add(pointGraphic);
  // }

