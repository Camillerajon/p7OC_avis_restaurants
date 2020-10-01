/**********************************************************************************************************
 ********************************************** Marker Object***********************************************/

class Marker {
  /**
   * Crée un marker
   * @param {Object} position La position du marker
   * @param {Objet} map La carte qui sera associé au marker
   * @param {Objet} infowindow L'infowindow qui sera associé au marker
   * @param {Object} data Les données des restaurants
   */
  constructor(position, map, infoWindow, data) {
    this.user = false;
    this.position = position;
    this.map = map;
    this.infoWindow = infoWindow;
    this.data = data;
  }

  /**
   * Création d'un nouveau marker sur la carte
   * ainsi que de son "event" click ouvrant l'infowindow
   * dont il est associé
   */
  createMarker() {
    let marker = new google.maps.Marker({
      position: this.position,
      map: this.map,
    });

    marker.addListener("click", () => {
  
      let restaurantOpen = this.data.find(data => data.infoWindow.opened);
      if(restaurantOpen != undefined) {
        restaurantOpen.infoWindow.close();
        restaurantOpen.infoWindow.opened = false;
      }
      
      this.infoWindow.open(this.map, marker);
      this.infoWindow.opened = true;
    });

    return marker;
  }
}
