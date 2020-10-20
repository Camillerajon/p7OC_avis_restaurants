/**********************************************************************************************************
 ********************************************** Marker Object***********************************************/

class Marker {
  /**
   * Crée un marker
   * @param {Object} position La position du marker
   * @param {Objet} map La carte qui sera associé au marker
   * @param {Objet} infoWindow L'infowindow qui sera associé au marker
   * @param {Object} data Les données des restaurants
   * @param {Object} manager Le manager de l'application
   */
  constructor(position, map, infoWindow, data, manager) {
    this.position = position;
    this.map = map;
    this.infoWindow = infoWindow;
    this.data = data;
    this.manager = manager;
    this.user = false;
  }

  /**
   * Création d'un nouveau marker sur la carte
   * ainsi que de son "event" click ouvrant l'infowindow
   * dont il est associé
   */
  createMarker(icon) {
    let marker = new google.maps.Marker({
      position: this.position,
      map: this.map,
      animation: google.maps.Animation.DROP,
      icon : icon 
     });
 
    marker.addListener("click", async () => {
      if (!marker.user) {
        let restaurantOpen = this.data.find((data) => data.infoWindow.opened);

        if (restaurantOpen != undefined) {
          restaurantOpen.infoWindow.close();
          restaurantOpen.infoWindow.opened = false;
        }

        await this.infoWindow.open(this.map, marker);

        this.infoWindow.opened = true;

        this.manager.hideFormComment();

      } else this.infoWindow.open(this.map, marker);
    });

    return marker;
  }
}
