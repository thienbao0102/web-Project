const moreSearch = document.querySelector('.more-search');
const btnMoreSearch = document.querySelector('.extend-search');
const FormUpdate = document.querySelector('.update');//form update
const titleH1Update = document.querySelector('.title');//the h1 cua form update
const size = document.getElementById('mySelection');//size
const quantity = document.getElementById('quantityUpdate');//input quantity
let list = [];
let listSizeUpdate = [];

//xo thanh tim kiem xuong
function extendSearch() {

    moreSearch.classList.toggle('active');
    btnMoreSearch.classList.toggle('active');
}

//hien thi o cap nhat
function showFormUpdate() {
    if (selectedIds.length <= 0) {
        alert("You must select a product to update")
        return;
    }
    FormUpdate.classList.toggle('active');
    console.log(selectedIds[0]._id)
    if (selectedIds.length == 1) {
        document.getElementById('allowUpdate').style.display = 'block';
        renderInfor(selectedIds[0]._id)
        return;
    }

    document.getElementById('allowUpdate').style.display = 'none';
    //show name
    document.getElementById('nameUpdate').value = '';
    //show price
    document.getElementById('priceUpdate').value = '';
    //popular
    document.getElementById('popular').checked = false;
    //sale
    document.getElementById('sale').value = '';

}

/*_____________Phan API_______________ */
//search
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
        'quantity': quantitySearch.value
    }
    console.log(searchData);
    const queryParams = new URLSearchParams(searchData).toString();
    console.log("queryParams: " + queryParams);
    fetch(`/api/searchProduct?${queryParams}`, {
        method: 'GET'
    })
    .then(res => res.json())
    .then(data => {
        if (data.st == 0) {
             list = data.dt;
            renderProducts(list);
        }
        else {
            alert("Search failed!")
        }
    })
    .catch(error => {
        console.error('Error:', error);
        // Xử lý lỗi ở đây nếu cần thiết
    })
}

async function updateProduct() {
    const name = document.getElementById('nameUpdate').value;
    const price = document.getElementById('priceUpdate').value;
    const uploadFile = document.getElementById('uploadFile').files[0];
    const popular = document.getElementById('popular').checked;
    const sale = document.getElementById('sale').value;
    const listId = selectedIds.map(selectedId => selectedId._id)
    const formData = new FormData();
    formData.append('listId', listId);
    formData.append('name', name);
    formData.append('price', price);
    formData.append('popular', popular);
    formData.append('sale', sale);
    formData.append('file', uploadFile);
    formData.append('sizeQuantity', JSON.stringify(listSizeUpdate))

    console.log('>>>Checked: ' + popular);
    console.log("listSize: ");
    console.log(listSizeUpdate)

    fetch('/api/updateShoes', { // Thay đổi URL tại đây
        method: 'PUT',
        body: formData,
    })
        .then(response => response.json())
        .then(data => {
            alert(data.ms);
            list.splice(0);
            searchProduct();
            selectedIds.splice(0);
            hideFormUpdate();
            listSizeUpdate.splice(0);
        })
        .catch(error => {
            console.log('An error occurred. Please try again later');
            console.error('Error:', error);
            // Xử lý lỗi ở đây nếu cần thiết
        });

}

function confirmDelete() {
    // Xác nhận xóa sản phẩm
    const confirmDelete = confirm(`Are you sure you want to delete ${selectedIds.length} product?`);
    if (confirmDelete) {

        const listId = selectedIds.map(selectedId => selectedId._id)
        console.table(listId)
        deleteProduct(listId);
    } else {
        console.log(`Delete cancelled.`)
    }
}
// Gửi yêu cầu DELETE đến API
function deleteProduct(listIds) {
    fetch(`/api/delete`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(listIds)
    })
        .then(response => response.json())
        .then(data => {
            // Xử lý kết quả từ server
            alert(data.ms);
            // fetch laij data
            list.splice(0);
            searchProduct()
            selectedIds.splice(0);
            listSizeUpdate.splice(0);
        })
        .catch(error => {
            console.log(Error);
            alert('An error occurred while deleting the product.');
        });
}

/*_____________Phan Client_______________ */
function renderProducts(products) {
    let Html = `<p class = "no-product" >No product found</p>`;
    if (products !== null && products.length > 0) {
        Html = '';
        Html += `<span class="text">`
        Html += `<p class="select-all-text" id = "btnSelectAll">Select all</p>`
        Html += `<p class="select-all-text" onclick = "showFormUpdate()">Update</p>`
        Html += `<p class="select-all-text" onclick = "confirmDelete()">Delete</p>`
        Html += `<p class="selected-text" id = "selectedText">Selected <i id = "numSelected">0</i> items</p>`
        Html += `</span>`;
        Html += `<div class="products-result">`;
        products.forEach(product => {
            Html += `<label class="toggle-btn" onchange="hideFormUpdate()">`;
            Html += `<input type="checkbox" class="choosed-shoes" value="${product._id}">`;
            Html += checkTag(product);
            Html += `<label class= "fake-checkbox">
                        <input type="checkbox" class="fakeCheckBox">
                        <img src="../system/checkmark-outline.svg" alt="">
                    </label>`;
            Html += `<img src="${product.imageURL}" onerror="this.onerror=null; this.src='../productPic/ads.webp';" alt="Product Image" class="product-image">`;
            Html += `<div class="product-info">`;
            Html += `<h2 class="product-title">${product.name}</h2>`;
            Html += `<p class="product-description">${product.description}</p>`
            Html += `<p class="product-description">Sale: ${product.sale || 0}</p>`
            Html += `<span id="productPrice">`;
            Html += `<p class="product-price old-price">$${product.price}</p>`;
            Html += calSalePrice(product);
            Html += `</span>`;
            Html += `</div>`;
            Html += `</div>`;
            Html += `</label>`;
        });
        Html += `</div>`;
    }
    // Chèn vào phần tử có id là "container"
    var container = document.getElementById('containerProduct');
    container.innerHTML = Html;

    attachClickEvent();
}

