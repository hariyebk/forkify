// The controller module in MVC architechure is responsible for handling the application logic.

import * as model from './model.js'
import renderView from './views/recipeView.js' // importing the child instance ofthe RenderView class.
import searchView from './views/searchView.js'
import resultsView from './views/resultView.js'
import bookmarkview from './views/bookmarkview.js'
import paginationView from './views/pagination.js'
import addrecipeview from './views/addrecipeview.js'
import { WAIT_TIME_SEC } from './config.js'

import 'core-js/stable'
import 'regenerator-runtime/runtime'
// console.log(icons)

// https://forkify-api.herokuapp.com/v2

/////////////////////////////////
// control fucntion for displayling ingridients for the chosen recipe.
const controlrecipes = async function () {
  try {
    // window.location is a JavaScript object that represents the current URL of the webpage that is currently loaded in the browser. It provides information about the current URL and allows you to manipulate the URL and navigate to other pages.
    const id = window.location.hash.slice(1)
    // console.log(id)
    // guard clause 
    if(!id) return
    // loading the spinner
    renderView.renderspinner()

    //3.  re-rendering the search result to mark the selected recipe
    resultsView.update(model.getsearchrecipepage())

    // re-rendering the bookmark view
    bookmarkview.update(model.state.bookmark)
    
    // 1. Loading the recipes data
    await model.loadrecipe(id) // doesn't return anything but we can access the recipe property that is inside the state object.
    
    // 2. Rendering the recipes data
    renderView.render(model.state.recipe) // inserting the recipe data we got  from the model module into the recipeview module with the render method.
  } catch (error) {
    renderView.renderError()
    console.error(error)
  }
};

// control fucntion for search results
const controlSearchRecipes = async function(){
    try
    { 
      //1 Getting search query.
      const query = searchView.getquery()

      //2 rendering the spinner 
      resultsView.renderspinner()

      //3 loading the recipe data
      await model.loadSearchRecipe(query)
      
      //4 rendering the search result
      resultsView.render(model.getsearchrecipepage())

      //5 rendering the pagination
      paginationView.render(model.state.search)}
      catch(error){
        resultsView.renderError('It took too long to respond. check your Internet Connection and try again :)')
      }
}

// control function for displaying the pagination.
const controllpagination = function(gotopage){
    // rendering the results but only with 10 recipes.
    resultsView.render(model.getsearchrecipepage(gotopage))
    // Re-rendering the pagination
    paginationView.render(model.state.search)
}

// control function for searvings
const controlservings = function(newserving){
  // update servings 
  model.updateservings(newserving)
  // update the recipe view
  renderView.update(model.state.recipe)

}

// controll bookmarks
const controlbookmarks = function(){
  // adding and removing the current loaded recipe to our bookmark array using the addbookmark method from model moduel
  // checking if the recipe is already bookmarked
  if(!model.state.recipe.bookmarked) model.addbookmark(model.state.recipe)
  else model.removebookmark(model.state.recipe.id) // if it is already bookmarked remove it from the bookmark

  //rendering the bookmarks
  bookmarkview.render(model.state.bookmark)
  // re-rendering the recipe view to make changes to the bookmark button.
  renderView.update(model.state.recipe)

}

// render bookmarks when the page loads
const controlbookmarkrender = function(){
  // retrieving bookmarked recipes from the local storage and updating the state.bookmark array
  model.retrivefromlocalstorage() 
  // rendering the updated bookmark array.
  bookmarkview.render(model.state.bookmark)

}

// controll upload recipe
const controluploadrecipe = async function(newuserrecipe){
  try{
    // loading the spinner
  addrecipeview.renderspinner()
  // sets a new recipe added by user by sending it to the api to get a special identifier key.
  await model.uploadrecipe(newuserrecipe)
  // display a successfull message.
  addrecipeview.rendermessage()
  //render the bookmark
  bookmarkview.render(model.state.bookmark)
  // close the modal window after few seconds
  setTimeout(function(){
    addrecipeview._togglewindow()
  }, WAIT_TIME_SEC * 1000)
  // render the recipe
  renderView.render(model.state.recipe)
  // using the history web api to reset the url after the user uploads a recipe. without reloading the page.
  window.history.pushState(null,'',`#${model.state.recipe.id}`)
}
catch(error){
  addrecipeview.renderError(error)

  }
}


// As soon as the page loads the html file imports the controller module and then the init function is immedietly invoked.
const init = function(){
  renderView.addHandlerRender(controlrecipes)
  bookmarkview.addHandlerbookmarks(controlbookmarkrender)
  renderView.addHandlerservings(controlservings)
  renderView.addHandlerbookmark(controlbookmarks)
  addrecipeview._addHandlerupload(controluploadrecipe)
  searchView.addHnadlerSerch(controlSearchRecipes)
  paginationView._addHandlerpagenation(controllpagination)
}
init()

// components of any software architecture
    // business logic
    // state
    // http library
    // an application logic (router)
    // presentation logic.
    
// hot module replacement
if (module.hot) {
  module.hot.accept();
}