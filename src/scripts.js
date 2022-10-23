import './styles.css'
import apiCalls from './apiCalls'
import MicroModal from 'micromodal'
// import '../src/images'
import "./images/bookmark-tiles-unsaved.png"
import "./images/bookmark-tiles-saved.png"
import "./images/bookmark-unsaved.png"
import "./images/bookmark-saved.png"
import './images/turing-logo.png'
// import '../src/images'
import RecipeRepository from '../src/classes/RecipeRepository'
import recipeData from './data/recipes'
import ingredientsData from "./data/ingredients"
import usersData from "./data/users"
import User from '../src/classes/User'

// ---------------------------DATA MODEL---------------------------

const recipeRepository = new RecipeRepository(recipeData, ingredientsData)
const user = new User(usersData[0])

let currentlyViewedRecipe

// ---------------------------QUERY SELECTORS---------------------------

const allRecipesContainer = document.querySelector('.all-recipes-container')
const closeModalButton = document.getElementById("close-modal-button")
const modalSaveRecipeButton = document.getElementById("modal-save-recipe")
const modalTagParent = document.getElementById("modal-tag-button-parent")
const modalRecipeTitle = document.getElementById("modal-title")
const modalImage = document.getElementById("modal-image")
const ingredientsParent = document.getElementById("ingr-parent")
const instructionsParent = document.getElementById("instructions-parent")

// ---------------------------EVENT LISTENERS---------------------------

window.onload = function () {
  displayAllRecipeTiles()
  MicroModal.init({
    openClass: 'is-open',
    disableScroll: true,
    disableFocus: true,
    awaitOpenAnimation: false,
    awaitCloseAnimation: false,
    debugMode: false
  })
}

allRecipesContainer.addEventListener("click", (event) => {
  if (event.target.nodeName === "SECTION") { return }
  let targetObject = recipeRepository.recipeList.find(recipe => recipe.id == event.target.parentNode.id)
  currentlyViewedRecipe = targetObject
  updateModal(targetObject)
})

closeModalButton.addEventListener("click", () => MicroModal.close("modal-1"))

modalSaveRecipeButton.addEventListener("click", () => user.storedFavoriteRecipes.push(currentlyViewedRecipe))

// ---------------------------DOM UPDATING---------------------------

function createRecipeTile(recipe) {
  allRecipesContainer.innerHTML +=
    `<div class="recipe-tile" id=${recipe.id}>
            <div class= "tile-image" style="background-image: url(${recipe.image})">
            <img class="modal-bookmark-icon" src="./images/bookmark-tiles-unsaved.png" alt="save recipe">
            </div>
            <h1>${recipe.name}</h1>
            <h2>${recipe.tags.join(', ')}</h2>
        </div>`
}

function displayAllRecipeTiles() {
  for (var i = 0; i < recipeRepository.recipeList.length; i++) {
    createRecipeTile(recipeRepository.recipeList[i])
  }
}

let updateModal = targetObject => {
  modalTagParent.innerHTML = ``
  targetObject.tags.forEach(tag => {
    modalTagParent.innerHTML += `<button>${tag}</button>`
  })
  modalRecipeTitle.innerHTML = targetObject.name
  modalImage.src = targetObject.image
  modalImage.alt = targetObject.name
  ingredientsParent.innerHTML = ``
  targetObject.ingredients.forEach(ingredient => {
    let amount = ingredient.amount
    if (amount === 0.25) {
      amount = "1/4"
    } else if (amount === 0.3333333333333333) {
      amount = "1/3"
    } else if (amount === 0.5) {
      amount = "1/2"
    } else if (amount === 0.6666666666666666) {
      amount = "2/3"
    } else if (amount === 0.75) {
      amount = "3/4"
    }
    ingredientsParent.innerHTML += `<ul>${amount} ${ingredient.unit} ${ingredient.name}</ul>`
  })
  instructionsParent.innerHTML = ``
  targetObject.instructions.forEach(item => {
    instructionsParent.innerHTML += `<p>${item.number}. ${item.instruction}`
  })
  MicroModal.show("modal-1")
}