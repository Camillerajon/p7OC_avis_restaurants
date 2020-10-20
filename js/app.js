/**
 * Fonction app pour charger les données data.json,
 * une fois qu'elles sont récupérées, je crée et charge ma carte,
 * ma liste, ainsi qu'un manager pour gérer les multiples actions de ma Google Map.
 */
function app() {
  const restaurants = [];

  const myHeaders = new Headers({ "Content-Type": "application/json" });

  const init = { method: "GET", headers: myHeaders, mode: "cors", cache: "default" };

  fetch("https://avis-restaurants.netlify.app/data.json", init)
    .then((response) => response.json())
    .then((response) => {
      restaurants.push(...response);

      const googleMap = new GoogleMaps(restaurants);

      const list = new List(restaurants, googleMap);

      new Manager(googleMap, list);
    });
}
