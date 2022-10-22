// import recipeData from "../data/recipes"
// import ingredientsData from "../scripts.js"
import Recipe from "./Recipe"

class RecipeRepository {
  constructor(recipeData, ingredientsData) {
    this.recipeList = this.instantiateRecipes(recipeData, ingredientsData);
  }

  instantiateRecipes(recipeData, ingredientsData) {
    console.log("recipesData is working!", recipeData.recipeData)
    console.log("ingredientsData is working!", ingredientsData.ingredientsData)
    return recipeData.recipeData.map(recipe => new Recipe(recipe, ingredientsData.ingredientsData))
  }

  filterByTag(tag) {
    return this.recipeList.filter(recipe => recipe.tags.includes(tag));
  }

  filterByName(name) {
    return this.recipeList.filter(recipe => recipe.name.includes(name))
  }

  recipeOfTheDay() {
    let randomNum = Math.floor(Math.random() * this.recipeList.length);
    return this.recipeList[randomNum];
  }
}

export default RecipeRepository;
