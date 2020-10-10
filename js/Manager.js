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
   * Evènement qui déclenche le filtre (récupération des valeurs, filtre sur les restaurants)
   * Et masque/affiche les markers et restaurants dans la liste selon le filtre
   */
  filter() {
    let restaurants = this.map.data;

    let filter1 = document.getElementById("filter-1");
    let filter2 = document.getElementById("filter-2");

    let value1 = filter1.options[filter1.selectedIndex].value;
    let value2 = filter2.options[filter2.selectedIndex].value;

    let selectedRestaurants = restaurants.filter(
      (restaurant) =>
        restaurant.averageGrade > value1 && restaurant.averageGrade < value2
    );

    restaurants.map((restaurant) => restaurant.marker.setVisible(false));
    restaurants.map((restaurant) => (restaurant.li.style.display = "none"));
    selectedRestaurants.map((restaurant) => restaurant.marker.setVisible(true));

    selectedRestaurants.map(
      (restaurant) => (restaurant.li.style.display = "flex")
    );
  }

  /**
   * Dans l'infoWindow :
   * Affiche le formulaire pour ajouter un commentaire et une note
   * Cache le bouton "Ajouter un commentaire"
   */
  showFormComment() {
    document.querySelector(".push-comments").style.display = "none";
    document.querySelector(".add-comments").style.display = "flex";
    document.querySelector(".textarea").value = "";
  }

  /**
   * Dans l'infoWindow :
   * Cache le formulaire pour ajouter un commentaire et une note
   * Montre le bouton "Ajouter un commentaire"
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

    // this.data = tout les restaurants
    let restaurant = this.map.data.find(
      (data) => data.restaurantName === title.innerHTML
    );

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
   * Checking du formulaire d'ajout de restaurant avant envoi
   */
  validationInput() {
    let name = document.querySelector("#name");
    let address = document.querySelector("#address");
    let select = document.querySelector("#stars-select");
    let message = document.querySelector("#msg");

    if (name.value.length === 0) {
      name.classList.add("input_invalid");
      document.querySelector('label[for="name"]').style.color = "red";
    } else if (name.value.length > 0) {
      name.classList.add("input_valid");
      document.querySelector('label[for="name"]').style.color = "#5fa550";
    }

    if (address.value.length === 0) {
      address.classList.add("input_invalid");
      document.querySelector('label[for="address"]').style.color = "red";
    } else if (address.value.length > 0) {
      address.classList.add("input_valid");
      document.querySelector('label[for="address"]').style.color = "#5fa550";
    }

    if (select.value === "0") {
      select.classList.add("input_invalid");
      document.querySelector('label[for="rating"]').style.color = "red";
    } else if (select.value != "0") {
      select.classList.add("input_valid");
      document.querySelector('label[for="rating"]').style.color = "#5fa550";
    }

    if (message.value.length === 0) {
      message.classList.add("input_invalid");
      document.querySelector('label[for="msg"]').style.color = "red";
    } else if (message.value.length > 1) {
      message.classList.add("input_valid");
      document.querySelector('label[for="msg"]').style.color = "#5fa550";
    }

    if (
      name.value.length > 0 &&
      address.value.length > 0 &&
      select.value > "0" &&
      message.value.length > 0
    ) {
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
    let stars = document.querySelector("#stars-select");
    let resultStars = stars.options[stars.selectedIndex].value;
    let resultMessage = document.querySelector("#msg").value;

    let arrayRestaurant = [];

    let myNewRestaurant = {
      restaurantName: resultName,
      address: resultAddress,
      lat: latLng.lat(),
      long: latLng.lng(),
      ratings: [
        {
          stars: parseInt(resultStars),
          comment: resultMessage,
        },
      ],
    };

    this.map.data.push(myNewRestaurant);
    arrayRestaurant.push(myNewRestaurant);

    let restaurantPosition = {
      lat: myNewRestaurant.lat,
      lng: myNewRestaurant.long,
    };

    this.map.showRestaurantAddedMarker(myNewRestaurant, restaurantPosition);
    this.list.addLi(arrayRestaurant);
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
    let select = document.querySelector("#stars-select");
    let message = document.querySelector("#msg");

    document.querySelector("#stars-select").selectedIndex = 0;

    name.value = "";
    message.value = "";

    name.classList.remove("input_valid", "input_invalid");
    address.classList.remove("input_valid", "input_invalid");
    select.classList.remove("input_valid", "input_invalid");
    message.classList.remove("input_valid", "input_invalid");

    document.querySelector('label[for="name"]').style.color = "#000000";
    document.querySelector('label[for="address"]').style.color = "#000000";
    document.querySelector('label[for="rating"]').style.color = "#000000";
    document.querySelector('label[for="msg"]').style.color = "#000000";
  }

  /*
  Cette méthode va te permettre de récupérer une adresse via la latitude et longitude lorsque tu cliques sur la carte, 
  et de la placer directement dans ton champ adress de ton formulaire.
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
}
