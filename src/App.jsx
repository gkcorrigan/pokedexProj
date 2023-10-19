import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [pokemonData, setPokemonData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [weaknessFilter, setWeaknessFilter] = useState("");
  const [backgroundColor, setBackgroundColor] = useState("gray");

  useEffect(() => {
    fetch(
      "https://raw.githubusercontent.com/Biuni/PokemonGO-Pokedex/master/pokedex.json"
    )
      .then((response) => response.json())
      .then((data) => setPokemonData(data.pokemon));
  }, []);

  const allTypesHave = (types, pokemon) => {
    
    if (pokemon && pokemon.type) {
      return types
      .toLowerCase()
        .split(",")
        .every((type) =>
          pokemon.type.map((t) => t.toLowerCase()).includes(type.trim())
        );
    }
    
    return false;
  };

  const allWeaknessesHave = (weaknesses, pokemon) => {
   
    if (pokemon && pokemon.weaknesses) {
      return weaknesses
        .toLowerCase()
        .split(",")
        .every((weakness) =>
          pokemon.weaknesses
            .map((w) => w.toLowerCase())
            .includes(weakness.trim())
        );
    }
  
    return false;
  };

  const filteredPokemon = pokemonData.filter((pokemon) => {
    const nameMatch = pokemon.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const typeMatch = !typeFilter || allTypesHave(typeFilter, pokemon);
    const weaknessMatch =
      !weaknessFilter || allWeaknessesHave(weaknessFilter, pokemon);

    return nameMatch && typeMatch && weaknessMatch;
  });

  const typeColorMatch = {
    fire: "red",
    water: "blue",
    grass: "green",
    ground: "brown",
    poison: "purple",
    ice: "lightblue",
    normal: "beige",
    electric: "yellow",
    bug: "orange",
    psychic: "pink"

  };

  useEffect(() => {
    try {
      if (filteredPokemon.length > 0) {
        const firstPokeType = filteredPokemon[0].type[0]?.toLowerCase();
        const backGColor = typeColorMatch[firstPokeType] || "gray";

        setBackgroundColor(backGColor);
      } else {
        setBackgroundColor("gray");
      }
    } catch (error) {
      console.error("Error setting background color:", error);
      setBackgroundColor("gray");
    }
  }, [filteredPokemon]);

  return (
    <div className="App" style={{ backgroundColor }}>
      <div>
        <label>
          Search by Name:
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          Filter by Type:
          <input
            type="text"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          Filter by Weakness:
          <input
            type="text"
            value={weaknessFilter}
            onChange={(e) => setWeaknessFilter(e.target.value)}
          />
        </label>
      </div>
      {/* Render the filteredPokemon list */}
      {filteredPokemon.map((pokemon) => (
        <div key={pokemon.id}>
          <img
            src={`http://www.serebii.net/pokemongo/pokemon/${pokemon.num}.png`}
            alt="{pokemon.name}"
          />
          <p>Name: {pokemon.name}</p>
          <p>Number: {pokemon.num}</p>
          <p>Type: {pokemon.type.join(", ")}</p>
          <p>Weaknesses: {pokemon.weaknesses.join(", ")}</p>
        </div>
      ))}
    </div>
  );
}

export default App;
