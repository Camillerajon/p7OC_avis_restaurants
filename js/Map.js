/**********************************************************************************************************
 ******************************************* Google Maps Object*******************************************/

class GoogleMaps {
  /**
   * Créer une nouvelle carte Google
   * @param {Array<Object>} data Les données des restaurants
   */
  constructor(data) {
    this.mapContainer = document.getElementById("map");
    this.map = new google.maps.Map(this.mapContainer, {
      center: { lat: 0, lng: 0 },
      zoom: 12,
    });
    this.data = data;
    this.manager = this.manager;
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
          this.clickOnMap(this.map);
        },
        () => {
          this.handleLocationError(
            true,
            this.infoWindow.container,
            this.map.getCenter()
          );
        }
      );
    } else {
      this.handleLocationError(
        false,
        this.infoWindow.container,
        this.map.getCenter()
      );
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
    infoWindow.setContent(
      browserHasGeolocation
        ? "Error: The Geolocation service failed."
        : "Error: Your browser doesn't support geolocation."
    );
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
    userMarker.user = true;
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

      let restaurantInfoWindow = new InfoWindow(data, this.manager);
      let infoWindow = restaurantInfoWindow.createContent();
      data.infoWindow = infoWindow;

      let restaurantMarker = new Marker(
        restaurantPosition,
        this.map,
        infoWindow,
        this.data,
        this.manager
      );
      let marker = restaurantMarker.createMarker();
      data.marker = marker;
    });
  }

  /**
   * Crée et affiche le marker du réstaurant ajouter par l'utilisateur
   * @param {Object} restaurant Le restaurant ajouté
   * @param {Objet} restaurantPosition Un objet contenant la latitude et longitude du restaurant
   */
  showRestaurantAddedMarker(restaurant, restaurantPosition) {
    let restaurantInfoWindow = new InfoWindow(restaurant, this.manager);
    let infoWindow = restaurantInfoWindow.createContent();
    restaurant.infoWindow = infoWindow;

    let restaurantMarker = new Marker(
      restaurantPosition,
      this.map,
      infoWindow,
      this.data,
      this.manager
    );
    let marker = restaurantMarker.createMarker();
    restaurant.marker = marker;
  }

  /**
   * Fait apparraître le formulaire pour ajouter un restaurant sur la carte
   * Rajoute également la possibilité de fermer le formulaire avec l'aide de la croix,
   * ou si l'utilisateur clique n'importe où en dehors du formulaire
   */
  clickOnMap() {
    let modal = document.getElementById("myModal");
    var span = document.getElementsByClassName("close")[0];

    span.onclick = () => {
      this.manager.emptyInput();
      modal.style.display = "none";
    };

    window.onclick = (event) => {
      if (event.target === modal) {
        this.manager.emptyInput();
        modal.style.display = "none";
      }
    };

    google.maps.event.addListener(this.map, "click", (event) => {
      this.manager.myGeocoder(event.latLng);
      modal.style.display = "block";
      document.querySelector(".submitForm").style.display = "none";
      document.querySelector(".validForm").style.display = "block";
    });
  }
}
