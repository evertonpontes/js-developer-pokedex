// functions of pokemon
const pokeAPI = {};

pokeAPI.setToPokemonModelFormat = (pokeDetails) => {
    const pokemon = new Pokemon();

    pokemon.id = pokeDetails.id;
    pokemon.name = pokeDetails.name;
    pokemon.height = pokeDetails.height / 10;
    pokemon.weight = pokeDetails.weight / 10;
    pokemon.listTypes = pokeDetails.types.map(slot => slot.type.name);

    const [type] = pokemon.listTypes;

    pokemon.mainType = type;
    pokemon.img = pokeDetails.sprites.other['official-artwork'].front_default;
    pokemon.abilities = pokeDetails.abilities.map(slot => slot.ability.name)
    pokemon.stats = pokeDetails.stats.map(slot => {
        const { base_stat } = slot;
        const { name } = slot.stat;

        return { base_stat, name };

    });

    return pokemon;

}

pokeAPI.fetchPokeDetails = (pokemon) => {
    return fetch(pokemon.url)
        .then(response => response.json())
        .then(pokeAPI.setToPokemonModelFormat)
}

pokeAPI.fetchPokemonsByType = (type) => {

    const url = `https://pokeapi.co/api/v2/type/${type}`;

    return fetch(url)
            .then(response => response.json())
            .then(jsonBody => jsonBody.pokemon.map(slot => {
                return fetch(slot.pokemon.url)
                .then(response => response.json())
                .then(pokeAPI.setToPokemonModelFormat)
            }))
            .then(pokemonsDetails => Promise.all(pokemonsDetails))
            .then(pokemonList => pokemonList.filter(pokemon => Number(pokemon.id) <= 386))


}

pokeAPI.fetchPokemons = (offset = 0, limit = 10) => {
    const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`;

    return fetch(url)
        .then(response => response.json())
        .then(jsonBody => jsonBody.results)
        .then(pokemons => pokemons.map(pokeAPI.fetchPokeDetails))
        .then(pokemonsList => Promise.all(pokemonsList))
        .then(listDetails => listDetails)
        .catch(error => console.log(error))
}