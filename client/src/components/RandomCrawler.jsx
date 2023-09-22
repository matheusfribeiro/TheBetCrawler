import "../assets/styles/randomcrawler/randomcrawler.css";
import MultipleBetBox from "./MultipleBetBox";
import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import Axios from 'axios'




function Crawler() {
  const [randomBets, setRandomBets] = useState([])
  const [betAmounts, setBetAmounts] = useState([]);

  const { register: registerForm1, handleSubmit: handleSubmit1, control, watch } = useForm();
  const { handleSubmit: handleSubmit2  } = useForm(); 
  //const { register, handleSubmit, control, watch } = useForm();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "bets",
  });

  // Initialize the form with one bet field
  if (fields.length === 0) {
    append({ team: "", betType: "vitoria", odd: ""});
  }


  const generateRandomCombinations = ({ bets, minOdd }) => {
    const availableBets = [...bets];
    const combinations = [];
    let currentCombination = { selectedBets: [], combinedOdd: 1.0, betAmount: 0};

    while (availableBets.length > 0) {
      if (currentCombination.combinedOdd >= minOdd) {
        combinations.push(currentCombination);
        currentCombination = { selectedBets: [], combinedOdd: 1.0, betAmount: 0 };
      }

      const randomIndex = Math.floor(Math.random() * availableBets.length);
      const selectedBet = availableBets[randomIndex];
      const odd = parseFloat(selectedBet.odd);


      currentCombination.selectedBets.push(selectedBet);
      currentCombination.combinedOdd *= odd;
      //currentCombination.betAmount = 3
      availableBets.splice(randomIndex, 1);
    }

    // pushes the last combination even if it does not reach the minOdd
    if (currentCombination){
      combinations.push(currentCombination);
    }

    return combinations;
  };


  const generateMultiple = (data) => {
    const generatedBets = generateRandomCombinations(data);
    setRandomBets(generatedBets)

  };


  const handleBetAmountChange = (index, amount) => {
    // Create a copy of the current bet amounts
    const updatedBetAmounts = [...betAmounts];

    // Update the bet amount for the specified combination
    updatedBetAmounts[index] = amount;

    // Update the state with the new bet amounts
    setBetAmounts(updatedBetAmounts);
  };

  
  const submitMultiples = () => {
    const updatedBetAmount = randomBets.map((betCombination, index) => {
      return {
        ...betCombination,
        betAmount: betAmounts[index],
      };
    })
    Axios.post("http://localhost:5172/testforecho", updatedBetAmount)
      .then((response) => console.log(response))
      .catch((err) => console.log(err));
  }
  
  return (
    <div className="random-crawler">
      <form className="form" onSubmit={handleSubmit1(generateMultiple)}>
        {fields.map((field, index) => (
          <div key={field.id} className="bet-container">
            <div className="crawler-input">
              <label>Time</label>
              <input
                type="text"
                required
                {...registerForm1(`bets[${index}].team`)}
              />
            </div>

            <div className="crawler-input">
              <label>Tipo de Aposta</label>
              <select
                {...registerForm1(`bets[${index}].betType`)}
                defaultValue="vitoria"
              >
                <option value="vitoria">Vitória</option>
                <option value="dupla chance">Dupla Chance</option>
                <option value="+1.5">+1.5</option>
                <option value="+2.5">+2.5</option>
                <option value="ambas">Ambas sim</option>
                <option value="nao ambas">Ambas não</option>
              </select>
            </div>

            <div className="crawler-input">
              <label>Odd</label>
              <input
                type="number"
                step="0.1"
                required
                {...registerForm1(`bets[${index}].odd`)}
              />
            </div>

            {index > 0 && (
              <button
                className="btn"
                type="button"
                onClick={() => remove(index)}
              >
                Remover
              </button>
            )}
          </div>
        ))}

        <div className="button-wrapper">
          <button
            type="button"
            className="btn"
            onClick={() => append({ team: "", betType: "vitoria" })}
          >
            Adicionar Aposta
          </button>
          <button className="btn" type="submit">
            Gerar Multiplas
          </button>
        </div>

        {/* Odd range selector */}
        <div className="odd-range">
          <div className="odd-range-selector">
            <label>Odd Mínima</label>
            <input
              type="range"
              min="1.1"
              max="5"
              step="0.1"
              defaultValue="1.1"
              {...registerForm1("minOdd")}
            />
            <span>{watch("minOdd")}</span>
          </div>
        </div>
      </form>

      {randomBets.length > 0 && (
        <form className="submit-form" onSubmit={handleSubmit2}>
          <div className="display">
            {randomBets.map((betCombination, index) => (
              <MultipleBetBox
                key={index}
                betCombination={betCombination}
                onBetAmountChange={(amount) =>
                  handleBetAmountChange(index, amount)
                }
              />
            ))}
          </div>
          <button
            className="btn"
            type="submit"
            onClick={handleSubmit2(submitMultiples)}
          >
            Aplicar Apostas
          </button>
        </form>
      )}
    </div>
  );
}

export default Crawler;
