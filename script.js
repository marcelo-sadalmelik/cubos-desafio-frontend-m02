
let data;
fetch(`https://tmdb-proxy.cubos-academy.workers.dev/3/discover/movie?language=pt-BR&include_adult=false`).then( async (response) => {
  data = (await response.json());
  console.log(data.results);
})

const construtor = (filme) => {
  const divElement = document.createElement('div');

  return divElement;
}