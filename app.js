/**
 * Fonction app pour charger les données data.json,
 * une fois qu'elles sont récupérées, je crée et charge ma carte,
 * ainsi que ma liste.
 */
function app() {
  let restaurants = [];
  let newMap;
  let filter1 = document.getElementById('filter-1') 
  let filter2= document.getElementById('filter-2') 
  let btnFilter= document.getElementById('btn-filter')
  
  fetch("data.json")
    .then((response) => response.json())
    .then((response) => {
      restaurants.push(...response);
      let mapContainer = document.getElementById("map");
      let listContainer = document.getElementById("list");

     newMap = new GoogleMaps(mapContainer, restaurants);
      newMap.load();

      let newList = new List(listContainer, newMap.data, newMap);
      newList.createList();
    });

  /**
   * Evènement qui déclenche le filtre (récupération des valeurs, filtre sur les restaurants) 
   * Et masque/affiche les markers et restaurants dans la liste selon le filtre
   */
   btnFilter.onclick=()=>{

    let value1 = filter1.options[filter1.selectedIndex].value;
    let value2 = filter2.options[filter2.selectedIndex].value;

    let selectedRestaurants = restaurants.filter(restaurant =>
      restaurant.averageGrade > value1 && restaurant.averageGrade < value2)

      restaurants.map(restaurant => restaurant.marker.setVisible(false));
      restaurants.map(restaurant => restaurant.li.style.display = 'none');
      selectedRestaurants.map(restaurant => restaurant.marker.setVisible(true));

      selectedRestaurants.map(restaurant => restaurant.li.style.display = 'flex');
  }

}
