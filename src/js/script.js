/* global Handlebars, utils, dataSource */ // eslint-disable-line no-unused-vars

'use strict';

class BookList {
  constructor(){
    const thisBookList = this;
    thisBookList.favoriteBooks = [];
    thisBookList.filters = [];
  
    thisBookList.getElements();
    thisBookList.initData();
    thisBookList.initActions();
  }

  initData(){
    const thisBookList = this;
    thisBookList.data = dataSource.books;
    thisBookList.template = Handlebars.compile(document.querySelector('#template-book').innerHTML);

    for(let book of thisBookList.data){   
      const ratingBgc = thisBookList.determineRatingBgc(book.rating);
      book.ratingBgc = ratingBgc;
      const ratingWidth = book.rating * 10;
      book.ratingWidth = ratingWidth;
      const generatedHTML = thisBookList.template(book);
      const generatedDOM = utils.createDOMFromHTML(generatedHTML);        
      thisBookList.dom.bookList.appendChild(generatedDOM);
    }
  }

  getElements(){
    const thisBookList = this;
    thisBookList.dom = {};
    thisBookList.dom.bookList = document.querySelector('.books-list');
    thisBookList.dom.filters = document.querySelector('.filters');
  }
  
  initActions(){
    const thisBookList = this;
    thisBookList.dom.bookList.addEventListener('click', function(event){
      event.preventDefault();
    });

    thisBookList.dom.bookList.addEventListener('dblclick', function(event) {
      event.preventDefault();
      console.log('double click');
      const imageParent = event.target.offsetParent;
      console.log(this);
      if(imageParent.classList.contains('book__image')){
        const imageId = imageParent.getAttribute('data-id');	
        // console.log(imageId);
        if(!thisBookList.favoriteBooks.includes(imageId)){
          imageParent.classList.add('favorite');
          thisBookList.favoriteBooks.push(imageId);
        }
        else {
          imageParent.classList.remove('favorite');
          const index = thisBookList.favoriteBooks.indexOf(imageId);
          thisBookList.favoriteBooks.splice(index, 1);
        }
      }
      console.log('favoriteBooks:', thisBookList.favoriteBooks);
    });   

    thisBookList.dom.filters.addEventListener('click', function(event){
      if(event.target.tagName === 'INPUT' && event.target.getAttribute('type') === 'checkbox' && event.target.getAttribute('name') === 'filter'){
        const filterValue = event.target.getAttribute('value');
        if(event.target.checked){
          thisBookList.filters.push(filterValue);
        }
        else {
          const index = thisBookList.filters.indexOf(filterValue);
          thisBookList.filters.splice(index, 1);
        }
      }
      // console.log('filters:', filters);
      thisBookList.filterBooks();
    });  
  }

  filterBooks(){
    const thisBookList = this;
    for(const book of thisBookList.data){
      let shouldBeHidden = false;
      for(let filter of thisBookList.filters){
        if(!book.details[filter]){
          shouldBeHidden = true;
          break;
        }
      }
      const bookImage = thisBookList.dom.bookList.querySelector(`.book__image[data-id="${book.id}"]`);
      if(shouldBeHidden === true) bookImage.classList.add('hidden');
      else bookImage.classList.remove('hidden');
    }
  }

  determineRatingBgc(rating){
    if(rating <= 6){
      return 'linear-gradient(to bottom, #b4df5b 0%,#b4df5b 100%)';
    }
    else if(rating > 6 && rating <= 8) {
      return 'linear-gradient(to bottom, #b4df5b 0%,#b4df5b 100%)';
    }
    else if(rating > 8 && rating <= 9) {
      return 'linear-gradient(to bottom, #299a0b 0%, #299a0b 100%)';
    }
    else if(rating > 9){
      return 'linear-gradient(to bottom, #ff0084 0%,#ff0084 100%)';
    }
  }
}

const app = new BookList();