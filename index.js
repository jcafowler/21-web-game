document.addEventListener("DOMContentLoaded", () => {
  let gameBoard = document.querySelector("#gameBoard")
  let winner = document.querySelector("#winner")
  let start = document.querySelector("#start")
  let score = 0
  let dealerScore = 0
  let deckID;
  let playerHand = document.createElement("div")
  let dealerHand = document.createElement("div")
  let gameScore = document.createElement("div")
  let buttons = document.createElement("div")
  let hit = document.createElement("button")
  hit.innerText = "HIT"
  hit.id = "hit"
  let stay = document.createElement("button")
  stay.innerText = "STAY"
  stay.id = "stay"
  let playAgain = document.createElement("button")
  playAgain.innerText = "Play Again"
  playAgain.id = "playAgain"
  const getDeck = async () => {
    try {
      let res = await axios.get("https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=6")
      deckID = res.data.deck_id
    }catch(err){
      console.log(err)
      debugger
    }
  }
  const displayDeck = async (id) => {
    await getDeck()
    id = deckID
    try{
      let res = await axios.get(`https://deckofcardsapi.com/api/deck/${id}/draw/?count=2`)
      let cards = res.data.cards
      gameBoard.innerHTML = ""
      playerHand.innerHTML=""
      cards.forEach((el) => {
        let card = document.createElement("img")
        card.src=(el.image)
        playerHand.appendChild(card)
      })
      const getScore = async () => {
        cards.forEach((el) => {
          if (el.code.includes("K")){
            el.value = 10
          } else if (el.code.includes("Q")){
            el.value = 10
          } else if (el.code.includes("J")){
            el.value = 10
          } else if (el.code.includes("A")){
            el.value = score > 10 ? 1 : 11
          }
          score += Number(el.value)
        })
        return score
      }
      gameBoard.appendChild(playerHand)
      
      gameScore.id = "score"
      gameScore.innerText = `Player Score: ${await getScore()}`
      gameBoard.appendChild(gameScore)

      
      buttons.appendChild(hit)
      buttons.appendChild(stay)
      gameBoard.appendChild(buttons)

    }catch(err){
      console.log(err)
      debugger
    }
    
  }
  const drawCard =  async (id) => {
    let res = await axios.get(`https://deckofcardsapi.com/api/deck/${id}/draw/?count=1`)
    let cards = res.data.cards
    let card = document.createElement("img")
    card.src = cards[0].image

    if (cards[0].code.includes("K")){
      cards[0].value = 10
    } else if (cards[0].code.includes("Q")){
      cards[0].value = 10
    } else if (cards[0].code.includes("J")){
      cards[0].value = 10
    } else if (cards[0].code.includes("A")){
      cards[0].value = score > 10 ? 1 : 11
    }
    score += Number(cards[0].value)

    if (score > 21) {
      gameBoard.innerHTML= ""
      let busted = document.createElement("div")
      let heading = document.createElement("h2")
      heading.innerText = "BUSTED!"
      busted.appendChild(heading)
      let result = document.createElement("h3")
      result.innerText = "You drew a:"
      busted.appendChild(result)
      let losingCard = document.createElement("img")
      losingCard.src = cards[0].image
      busted.appendChild(losingCard)
      let finalScore = document.createElement("p")
      finalScore.innerText = `Your final score was: ${score}`
      busted.appendChild(finalScore)
      busted.appendChild(playAgain)
      gameBoard.appendChild(busted)
    } 
    // else if (score === 21){
    //   let gameWon = document.createElement("div")
    //   let victory = document.createElement("h2")
    //   victory.innerText = "YOU WIN!"
    //   let results = document.createElement("h3")
    //   results.innerText = "You winning hand was:"
    //   playerHand.appendChild(card)
      

      
    //   gameWon.appendChild(victory)
    //   gameWon.appendChild(results)
    //   gameWon.appendChild(playerHand)
    // }
    else {
      playerHand.appendChild(card)
      gameScore.innerText=`Player score: ${score}`
    }
  };
  const endTurn = async (id) => {
    try {
      let res = await axios.get(`https://deckofcardsapi.com/api/deck/${id}/draw/?count=3`)
      let cards = res.data.cards
      let dealerScoreboard = document.createElement("div")
      dealerHand.innerHTML=""
      cards.forEach((el) => {
        let card = document.createElement("img")
        card.src=(el.image)
        dealerHand.appendChild(card)
      })
      const getScore = async () => {
        cards.forEach((el) => {
          if (el.code.includes("K")){
            el.value = 10
          } else if (el.code.includes("Q")){
            el.value = 10
          } else if (el.code.includes("J")){
            el.value = 10
          } else if (el.code.includes("A")){
            el.value = dealerScore > 10 ? 1 : 11
          }
          dealerScore += Number(el.value)
        })
        return dealerScore
      }
      gameBoard.appendChild(dealerHand)
      
      dealerScoreboard.id = "dealerScore"
      dealerScoreboard.innerText = `Dealer score: ${await getScore()}`
      gameBoard.removeChild(buttons)
      gameBoard.appendChild(dealerScoreboard)
      gameBoard.appendChild(playAgain)

      if (dealerScore > score && dealerScore <= 21) {
        winner.innerText = "The Dealer Wins! Better luck Next Time"
      } else if ( dealerScore === score) {
        winner.innerText = "The game is a draw."
      } else {
        winner.innerText = "You Win!"
      }
    }catch(err){
      console.log(err)
      debugger
    }
  }
  start.addEventListener("click", () => {
    displayDeck()
  })
  hit.addEventListener("click", () => {
    drawCard(deckID)
  })
  stay.addEventListener("click", () => {
    endTurn(deckID)
  })
  playAgain.addEventListener("click", () => {
    score = 0 
    dealerScore = 0
    winner.innerText = ""
    displayDeck()
  })
  
})