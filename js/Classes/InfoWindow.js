/**********************************************************************************************************
 ********************************************** InfoWindow Object***********************************************/

class InfoWindow {
  /**
   * Crée une infoWindow
   * @param {Object || String} data Le contenu complet d'un restaurant (nom, adresse, lat etc...),
   *                                  ou une chaîne de caractères si c'est l'infowindow de l'utilisateur
   * @param {Object} mapManager Le manager de l'application
   */
  constructor(data, manager) {
    this.data = data;
    this.manager = manager;
    this.opened = false;
  }

  /**
   * Création du contenu de l'infowindow avec un objet restaurant OU une chaîne de caractères  
   */
  createInfoWindow() {
    let infoWindow = new google.maps.InfoWindow({});
    if (typeof this.data === "object") {
      let comments = this.data.ratings.map((rating) => {
        let paragraph = "";
        return (paragraph += `<p>${rating.stars} ${rating.comment}</p>`);
      });

      let restaurantAverage = this.manager.calculRating(this.data);
      let starsAverage = this.manager.getStars(restaurantAverage);

      let newTemplate = this.template(this.data.restaurantName, this.data.lat, this.data.long, this.data.address, comments.join(""), starsAverage);

      infoWindow.setContent(newTemplate);
      return infoWindow;
    } else infoWindow.setContent(this.data);
    return infoWindow;
  }

  /**
   * Modèle du template HTML dans chaque InfoWindow
   * @param {String} name Le nom du restaurant
   * @param {Number} lat La latitude du restaurant
   * @param {Number} long La longitude du restaurant
   * @param {String} address 'L'adresse du restaurant
   * @param {Array} comments Le tableau des commentaires et notes du restaurant
   * @param {String} stars Le nombre d'étoiles (note) du restaurant
   */
  template(name, lat, long, address, comments, stars) {
    let template = `
      <div class="infoWindow">
        <h2 class="restaurant-title">${name}</h2> 
        <img 
        src="https://maps.googleapis.com/maps/api/streetview?size=300x200&location= ${lat},${long} &heading=151.78&pitch=-0.76&key=AIzaSyBPkFir7nmpEwtfukNlv-G7Lz3SGIPqC8g">
        </img>
        <h3>${address}</h3>
        <p class="stars">${stars}<p>
        <button class="push-comments" onClick="showFormComment()">Ajouter un commentaire</button>
        <div class="add-comments">
        <div class="select-stars">
          <label for="stars-select">Choisissez le nombre d'étoiles : </label>
          <select class="starsnumber">
            <option>1</option>
            <option>2</option>
            <option>3</option>
            <option>4</option>
            <option>5</option>
          </select>
        </div>
        <textarea class="textarea" rows="5" cols="33"></textarea>
        <button id="btn-validate" onClick="submitFormComment()">Valider</button>
        <hr>
        </div>
        <p class="thanks">Merci pour votre commentaire</p>
        <div class="comments">${comments}</div>
      </div>
      `;
    return template;
  }
}
