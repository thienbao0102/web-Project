//xo thanh tim kiem xuong
const moreSearch = document.querySelector('.more-search');
const btnMoreSearch = document.querySelector('.extend-search');
const FormUpdate = document.querySelector('.update');//form update
const titleH1Update = document.querySelector('.title');//the h1 cua form update
const size = document.getElementById('sizeUpdate');//input size
const quantity = document.getElementById('quantityUpdate');//input quantity

function extendSearch() {

    moreSearch.classList.toggle('active');
    btnMoreSearch.classList.toggle('active');
}

//hien thi o cap nhat
function showFormUpdate(_Id) {
    FormUpdate.classList.toggle('active');
    titleH1Update.textContent = 'Update - ' + _Id;
}

//cho phép nhap quantity khi da nhap size

size.addEventListener('change', () => {
    console.log(size.value);
    if (size.value > 0 && size.value <= 60) {
        quantity.disabled = false;
    }
    else {
        quantity.disabled = true;
    }
})

//search
let list;
function searchProduct() {
    idOrName = document.getElementById('infoSearch');
    sizeSearch = document.getElementById('sizeSearch');
    minPrice = document.getElementById('minPrice');
    maxPrice = document.getElementById('maxPrice');
    quantitySearch = document.getElementById('quantity');
    const searchData = {
        'idOrName': idOrName.value,
        'size': sizeSearch.value,
        'minPrice': minPrice.value,
        'maxPrice': maxPrice.value,
        'quantity': quantity.value
    }
    console.log(searchData);
    const queryParams = new URLSearchParams(searchData).toString();
    fetch(`/api/searchProduct?${queryParams}`, {
        method: 'GET',
    })
        .then(res => res.json())
        .then(data => {
            if (data.st == 0) {
                renderProducts(data.dt)
                console.table(data.dt);
            }
            else {
                alert("Search failed!")
            }
        })
        .catch(error => {
            console.error('Error:', error);
            // Xử lý lỗi ở đây nếu cần thiết
        });
}
