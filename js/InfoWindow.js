/**********************************************************************************************************
 ********************************************** InfoWindow Object***********************************************/

class InfoWindow {
  /**
   * Crée une infoWindow
   * @param {Object || String} data Le contenu complet d'un restaurant (nom, adresse, lat etc...),
   *                                  ou une chaîne de caractère si c'est l'infowindow de l'utilisateur
   */
  constructor(data) {
    this.data = data;
    this.opened = false;
  }

  /**
   * Création du contenu de l'infowindow
   */
  createContent() {
    let infoWindow = new google.maps.InfoWindow({});
    if (typeof this.data === "object") {
      let container = document.createElement("div");
      container.style.width = "320px";

      let title = document.createElement("h2");
      let img = document.createElement("img");
      let address = document.createElement("h3");
      let stars = document.createElement('p');
      let divOfComments = document.createElement("div");

      this.data.ratings.map((rating) => {
        let p = document.createElement("p");
        p.innerHTML = "(" + rating.stars + ")" + " " + rating.comment;
        divOfComments.appendChild(p);
      });

      title.innerHTML = this.data.restaurantName;
      img.src = `https://maps.googleapis.com/maps/api/streetview?size=300x200&location= ${this.data.lat},${this.data.long} &heading=151.78&pitch=-0.76&key=AIzaSyBPkFir7nmpEwtfukNlv-G7Lz3SGIPqC8g`;
      address.innerHTML = this.data.address;


      let restaurantAverage = this.calculRating(this.data.ratings);
      let starsAverage = this.getStars(restaurantAverage);

      stars.innerHTML= starsAverage;

      container.appendChild(title);
      container.appendChild(img);
      container.appendChild(address);
      container.appendChild(stars);
      container.appendChild(divOfComments);

      infoWindow.setContent(container);
      return infoWindow;
    } else infoWindow.setContent(this.data);
    return infoWindow;
  }

  /**
   * Calcul une moyenne via un tableau de chiffres 
   * @param {Array} ratings Tableau contenant les notes laissées par les utilisateurs
   */
  calculRating(ratings) {
    let total = 0;
    for (let i = 0; i < ratings.length; i++) {
      total += ratings[i].stars;
    }

    let rating = Math.round(total) / ratings.length;
    this.data.averageGrade = rating;
   return rating;
  }

  /**
   * Renvoie une variable contenant des étoiles via l'encodage HTML
   * @param {Number} rating Un nombre qui est la moyenne d'un restaurant 
   */
  getStars(rating){
    let ratingHTML = "";
    for (let i = 0; i < 5; i++) {
    if (rating < i + 0.5) {
      ratingHTML += "&#9734";
    } else ratingHTML += "&#9733";
  }
  return ratingHTML;
  }
}
