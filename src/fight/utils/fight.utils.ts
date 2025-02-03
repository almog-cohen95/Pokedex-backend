//First attacker
// export const determineFirstAttacker(userPokemonDetails, enemyPokemonDetails) {
//     return userPokemonDetails.currentHP > enemyPokemonDetails.currentHP
//       ? userPokemonDetails._id
//       : enemyPokemonDetails._id;
//   }


// export function determineNextTurn(fightData) {
//   const { userPokemon, enemyPokemon, currentTurn } = fightData;

//   // אם התור הנוכחי הוא של המשתמש - הבא בתור הוא היריב, ולהפך
//   return currentTurn.equals(userPokemon._id) ? enemyPokemon._id : userPokemon._id;
// }

//Calculate the damage of attack
// export function calculateDamage(pokemonAttack: number, pokemonDefense: number) {
//   return Math.max(pokemonAttack - pokemonDefense, 0); 
// }