/**********************************************************************************************************
 ********************************************** List Object***********************************************/

class List {
  /**
   * Crée une liste
   * @param {Object} data Les données des restaurants
   * @param {Object} map La carte associé à la liste
   */
  constructor(data, map) {
    this.data = data;
    this.map = map;
    this.container = document.getElementById("list");
    this.ul = document.createElement("ul");
    this.manager = this.manager;
  }

  /**
   * Création de la liste des restaurants à droite et affichage des restaurants filtrés
   */
  addLi(array) {
    array.map((restaurant) => {
      let li = document.createElement("li");
      li.innerHTML = restaurant.restaurantName;

      this.ul.appendChild(li);
      this.container.appendChild(this.ul);

      li.addEventListener("click", async () => {
        let restaurantOpen = this.data.find((data) => data.infoWindow.opened);

        if (restaurantOpen != undefined) {
          restaurantOpen.infoWindow.close();
          restaurantOpen.infoWindow.opened = false;
        }

        await restaurant.infoWindow.open(this.map, restaurant.marker);

        restaurant.infoWindow.opened = true;
   
        this.manager.hideFormComment();
      });

      restaurant.li = li;
    });
  }

  /**
   * Rajoute un nouveau restaurant dans la liste
   */
  addRestaurantInList() {

  }
}
