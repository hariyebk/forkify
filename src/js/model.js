// import { API_URL } from "./config"

import {API_URL, RESULT_LIMIT_PER_PAGE, API_KEY} from './config.js'

import {ajaxcalls} from './helpers.js'

// business logic and the state of the application
export const state = {
    search:{
        query: '',
        results: [],
        resultlimitperpage: RESULT_LIMIT_PER_PAGE,
        currentPage: 1
    },
    bookmark: []
}

// Functions to prepare/chnage the data/state based on our need.

// a function to create a recipe object by structuring the data we recieve from the api.
const create_a_recipe = function(data){
    const { recipe } = data.data;
      // adding a new proprty called recipe to the state object.
    return {
        publisher: recipe.publisher,
        title: recipe.title,
        sourceUrl: recipe.source_url,
        id: recipe.id,
        servings: recipe.servings,
        image: recipe.image_url,
        cookingTime: recipe.cooking_time,
        ingredients: recipe.ingredients,
        // a special property to identify user added recipe
        ...(recipe.key && {key: recipe.key})
        // if recipe.key exists it adds a new propert key with a value of recipe.key. else it does nothing. recipe.key only exists if the user uploads a recipe.
    };
}
// Getting the ingredients of a single recipe using it's hash value . selected result data.
export const loadrecipe = async function(id){
    try
    {
    const data = await ajaxcalls(`${API_URL}${id}?key=${API_KEY}`)
    state.recipe = create_a_recipe(data)
    // when the recipe is clicked it sets the state.recipe property from scratch just like in the create_a_recipe function, which ruins our bookmarked property so we need to check if the clicked recipe is bookmarked before by looking it's id on the state.bookmark array.
    if(state.bookmark.some(recipe => recipe.id === id)) state.recipe.bookmarked = true;
    else
    state.recipe.bookmarked = false;
}
catch(error){
// console.error(`${error} 💥💥`)
// the model module is not responsible to dispaly error that might happen during the aync operation of fecth function. anything related to presentation is the view modules job. but the error is catched in the model module so how do we connect the two modules ? using the controller module, so let's rethrow the catched error in the model module to the controller module which then calls the rendererror function that's located in the view module.
throw new Error(error.message)

}
}

// Getting all the recipes that are similar to the user's query to allow the user which specific recipe he/she wants. serach result data
export const loadSearchRecipe = async function(query){
    try{
        state.search.query = query
        const data = await ajaxcalls(`${API_URL}?search=${query}&key=${API_KEY}`)
        state.search.results = data.data.recipes.map(recipe => {
            return {
                publisher: recipe.publisher,
                title: recipe.title,
                id: recipe.id,
                image: recipe.image_url,
                 // a special property to identify user added recipe
                ...(recipe.key && {key: recipe.key})
            }
        })
        // resetting the pagination to first.
        state.search.currentPage = 1
    }
    catch(error){
        throw new Error(error)
    }
}

// Implementing pagination. a function that otputs the serach result data based on the current page.
export const getsearchrecipepage = function(page = state.search.currentPage){
    // since the current page is a necessary data. it has to be stored in the state object.
    state.search.currentPage = page
    const start = (page -1 ) * state.search.resultlimitperpage
    const end = page * state.search.resultlimitperpage;
    return state.search.results.slice(start , end)
}

// changing the serving data
export const updateservings = function(newserving){
    // handling exceptions.
    if(newserving <= 0 || newserving >= 21){
        return
    }
    state.recipe.ingredients.forEach(ing => {
        // updating the quantity for the ingrdients.
        ing.quantity = (ing.quantity * newserving) / state.recipe.servings
    });
    // setting the new serving value
    // console.log(state.recipe.ingredients[0].quantity)
    state.recipe.servings = newserving
}

