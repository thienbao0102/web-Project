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
function showFormUpdate() {
    FormUpdate.classList.toggle('active');
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

/*_____________Phan API_______________ */
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
    console.log("queryParams: " + queryParams);
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

async function updateProduct() {
    const name = document.getElementById('nameUpdate').value;
    const price = document.getElementById('priceUpdate').value;
    const size = document.getElementById('sizeUpdate').value;
    const quantity = document.getElementById('quantityUpdate').value;
    const uploadFile = document.getElementById('uploadFile').files[0];
    const listId = selectedIds.map(selectedId => selectedId._id)
    const formData = new FormData();
    formData.append('listId', listId);
    formData.append('name',name);
    formData.append('price',price);
    formData.append('size',size);
    formData.append('quantity',quantity);
    formData.append('file',uploadFile);

    console.log(formData.has("file"));

    fetch('/api/updateShoes', { // Thay đổi URL tại đây
        method: 'PUT',
        body: formData,
    })
    .then(response => response.json())
    .then(data => {
        alert(data.ms);
        location.reload();
    })
    .catch
    {
        console.log('An error occurred. Please try again later');
    }
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
        headers:{
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(listIds)
    })
    .then(response => response.json())
    .then(data => {
        // Xử lý kết quả từ server
        alert(data.ms);
        // Reload trang hoặc cập nhật giao diện sau khi xóa sản phẩm thành công
        location.reload();
    })
    .catch(error => {
        console.log(Error);
        alert('An error occurred while deleting the product.');
    });
}

/*_____________Phan Client_______________ */
function renderProducts(products) {
    let Html = ' ';
    if (products !== null && products.length > 0) {
        Html += `<span class="text">`
        Html += `<p class="select-all-text" id = "btnSelectAll">Select all</p>`
        Html += `<p class="select-all-text" onclick = "showFormUpdate()">Update</p>`
        Html += `<p class="select-all-text" onclick = "confirmDelete()">Delete</p>`
        Html += `<p class="selected-text" id = "selectedText">Selected <i id = "numSelected">0</i> items</p>`
        Html += `</span>`;
        Html += `<div class="products-result">`;
        products.forEach(product => {
            Html += `<label class="toggle-btn">`;
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
