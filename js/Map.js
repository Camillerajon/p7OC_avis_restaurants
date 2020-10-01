/**********************************************************************************************************
 ******************************************* Google Maps Object*******************************************/

class GoogleMaps {
  /**
   * Créer une nouvelle carte Google
   * @param {Object} mapContainer L'élément HTML où j'affiche la carte
   * @param {Array<Object>} data Les données des restaurants
   */
  constructor(mapContainer, data) {
    this.mapContainer = mapContainer;
    this.map = new google.maps.Map(this.mapContainer, {
      center: { lat: 0, lng: 0 },
      zoom: 12,
    });
    this.data = data;
  }
  /**
   * Chargement de la carte
   */
  load() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          let userPosition = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          this.showUserMarker(userPosition);
          this.showRestaurantsMarkers();

          this.map.setCenter(userPosition);
          console.log(this.data);
        },
        () => {
          this.handleLocationError(true, this.infoWindow.container, this.map.getCenter());
        }
      );
    } else {
      this.handleLocationError(false, this.infoWindow.container, this.map.getCenter());
    }
  }

  /**
   * Message d'erreur si la geolocalisation échoue
   * @param {Boolean} browserHasGeolocation True si le service de geolocalisation est en cause, False si c'est le navigateur qui est en cause
   * @param {Object} infoWindow L'infowindow qui affichera le message d'erreur sur la carte
   * @param {Object} pos La position de l'infowindow
   */
  handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ? "Error: The Geolocation service failed." : "Error: Your browser doesn't support geolocation.");
    infoWindow.open(map);
  }

  /**
   * Crée et affiche le marker de l'utilisateur
   * @param {Object} position Les coordonnées lat et long du marker
   */
  showUserMarker(position) {
    let userInfoWindow = new InfoWindow("Vous êtes ici !");
    let infoWindow = userInfoWindow.createContent();

    let userMarker = new Marker(position, this.map, infoWindow);
    userMarker.createMarker();
  }

  /**
   * Crée et affiche les markers des différents réstaurants
   */
  showRestaurantsMarkers() {
    this.data.map((data) => {
      let restaurantPosition = {
        lat: data.lat,
        lng: data.long,
      };

      let restaurantInfoWindow = new InfoWindow(data);
      let infoWindow = restaurantInfoWindow.createContent();
      data.infoWindow = infoWindow;

      let restaurantMarker = new Marker(restaurantPosition, this.map, infoWindow, this.data);
      let marker = restaurantMarker.createMarker();
      data.marker = marker;
    });
  }
}
