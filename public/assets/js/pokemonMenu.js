const menuOptions = document.getElementById('menu-options');
const pokemonInfos = document.getElementById('pokemon-infos');
const pokemonSection = document.getElementById('pokemon');
const pokemonAbout = document.getElementById('about');
const barList = document.getElementById('bar-list');
const bars = document.getElementsByClassName('bar-stats');
const evolutionTree = document.getElementById('evolution-tree');

menuOptions.addEventListener('click', (event) => {

    if (!event.target.classList.contains('open')) {
        Array.prototype.slice.call(menuOptions.children, 0).map(el => {
            if (el.innerHTML !== event.target.innerHTML && el.classList.contains('open')) {
                el.classList.remove('open');
            }
        })
        event.target.classList.add('open');
        const className = event.target.innerHTML
            .toLowerCase()
            .replace(' ', '-')
            .replace('.','')
        Array.prototype.slice.call(pokemonInfos.children, 0).map(el => {
            if (el.classList.contains(className) && el.classList.contains('hidden')) {
                el.classList.remove('hidden');
            } else if (!el.classList.contains(className) && !el.classList.contains('hidden')) {
                el.classList.add('hidden');
            }
        })
    }
})

const pokemonObjt = new Pokemon();

const href = window.location.href;

function fetchPokemonNumber() {

}

function fetchPokemonSpecies() {

    const pokemonName = href.split('/')[href.split('/').length - 1];
    const url = `https://pokeapi.co/api/v2/pokemon-species/${pokemonObjt.id}/`;

    return fetch(url)
        .then(response => response.json())
        .then(jsonBody => {

            pokemonObjt.gender_rate = jsonBody.gender_rate;
            pokemonObjt.evolution_chain = jsonBody.evolution_chain.url;

            jsonBody.genera.map(slot => {
                if (slot.language.name === 'en') {
                    pokemonObjt.genus = slot.genus.split(' ')[0];
                }
            })

            jsonBody.flavor_text_entries.map(slot => {
                if (slot.version.name === 'firered') {
                    pokemonObjt.flavor_text = slot.flavor_text;
                }
            })

        })
        .catch(error => console.error(error))

}

function getPokemonEvolutionChain(url) {
    return fetch(url)
        .then(res => res.json())
        .then(jsonBody => jsonBody.chain)
}

async function buildEvolutionTreeWithDetails(evolution_tree) {
    const url = `https://pokeapi.co/api/v2/pokemon/${evolution_tree.id}/`;

    return await fetch(url)
        .then(response => response.json())
        .then( async jsonBody => {
            if (!evolution_tree.evolves_to) {
                return {
                    name: evolution_tree.name,
                    id: evolution_tree.id,
                    img: jsonBody.sprites.other['official-artwork'].front_default,
                    types: jsonBody.types.map(slot => slot.type.name),
                    mainType: jsonBody.types.map(slot => slot.type.name)[0]
                }
            }

            const evolves_to = Promise.all(evolution_tree.evolves_to.map(evolution => {
                return buildEvolutionTreeWithDetails(evolution)
            }))

            return {
                name: evolution_tree.name,
                id: evolution_tree.id,
                img: jsonBody.sprites.other['official-artwork'].front_default,
                types: jsonBody.types.map(slot => slot.type.name),
                mainType: jsonBody.types.map(slot => slot.type.name)[0],
                evolves_to: await evolves_to.then(result => result)
            }

        })
        .then(result => result)
        .catch(error => console.error(error))
}

function buildEvolutionTree(pokemon) {

    const name = pokemon.species.name;
    const id = Number(pokemon.species.url.split('/').slice(-2, -1)[0]);

    if (!pokemon.evolves_to.length) {
        return {
            name: name,
            id: id,
        }
    }

    const evolves_to = pokemon.evolves_to.map(object => {
        return buildEvolutionTree(object)
    })

    return {
        name: name,
        id: id,
        evolves_to: evolves_to
    }
}

function getPokemonEvolutionTree() {

    const evolution_chain = getPokemonEvolutionChain(pokemonObjt.evolution_chain);

    return evolution_chain
        .then(result => buildEvolutionTree(result))

}

