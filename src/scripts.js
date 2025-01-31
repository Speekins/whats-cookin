import "./images/bookmark-saved.png"
import "./images/bookmark-tiles-saved.png"
import "./images/bookmark-tiles-unsaved.png"
import "./images/bookmark-unsaved.png"
import './images/whats-cookin-logo.png'
import './styles.css'
import MicroModal from 'micromodal'
import RecipeRepository from '../src/classes/RecipeRepository'
import User from '../src/classes/User'
import { getData, postData } from './apiCalls'

// ---------------------------DATA MODEL---------------------------

export let ingredientsData
let recipeRepository
export let recipesData
let user
let usersData
let currentlyViewedRecipe

const ingredientsURL = 'http://localhost:3001/api/v1/ingredients'
const recipesURL = 'http://localhost:3001/api/v1/recipes'
const usersURL = 'http://localhost:3001/api/v1/users'

// ---------------------------QUERY SELECTORS---------------------------

const allRecipesButton = document.getElementById("all-recipes")
const allRecipesContainer = document.querySelector('.all-recipes-container')
const closeModalButton = document.getElementById("close-modal-button")
const featuredIcon = document.querySelector('.featured-bookmark-icon')
const featuredRecipeParent = document.getElementById('featured-recipe-parent')
const featuredRecipeTitle = document.querySelector('.featured-recipe-title')
const filterClearButton = document.querySelector('#filter-clear-button')
const ingredientsParent = document.getElementById("ingr-parent")
const instructionsList = document.getElementById("instructions-list")
const modalImage = document.getElementById("modal-image")
const modalRecipeTitle = document.getElementById("modal-title")
const modalSaveRecipeButton = document.querySelector(".modal-bookmark-icon")
const modalTagParent = document.getElementById("modal-tag-parent")
const myRecipesButton = document.getElementById("my-recipes")
const searchBar = document.getElementById('search-bar')
const welcomeMessage = document.querySelector('.welcome-message')
const pantryParent = document.querySelector('.pantry-parent')
const logoImage = document.getElementById('logo')
const modalCookButton = document.getElementById("modal-cook-button")
const table = document.querySelector('table')
let filter = document.getElementById('filter')
let tileNodes = allRecipesContainer.childNodes

// ---------------------------ARIA ATTRIBUTES---------------------------
const myRecipesAttr = myRecipesButton.getAttribute("aria-expanded")
const allRecipesAttr = myRecipesButton.getAttribute("aria-expanded")

// ---------------------------UTILITY FUNCTIONS---------------------------

function fetchData(urls) {
  Promise.all([getData(urls[0]), getData(urls[1]),
  getData(urls[2])])
    .then(data => {
      usersData = data[0]
      recipesData = data[1]
      ingredientsData = data[2]
      initPage()
    })
    .catch(error => {
      console.log("Fetch error: ", error)
      if (error instanceof TypeError) {
        alert("Sorry, there is an issue with our data server. Please try again later. 🙈")
      } else if (error instanceof ReferenceError) {
        alert("There's an issue on our end, we're working on it. 👷")
      } else {
        alert("An error occured, please try again later.")
      }
    })
}

function initPage() {
  initRecipeRepository()
  displayRecipeTiles(recipeRepository.recipeList)
  populateTags()
  initUser()
  displayWelcomeMessage()
  renderFeaturedRecipe()
  displayPantryView()
  MicroModal.init({
    openClass: 'is-open',
    disableScroll: true,
    disableFocus: true,
    awaitOpenAnimation: false,
    awaitCloseAnimation: false,
    debugMode: false
  })
}

function getRandomIndex(array) {
  return Math.floor(Math.random() * array.length)
}

function initRecipeRepository() {
  recipeRepository = new RecipeRepository(recipesData, ingredientsData)
}

function initUser() {
  user = new User(usersData[getRandomIndex(usersData)], recipeRepository.allIngredients)
}

// ---------------------------EVENT LISTENERS---------------------------

document.addEventListener('keypress', event => {
  if(event.key === "Enter") {
    event.preventDefault()
    event.target.click()
  }
})

