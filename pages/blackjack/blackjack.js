// ------------------------------------------------------------------------------------------------
// Card Helpers

const VALID_SUITS = ['spade', 'club', 'diamond', 'heart']
const VALID_VALUES = ['ace', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'jack', 'queen', 'king', 'joker']
const VALUE_RESOLUTIONS = {
    'ace': 11,    // evaluating the hand will take into account that aces can have a value of one
    'two': 2,
    'three': 3,
    'four': 4,
    'five': 5,
    'six': 6,
    'seven': 7,
    'eight': 8,
    'nine': 9,
    'ten': 10,
    'jack': 10,
    'queen': 10,
    'king': 10
}

/**
 * @typedef Card
 * @prop {('spade'|'club'|'diamond'|'heart')} suit,
 * @prop {('ace'|'two'|'three'|'four'|'five'|'six'|'seven'|'eight'|'nine'|'ten'|'jack'|'queen'|'king'|'joker')} value
 */

/**
 * Creates a new playing card
 * 
 * @param {('spade'|'club'|'diamond'|'heart')} suit 
 * @param {('ace'|'two'|'three'|'four'|'five'|'six'|'seven'|'eight'|'nine'|'ten'|'jack'|'queen'|'king'|'joker')} value 
 * @returns {Card}
 */
const makeCard = (suit, value) => {
    
    if (!VALID_SUITS.includes(suit)) throw new Error("Suit not found")
    if (!VALID_VALUES.includes(value)) throw new Error("Value not found")
    
    return {
        suit: suit,
        value: value
    }
    
}

/**
 * Creates a new playing deck for the game
 * @returns {Card[]}
 */
const makeDeck = () => {
    let cards = []

    VALID_SUITS.forEach(suit => {
        for (let i = 0; i < VALID_SUITS.length - 1; i++) {
            cards.push(makeCard(suit, VALID_VALUES[i]))
        }
    })

    return cards;
}

/**
 * Riffle shuffles a deck
 * @param {Card[]} deck Deck to shuffle
 * @param {number} riffles The number of times to riffle, default is 3
 * @returns {Card[]} Shuffled deck
 */
const shuffleDeck = (deck, riffles = 3) => {

    let side1 = []
    let side2 = []

    for (let r = 0; r < riffles; r++) {

        //split the deck in half
        side1 = deck.slice(0, Math.floor(deck.length / 2))
        side2 = deck.slice(Math.ceil(deck.length / 2), deck.length)

        // initialize "pointers"
        let i = 0;
        let j = 0;
        let k = 0;
        let currentCard = undefined;

        while (i < side1.length && j < side2.length) {

            // select random side to pick a card from
            if (i < side1.length && j < side2.length) {
                let rand = Math.random() * 2;

                if (rand < 1) {
                    currentCard = side1[i]
                    i++
                } else {
                    currentCard = side2[j]
                    j++
                }

            // one side is empty, so just take the card from the nonempty side
            } else if (i >= side1.length) {
                currentCard = side2[j]
                j++
            } else {
                currentCard = side1[i]
                i++
            }

            deck[k] = currentCard
            k++
        }

    }

    return deck
}

/**
 * 
 * @param {Card[]} hand
 * @returns {number} The total value of the hand 
*/
const evaluateHand = (hand) => {
    let numberOfAces = 0;
    let currentValue = 0;
    
    hand.forEach(card => {
        currentValue += VALUE_RESOLUTIONS[ card.value ]
        if (card.value === 'ace') numberOfAces++;
    })
    
    while (numberOfAces > 0 && currentValue > 21) {
        currentValue -= 10;
        numberOfAces--;
    }
    
    return currentValue;
}



// ------------------------------------------------------------------------------------------------
// HTML functions

const dealerHandArea = document.getElementById('dealer-hand')
const playerHandArea = document.getElementById('player-hands')

let currentDeck = []
let dealerHand = []
let playerHands = [[]]      // since the player can split, they may have more than one hand at once
let playerBets = [[]]


const newGame = () => {
    currentDeck = shuffleDeck( makeDeck() )
}