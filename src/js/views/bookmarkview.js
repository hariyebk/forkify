import view from './View.js'
import previewview from './previewview.js'

class bookmarkvieww extends view {
    _parentelement = document.querySelector('.bookmarks__list')
    _errormessage = `No bookmarks yet. Find your favorite recipe and bookmark it :)`

    _generatemarkup(){
        return this._data.map(bookmarkedrecipe => previewview._generatemarkup(bookmarkedrecipe)).join(' ')
        // each element of the data is passed as an arugment to the _generaterecipemarkup function with the power of map method. 
    }
    // publisher-subscriber design pattern event handler.
    addHandlerbookmarks(handler){
        window.addEventListener('load', function(e){
            handler()
        })

    }

}
export default new bookmarkvieww()