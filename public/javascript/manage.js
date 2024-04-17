//xo thanh tim kiem xuong
const moreSearch = document.querySelector('.more-search');
const btnMoreSearch = document.querySelector('.extend-search');

function extendSearch(){
    
    moreSearch.classList.toggle('active');
    btnMoreSearch.classList.toggle('active');
}

//hien thi o cap nhat
const FormUpdate = document.querySelector('.update');
function showFormUpdate(){
    FormUpdate.classList.toggle('active')
}