function calSalePrice(product) {
    if (product.sale !== false && !isNaN(product.sale)) {
        return `<p id="newPrice">$${product.price - (product.price * product.sale / 100)}</p>`;
    }
    return `<p id="newPrice"></p>`;
}

function checkTag(product) {
    if (product.sale !== false && !isNaN(product.sale)) {
        return `<div class="product-card sale-product content" data-sale="${product.sale}%">`
    }
    if (product.isPopular !== false) {
        return `<div class="product-card popular-product content">`
    }
    return `<div class="product-card content">`;
}

const selectedIds = [];

function attachClickEvent() {
    const productCards = document.querySelectorAll('.toggle-btn');
    productCards.forEach(productCard => {
        const checkbox = productCard.querySelector('.choosed-shoes');
        const fakeCheckbox = productCard.querySelector('.fake-checkbox');
        // Thêm sự kiện click cho cả checkbox và fakeCheckbox
        checkbox.addEventListener("click", (e) => {
            handleCheckboxClick(e.target, fakeCheckbox);
        });

        fakeCheckbox.addEventListener("click", (e) => {
            handleCheckboxClick(checkbox, fakeCheckbox);
        });
    });
    handleSelectAllBtn();
}

function handleSelectAllBtn() {
    const btnSelectAll = document.getElementById("btnSelectAll");
    const selectedText = document.getElementById("selectedText");

    let isClicked = false;

    btnSelectAll.addEventListener("click", () => {
        const checkBoxes = document.querySelectorAll('.choosed-shoes');

        checkBoxes.forEach(checkBox => {
            checkBox.checked = !isClicked;
            handleCheckboxClick(checkBox, checkBox.parentElement.querySelector('.fake-checkbox'));
        });

        isClicked = !isClicked;
    });
}

function handleCheckboxClick(checkbox, fakeCheckbox) {
    const id = checkbox.value;
    const imgFakeCheckbox = fakeCheckbox.querySelector('img');
    if (imgFakeCheckbox) { // Kiểm tra xem có phần tử <img> trong fakeCheckbox không trước khi truy cập
        const index = selectedIds.findIndex(item => item._id === id);
        if (checkbox.checked) {
            fakeCheckbox.style.backgroundColor = "#3559E0";
            imgFakeCheckbox.style.opacity = 1;
            // Nếu sản phẩm được chọn và chưa có trong mảng selectedIds, thêm id vào mảng
            if (index === -1) {
                selectedIds.push({ _id: id });
            }
        } else {
            fakeCheckbox.style.backgroundColor = "transparent";
            imgFakeCheckbox.style.opacity = 0;
            // Nếu sản phẩm bị hủy chọn và có trong mảng selectedIds, loại bỏ id khỏi mảng
            if (index !== -1) {
                selectedIds.splice(index, 1);
            }
        }
        handleNumSelected();
    }
}

function handleNumSelected() {
    const numSelected = document.getElementById("numSelected");
    if (selectedIds < 0) {
        return;
    }
    numSelected.innerHTML = selectedIds.length;
}

//hien thi danh sach size
function renderInfor(id) {
    const listSize = list.filter(item => item._id === id)[0];
    let html = '';
    //show name
    document.getElementById('nameUpdate').value = listSize.name;
    //show price
    document.getElementById('priceUpdate').value = listSize.price;
    //popular
    if (listSize.isPopular) {
        document.getElementById('popular').checked = true;
        console.log('listSize.isPopular -t: ' + listSize.isPopular);
    }
    else {
        document.getElementById('popular').checked = false;
        console.log('listSize.isPopular -f: ' + listSize.isPopular);
    }

    //sale
    if (listSize.sale > 0) {
        document.getElementById('sale').value = listSize.sale;
    }
    else {
        document.getElementById('sale').value = 0;
    }
    //render size
    for (var size in listSize.sizes) {
        html += `<option value="${size}">${size}</option>`
    }
    document.getElementById('mySelection').innerHTML = html;
    //show quantity of size
    quantityOfSize()
}

//them size vao mang update size
function addQuantityForSize() {
    const sizeUpdateValue = size.value;
    console.log('sizeUpdateValue ' + sizeUpdateValue)
    const objSizeUpdate = {
        'size': sizeUpdateValue,
        'quantity': quantity.value
    }
    if (listSizeUpdate.filter(size => size.size === objSizeUpdate.size).length === 0) {
        listSizeUpdate.push(objSizeUpdate);
    }

}

//ẩn khi listid vê 0
function hideFormUpdate() {
    if (selectedIds.length == 0) {
        FormUpdate.classList.remove('active');
        return;
    }
    if (selectedIds.length >= 1 && FormUpdate.classList.contains('active')) {
        FormUpdate.classList.remove('active');
        showFormUpdate();
    }

}

//change quantity của sản phẩm
function quantityOfSize() {
    if (selectedIds.length == 1) {
        const listSize = list.filter(item => item._id == selectedIds[0]._id)[0].sizes;
        Object.entries(listSize).forEach(([item, itemData]) => {
            if (item == size.value) {
                quantity.value = itemData.quantity;
                return;
            }
        })
    }
}