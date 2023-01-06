const moviesElement = document.querySelector('.movies');
const btnPrevElement = document.querySelector('.btn-prev');
const btnNextElement = document.querySelector('.btn-next');
const inputElement = document.querySelector('.input');

const highlightVideo = document.querySelector('.highlight__video');
const highlightVideoLink = document.querySelector('.highlight__video-link');
const highlightTitle = document.querySelector('.highlight__title');
const hightlightRating = document.querySelector('.highlight__rating');
const hightlightGenres = document.querySelector('.highlight__genres');
const hightlightLaunch = document.querySelector('.highlight__launch');
const hightlightDescriptions = document.querySelector('.highlight__description');


const URL_INICIAL_FILMES = 'https://tmdb-proxy.cubos-academy.workers.dev/3/discover/movie?language=pt-BR&include_adult=false';
const URL_BUSCA_FILMES = `https://tmdb-proxy.cubos-academy.workers.dev/3/search/movie?language=pt-BR&include\_adult=false`;
const URL_FILME_DO_DIA = 'https://tmdb-proxy.cubos-academy.workers.dev/3/movie/436969?language=pt-BR';
const URL_FILME_DO_DIA_VIDEO = 'https://tmdb-proxy.cubos-academy.workers.dev/3/movie/436969/videos?language=pt-BR';

let paginaAtual = 0;
let paginas = [];

btnPrevElement.addEventListener('click', () => {
  voltarPagina();
  popularFilmes(paginas[paginaAtual]);
});

btnNextElement.addEventListener('click', () => {
  avancarPagina();
  popularFilmes(paginas[paginaAtual]);
});

inputElement.addEventListener('keydown', (ev) => {
  const { code } = ev;
  if(code === 'Enter'){
    const busca = ev.target.value.trim();
    if(busca) {
      buscarFilme(busca);
    } else {
      buscaInicial();
    }
    inputElement.value = '';
  }
});

const criarFilme = (filme) => {
  const movie = document.createElement('div');
  movie.classList.add('movie');
  movie.style.backgroundImage = `url(${filme.poster_path})`;

  const movie__info = document.createElement('div');
  movie__info.classList.add('movie__info');

  const span_movie__title = document.createElement('span');
  span_movie__title.classList.add('movie__title');
  span_movie__title.textContent = filme.title;

  const span_movie__rating = document.createElement('span');
  span_movie__rating.classList.add('movie__rating');
  span_movie__rating.textContent = filme.vote_average;

  const img = document.createElement('img');
  img.src='./assets/estrela.svg';
  img.alt='Estrela';

  span_movie__rating.appendChild(img);
  movie__info.append(span_movie__title, span_movie__rating);
  movie.appendChild(movie__info);

  return movie;
}

const popularFilmes = (filmes) => {
  while(moviesElement.firstChild){
    moviesElement.firstChild.remove();
  }
  filmes.forEach(filme => moviesElement.appendChild(criarFilme(filme)));
}

const avancarPagina = () => {
  if(paginaAtual === 2){
    paginaAtual = 0;
  } else {
    paginaAtual += 1;
  }
}

const voltarPagina = () => {
  if(paginaAtual === 0){
    paginaAtual = 2;
  } else {
    paginaAtual -= 1;
  }
}

const buscarFilme = async (busca) => {
  const resposta = await fetch(`${URL_BUSCA_FILMES}&query=${busca}`);
  const data = await resposta.json();
  const filmes = data.results.slice(0, 19);
  paginas = [filmes.slice(0, 6), filmes.slice(6, 12), filmes.slice(12, 18)];
  popularFilmes(paginas[0]);
}

const buscaInicial = async () => {
  const resposta = await fetch(URL_INICIAL_FILMES);
  const data = await resposta.json();
  const filmes = data.results.slice(0, 19);
  paginas = [filmes.slice(0, 6), filmes.slice(6, 12), filmes.slice(12, 18)];
  popularFilmes(paginas[0]);
}

const carregarFilmeDoDia = async () => {
  const respostaFilme = await fetch(URL_FILME_DO_DIA);
  const respostaFilmeJson = await respostaFilme.json();

  const respostaVideo = await fetch(URL_FILME_DO_DIA_VIDEO);
  const respostaVideoJson = await respostaVideo.json();

  highlightVideo.style.backgroundImage = `url(${respostaFilmeJson.backdrop_path})`
  highlightTitle.textContent = respostaFilmeJson.title;
  hightlightRating.textContent = Number(respostaFilmeJson.vote_average).toFixed(1);
  hightlightGenres.textContent = montarGenres(respostaFilmeJson.genres);
  hightlightLaunch.textContent = formatarData(respostaFilmeJson.release_date);
  hightlightDescriptions.textContent = respostaFilmeJson.overview;
  highlightVideoLink.href = `https://www.youtube.com/watch?v=${respostaVideoJson.results[0].key}`

}

const montarGenres = (array) => {
  let genres = '';
  array.forEach(genre => genres += genre.name +', ');
  return genres.slice(0, -2);
}

const formatarData = (currentDate) => {
  return new Date(currentDate).toLocaleDateString("pt-BR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

buscaInicial();
carregarFilmeDoDia();