// a function to set the bookmark into the local storage of user.
const settolocalstorage = function(){
    localStorage.setItem('bookmarks', JSON.stringify(state.bookmark))
}
// adding bookmarks
export const addbookmark = function(recipe){

    // 1. Adding the recipe to the bookmark.
    state.bookmark.push(recipe)

    // 2. adding the bookmark to local storage
    settolocalstorage()

    // 3. marking the recipe as bookmarked.
    if(recipe.id === state.recipe.id) state.recipe.bookmarked = true;
}

// removing bookmark 
export const removebookmark = function(id){
    const index = state.bookmark.findIndex(recipe => recipe.id === id)
    // 1. removing the bookmark 
    state.bookmark.splice(index, 1)

    // 2. updating the bookmark in the local storage
    settolocalstorage()

    // 3. marking the recipe as unbookmarked.
    if(id === state.recipe.id) state.recipe.bookmarked = false;
}

// a function that retrives bookmarked recipes from the local storage when the page loads.
export const retrivefromlocalstorage = function(){
    const storage = localStorage.getItem('bookmarks')
    // checking if there are any bookmarked recipes stored inside the users local storage
    if(storage) state.bookmark = JSON.parse(storage) // the data is sent in string form so, we need to convert it into object.
}

// uploading the recipe to the api
export const uploadrecipe = async function(newrecipe){
    try {
        const ingredients = newrecipe.filter(entry => entry[0].startsWith('ingredient') && entry[1]!== '').map(ing => {
            const recipevalues = ing[1].replaceAll(' ', '').split(',') // array
            // if the user only inserts one value (ex. quantity)
            if(recipevalues.length !== 3) throw new Error('Wrong input format. Please make sure you provide all the necessary details :)')
            const [quantity,unit,description] = recipevalues;
            // if there is no quantity, it should return null.
            return {quantity: quantity ? + quantity : null,unit,description}
        })
        
        // changing the recieved array format newrecipe into an object
        const newRecipe = Object.fromEntries(newrecipe)
        // structuring our data to transfer for the api
        const recipe = {
            publisher: newRecipe.publisher,
            title: newRecipe.title,
            source_url: newRecipe.sourceUrl,
            servings: +newRecipe.servings,
            image_url: newRecipe.image,
            cooking_time: +newRecipe.cookingTime,
            ingredients: ingredients,
            
        }
        // sending the recipe data to the api.
        const data = await ajaxcalls(`${API_URL}?key=${API_KEY}`, recipe)
        // storing the recieved data in the state.
        state.recipe = create_a_recipe(data)
         // the recipe added by the user should be bookmarked automatically.
        addbookmark(state.recipe)
}
    catch(error){
        throw new Error(error.message)
    }
}

// get nurtion data about the recipe
const spoonacular = async function(query){
    try{// https://api.spoonacular.com/recipes/716429/information?includeNutrition=true&apiKey=ba17f5e79da0446e81cbae506c0a9b39

    // https://api.spoonacular.com/recipes/complexSearch?apiKey=ba17f5e79da0446e81cbae506c0a9b39&query=${query}&addRecipeInformation=true&fillIngredients=true&includeNutrition=true
    const response1 = await fetch(`https://api.spoonacular.com/recipes/complexSearch?apiKey=ba17f5e79da0446e81cbae506c0a9b39&query=${query}&addRecipeInformation=true&fillIngredients=true&includeNutrition=true`)
    const rawdata = await response1.json()
    state.search.id = rawdata.results[0].id
    const response2 = await fetch(`https://api.spoonacular.com/recipes/${state.search.id}/information?includeNutrition=true&apiKey=ba17f5e79da0446e81cbae506c0a9b39`)
    const data = await response2.json()
    state.search.caloric_composition = data.nutrition.caloricBreakdown
    state.search.nutrition = data.nutrition.nutrients
    // console.log( state.search.caloric_composition)
    // console.log(state.search.nutrition)
    
}
    catch(error){
    console.error(error.message)
    }
}
// spoonacular('pizza')