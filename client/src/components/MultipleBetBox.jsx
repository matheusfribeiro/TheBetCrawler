import "../assets/styles/multiplebetbox/multiplebetbox.css";

import PropTypes from 'prop-types';


function MultipleBetBox({ betCombination }) {
  // Extract data from the betCombination object
  const { selectedBets, combinedOdd } = betCombination;
  
  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

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
      <div className="betamount">
        <label>Valor da Aposta:</label>
        <input
          type="number"
          required
          min="3"
          placeholder="Inserir Valor"
        />
      </div>
    </div>
  );
}

MultipleBetBox.propTypes = {
  betCombination: PropTypes.object,
  amount: PropTypes.number,
};

export default MultipleBetBox;
