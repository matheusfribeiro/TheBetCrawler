const {
  betTypeOverUnder,
  betTypeHomeAwayBothDouble,
  confirmMultipleBet
} = require("./betTypes");

const {
  scrapeAndValidate,
  waitAndClick
  
} = require("./helpers");


exports.multipleBet = async (page, selectedBets, betAmountString) => {
  let homeOrAway = "";

  for (const selectedBet of selectedBets) {
    console.log(`Placing bet for team: ${selectedBet.team}`);

    if (selectedBet.betType == "+1.5" || selectedBet.betType == "+2.5") {
      console.log(`Tipo de aposta: ${selectedBet.betType}`);
      homeOrAway = await scrapeAndValidate(page, selectedBet.team);
      await betTypeOverUnder(page, selectedBet.betType);
    } else if (selectedBet.betType == "vitoria") {
      console.log(`Tipo de aposta: ${selectedBet.betType}`);
      homeOrAway = await scrapeAndValidate(page, selectedBet.team);
      await betTypeHomeAwayBothDouble(page, `${homeOrAway}`);
    } else if (selectedBet.betType == "dupla chance") {
      console.log(`Tipo de aposta: ${selectedBet.betType}`);
      homeOrAway = await scrapeAndValidate(page, selectedBet.team);
      await betTypeHomeAwayBothDouble(page, `${homeOrAway} ou empate`);
    } else if (selectedBet.betType == "ambas") {
      console.log(`Tipo de aposta: ${selectedBet.betType}`);
      homeOrAway = await scrapeAndValidate(page, selectedBet.team);
      await betTypeHomeAwayBothDouble(page, `ambas`);
    } else if (selectedBet.betType == "nao ambas") {
      console.log(`Tipo de aposta: ${selectedBet.betType}`);
      homeOrAway = await scrapeAndValidate(page, selectedBet.team);
      await betTypeHomeAwayBothDouble(page, `nao ambas`);
    }
  }

  //Section 4 - Placing the bet
  const screenshotName = selectedBets
    .map((bet) => bet.team.replace(/\s+/g, ""))
    .join("");

  await confirmMultipleBet(page, betAmountString, screenshotName);

  await waitAndClick(page, '.confirm.mat-button.mat-button-base')
};
