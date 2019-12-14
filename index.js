document.addEventListener("DOMContentLoaded", () => {
  let gameBoard = document.querySelector("#gameBoard")
  let start = document.querySelector("#start")
  let score = 0
  const getDeck = async () => {
    try {
      let res = await axios.get("https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=6")
      let deckID = res.data.deck_id
      return deckID
    }catch(err){
      console.log(err)
      debugger
    }
  }
  const displayDeck = async (deckID) => {
    try{
      let res = await axios.get(`https://deckofcardsapi.com/api/deck/${await getDeck()}/draw/?count=2`)
      let cards = res.data.cards
      console.log(cards)
      gameBoard.innerHTML = ""
      cards.forEach((el) => {
        let card = document.createElement("img")
        card.src=(el.image)
        gameBoard.appendChild(card)
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
      let gameScore = document.createElement("div")
      gameScore.id = "score"
      gameScore.innerText = `Score: ${await getScore()}`
      gameBoard.appendChild(gameScore)
      let buttons = document.createElement("div")
      let hit = document.createElement("button")
      let stay = document.createElement("button")
      hit.innerText = "HIT"
      hit.id = "hit"
      stay.innerText = "STAY"
      stay.id = "stay"
      buttons.appendChild(hit)
      buttons.appendChild(stay)
      gameBoard.appendChild(buttons)

    }catch(err){
      console.log(err)
      debugger
    }
    const drawCard;
  }
  start.addEventListener("click", () => {
    displayDeck()
  })
  
})