filterClearButton.addEventListener('click', clearFilterByTag)

window.addEventListener('load', () => {
  fetchData([usersURL, recipesURL, ingredientsURL])
})

allRecipesContainer.addEventListener("click", event => {
  if (event.target.nodeName === "SECTION") { return }
  let viewingMyRecipes = myRecipesButton.classList.contains('selected-view')
  let targetIsIMG = event.target.nodeName === "IMG"

  if (targetIsIMG && (event.target.src.includes('unsaved'))) {
    addRecipeToFavorites(event)
  } else {
    removeRecipeFromFavorites(event)
    if (targetIsIMG && viewingMyRecipes) {
      removeTileFromDisplay(event)
    }
  }
  let targetObject = recipeRepository.recipeList.find(recipe => recipe.id == event.target.parentNode.id)
  displayModal(targetObject)
})

closeModalButton.addEventListener("click", () => MicroModal.close("modal-1"))

modalSaveRecipeButton.addEventListener("click", event => {
  let targetIsUnsaved = (event.target.src.includes('unsaved'))

  if (targetIsUnsaved) {
    event.target.src = './images/bookmark-saved.png'
    addRecipeToFavorites(event)
  } else {
    event.target.src = './images/bookmark-unsaved.png'
    removeRecipeFromFavorites(event)
  }
})

const searchBarEvents = ['keyup', 'search']
searchBarEvents.forEach(index =>
  searchBar.addEventListener(index, event => {
    clearFilterByTag()
    let input = event.target.value
    let viewingMyRecipes = myRecipesButton.classList.contains('selected-view')

    if (viewingMyRecipes) {
      let recipes = filterByNameOrIngredient(user.favoriteRecipes, input)
      displaySearchedRecipeTiles(recipes)
    } else {
      let recipes = filterByNameOrIngredient(recipeRepository.recipeList, input)
      displaySearchedRecipeTiles(recipes)
    }
  }))

myRecipesButton.addEventListener("click", displayMyRecipes)

allRecipesButton.addEventListener("click", displayAllRecipes)

filter.addEventListener('input', event => {
  enableFilterClearButton(true)
  searchBar.value = ''

  let input = event.target.value
  let viewingMyRecipes = myRecipesButton.classList.contains('selected-view')

  if (viewingMyRecipes) {
    let recipes = filterByTag(user.favoriteRecipes, input)
    displaySearchedRecipeTiles(recipes)
  } else {
    let recipes = filterByTag(recipeRepository.recipeList, input)
    displaySearchedRecipeTiles(recipes)
  }
})

function clearFilterByTag() {
  filter.value = 'Filter recipes by type...'
  enableFilterClearButton(false)
  let viewingMyRecipes = myRecipesButton.classList.contains('selected-view')

  if (viewingMyRecipes) {
    displayRecipeTiles(user.favoriteRecipes)
    updateBookmarks()
  } else {
    displayRecipeTiles(recipeRepository.recipeList)
    updateBookmarks()
  }
}

featuredRecipeParent.addEventListener("click", event => {
  let viewingMyRecipes = myRecipesButton.classList.contains('selected-view')
  let targetIsIMG = event.target.nodeName === "IMG"
  let targetIsH3 = event.target.nodeName === "H3"

  if (targetIsIMG && event.target.src.includes('unsaved')) {
    addRecipeToFavorites(event)
    if (viewingMyRecipes) {
      displayMyRecipes()
    }
  } else if (targetIsIMG) {
    removeRecipeFromFavorites(event)
    if (viewingMyRecipes) {
      removeTileFromDisplay(event)
    }
  } else if (targetIsH3) {
    displayModal(recipeRepository.featuredRecipe)
  }
})

modalCookButton.addEventListener("click", (e) => {
  let recipeID = e.target.getAttribute('recipe-id')
  if (e.target.classList.contains("add-ingredients-button")) {
    MicroModal.close("modal-1")
    displayMyRecipes()
  } else {
    let recipe = recipeRepository.recipeList.find(recipe => recipe.id == recipeID)
    MicroModal.close("modal-1")
    cookRecipe(recipe)
  }
})

