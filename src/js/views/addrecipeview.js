import view from "./View.js"
class addrecipeView extends view {
    _parentelement = document.querySelector('.upload')
    _message = 'Recipe was Successfully uploaded :)'
    _window = document.querySelector('.add-recipe-window')
    _overlay = document.querySelector('.overlay')
    _btnopen = document.querySelector('.nav__btn--add-recipe')
    _btnclose = document.querySelector('.btn--close-modal')
    
    // as soon as an instance is created ( instantiated) from this class it calls the _addHandleraddrecip function.
    constructor(){
        super() // we can't use this key word in the constructor without the super key word.
        this._addHandlershowwindow()
        this._addHandlerclosewindow()
    }
    _togglewindow(){
        this._window.classList.toggle('hidden')
        this._overlay.classList.toggle('hidden')
    }
    _addHandlershowwindow(){
        this._btnopen.addEventListener('click', this._togglewindow.bind(this))
    }
    _addHandlerclosewindow(){
        // if the close X button is clicked.
        this._btnclose.addEventListener('click', this._togglewindow.bind(this))
        // if the background is clicked.
        this._overlay.addEventListener('click', this._togglewindow.bind(this))
    }

    // the data retrieved from the add recipe form needs to be added into our state object in the model so we need a publisher-subscriber design pattern.
    _addHandlerupload(handler){
        this._parentelement.addEventListener('submit', function(e){
            // since we are litsening a submit event from a form. the page will reload. to prevent that
            e.preventDefault()
            // retrieving the data from the form
            const data = [...new FormData(this)] // outputs an array.
            handler(data)
            // closing the modal window
        })
    }
}
export default new addrecipeView()