const moviesElement = document.querySelector('.movies');
const btnPrevElement = document.querySelector('.btn-prev');
const btnNextElement = document.querySelector('.btn-next');
const inputElement = document.querySelector('.input');

const URL_INICIAL_FILMES = 'https://tmdb-proxy.cubos-academy.workers.dev/3/discover/movie?language=pt-BR&include_adult=false'
const URL_BUSCA_FILMES = `https://tmdb-proxy.cubos-academy.workers.dev/3/search/movie?language=pt-BR&include\_adult=false`
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
      fetch(URL_INICIAL_FILMES).then( async (response) => {
        const data = await response.json();
        const filmes = data.results.slice(0, 19);
        paginas = [filmes.slice(0, 6), filmes.slice(6, 12), filmes.slice(12, 18)];
        popularFilmes(paginas[0]);
      });
    }
    inputElement.value = '';
  }
});
fetch(URL_INICIAL_FILMES).then( async (response) => {
  const data = await response.json();
  const filmes = data.results.slice(0, 19);
  paginas = [filmes.slice(0, 6), filmes.slice(6, 12), filmes.slice(12, 18)];
  popularFilmes(paginas[0]);
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