table.addEventListener('click', (event) => {
  if (event.target.id !== 'table-button-add') { return }
  let inputValue = Number(event.target.parentNode.querySelector('select').value)
  let id = Number(event.target.classList.value)
  let restructuredPantryObj = structurePost(user.id, id, inputValue)
  postData(restructuredPantryObj, 'http://localhost:3001/api/v1/users')
    .then(() => fetchUsers())
})

// ---------------------------DOM UPDATING---------------------------

function displayWelcomeMessage() {
  welcomeMessage.innerText = `Welcome, ${user.name.split(' ')[0]}!`
}

function createRecipeTile(recipe) {
  allRecipesContainer.innerHTML +=
    `<li class="recipe-tile" id=${recipe.id}>
      <div class="tile-image" style="background-image: url(${recipe.image})" alt="${recipe.name}">
        <img class="tile-bookmarks bookmark-nodes" id=${recipe.id} src="./images/bookmark-tiles-unsaved.png" aria-label="bookmark ${recipe.name}">
      </div>
      <h3 tabindex="0">${recipe.name}</h3>
      <p>${recipe.tags.join(', ')}</p>
    </li>`
}

function displayRecipeTiles(recipeArray) {
  allRecipesContainer.innerHTML = ''
  recipeArray.forEach(recipe => createRecipeTile(recipe))
}

function makeViewButtonActive(button) {
  if (button === allRecipesButton) {
    ariaSelectedToggleAllRecipes()
    myRecipesButton.classList.remove('selected-view')
    allRecipesButton.classList.add('selected-view')
  } else {
    ariaSelectedToggleMyRecipes()
    myRecipesButton.classList.add('selected-view')
    allRecipesButton.classList.remove('selected-view')
  }
}

function displayAllRecipes() {
  filter.value = 'Filter recipes by type...'
  enableFilterClearButton(false)
  makeViewButtonActive(allRecipesButton)
  displayRecipeTiles(recipeRepository.recipeList)
  updateBookmarks()
  showFeaturedRecipe()
  renderFeaturedRecipe()
}

function displayMyRecipes() {
  filter.value = 'Filter recipes by type...'
  enableFilterClearButton(false)
  makeViewButtonActive(myRecipesButton)
  displayRecipeTiles(user.favoriteRecipes)
  updateBookmarks()
  showPantry()
}

function ariaSelectedToggleMyRecipes() {
  myRecipesButton.setAttribute("aria-selected", true)
  allRecipesButton.setAttribute("aria-selected", false)
}

function ariaSelectedToggleAllRecipes() {
  myRecipesButton.setAttribute("aria-selected", false)
  allRecipesButton.setAttribute("aria-selected", true)
}

function removeTileFromDisplay(event) {
  let targetNode = Array.from(tileNodes).find(tile => tile.id === event.target.id)
  targetNode.remove()
}

function enableFilterClearButton(boolean) {
  if (boolean) {
    filterClearButton.disabled = false
    filterClearButton.classList.remove('disabled')
  } else {
    filterClearButton.disabled = true
    filterClearButton.classList.add('disabled')
  }
}

function displaySearchedRecipeTiles(searchedRecipes) {
  allRecipesContainer.innerHTML = ''
  searchedRecipes.forEach(recipe => createRecipeTile(recipe))
  updateBookmarks()
}

function convertDecimal(amount) {
  let key = {
    '0.125': '1/8',
    '0.25': '1/4',
    '0.3333333333333333': '1/3',
    '0.5': '1/2',
    '0.6666666666666666': '2/3',
    '0.75': '3/4',
    '1.25': '1 1/4',
    '1.3333333333333333': '1 1/3',
    '1.5': '1 1/2',
    '1.75': '1 3/4',
    '2.5': '2 1/2',
    '2.75': '2 3/4',
    '5.5': '5 1/2',
    '6.333333333333333': '6 1/3',
    '6.5': '6 1/2'
  }
  if (!key[amount]) {
    return amount
  } else {
    amount = key[amount]
    return amount
  }
}

