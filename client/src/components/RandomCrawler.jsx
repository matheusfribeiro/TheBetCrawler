import "../assets/styles/randomcrawler/randomcrawler.css";
import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import Axios from "axios";




function Crawler() {
  const [minOdd, setMinOdd] = useState(1.1); // State for min odd
  const { register, handleSubmit, control } = useForm();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "bets",
  });

  // Initialize the form with one bet field
  if (fields.length === 0) {
    append({ team: "", betType: "vitoria", odd: ""});
  }


  const generateRandomCombination = ({ bets }, minOdd) => {
    const availableBets = [...bets];
    const selectedBets = [];
    let combinedOdd = 1.0;
  
    while (combinedOdd < minOdd && availableBets.length > 0) {
      const randomIndex = Math.floor(Math.random() * availableBets.length);
      const selectedBet = availableBets[randomIndex];
      const odd = parseFloat(selectedBet.odd);
  
      selectedBets.push(selectedBet);
      availableBets.splice(randomIndex, 1);
      combinedOdd *= odd;
    }
  
    return { selectedBets, combinedOdd };
  };
  

  const generateMultiple = (data) => {
    //data.minOdd = minOdd;
    //data.maxOdd = maxOdd;
    
    const randomBets = generateRandomCombination(data, minOdd);
    console.log(minOdd, randomBets.selectedBets, randomBets.combinedOdd)

    
  };

  const onSubmitMultiple = (data) => {
    Axios.post("http://localhost:5172/testforecho", data)
      .then((response) => console.log(response))
      .catch((err) => console.log(err));
  }

  

  

  return (
    <div className="random-crawler">
      <form className="form" onSubmit={handleSubmit(generateMultiple)}>
        {fields.map((field, index) => (
          <div key={field.id} className="bet-container">
            <div className="crawler-input">
              <label>Time</label>
              <input
                type="text"
                required
                {...register(`bets[${index}].team`)}
              />
            </div>

            <div className="crawler-input">
              <label>Tipo de Aposta</label>
              <select
                {...register(`bets[${index}].betType`)}
                defaultValue="vitoria"
              >
                <option value="vitoria">Vitória</option>
                <option value="dupla chance">Dupla Chance</option>
                <option value="+1.5">+1.5</option>
                <option value="+2.5">+2.5</option>
              </select>
            </div>

            <div className="crawler-input">
              <label>Odd</label>
              <input
                type="number"
                step="0.1"
                required
                {...register(`bets[${index}].odd`)}
              />
            </div>

            {index > 0 && (
              <button type="button" onClick={() => remove(index)}>
                Remover
              </button>
            )}
          </div>
        ))}

        <button
          type="button"
          onClick={() => append({ team: "", betType: "vitoria" })}
        >
          Adicionar Aposta
        </button>

        <button type="submit">Gerar Multiplas</button>

        {/* Odd range selector */}
        <div className="odd-range">
          <div className="odd-range-selector">
            <label>Odd Mínima</label>
            <input
              type="range"
              min="1.1"
              max="5"
              step="0.1"
              value={minOdd}
              onChange={(e) => setMinOdd(parseFloat(e.target.value))}
              
            />
            <span>{minOdd}</span>
          </div>
        </div>
      </form>
      <form className="form" onSubmit={handleSubmit(onSubmitMultiple)}>
        <div className="display"></div>
      </form>
    </div>
  );
}

export default Crawler;