function fetchPokemonDetails() {

    const pokemonName = href.split('/')[href.split('/').length - 1];
    console.log(pokemonName)
    const url = `https://pokeapi.co/api/v2/pokemon/${pokemonName}/`;

    return fetch(url)
        .then(response => response.json())
        .then(jsonBody => {

            pokemonObjt.name = jsonBody.name;
            pokemonObjt.id = jsonBody.id;
            pokemonObjt.img = jsonBody.sprites.other['official-artwork'].front_default;
            pokemonObjt.height = jsonBody.height / 10;
            pokemonObjt.weight = jsonBody.weight / 10;
            pokemonObjt.abilities = jsonBody.abilities.map(slot => slot.ability.name)
            pokemonObjt.listTypes = jsonBody.types.map(slot => slot.type.name);
            pokemonObjt.mainType = jsonBody.types.map(slot => slot.type.name)[0];

        })
        .catch(error => console.error(error))

}

function fetchPokemonStats() {

    const pokemonName = href.split('/')[href.split('/').length - 1];
    const url = `https://pokeapi.co/api/v2/pokemon/${pokemonName}/`;

    return fetch(url)
        .then(response => response.json())
        .then(jsonBody => {

            pokemonObjt.stats = jsonBody.stats.map(slot => {
                const { base_stat, stat } = slot
                return { base_stat: base_stat, name: stat.name }
            })

        })
        .catch(error => console.error(error))

}

function generateGraphicHTML() {

    barList.innerHTML = `
        ${pokemonObjt.stats.map(stat => {
        if (stat.name === 'special-attack') {
            return `
                <li>
                    <span class="name" >Sp. Atk</span>
                    <span class="value">${stat.base_stat}</span>
                    <div class="bar">
                        <div class="bar-stats hp ${stat.name} ${pokemonObjt.mainType}"></div>
                    </div>
                </li>
                `
        } else if (stat.name === 'special-defense') {
            return `
                <li>
                    <span class="name" >Sp. Def</span>
                    <span class="value">${stat.base_stat}</span>
                    <div class="bar">
                        <div class="bar-stats hp ${stat.name} ${pokemonObjt.mainType}"></div>
                    </div>
                </li>
                `
        }
        return `
                <li>
                    <span class="name" >${stat.name}</span>
                    <span class="value">${stat.base_stat}</span>
                    <div class="bar">
                        <div class="bar-stats hp ${stat.name} ${pokemonObjt.mainType}"></div>
                    </div>
                </li>
            `
    }).join('')
        }
    `
}

function setBarWidth() {

    pokemonObjt.stats.map(stat => {
        Array.prototype.slice.call(bars, 0).map(item => {
            if (item.classList.contains(stat.name)) {
                item.style.width = `${(stat.base_stat / 255) * 100}%`;
            }
        })
    })
}

function converterAltura(alturaEmMetros) {
    const alturaEmPesEPolegadas = alturaEmMetros * 3.28084;
    const alturaEmPes = Math.floor(alturaEmPesEPolegadas);
    const alturaEmPolegadas = Math.round((alturaEmPesEPolegadas - alturaEmPes) * 12);
    return alturaEmPes + "'" + alturaEmPolegadas + '"';
}

function convertKgToLbs(kg) {
    const valueInlbs = kg * 2.20462;

    return valueInlbs.toFixed(1);
}

function generatePokemonSection() {

    pokemonSection.innerHTML = `
        <div class="pokemon-details" >
            <h2 class="pokemon-name">
                ${pokemonObjt.name}
            </h2>
            <span class="pokemon-id">Nº ${pokemonObjt.id.toString().padStart(4, '0')}</span>
        </div>
        <div class="pokemon-img ${pokemonObjt.mainType}">
            <img src="${pokemonObjt.img}"
                alt="${pokemonObjt.name}">
        </div>
        `

}