function updateModal(targetObject) {
  modalTagParent.innerHTML = ``
  targetObject.tags.forEach(tag => {
    modalTagParent.innerHTML += `<li>${tag}</li>`
  })
  modalSaveRecipeButton.id = targetObject.id
  if (user.favoriteRecipes.includes(targetObject)) {
    modalSaveRecipeButton.src = './images/bookmark-saved.png'
  } else if (!user.favoriteRecipes.includes(targetObject)) {
    modalSaveRecipeButton.src = './images/bookmark-unsaved.png'
  }
  modalSaveRecipeButton.ariaLabel = `bookmark ${targetObject.name}`
  modalRecipeTitle.innerHTML = targetObject.name
  modalImage.src = targetObject.image
  modalImage.alt = targetObject.name
  ingredientsParent.innerHTML += `<p class="total-price">Total estimated cost to make: ${targetObject.getTotalCost()}</p>`
  instructionsList.innerHTML = ``
  targetObject.instructions.forEach(item => {
    instructionsList.innerHTML += `<li>${item.instruction}</li>`
  })
  updateModalIngredients()
  updateModalButton()
}

function updateModalIngredients() {
  let ingrCompareObj = user.compareIngredients(currentlyViewedRecipe)
  ingredientsParent.innerHTML = ``
  ingrCompareObj.userHas.forEach(ingredient => {
    ingredientsParent.innerHTML += `<li class="user-has">${convertDecimal(ingredient.amount)} ${ingredient.unit} ${ingredient.name} </li>`
  })
  ingrCompareObj.userNeeds.forEach(ingredient => {
    ingredientsParent.innerHTML += `<li class="user-needs">${convertDecimal(ingredient.amount)} ${ingredient.unit} ${ingredient.name} </li>`
  })
}

function updateModalButton() {
  modalCookButton.innerHTML = ''
  let ingrCompareObj = user.compareIngredients(currentlyViewedRecipe)
  modalCookButton.setAttribute('recipe-id', `${currentlyViewedRecipe.id}`)
  if (ingrCompareObj.userNeeds.length) {
    modalCookButton.className = "cook-this-button add-ingredients-button tooltip"
    modalCookButton.innerHTML = `Add Ingredients
    <div class="left">
        <p>You don't have the necessary ingredients.</p>
        <p>Click to view your pantry and add ingredients.</p>
        <i></i>
    </div>`
  } else {
    modalCookButton.className = "cook-this-button tooltip"
    modalCookButton.innerHTML = `Cook Recipe
    <div class="left">
        <p>Click to cook recipe and remove required ingredients from your pantry.</p>
        <i></i>
    </div>`
  }
}

function displayModal(targetObject) {
  if (!targetObject) { return }
  currentlyViewedRecipe = targetObject
  updateModal(targetObject)
  MicroModal.show("modal-1")
}

function renderFeaturedRecipe() {
  featuredRecipeParent.style.backgroundImage = `url(${recipeRepository.featuredRecipe.image})`
  featuredRecipeTitle.innerText = `${recipeRepository.featuredRecipe.name}`
  featuredRecipeTitle.id = recipeRepository.featuredRecipe.id
  featuredIcon.id = recipeRepository.featuredRecipe.id
  featuredIcon.ariaLabel = `bookmark ${recipeRepository.featuredRecipe.name}`
}

function addRecipeToFavorites(e) {
  recipeRepository.recipeList.forEach(recipe => {
    if (recipe.id === Number(e.target.id)) {
      user.addRecipeToFavorites(recipe)
    }
  })
  updateBookmarks()
}

function removeRecipeFromFavorites(e) {
  let id = Number(e.target.id)
  user.removeRecipeFromFavorites(id)
  updateBookmarks()
}

function populateTags() {
  let allTags = []
  recipeRepository.recipeList.forEach(recipe => {
    recipe.tags.forEach(tag => {
      if (!allTags.includes(tag)) {
        allTags.push(tag)
      }
    })
  })
  allTags.sort()
  allTags.forEach(tag => {
    filter.innerHTML += `<option id=${tag} role="menuitem">${tag}</option>`
  })
}

