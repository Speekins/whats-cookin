import User from '../src/classes/User'
import Recipe from '../src/classes/Recipe'
import RecipeRepository from '../src/classes/RecipeRepository'
import ingredientsData from '../src/data/ingredients'
import recipeData from '../src/data/recipes'
import { testComparison, testPantry, usersData } from '../src/data/testData'
import { expect } from 'chai'

describe('User', () => {
  let recipeRepository, user, recipe, recipe2
  beforeEach(() => {
    recipeRepository = new RecipeRepository(recipeData, ingredientsData)
    recipe = new Recipe(recipeData[0], ingredientsData)
    recipe2 = new Recipe(recipeData[1], ingredientsData)
    user = new User(usersData[0], recipeRepository.allIngredients)
  })

  it('should be an instance of User', () => {
    expect(user).to.be.an.instanceOf(User)
  })

  it('should have a name', () => {
    expect(user.name).to.equal("Saige O'Kon")
  })

  it('should have an ID', () => {
    expect(user.id).to.equal(1)
  })

  it('should have a pantry of ingredients', () => {
    expect(user.pantry).to.be.an('array')
    expect(user.pantry.slice(0, 4)).to.eql(testPantry)
  })

  it('should have a list of favorite recipes', () => {
    user.addRecipeToFavorites(recipe)
    user.addRecipeToFavorites(recipe2)
    
    expect(user.favoriteRecipes.length).to.equal(2)
    expect(user.favoriteRecipes[0]).to.eql(recipe)
    expect(user.favoriteRecipes[1]).to.eql(recipe2)
  })

  it('should be able to remove recipe from favorites', () => {
    user.addRecipeToFavorites(recipe)
    user.addRecipeToFavorites(recipe2)

    user.removeRecipeFromFavorites(recipe.id)
    expect(user.favoriteRecipes[0]).to.eql(recipe2)

    user.removeRecipeFromFavorites(recipe2.id)
    expect(user.favoriteRecipes).to.eql([])
  })

  it('should have properly formatted ingredients', () => {
    for (let i = 0; i < user.pantry; i++) {
      let ingredient = user.pantry[i]
      let name = user.pantry[i].name;
      let unit = user.pantry[i].unit
      expect(!!name).to.equal(true)
      expect(ingredient.hasOwnProperty(unit)).to.equal(true)
  }
})

  it('should be able to compare pantry to a recipe\'s ingredients', () => {
    let comparison = user.compareIngredients(recipe)
    expect(comparison).to.eql(testComparison)
  })
})