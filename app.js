/**
 * Fonction app pour charger les données data.json,
 * une fois qu'elles sont récupérées, je crée et charge ma carte,
 * ma liste, ainsi qu'un manager pour gérer les multiples actions de ma Google Map.
 */
function app() {
  let restaurants = [];

  fetch("data.json")
    .then((response) => response.json())
    .then((response) => {
      restaurants.push(...response);

      let newMap = new GoogleMaps(restaurants);
      newMap.load();

      let newList = new List(newMap.data, newMap);
      newList.addLi(restaurants);

      let newManager = new Manager(newMap, newList);
      newManager.addManagerInMapAndList();
      newManager.addWindowFunction();
    });
}