function updateBookmarks() {
  let allBookmarks = document.querySelectorAll('.bookmark-nodes')
  allBookmarks.forEach(bookmark => {
    if (user.favoriteRecipes.find(recipe => recipe.id == bookmark.id)) {
      bookmark.src = './images/bookmark-tiles-saved.png'
    } else {
      bookmark.src = './images/bookmark-tiles-unsaved.png'
    }
  })
}

function filterByNameOrIngredient(recipes, input) {
  let filteredRecipes = []
  input = input.toLowerCase()
  recipes.forEach(recipe => {
    if (recipe.name.toLowerCase().includes(input)) {
      filteredRecipes.push(recipe)
    } else {
      recipe.ingredients.forEach(ingredient => {
        if (ingredient.name.toLowerCase().includes(input)) {
          if (!filteredRecipes.includes(recipe)) {
            filteredRecipes.push(recipe)
          }
        }
      })
    }
  })
  return filteredRecipes
}

function filterByTag(recipes, tag) {
  return recipes.filter(recipe => recipe.tags.includes(tag))
}

function showPantry() {
  featuredRecipeParent.classList.add('hidden')
  logoImage.style.width = '25%'
  pantryParent.classList.remove('hidden')
}

function showFeaturedRecipe() {
  featuredRecipeParent.classList.remove('hidden')
  logoImage.style.width = '38%'
  pantryParent.classList.add('hidden')
}

function updateUser() {
  return usersData.find(updatedUser => {
    return user.id === updatedUser.id
  })
}

function structurePost(userID, ingredientID, value) {
  return {
    userID: userID,
    ingredientID: ingredientID,
    ingredientModification: value
  }
}

function cookRecipe(recipe) {
  let bodies = recipe.ingredients.map(ingredient => {
    let amount = ingredient.amount - (ingredient.amount * 2)
    return structurePost(user.id, ingredient.id, amount)
  })
  bodies.forEach((body, i) => {
    postData(body, 'http://localhost:3001/api/v1/users')
      .then(() => {
        if (i === bodies.length - 1) {
          MicroModal.close("modal-1")
          fetchUsers()
        }
      })
      .catch(err => console.log(err))
  })
}

function fetchUsers() {
  fetch('http://localhost:3001/api/v1/users')
    .then(response => response.json())
    .then(data => usersData = data)
    .then(() => {
      user.pantry = user.getAllPantryIngredients(updateUser().pantry, recipeRepository.allIngredients)
      displayPantryView()
      displayMyRecipes()
    })
    .catch(err => console.log(err))
}

function displayPantryView() {
  table.innerHTML = ''
  table.innerHTML += `<th>Ingredient</th><th>Current quantity</th><th>Amount to add</th>`

  const findMissingIngredients = recipeRepository.allIngredients.forEach((ingredient) => {
    const missingIngredient = user.pantry.find((pantryItem) => {
      return ingredient.id === pantryItem.id
    })
    if (missingIngredient == null) {
      user.pantry.push({
        amount: 0,
        id: ingredient.id,
        name: ingredient.name,
        unit: ingredient.unit,
      })
    }
  })

  const sortedPantry = user.pantry.sort((a, b) => {
    return a.amount - b.amount
  })

  return sortedPantry.forEach((pantryItem) => {
    table.innerHTML += `
      <tr>
        <td id="table-col-name">${pantryItem.name}</td>
        <td id="table-col-quantity">${pantryItem.amount}</td>
        <td id="table-col-select">
          <label for="table-select-${pantryItem.id}">select amount of ${pantryItem.name} to add</label>
          <select class="table-select" id="table-select-${pantryItem.id}">
            <option>0</option>
            <option>1</option>
            <option>5</option>
            <option>10</option>
            <option>15</option>
            <option>25</option>
            <option>50</option>
            <option>100</option>
          </select>
          <button id="table-button-add" class='${pantryItem.id}'>Add</button>
        </td>
      </tr>
    `
  })
}