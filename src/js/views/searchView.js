class SearchView {
    #parentElement = document.querySelector('.search')
    // Public variable
    // query = ''

    getquery(){
        const query =  this.#parentElement.querySelector('.search__field').value;
        this.#clearinput()
        return query
    }
    
    #clearinput(){
        this.#parentElement.querySelector('.search__field').value = ''
    }
    
    // publisher-subscriber design pattern to call the contrlsearchRecipes as soon as the submit event occurs.
    addHnadlerSerch(handler){
        this.#parentElement.addEventListener('submit', function(e){
            e.preventDefault();
            handler()
        })

    }

    
}

export default new SearchView()