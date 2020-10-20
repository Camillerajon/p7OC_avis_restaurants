class Manager {
  /**
   * Crée un nouveau Manager
   * @param {Object} map La Google Map dont le manager s'occupera
   * @param {Object} list La Liste dont le manager s'occupera
   */
  constructor(map, list) {
    this.map = map;
    this.list = list;
    this.latlng = null;
    this.addManagerInMapAndList();
    this.addWindowFunction();
  }

  /**
   * Ajoute également le manager dans l'objet Map et List
   */
  addManagerInMapAndList() {
    this.map.manager = this;
    this.list.manager = this;
  }

  /**
   * Ajoute les méthodes correspondantes à chaque "onClick" pour mes boutons
   */
  addWindowFunction() {
    window.filter = () => {
      this.filter();
    };

    window.selectOnChange = () => {
      this.selectOnChange();
    };

    window.search = () => {
      this.map.search();
    };

    window.showFormComment = () => {
      this.showFormComment();
    };

    window.submitFormComment = () => {
      this.submitFormComment();
    };

    document.querySelector(".validForm").addEventListener("click", (event) => {
      event.preventDefault();
      this.validationInput();
    });

    document.querySelector(".submitForm").addEventListener("click", (event) => {
      event.preventDefault();
      this.submitFormAddRestaurant(this.latlng);
    });
  }

  /**
   * Calcul une moyenne d'un restaurant
   * @param {Object} data Le restaurant
   */
  calculRating(data) {
    let total = 0;
    for (let i = 0; i < data.ratings.length; i++) {
      total += data.ratings[i].stars;
    }

    let rating = Math.round(total) / data.ratings.length;
    data.averageGrade = rating;
    return rating;
  }

  /**
   * Renvoie une variable contenant des étoiles via l'encodage HTML
   * @param {Number} rating Un nombre qui est la moyenne d'un restaurant
   */
  getStars(rating) {
    let ratingHTML = "";
    for (let i = 0; i < 5; i++) {
      if (rating < i + 0.5) {
        ratingHTML += "&#9734";
      } else ratingHTML += "&#9733";
    }
    return ratingHTML;
  }

  /**
   * Retourne un objet restaurant basé sur le modéle du data.json
   * @param {String} name Le nom du restaurant
   * @param {String} address L'adresse du restaurant
   * @param {Number} lat La latitude du restaurant
   * @param {Number} lng La longitude du restaurant
   * @param {Array} ratings Le tableau des notes et commentaires du restaurant
   */
  restaurantObjet(name, address, lat, lng, ratings) {
    let restaurant = {
      restaurantName: name,
      address: address,
      lat: lat,
      long: lng,
      ratings: [...ratings],
    };

    return restaurant;
  }

  /**
   * Méthode attachée au bouton valider du filtre
   * qui masque/affiche les markers et restaurants dans la liste selon le filtre
   */
  filter() {
    let restaurants = this.map.data;

    let filter1 = document.getElementById("filter-1");
    let filter2 = document.getElementById("filter-2");

    let value1 = filter1.options[filter1.selectedIndex].value;
    let value2 = filter2.options[filter2.selectedIndex].value;

    // Filtre les restaurants par rapport au choix de l'utilisateur ET si ils sont visibles sur la zone d'affichage de la carte
    let selectedRestaurants = restaurants.filter(
      (restaurant) =>
        restaurant.averageGrade >= value1 && restaurant.averageGrade <= value2 && this.map.map.getBounds().contains(restaurant.marker.getPosition())
    );

    // On map l'entièreté des restaurants pour ne pas les afficher
    restaurants.map((restaurant) => restaurant.marker.setVisible(false));
    // On fait pareil pour les Li
    restaurants.map((restaurant) => {
      if (restaurant.li) {
        restaurant.li.style.display = "none";
      }
    });

    // On affiche les restaurants que l'on a filtré
    selectedRestaurants.map((restaurant) => restaurant.marker.setVisible(true));
    // On fait pareil pour les Li
    selectedRestaurants.map((restaurant) => {
      if (restaurant.li) {
        restaurant.li.style.display = "block";
      }
    });

    filter1.disabled = false;
    filter1.selectedIndex = 0;
    filter2.disabled = true;

    while (filter2.firstChild) {
      filter2.removeChild(filter2.firstChild);
    }

    document.querySelector("#btn-filter").style.display = "none";
  }

  /**
   * Change le statut des selects à son utilisation :
   * Active le second select quand l'utilisateur a utilisé le premier et désactive celui-ci.
   * Calcul les options du second select.
   * Affiche le bouton valider.
   */
  selectOnChange() {
    let filter1 = document.getElementById("filter-1");
    let filter2 = document.getElementById("filter-2");

    let value1 = filter1.options[filter1.selectedIndex].value;

    if (filter1.disabled != true) {
      for (let i = value1; i <= 5; i++) {
        let option = document.createElement("option");
        option.innerHTML = i;
        filter2.appendChild(option);
      }
    }

    filter1.disabled = true;
    filter2.disabled = false;
    document.querySelector("#btn-filter").style.display = "flex";
  }

  /**
   * Dans l'infoWindow :
   * Affiche le formulaire pour ajouter un commentaire et une note.
   * Cache le bouton "Ajouter un commentaire".
   */
  showFormComment() {
    document.querySelector(".push-comments").style.display = "none";
    document.querySelector(".add-comments").style.display = "flex";
    document.querySelector(".textarea").value = "";
  }

  /**
   * Dans l'infoWindow :
   * Cache le formulaire pour ajouter un commentaire et une note.
   * Montre le bouton "Ajouter un commentaire".
   */
  hideFormComment() {
    document.querySelector(".add-comments").style.display = "none";
    document.querySelector(".push-comments").style.display = "block";
  }

  /**
   * Valide l'ajout d'une nouvelle note et commentaire sur un restaurant
   */
  submitFormComment() {
    let title = document.querySelector(".restaurant-title");
    let btn = document.querySelector(".push-comments");
    let textarea = document.querySelector(".textarea");
    let starsNumber = document.querySelector(".starsnumber");
    let divComments = document.querySelector(".comments");
    let formComments = document.querySelector(".add-comments");
    let starsHtml = document.querySelector(".stars");
    let thanks = document.querySelector(".thanks");

    let restaurant = this.map.data.find((data) => data.restaurantName === title.innerHTML);

    let newRating = {
      stars: parseInt(starsNumber.value),
      comment: textarea.value,
    };

    restaurant.ratings.push(newRating);

    let comments = restaurant.ratings.map((rating) => {
      let paragraph = "";
      return (paragraph += `<p>${rating.stars} ${rating.comment}</p>`);
    });

    let newAverage = this.calculRating(restaurant);
    let newStars = this.getStars(newAverage);

    starsHtml.innerHTML = newStars;
    divComments.innerHTML = comments.join("");

    formComments.style.display = "none";
    btn.style.display = "block";
    thanks.style.display = "block";

    setTimeout(function () {
      thanks.style.display = "none";
    }, 2000);
  }

  /**
   * Rempli le champ adresse du formulaire d'ajout de restaurant à l'aide
   * du Geocoder de Google
   * @param {Object} latlng La latitude et longitude du clique de l'utilisateur sur la map
   */
  myGeocoder(latlng) {
    let adress = document.querySelector("#address");
    const geocoder = new google.maps.Geocoder();

    geocoder.geocode({ location: latlng }, (result, status) => {
      if (status === "OK") {
        adress.value = result[0].formatted_address;
        this.latlng = latlng;
      } else {
        console.log("No results found");
      }
    });
  }

  /**
   * Checking des inputs du formulaire d'ajout de restaurant avant son envoie
   */
  validationInput() {
    let name = document.querySelector("#name");
    let address = document.querySelector("#address");
    let select = document.querySelector("#rating");
    let msg = document.querySelector("#msg");

    let arrayOfInput = [name, address, select, msg];

    arrayOfInput.map((input) => {
      if (input.value.length === 0 || input.value === "0") {
        input.classList.add("input_invalid");
        document.querySelector(`label[for="${input.id}"]`).style.color = "red";
      } else if (input.value.length > 0 || input.value != "0") {
        input.classList.add("input_valid");
        document.querySelector(`label[for="${input.id}"]`).style.color = "#5fa550";
      }
    });

    if (name.value.length > 0 && address.value.length > 0 && select.value > "0" && msg.value.length > 0) {
      document.querySelector(".submitForm").style.display = "block";
      document.querySelector(".validForm").style.display = "none";
    }
  }

  /**
   * Méthode qui se déclenchera au clique sur le bouton Valider de ton formulaire
   * @param {Object} latLng Un objet contenant la latitude et longitude du restaurant
   */
  submitFormAddRestaurant(latLng) {
    let resultName = document.querySelector("#name").value;
    let resultAddress = document.querySelector("#address").value;
    let stars = document.querySelector("#rating");
    let resultStars = stars.options[stars.selectedIndex].value;
    let resultMessage = document.querySelector("#msg").value;

    let ratings = [{ stars: parseInt(resultStars), comment: resultMessage }];

    let myNewRestaurant = this.restaurantObjet(resultName, resultAddress, latLng.lat(), latLng.lng(), ratings);

    myNewRestaurant.personalData = true;

    this.map.data.push(myNewRestaurant);
    this.map.showRestaurantsMarkers(myNewRestaurant);
    this.map.checkRestaurantPosition(myNewRestaurant);
    this.emptyInput();

    let modal = document.getElementById("myModal");
    modal.style.display = "none";
    this.latlng = null;
  }

  /**
   * Remise à zéro du formulaire d'ajout de restaurant
   */
  emptyInput() {
    let name = document.querySelector("#name");
    let address = document.querySelector("#address");
    let select = document.querySelector("#rating");
    let msg = document.querySelector("#msg");

    let arrayOfInput = [name, address, select, msg];

    arrayOfInput.map((input) => {
      input.classList.remove("input_valid", "input_invalid");
      document.querySelector(`label[for="${input.id}"]`).style.color = "#000000";
    });

    select.selectedIndex = 0;
    name.value = "";
    msg.value = "";
  }
}
