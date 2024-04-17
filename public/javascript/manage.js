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
    FormUpdate.classList.toggle('active');
}

//cho phép nhap quantity khi da nhap size
const size = document.getElementById('sizeUpdate');
const quantity = document.getElementById('quantityUpdate')

size.addEventListener('change', ()=>{
    console.log(size.value);
    if(size.value > 0 && size.value <= 60){
        quantity.disabled = false;
    }
    else{
        quantity.disabled = true;
    }
})
