const API_KEY = "b298f2c7fb554844e7980782dca6813f";
const BASE_PATH = "https://api.themoviedb.org/3";

export function getMovies() {
  return fetch(`${BASE_PATH}/movie/now_playing?api_key=${API_KEY}`).then(
    (responce) => responce.json()
  );
}
