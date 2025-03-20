import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FooterComponent } from "../../../shared/components/user/footer/footer.component";
import * as L from 'leaflet';
import { NavBarComponent } from "../../../shared/components/user/nav-bar/nav-bar.component";
import { HeadContentComponent } from "../../../shared/components/user/head-content/head-content.component";

@Component({
  selector: 'app-about',
  imports: [ FooterComponent, NavBarComponent, HeadContentComponent],
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements AfterViewInit{
  private map!: L.Map;

  ngAfterViewInit(): void {
    this.initMap();
  }

  private initMap(): void {
    this.map = L.map('map').setView([50.5, 0], 5); 

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);

    const customIcon = L.icon({
      iconUrl: 'a.png', 
      iconSize: [20, 30], 
      iconAnchor: [20, 40], 
      popupAnchor: [0, -40] 
    });

    L.marker([48.8566, 2.3522],{icon: customIcon}).addTo(this.map).bindPopup('Occassio, <br> Events').openPopup();
  }

}
