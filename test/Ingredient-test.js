import { testIngredients, ingredientsData, recipeData } from '../src/data/testData'
import Ingredient from '../src/classes/Ingredient'
import { expect } from 'chai'

describe('Ingredient', () => {
  let ingredientInfo, ingredientInfo1, ingredientInfo2, recipeInfo,
    recipeInfo1, recipeInfo2, wheatFlour, bicarbonateOfSoda, eggs

  beforeEach(() => {
    ingredientInfo = ingredientsData[0]
    ingredientInfo1 = ingredientsData[1]
    ingredientInfo2 = ingredientsData[2]
    recipeInfo = recipeData[0].ingredients[0]
    recipeInfo1 = recipeData[0].ingredients[1]
    recipeInfo2 = recipeData[0].ingredients[2]
    wheatFlour = new Ingredient(ingredientInfo, recipeInfo)
    bicarbonateOfSoda = new Ingredient(ingredientInfo1, recipeInfo1)
    eggs = new Ingredient(ingredientInfo2, recipeInfo2)
  })

  console.log('WHEAT FLOUR:', wheatFlour)
  console.log('SODA:', bicarbonateOfSoda)
  console.log('EGGS:', eggs)

  it('should be an instance of Ingredient', () => {
    expect(wheatFlour).to.be.an.instanceof(Ingredient)
  })

  it('should have an ID', () => {
    expect(wheatFlour.id).to.equal(20081)
  })

  it('should have a name', () => {
    expect(wheatFlour.name).to.equal("wheat flour")
  })

  it('should have an estimated cost in cents', () => {
    expect(wheatFlour.estimatedCostInCents).to.equal(142)
  })

  it('should be able to have an amount', () => {
    expect(wheatFlour.amount).to.equal(1.5)
  })

  it('should be able to have a unit', () => {
    expect(wheatFlour.unit).to.equal('cups')
  })

  it('should have properly formatted ingredient units', () => {
    expect(wheatFlour).to.eql(testIngredients[0])
    expect(bicarbonateOfSoda).to.eql(testIngredients[1])
    expect(eggs).to.eql(testIngredients[2])
  })
})