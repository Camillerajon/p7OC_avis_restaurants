
/**********************************************************************************************************
 ********************************************** List Object***********************************************/

class List {
  /**
   * Crée une liste
   * @param {Object} container L'élément HTML où s'affiche la liste
   * @param {Object} data Les données des restaurants
   * @param {Object} map La carte associé à la liste
   */
  constructor(container, data, map) {
    this.container = container;
    this.data = data;
    this.map = map;
    this.ul = document.createElement("ul");
  }

  /**
   * Création de la liste de restaurants à droite et affichage des restaurants filtrés
   */
  createList() {
    this.data.map((restaurant) => {
      let li = document.createElement("li");
      li.innerHTML = restaurant.restaurantName;

      this.ul.appendChild(li);
      this.container.appendChild(this.ul);

      li.addEventListener("click", () => {

        let restaurantOpen = this.data.find(data => data.infoWindow.opened);
        if(restaurantOpen != undefined) {
          restaurantOpen.infoWindow.close();
          restaurantOpen.infoWindow.opened = false;
        }
        
        restaurant.infoWindow.open(this.map, restaurant.marker);
        restaurant.infoWindow.opened = true;
      });

      restaurant.li = li;
    });
  }
}
