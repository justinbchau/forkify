//global._babelPolyfill = false;
import Search from "./models/Search";
import Recipe from "./models/Recipe";
import * as searchView from "./views/searchView";
import { elements, renderLoader, clearLoader } from "./views/base";

/** Global state of the app
 * - Search Object
 * - Current recipe Object
 * - Shopping list object
 * - Liked recipes
 */
const state = {};

/** SEARCH CONTROLLER */
const controlSearch = async () => {
  // 1.) Get query from view
  const query = searchView.getInput(); //TODO

  if (query) {
    // 2.) New search object and add to the state
    state.search = new Search(query);

    // 3.) Prepare UI for results
    searchView.clearInput();
    searchView.clearResults();
    renderLoader(elements.searchRes);

    try {
      // 4.) Search for Recipes
      await state.search.getResults();

      // 5.) Render results on the UI
      clearLoader();
      searchView.renderResults(state.search.result);
    } catch (err) {
      alert("Something wrong with the search.");
      clearLoader();
    }
  }
};

// Happens upon searching for a Query, calls the above async function
elements.searchForm.addEventListener("submit", e => {
  e.preventDefault();
  controlSearch();
});

// Changes the dataset depending on what page you change to
elements.searchResPages.addEventListener("click", e => {
  const btn = e.target.closest(".btn-inline");
  if (btn) {
    const goToPage = parseInt(btn.dataset.goto, 10);
    searchView.clearResults();
    searchView.renderResults(state.search.result, goToPage);
  }
});

/** RECIPE CONTROLLER */
const controlRecipe = async () => {
  //Get the hash/ Getting the ID from the URL itself and also replace the hash symbol with nothing
  const id = window.location.hash.replace("#", "");
  console.log(id);

  // Check to see if we actually have an ID
  if (id) {
    //Prepare the UI

    // Create the new Recipe Object
    state.recipe = new Recipe(id);

    try {
      // Get the recipe data and parse the ingredients
      await state.recipe.getRecipe();
      state.recipe.parseIngredients();
      //

      // Calculate servins and time
      state.recipe.calcTime();
      state.recipe.calcServings();

      // Render the recipe
      console.log(state.recipe);
    } catch (err) {
      alert("Error processing the recipe");
    }
  }
};

/*
 * Put each event type into an Array
 * Looped over them with the forEach method
 * Used the addEventListener method on each type to add the same Event Listener on multiple events
 */
["hashchange", "load"].forEach(event =>
  window.addEventListener(event, controlRecipe)
);
