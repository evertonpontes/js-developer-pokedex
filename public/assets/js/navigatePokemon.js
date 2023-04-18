const previousPokemon = document.getElementById('previous');
const nextPokemon = document.getElementById('next');

async function fetchPokemonName(id) {

    return await fetch(`https://pokeapi.co/api/v2/pokemon/${id}/`)
    .then(response => response.json())
    .then(jsonBody => jsonBody.name)

} 

async function getNextPokemon () {
    fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}/`)
    .then(response => response.json())
    .then( async jsonBody => {
        if(jsonBody.id === maxRecords) {
            nextPokemon.href = await fetchPokemonName(1);
            nextPokemon.innerHTML = `
            <span>${(1).toString().padStart(4, '0')}</span>
            <i class="fa fa-arrow-right"></i>
        `    
        } else {
            nextPokemon.href = await fetchPokemonName(jsonBody.id + 1);
            nextPokemon.innerHTML = `
            <span>${(jsonBody.id + 1).toString().padStart(4, '0')}</span>
            <i class="fa fa-arrow-right"></i>
            `
        }
    })

}

async function getPreviousPokemon () {
    fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}/`)
    .then(response => response.json())
    .then( async jsonBody => {
        if(jsonBody.id === 1) {
            previousPokemon.href = await fetchPokemonName(maxRecords);
            previousPokemon.innerHTML = `
            <i class="fa fa-arrow-left"></i>
            <span>${(maxRecords).toString().padStart(4, '0')}</span>
        `
        } else {
            previousPokemon.href = await fetchPokemonName(jsonBody.id - 1);
            previousPokemon.innerHTML = `
            <i class="fa fa-arrow-left"></i>
            <span>${(jsonBody.id - 1).toString().padStart(4, '0')}</span>
            `
        }
    })

}

getNextPokemon()
getPreviousPokemon()