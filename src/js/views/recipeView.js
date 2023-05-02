// importing icons from the image folder.
import icons from '../../img/icons.svg'
import {Fraction} from 'fractional';
import view from './View.js'
class RenderView extends view{
    _parentelement = document.querySelector('.recipe')
    _errormessage = `We couldn't find that recipe. please try another one !!`
    
    _generatemarkup(){
        return ` <figure class="recipe__fig">
            <img src="${this._data.image}" alt="${this._data.title}" class="recipe__img" />
            <h1 class="recipe__title">
            <span>${this._data.title}</span>
            </h1>
        </figure>
        
        <div class="recipe__details">
            <div class="recipe__info">
            <svg class="recipe__info-icon">
                <use href="${icons}#icon-clock"></use>
            </svg>
            <span class="recipe__info-data recipe__info-data--minutes">${
                this._data.cookingTime
            }</span>
            <span class="recipe__info-text">minutes</span>
            </div>
            <div class="recipe__info">
            <svg class="recipe__info-icon">
                <use href="${icons}#icon-users"></use>
            </svg>
            <span class="recipe__info-data recipe__info-data--people">${
                this._data.servings
            }</span>
            <span class="recipe__info-text">servings</span>
        
            <div class="recipe__info-buttons">
                <button data-update-to = "${this._data.servings - 1}" class="btn--tiny btn--update-servings">
                <svg>
                    <use href="${icons}#icon-minus-circle"></use>
                </svg>
                </button>
                <button data-update-to = "${this._data.servings + 1}" class="btn--tiny btn--update-servings">
                <svg>
                    <use href="${icons}#icon-plus-circle"></use>
                </svg>
                </button>
            </div>
            </div>
        
            <div class="recipe__user-generated ${this._data.key ? '' : 'hidden'}">
                <svg>
                    <use href="${icons}#icon-user"></use>
                </svg>
            </div>
            <button class="btn--round btn-bookmark">
            <svg class="">
                <use href="${icons}#icon-bookmark${this._data.bookmarked ? '-fill' : ''}"></use>
            </svg>
            </button>
        </div>
        <div class="recipe__ingredients">
            <h2 class="heading--2">Recipe ingredients</h2>
            <ul class="recipe__ingredient-list">
                ${this._data.ingredients
                .map(this._generateingredientmarkup)
                .join('')}
            </ul>
        </div>
        
        <div class="recipe__directions">
            <h2 class="heading--2">How to cook it</h2>
            <p class="recipe__directions-text">
            This recipe was carefully designed and tested by
            <span class="recipe__publisher">${
                this._data.publisher
            }</span>. Please check out
            directions at their website.
            </p>
            <a
            class="btn--small recipe__btn"
            href="${this._data.sourceUrl}"
            target="_blank"
            >
            <span>Directions</span>
            <svg class="search__icon">
                <use href="${icons}#icon-arrow-right"></use>
            </svg>
            </a>
        </div>`;
    }
    
    // a helper fucntion that displays the recipe ingredients amout.
    _generateingredientmarkup(ing){
        return `
            <li class="recipe__ingredient">
                <svg class="recipe__icon">
                    <use href="${icons}#icon-check"></use>
                </svg>
        <div class="recipe__quantity">${ing.quantity ? new Fraction(ing.quantity).toString(): ''}</div>
        <div class="recipe__description">
        <span class="recipe__unit">${ing.unit}</span>
        ${ing.description}
        </div>
    </li>
    `;

    }

    // The view module do not have any idea that other modules exist. so we can't import the controller module in here. but there is an option called publisher-subscriber design pattern. where the publisher fucntion(addHandlerRender) notifies and later excutes the subscriber fucntion which it recies as an arugument .
    addHandlerRender(handler){
        // Instead of attaching two eventlitseners in separete. 
        // console.log(handler);
    ['hashchange', 'load'].forEach(event => window.addEventListener(event, handler))

    }

    // a publisher-subscriber design pattern.
    addHandlerservings(handler){
        // event delegation
        this._parentelement.addEventListener('click', function(e){
            const clickedserving  = e.target.closest('.btn--update-servings')
            // guard cluase if other parts were clicked
            if(!clickedserving) return
            const newservingvalue = +clickedserving.dataset.updateTo
            // console.log(newservingvalue)
            handler(newservingvalue)
        })

    }

    addHandlerbookmark(handler){
        // event delegation
        this._parentelement.addEventListener('click' , function(e){
            const btn = e.target.closest('.btn-bookmark')
            // guard clause
            if(!btn) return
            handler()
        })
    }



}

export default new RenderView()