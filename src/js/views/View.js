
import { Array } from 'core-js';
import icons from '../../img/icons.svg'

export default class view{
    _data
    
    // public API, all child instances can inherit this method.
    render(data){
        if(!data || Array.isArray(data) && data.length === 0) return this.renderError()
        this._data = data;
        // console.log(this._data)
        const markup = this._generatemarkup()
        this._clear()
        this._parentelement.insertAdjacentHTML('afterbegin', markup)
    }
    
    // a helper function that clears whats's inside the parent elemnt before adding a new el.
    _clear(){
        this._parentelement.innerHTML = ''
    }
    
    // a fucntions that loads a spinner before the image is loaded.
    renderspinner(){
            const markup = `
            <div class="spinner">
                    <svg>
                        <use href="${icons}#icon-loader"></use>
                    </svg>
            </div>
            `;
            this._clear()
            this._parentelement.insertAdjacentHTML('afterbegin', markup)
        }
    
    renderError(message = this._errormessage){
        const markup = `
            <div class="error">
                <div>
                <svg>
                    <use href="${icons}#icon-alert-triangle"></use>
                </svg>
                </div>
                <p>${message}</p>
            </div>
        `;
        this._clear()
        this._parentelement.insertAdjacentHTML('afterbegin', markup)
    }
    
    rendermessage(message = this._message){
        const markup = `
        <div class="message">
            <div>
                <svg>
                    <use href="${icons}#icon-smile"></use>
                </svg>
            </div>
            <p>
            ${message}
            </p>
        </div> 
        `
        this._clear()
        this._parentelement.insertAdjacentHTML('afterbegin', markup)

    }
    // when the serving is increased or decreased in the page,  the controllsevings function in the controller module uses another fucntion from the model module (updatesevings) that updates the original recipe data based on the new serving value. and that data is then used by this update method to generate a virtual dom and compares it with the original dom and then it only mutates the chaged values rather than rendering the entire recipe view.
    // a function to update only the changed servings in the recipe view
    update(data){
        this._data = data;
        const newmarkup = this._generatemarkup() // a string html
        // creating a new virtual dom from updated data due to the change on sevring amout or new bookmark property.
        const virtualdom = document.createRange().createContextualFragment(newmarkup)
        // selecting all the els from the virtual dom we created.
        const newels = Array.from(virtualdom.querySelectorAll('*'));// returns a node list and we changed it to an array.
        // selecting all els from the original dom (livedom)
        const livedom = Array.from(this._parentelement.querySelectorAll('*'));

        // comparing the virtual dom and the livedom to know changes that occered.
        newels.forEach((el , i) => {
            // tracking the exact live dom el with the virtual dom el.
            const curel = livedom[i]
            
            // changing only the text value of the mutated el in the live dom with the text value of the virtual dom..
            if(!curel.isEqualNode(el) && curel.firstChild?.nodeValue.trim() !== ''){
                curel.textContent = el.textContent
            }
            // changing the attribute value of the mutated el in the live dom with the attribute value of the virtual dom.
            if(!curel.isEqualNode(el)){
                // setting the attributes of the livedom with the new attributes from the virtual dom
                Array.from(el.attributes).forEach(att => {
                    curel.setAttribute(att.name, att.value)
                })
            }

            
        });
    }
}