function generatePokemonAboutHTML() {

    pokemonAbout.innerHTML = `
        <p class="description">
            ${pokemonObjt.flavor_text}
        </p>
        <div class="columns">
            <div class="column">
                <span class="attribute-title">Species</span>
                <span class="attribute-title">Height</span>
                <span class="attribute-title">Weight</span>
                <span class="attribute-title">Gender</span>
                <span class="attribute-title">Abilities</span>
            </div>
            <div class="column">
                <span class="attribute-value">
                    ${pokemonObjt.genus}
                </span>
                <span class="attribute-value">
                    ${`${converterAltura(pokemonObjt.height)} (${pokemonObjt.height}m)`}
                </span>
                <span class="attribute-value">
                ${`${convertKgToLbs(pokemonObjt.weight)} lbs (${pokemonObjt.weight} kg)`}
                </span>
                <span class="attribute-value">
                    ${(() => {
            const femalePercent = (pokemonObjt.gender_rate) * 12.5;
            const malePercent = (8 - pokemonObjt.gender_rate) * 12.5;

            if (pokemonObjt.gender_rate < 0) {
                return `Unknown`
            }

            return `
                                        <span class="male-icon">
                                            <i class="fa fa-mars"></i>
                                        </span>
                                        <span class="percent-male">${malePercent}%</span>
                                        <span class="female-icon">
                                            <i class="fa fa-venus"></i>
                                        </span>
                                        <span class="percent-female">${femalePercent}%</span>
                                    `
        })()
        }
                </span>
                <span class="attribute-value">
                    <ol class="abilities">
                        ${pokemonObjt.abilities.map(ability => `
                                            <li class="ability">
                                                ${ability}
                                            </li>
                                        `).join('')
        }
                    </ol>
                </span>
            </div>
        </div>
    `

}

function generatePokemonEvolutions(evolution_tree) {

    if(!evolution_tree.evolves_to) {
        return `
        <li>
        <a href="./${evolution_tree.name}">
            <img class="pokemon-sprite ${evolution_tree.mainType}" src="${evolution_tree.img}" alt="${evolution_tree.name}">
            <h3 class="pokemon-details">
                ${evolution_tree.name}
                <span class="pokemon-number">
                    Nº&nbsp;${evolution_tree.id.toString().padStart(4, '0')}
                </span>
            </h3>
            <ol class="pokemon-types">
                ${evolution_tree.types.map(type => {
                    return `
                    <li class="type ${type}" ><img src="assets/icons/${type}.svg" alt="${type}"></li>
                    `
                }).join('')}
            </ol>
        </a>
        </li>
        `
    }

    const evolves_to = evolution_tree.evolves_to.map(evolution => {
        return generatePokemonEvolutions(evolution);
    }).join('')

    return `
    <li>
    <a href="./${evolution_tree.name}" class="evolves_to">
        <img class="pokemon-sprite ${evolution_tree.mainType}" src="${evolution_tree.img}" alt="${evolution_tree.name}">
        <h3 class="pokemon-details">
            ${evolution_tree.name}
            <span class="pokemon-number">
                Nº&nbsp;${evolution_tree.id.toString().padStart(4, '0')}
            </span>
        </h3>
        <ol class="pokemon-types">
            ${evolution_tree.types.map(type => {
                return `
                <li class="type ${type}" ><img src="assets/icons/${type}.svg" alt="${type}"></li>
                `
            }).join('')}
        </ol>
    </a>
    ${
        evolution_tree.evolves_to.length > 1? 
        `<ul class="evolution-tree pokemon-forms">
            ${evolves_to}
        </ul>`
        : 
        `<ul class="evolution-tree">
            ${evolves_to}
        </ul>`
    }
    </li>
    `

}

async function main() {
    await fetchPokemonDetails();
    await fetchPokemonSpecies();
    await fetchPokemonStats();
    generatePokemonSection();
    generatePokemonAboutHTML();
    generateGraphicHTML();
    setBarWidth();
    await getPokemonEvolutionTree()
        .then(result => pokemonObjt.evolution_tree = result)
    await buildEvolutionTreeWithDetails(pokemonObjt.evolution_tree)
        .then(result => pokemonObjt.evolution_tree = result)
    evolutionTree.innerHTML = generatePokemonEvolutions(pokemonObjt.evolution_tree);

}


main();