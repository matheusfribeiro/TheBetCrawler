import "../assets/styles/multiplebetbox/multiplebetbox.css";
import { useState } from "react";

import PropTypes from "prop-types";

function MultipleBetBox({ betCombination, onBetAmountChange }) {
  const [betAmount, setBetAmount] = useState(0);
  const { selectedBets, combinedOdd } = betCombination;

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }


  

  const handleBetAmountChange = (amount) => {
    setBetAmount(amount);

    // Notify the parent component of the change
    onBetAmountChange(amount);
  };

  

  return (
    <div className="box">
          {selectedBets.length === 1 && <h3>Simples</h3>}
          {selectedBets.length === 2 && <h3>Dupla</h3>}
          {selectedBets.length === 3 && <h3>Tripla</h3>}
          {selectedBets.length > 3 && <h3>Multipla</h3>}
          <p>Odd Combinada: {combinedOdd.toFixed(2)}</p>
          <ul>
            {selectedBets.map((bet, index) => (
              <li key={index}>
                {capitalizeFirstLetter(bet.team)} - {bet.odd}
              </li>
            ))}
          </ul>
        <input
          type="text"
          min="1"
          placeholder="Enter amount"
          value={betAmount}
          onChange={(e) => handleBetAmountChange(Number(e.target.value))}
        />
        </div>
  );
}

MultipleBetBox.propTypes = {
  betCombination: PropTypes.object,
  onBetAmountChange: PropTypes.func,
};

export default MultipleBetBox;
