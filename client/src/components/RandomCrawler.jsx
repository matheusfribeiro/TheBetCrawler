import "../assets/styles/randomcrawler/randomcrawler.css";
import MultipleBetBox from "./MultipleBetBox";
import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { RotatingLines } from  'react-loader-spinner'
import Axios from 'axios'

function Crawler() {
  const [randomBets, setRandomBets] = useState([])
  const [betAmounts, setBetAmounts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [downloadBtn, setDownloadBtn] = useState(false)

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

  /* const generateRandomCombinations = ({ bets, minOdd }) => {
    ORIGINAALLLL
    const availableBets = [...bets];
    const combinations = [];
    let currentCombination = { selectedBets: [], combinedOdd: 1.0, betAmount: 0};

    while (availableBets.length > 0) {
    
      const randomIndex = Math.floor(Math.random() * availableBets.length);
      const selectedBet = availableBets[randomIndex];
      const odd = parseFloat(selectedBet.odd);


      currentCombination.selectedBets.push(selectedBet);
      currentCombination.combinedOdd *= odd;
      availableBets.splice(randomIndex, 1);

      if (currentCombination.combinedOdd >= minOdd) {
        combinations.push(currentCombination);
        currentCombination = { selectedBets: [], combinedOdd: 1.0, betAmount: 0 };
      }
    }
    

    // pushes the last combination even if it does not reach the minOdd
    if (currentCombination){
      combinations.push(currentCombination);
    }

    console.log(combinations, 'comb')

    const filteredCombinations = combinations.filter((combination) => {
      const numSelectedBets = combination.selectedBets.length;
      if (numSelectedBets >= 3) {
        return combination.combinedOdd >= 2.1;
      } else if (numSelectedBets === 2) {
        return combination.combinedOdd >= 1.6;
      }
      return true; // For combinations with different numbers of bets
    });
    console.log(filteredCombinations, 'filtered')

    return filteredCombinations;
  }; */

  const generateRandomCombinations = ({ bets, minOdd }) => {
    const availableBets = [...bets];
    const combinations = [];
    const usedBets = []; // To track used bets
    const usedTeams = new Set(); // To track teams already included
    let currentCombination = {
      selectedBets: [],
      combinedOdd: 1.0,
      betAmount: 0,
      checked: true,
    };

    while (availableBets.length > 0) {
      const randomIndex = Math.floor(Math.random() * availableBets.length);
      const selectedBet = availableBets[randomIndex];
      const selectedTeam = selectedBet.team;

      // Check if the selectedBet has not been used in the current combination
      // and if the team is not already in the current combination
      if (!usedBets.includes(selectedBet) && !usedTeams.has(selectedTeam)) {
        const odd = parseFloat(selectedBet.odd);

        currentCombination.selectedBets.push(selectedBet);
        currentCombination.combinedOdd *= odd;
        usedBets.push(selectedBet); // Mark the selectedBet as used
        usedTeams.add(selectedTeam); // Mark the team as used in the current combination
      }

      availableBets.splice(randomIndex, 1);

      if (
        currentCombination.combinedOdd >= minOdd &&
        ((currentCombination.selectedBets.length <= 2 &&
          currentCombination.combinedOdd >= 1.6) ||
          (currentCombination.selectedBets.length >= 3 &&
            currentCombination.combinedOdd >= 2.1))
      ) {
        combinations.push(currentCombination);
        currentCombination = {
          selectedBets: [],
          combinedOdd: 1.0,
          betAmount: 0,
          checked: true,
        };
        usedTeams.clear(); // Clear the used teams for the next combination
      }
    }

    return combinations;
  };
  

  const generateMultiple = (data) => {
    const generatedBets = generateRandomCombinations(data);
    setRandomBets(generatedBets)

  };

  const handleBetAmountChange = (index, amount) => {
    const updatedBetAmounts = [...betAmounts];

    // Update the bet amount for the specified combination
    updatedBetAmounts[index] = amount;

    setBetAmounts(updatedBetAmounts);
  };

  const handleDownloadClick = (e) => {
    e.preventDefault();
    Axios.get("http://localhost:5172/downloadscreenshots", {
      responseType: "blob",
    })
      .then((response) => {
        const blob = new Blob([response.data]);
        const url = window.URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = "screenshots.zip";
        document.body.appendChild(a);
        a.click();

        window.URL.revokeObjectURL(url);
      })
      .catch((error) => {
        console.error("Error downloading ZIP file:", error);
      });
  };

  const handleCheckboxChange = (index) => {
    const updatedBets = [...randomBets];
    updatedBets[index].checked = !updatedBets[index].checked;
    setRandomBets(updatedBets);
  };

  
  const submitMultiples = () => {
    const updatedBetAmount = randomBets.map((betCombination, index) => {
      return {
        ...betCombination,
        betAmount: betAmounts[index],
      };
    });

    const checkedCombinations = updatedBetAmount.filter(
      (betCombination) => betCombination.checked
    );
    
    setIsLoading(true);
    Axios.post("http://localhost:5172/testforecho", checkedCombinations)
      .then((response) => {
        console.log(response);
        setIsLoading(false)
        setDownloadBtn(true)
      })
      .catch((err) => {
        console.log(err)
        setIsLoading(false)
      });
  }
  
  return (
    <div className="random-crawler">
      <form className="form" onSubmit={handleSubmit1(generateMultiple)}>
        <h2>Random Crawler</h2>
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
                <option value="-3.5">-3.5</option>
                <option value="ambas">Ambas sim</option>
                <option value="nao ambas">Ambas não</option>
              </select>
            </div>

            <div className="crawler-input">
              <label>Odd</label>
              <input
                type="number"
                step="0.01"
                required
                min="1.0"
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
              <div key={index} className="bet-container">
              {/* ...Other bet information */}
              <input
                type="checkbox"
                checked={betCombination.checked || false}
                onChange={() => handleCheckboxChange(index)}
              />
              <MultipleBetBox
                key={index}
                betCombination={betCombination}
                onBetAmountChange={(amount) =>
                  handleBetAmountChange(index, amount)
                }
              />
            </div>
              
            ))}
          </div>
          {isLoading ? (
            <RotatingLines
              strokeColor="red"
              strokeWidth="5"
              animationDuration="0.75"
              width="96"
              visible={true}
            />
          ) : (
            <button
              className="btn"
              type="submit"
              onClick={handleSubmit2(submitMultiples)}
            >
              Aplicar Apostas
            </button>
          )}
          {downloadBtn && <button className="btn" onClick={handleDownloadClick}>Baixar Screenshots</button>}
          
        </form>
      )}
    </div>
  );
}

export default Crawler;
