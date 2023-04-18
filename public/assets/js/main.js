const pokemons = document.getElementById('pokemons');
const loadMore = document.getElementById('load-more');
const loadMoreIcon = document.getElementById('load-more-icon');
const loadCircle = document.getElementById('load-pokemon');
const typesList = document.getElementById('types');

let offset = 0;
const limit = 10;
const maxRecords = 386;

function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}

// generate html li of pokemons
function generatePokemonLi(offset, limit) {

    pokeAPI.fetchPokemons(offset, limit).then(pokemonList => {
        const newHTMLElement = pokemonList.map(pokemon => `
    
            <li class="pokemon ${pokemon.mainType}">
                <a href="./${pokemon.name}" >
                <h2 class="name">${pokemon.name}</h2>
                <span class="number">Nº ${pokemon.id.toString().padStart(4, '0')}</span>
    
                <div class="details">
                    <ol class="pokemon-types">
                        ${pokemon.listTypes.map(type => `
                            <li class="type ${type}">${type}</li>
                        `).join('')
            }
                    </ol>
                    <img src="${pokemon.img}"
                        alt="${pokemon.name}">
                </div>
                </a>
            </li>
        
        `).join('')

        pokemons.innerHTML += newHTMLElement;
    })
}

// when click on button load more pokemon
loadMore.addEventListener('click', () => {

    loadMore.classList.add('hidden');
    loadMoreIcon.classList.remove('hidden');

    offset += limit;
    const qtdRecordsWithNextPage = offset + limit;

    if (qtdRecordsWithNextPage >= maxRecords) {
        let newLimit = maxRecords - offset;

        delay(1000).then(() => {
            generatePokemonLi(offset, newLimit);

            loadMoreIcon.classList.add('hidden');
            loadMore.parentElement.removeChild(loadMore);
        });
    } else {

        delay(1000).then(() => {
            generatePokemonLi(offset, limit);

            loadMoreIcon.classList.add('hidden');
            loadMore.classList.remove('hidden');
        });
    }

})

// calling the function
generatePokemonLi(offset, limit);

function generatePokemonByTypeLi(type) {

    pokeAPI.fetchPokemonsByType(type).then(pokemons => {

        return pokemons.map(pokemon => `
    
            <li class="pokemon ${pokemon.mainType}">
                <a href="./${pokemon.name}" >
                    <h2 class="name">${pokemon.name}</h2>
                    <span class="number">Nº ${pokemon.id.toString().padStart(4, '0')}</span>
    
                    <div class="details">
                        <ol class="pokemon-types">
                            ${pokemon.listTypes.map(type => `
                                <li class="type ${type}">${type}</li>
                            `).join('')
            }
                        </ol>
                        <img src="${pokemon.img}"
                        alt="${pokemon.name}">
                    </div>
                </a>
            </li>
        
        `).join('')
    }).then(html => {

        if (!loadMore.classList.contains('hidden')) {
            loadMore.classList.add('hidden');
        }

        delay(1000).then(() => {

            loadCircle.classList.add('hidden');
            pokemons.innerHTML = html;
        });
    })

    pokemons.innerHTML = '';

    loadCircle.classList.remove('hidden');

}

// when click to the type option to filter pokemons by type and generate html li
typesList.addEventListener('click', (event) => {

    if (event.target.tagName === 'SPAN' || event.target.tagName === 'IMG') {
        const type = event.target.parentElement.classList[1];

        generatePokemonByTypeLi(type);

    } else if (event.target.tagName === 'LI') {
        const type = event.target.classList[1];

        generatePokemonByTypeLi(type);
    }

})