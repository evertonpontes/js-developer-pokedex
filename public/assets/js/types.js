const weaknessList = document.getElementById('weakness');
const typeList = document.getElementById('pokemon-types');

const url = window.location.href;
const pokemonName = url.split('/')[url.split('/').length - 1];

async function getDamageRelations(types) {

    const damageRelations = {};

    await Promise.all(types.map( async type => {

        damageRelations[type] = {}
    
        return await fetch(`https://pokeapi.co/api/v2/type/${type}/`)
            .then(response => response.json())
            .then(jsonBody => {

                damageRelations[type] = jsonBody.damage_relations;

            })
            
    }))

    return damageRelations;
}

async function fetchPokemonDetails(pokemonName) {

    const url = `https://pokeapi.co/api/v2/pokemon/${pokemonName}/`;

    return await fetch(url)
        .then(response => response.json())
        .then(jsonBody => jsonBody.types.map(slot => slot.type.name))

}

async function main() {

    const listTypes = await fetchPokemonDetails(pokemonName);

    typeList.innerHTML = listTypes.map(type => {
        return `
            <li class="type ${type}">${type}</li>
        `
    }).join('')

    const damageRelations = await getDamageRelations(listTypes)
    
    const doubleDamageFrom = [];

    const halfNoDamageFrom = [];

    listTypes.map(type => {

        damageRelations[type].double_damage_from.map(typeDouble => {
            doubleDamageFrom.push(typeDouble.name)
        })

        damageRelations[type].half_damage_from.map(typeHalf => {
            halfNoDamageFrom.push(typeHalf.name)
        })

        damageRelations[type].no_damage_from.map(noDamage => {
            halfNoDamageFrom.push(noDamage.name)
        })
    })

    const pokemonDoubleDamage = [...new Set(doubleDamageFrom
        .filter(typeDouble => !halfNoDamageFrom.includes(typeDouble)))]

    weaknessList.innerHTML = pokemonDoubleDamage.map(type => {
        return `
        <li class="type ${type}">${type}</li>
        `
    }).join('')
}

main()
