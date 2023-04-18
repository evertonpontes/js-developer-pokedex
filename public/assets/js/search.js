const inputSearchPokemon = document.getElementById('input-search');
const buttonSearchPokemon = document.getElementById('btn-search');
const filterWrapper = document.getElementById('filter-wrapper');
const openFilterWrapper = document.getElementById('open-filter-wrapper');

async function getPokemonTypes() {
    const response = await fetch("https://pokeapi.co/api/v2/type");
    const data = await response.json();

    const types = data.results.map(type => type.name);

    return types.slice(0, -2);
}

async function fetchPokemonByNameOrId(searchText) {

    if (searchText === '') {
        pokemons.innerHTML = '';
        generatePokemonLi(0, limit);
    } else {

        const pokemonId = await fetch(`https://pokeapi.co/api/v2/pokemon/${searchText}/`)
            .then(res => res.json())
            .then(jsonBody => jsonBody.id)
            .catch(error => console.log(error))

        if (!pokemonId) {
            pokemons.innerHTML = `
                <span class="error" >Nenhum Pokémon corresponde a sua pesquisa</span>
            `;

        } else {

            pokemons.innerHTML = '';
            loadCircle.classList.remove('hidden');

            delay(1000).then(() => {
                generatePokemonLi(pokemonId - 1, 1);

                loadCircle.classList.add('hidden');
            });

        }
    }
}

openFilterWrapper.addEventListener('click', () => {



    if (filterWrapper.classList.contains('open')) {

        filterWrapper.classList.remove('open');
        openFilterWrapper.innerHTML = `
        <span>Mostrar busca avançada</span>
        <span><i class="fa-solid fa-chevron-down"></i></span>
        `

    } else {

        filterWrapper.classList.add('open');
        openFilterWrapper.innerHTML = `
        <span>Esconder busca avançada</span>
        <span><i class="fa-solid fa-chevron-up"></i></span>
        `
    }

})

buttonSearchPokemon.addEventListener('click', async () => {
    const searchText = inputSearchPokemon.value.toLowerCase();
    fetchPokemonByNameOrId(searchText);
})

inputSearchPokemon.addEventListener('keydown', async (event) => {
    if (event.key === 'Enter') {
        const searchText = inputSearchPokemon.value.toLowerCase();
        fetchPokemonByNameOrId(searchText);
    }
})

getPokemonTypes().then(types => {
    typesList.innerHTML = types.map(type => `
        <li class="type ${type}">
            <img src="assets/icons/${type}.svg" alt="${type}">
            <span class="name" id="type">${type}</span>
        </li>
    `).join('')
})