import view from './View.js'
import previewview from './previewview.js'
class resultsView extends view {
    _parentelement = document.querySelector('.results')
    _errormessage = `No recipes found for your query. please try another one :)`

    // this function uses another generate markup function inside of the preview module returns a string of html.
    _generatemarkup(){
        return this._data.map(searchresultrecipes => previewview._generatemarkup(searchresultrecipes)).join(' ')
        // each element of the data is passed as an arugment to the _generaterecipemarkup function with the power of map method. 
    }
}
export default new resultsView()