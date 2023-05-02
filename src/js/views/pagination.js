import view from './View.js'
import icons from '../../img/icons.svg'

class paginationView extends view {
    _parentelement = document.querySelector('.pagination')
    _numberofpages 

    // publisher-subscriber ppattern design
    _addHandlerpagenation(handler){
        //event delegation
        this._parentelement.addEventListener('click', function(e){
            const clikedbtn = e.target.closest('.btn--inline')
            // guard clause
            if(!clikedbtn) return
            const gotopage = Number(clikedbtn.dataset.goto)
            // calling the handler
            handler(gotopage)
        })
    }

    _generatemarkup(){
        // the number of pages that can displayed based on the RESULT_LIMIT_PER_PAGE 

        this._numberofpages = Math.ceil(this._data.results.length / this._data.resultlimitperpage)

        const curpage = this._data.currentPage
        // scenario 1: page1 and other pages
        if(curpage === 1 && this._numberofpages > 1){
            return this._nextmarkup(curpage)
        }
        // scenario 2: last page and other pages
        if(curpage === this._numberofpages && this._numberofpages > 1){
            return this._prevmarkup(curpage)
        }
        // scenario 3: if the currentpage is between the first & the last page
        if(curpage < this._numberofpages){
            return this._bothprevandnext(curpage)
        }
        return ''
    }
    
    // Refactoring our markup
    _prevmarkup(curpage){
        return `
        <button data-goto = "${curpage - 1 }" class="btn--inline pagination__btn--prev">
                <svg class="search__icon">
                <use href="${icons}#icon-arrow-left"></use>
                </svg>
                <span>Page ${curpage - 1 }</span>
        </button>
        `
    }

    _nextmarkup(curpage){
        return `
        <button data-goto= "${curpage + 1 }"class="btn--inline pagination__btn--next">
                <span>Page ${curpage + 1} out of ${this._numberofpages}
                </span>
                <svg class="search__icon">
                <use href="${icons}#icon-arrow-right"></use>
                </svg>
        </button>
        `
    }

    _bothprevandnext(curpage){
        return `
        <button data-goto = "${curpage - 1 }" class="btn--inline pagination__btn--prev">
                <svg class="search__icon">
                <use href="${icons}#icon-arrow-left"></use>
                </svg>
                <span>Page ${curpage - 1 }</span>
        </button>

        <button data-goto = "${curpage + 1 }" class="btn--inline pagination__btn--next">
                <span>Page ${curpage + 1} out of ${this._numberofpages}</span>
                <svg class="search__icon">
                <use href="${icons}#icon-arrow-right"></use>
                </svg>
        </button>
        `
    }
}

export default new paginationView()