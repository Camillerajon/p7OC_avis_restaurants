/**********************************************************************************************************
 ******************************************* Google Maps Object*******************************************/

class GoogleMaps {
  /**
   * Créer une nouvelle carte Google
   * @param {Array<Object>} data Les données des restaurants
   */
  constructor(data) {
    this.data = data;
    this.mapContainer = document.getElementById("map");
    this.map = new google.maps.Map(this.mapContainer, {
      center: { lat: 48.8534, lng: 2.3488 },
      zoom: 15,
    });
    this.geolocation = false;
    this.userPosition = {};
    this.manager = this.manager;
    this.userIcon = "http://maps.google.com/mapfiles/ms/icons/green-dot.png";
    this.myDataIcon = "https://img.icons8.com/ultraviolet/40/000000/waiter.png";
    this.placeLibraryIcon = "https://img.icons8.com/offices/40/000000/waiter.png";
    this.load();
  }
  /**
   * Chargement de la carte
   */
  load() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.geolocation = true;

          this.userPosition = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          this.showUserMarker(this.userPosition);

          this.map.setCenter(this.userPosition);
          this.clickOnMap(this.map);

          this.search();
        },
        () => {
          let infoWindow = new google.maps.InfoWindow({});
          this.handleLocationError(true, infoWindow, this.map.getCenter());
        }
      );
    } else {
      let infoWindow = new google.maps.InfoWindow({});
      this.handleLocationError(false, infoWindow, this.map.getCenter());
    }
  }

  /**
   * Message d'erreur si la geolocalisation échoue ou n'est pas activée par l'utilisateur
   * @param {Boolean} browserHasGeolocation True si l'utilisateur refuse la geolocalisation, False si c'est le navigateur qui est en cause
   * @param {Object} infoWindow L'infowindow qui affichera le message d'erreur sur la carte
   * @param {Object} pos La position de l'infowindow
   */
  handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(
      browserHasGeolocation
        ? "La géolocalisation n'est pas activée, sans votre position nous ne pouvons afficher les restaurants"
        : "Erreur: votre navigateur ne prend pas en charge la géolocalisation."
    );
    infoWindow.open(this.map);
  }

  /**
   * Crée et affiche le marker de l'utilisateur
   * @param {Object} position Les coordonnées lat et long du marker
   */
  showUserMarker(position) {
    let userInfoWindow = new InfoWindow("Vous êtes ici !");
    let infoWindow = userInfoWindow.createInfoWindow();

    let marker = new Marker(position, this.map, infoWindow, this.data, this.manager);

    let userMarker = marker.createMarker(this.userIcon);
    userMarker.user = true;
  }

  /**
   * Crée et affiche les markers des différents restaurants
   * @param {Array} array Un tableau de 1 ou plusieurs restaurant
   */
  showRestaurantsMarkers(restaurant) {
    let icon;
    let restaurantPosition = {
      lat: restaurant.lat,
      lng: restaurant.long,
    };

    let restaurantInfoWindow = new InfoWindow(restaurant, this.manager);
    let infoWindow = restaurantInfoWindow.createInfoWindow();
    restaurant.infoWindow = infoWindow;

    let newMarker = new Marker(restaurantPosition, this.map, infoWindow, this.data, this.manager);

    if (restaurant.personalData) {
      icon = this.myDataIcon;
    } else if (!restaurant.personalData) {
      icon = this.placeLibraryIcon;
    }

    let marker = newMarker.createMarker(icon);
    restaurant.marker = marker;
    marker.setVisible(false);
  }

  /**
   * Fait apparraître le formulaire pour ajouter un restaurant sur la carte
   * Rajoute également la possibilité de fermer le formulaire avec l'aide de la croix,
   * ou si l'utilisateur clique n'importe où en dehors du formulaire
   */
  clickOnMap() {
    let modal = document.getElementById("myModal");
    var span = document.getElementsByClassName("close")[0];

    google.maps.event.addListener(this.map, "click", (event) => {
      this.manager.myGeocoder(event.latLng);
      modal.style.display = "block";
      document.querySelector(".submitForm").style.display = "none";
      document.querySelector(".validForm").style.display = "block";
    });

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
  }

  /**
   * Utilisation de NearbySearch et GetDetails de Google map afin
   * d'afficher des restaurants provenant de Google Place dans la zone de l'utisateur.
   */
  search() {
    if (this.geolocation === true) {
      let newLocation = this.map.getCenter();

      const request = {
        location: newLocation,
        radius: "800",
        types: ["restaurant"],
      };

      let service = new google.maps.places.PlacesService(this.map);
      service.nearbySearch(request, (results, status) => {

        // On regarde en même temps si des restaurants provenant de nos données se trouvent dans la zone
        // avant de checker le statut de notre requête nearBySearch
        this.data.map((restaurant) => {
          this.showRestaurantsMarkers(restaurant);
          this.checkRestaurantPosition(restaurant);
        });

        if (status == google.maps.places.PlacesServiceStatus.OK) {
          for (let i = 0; i < results.length; i++) {
            let newRequest = {
              placeId: results[i].place_id,
              fields: ["name", "formatted_address", "review", "geometry"],
            };

            service.getDetails(newRequest, (results, status) => {
              if (status == google.maps.places.PlacesServiceStatus.OK) {
                let arrayRatings = [];
                
                if (results.reviews != undefined) {
                  results.reviews.map((result) => {
                    let newRating = {
                      stars: result.rating,
                      comment: result.text,
                    };
                    arrayRatings.push(newRating);
                  });

                  let myNewRestaurant = this.manager.restaurantObjet(
                    results.name,
                    results.formatted_address,
                    results.geometry.location.lat(),
                    results.geometry.location.lng(),
                    arrayRatings
                  );

                  this.data.push(myNewRestaurant);
                  this.showRestaurantsMarkers(myNewRestaurant);
                  this.checkRestaurantPosition(myNewRestaurant);
                }
              }
            });
          }
        }
      });
    }
  }

  /**
   * Vérifie si le marqueur du restaurant est dans la zone affichée de la carte :
   * _Si oui, on l'affiche et on génére un Li dans la liste.
   * _Si non, on n'affiche pas le marqueur et on supprime le Li si il y en a 1.
   * @param {Object} restaurant Un restaurant
   */
  checkRestaurantPosition(restaurant) {
    if (this.map.getBounds().contains(restaurant.marker.getPosition())) {
      restaurant.marker.setVisible(true);
      this.manager.list.addLi(restaurant);
    } else if (!this.map.getBounds().contains(restaurant.marker.getPosition())) {
      restaurant.marker.setVisible(false);
      if (restaurant.li && restaurant.li.parentElement != null) {
        document.querySelector("#list ul").removeChild(restaurant.li);
      }
    }
  }
}
