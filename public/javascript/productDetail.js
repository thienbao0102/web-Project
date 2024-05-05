const fixedBox = document.getElementById("fixedBox");
const btnMoreOpt = document.getElementById("moreOpt")
const searchInput = document.getElementById("searchInput");
let searchExpand = !0;
let timerId;

/*____________API____________ */
function getSearch(data) {
    const queryParams = new URLSearchParams(data).toString();
    fetch(`/api/indexSearch?${queryParams}`, {
        method: 'GET',
    })
        .then(res => res.json())
        .then(data => {
            documents = data.dt[0];                
            renderProduct(documents);
        })
        .catch(error => {
            console.error('Error:', error);
            // Xử lý lỗi ở đây nếu cần thiết
        });
}

function addToCart(){
    const userId = sessionStorage.getItem('_id');
    try{
        const size = document.querySelector('input[name="size"]:checked').value || ' ';
        dataProd ={
            '_id': userId,
            'idProd':  documents._id,
            'size': size,
            'quantity': 1
        }
    }catch{
        alert("Please choose size");
        return;
    }

    fetch('/api/addtocart',{
        method: "PUT",
        headers:{
            "Content-Type": "application/json",
        },
        body: JSON.stringify(dataProd)
    })
    .then(res => res.json())
    .then(data=>{
        alert(data.ms);
    })
    .catch(error => {
        console.error('Error:', error);
        // Xử lý lỗi ở đây nếu cần thiết
    })
}
/*______________client_______________*/
document.addEventListener("DOMContentLoaded", () => {
    var lastScrollTop = 0;

    window.addEventListener("scroll", function () {
        var st = window.pageYOffset || document.documentElement.scrollTop;
        if (st > lastScrollTop || st == 0) {
            fixedBox.style.top = 0 + "px"
        } else if (st < lastScrollTop) {
            fixedBox.style.top = lastScrollTop + "px"
        }
        lastScrollTop = st <= 0 ? 0 : st;
    });

    btnMoreOpt.addEventListener("click", (handleMoreOptClick));

    function handleMoreOptClick() {
        const expandDiv = document.getElementById("expandDiv");
        expandDiv.classList.toggle("expanded");
        if (searchExpand) {
            searchExpand = !!0
            document.getElementById("filter").style.display = "block";
            document.getElementById("searchResult").innerHTML = "";
        } else {
            searchExpand = !0
            document.getElementById("filter").style.display = "none";
            if (searchInput.value && searchInput.value.trim() != "" && searchExpand) {
                const data = {
                    name: searchInput.value,
                };
                getSearch(data);
            }
        }
    };

    searchInput.addEventListener("input", debounceInput);

    function debounceInput(e) {     //hàm debounce dùng để chờ người dùng nhập xong mới tìm
        clearTimeout(timerId);
        timerId = setTimeout(() => {
            handleInput(e);
        }, 1000); // Thời gian chờ là milliseconds

        function handleInput(e) {   // Lấy giá trị của các ô input vào data để fetch
            e.preventDefault();
            if (searchInput.value && searchInput.value.trim() != "" && searchExpand) {
                const data = {
                    name: searchInput.value,
                };
                getSearch(data);
            } else {
                document.getElementById("searchResult").innerHTML = "";
            }
        }
    }

    async function getSearch(data) {
        const queryParams = new URLSearchParams(data).toString();
        fetch(`/api/indexSearch?${queryParams}`, {
            method: 'GET',
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log(data.dt);
                renderProducts(data.dt)
            })
            .catch(error => {
                console.error('Error:', error);
                // Xử lý lỗi ở đây nếu cần thiết
            });
    }

    function renderProducts(products) {
        let Html = ' ';
        console.table(products)
        if (products !== null && products.length > 0) {
            products.forEach(product => {
                Html += `<a href="product?id=${product._id}" style="text-decoration: none; color: #222831;">`;
                Html += checkTag(product);
                console.log(Html);
                Html += `<img src="${product.imageURL}" onerror="this.onerror=null; this.src='../productPic/ads.webp';" alt="Product Image" class="product-image">`;
                Html += `<div class="product-info">`;
                Html += `<h4 class="product-title">${product.name}</h4>`;
                Html += `<span id="productPrice">`;
                Html += `<p class="product-price old-price">$${product.price}</p>`;
                Html += calSalePrice(product);
                Html += `</span>`;
                Html += `</div>`;
                Html += `</div>`;
                Html += `</a>`;
            });
        }
        // Chèn vào phần tử có id là "container"
        var container = document.getElementById('searchResult');
        container.innerHTML = Html;
    }

    function calSalePrice(product) {
        if(product.sale !== false  && !isNaN(product.sale))
        {
            return `<p id="newPrice">$${product.price - (product.price * product.sale / 100)}</p>`;
        }
        return `<p id="newPrice"></p>`;
    }

    function checkTag(product) {
        if (product.sale !== false && !isNaN(product.sale)) {
            return `<div class="product-result sale-product" data-sale="${product.sale}%">`
        }
        if (product.isPopular !== false) {
            return `<div class="product-result popular-product">`
        }
        return `<div class="product-result">`;
    }

})
//script xử lí price range
const checkBox = document.getElementById('checkbox');
const maxPrice = document.getElementById('maxPrice');
const minPrice = document.getElementById('minPrice');

maxPrice.style.backgroundColor = "#12121212";
minPrice.style.backgroundColor = "#12121212";
maxPrice.disabled = true;
minPrice.disabled = true;

/* Xử lí ô check box của price range*/
checkBox.addEventListener("change", function () {
    // Nếu checkbox được check
    if (checkbox.checked) {
        // Disable ô input price
        price.value = '';
        price.disabled = true;
        price.style.backgroundColor = "#12121212";
        maxPrice.style.backgroundColor = "#EEEEEE";
        minPrice.style.backgroundColor = "#EEEEEE";
        maxPrice.disabled = false;
        minPrice.disabled = false;
    } else {
        // Enable ô input price
        price.disabled = false;
        price.style.backgroundColor = "#EEEEEE";
        maxPrice.style.backgroundColor = "#12121212";
        minPrice.style.backgroundColor = "#12121212";
        minPrice.value = '';
        maxPrice.value = '';
    }
})

document.addEventListener('DOMContentLoaded', function () {
    handleInput();
});

function handleInput() {   // Lấy giá trị của các ô input vào data để fetch
    // Lấy các tham số truy vấn từ URL
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    console.log(urlParams);
    const idValue = urlParams.get('id');
    const data = {};
    if (idValue && idValue.trim() != "") {
        data._id = idValue;
    }
    getSearch(data)

    //data.category += typeValue;
}

let documents = [] //Chua san pham tra ve

function renderProduct(product) {
    let html = '<h2>No product found</h2>';
    console.log(html)
    if (product) {
        html = `<div class="product-image">`;
        html += `<div class="image-thumbnail">`;
                // <img src="https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/5b23e3c3-48a5-4d72-ae36-adfa7e5dccc4/v2k-run-shoes-zJV8TV.png" alt="Giày thể thao Nike V2K Run">
                // <img src="https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/5b23e3c3-48a5-4d72-ae36-adfa7e5dccc4/v2k-run-shoes-zJV8TV.png" alt="Giày thể thao Nike V2K Run">
                // <img src="https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/5b23e3c3-48a5-4d72-ae36-adfa7e5dccc4/v2k-run-shoes-zJV8TV.png" alt="Giày thể thao Nike V2K Run">
                // <img src="https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/5b23e3c3-48a5-4d72-ae36-adfa7e5dccc4/v2k-run-shoes-zJV8TV.png" alt="Giày thể thao Nike V2K Run">
                // <img src="https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/5b23e3c3-48a5-4d72-ae36-adfa7e5dccc4/v2k-run-shoes-zJV8TV.png" alt="Giày thể thao Nike V2K Run">
                // <img src="https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/5b23e3c3-48a5-4d72-ae36-adfa7e5dccc4/v2k-run-shoes-zJV8TV.png" alt="Giày thể thao Nike V2K Run">
        html +=`</div>`
        html +=checkTag(product);
        html +=`<img id="productImage" src="${product.imageURL}" alt="Giày thể thao Nike V2K Run">`;
        html +=`</div>`;
        html +=`</div>`;
        html +=`<div class="product-info">`;
        html +=`<h1 id="productName">${product.name}</h1>`;
        html +=`<p id="productCategory">${product.category}</p>`;
        html +=`<span class="price">`;
        html +=calSalePrice(product);                             
        if( product.sale != false || product.sale > 0){
            html +=`<p class="new-price" id="productNewPrice">${product.sale}% off</p>`;
        }                
        html +=`</span>`;
        html +=`<form id="sizeForm" action="#">`;
        html +=`<h2>Select size</h2>`;
        Object.entries(product.sizes).forEach(([size, quantity]) =>  {
            html +=`<input type="radio" id="${size}" name="size" value="${size}" ${checkSizeQuantity(quantity.quantity)}>`;
            html +=`<label for="${size}" class="${checkSizeQuantity(quantity.quantity)}" >${size}</label>`;
        });
        html +=`</form>`;
        html +=`<div class="product-description" id="productDescription">`;
        html +=`<p>**${product.description}**</p>`;
        html +=`</div>`;
        html +=`<button class="add-to-cart" onclick="addToCart()">Add to cart</button>`;
    }
    // Chèn vào phần tử có id là "container"
    var container = document.getElementById('product');
    container.innerHTML = html;
}

function calSalePrice(product) {
    if(product.sale !== false  && !isNaN(product.sale))
    {
        return `<p id="newPrice">$${product.price - (product.price * product.sale / 100)}</p>
        <p class="current-price old-price" id="productCurrentPrice">$${product.price}</p>`;
    }
    return `
    <p class="current-price" id="productCurrentPrice">$${product.price}</p>`;
}

function checkTag(product){
    if (product.isPopular !== false) {
        return `<div class="primary-image popular-product">`
    }
    return `<div class="primary-image">`;
}

function checkSizeQuantity(quantity){
    
    console.log(quantity)
    let disabled = '';
    if(quantity <= 0){
        disabled = 'disabled';
    }
    return disabled;
}

// check user đã đăng nhập hay chưa
const redireRoute = document.querySelector('.redirtUser');
function checkUserSignIn(){
    const userBox = document.getElementById("userBox")
    const checkSignin = sessionStorage.getItem('_id');
    const userAvt = document.getElementById("userAvt");
    console.log("Checksignin: " + checkSignin);
    
    if(checkSignin == null){
        redireRoute.textContent = 'Login';
        userBox.style.display = "none";
        wellcomeName.style.display = "none";
        wellcomeName.textContent = ``;
        return;
    }

    userBox.style.display = "flex";
    renderUserAvt(userAvt)
    redireRoute.textContent = 'My Info';
    accessManagement();
}

function getUserAvtFromSession(){
    return sessionStorage.getItem('imageUrl')
}

function getUserNameFromSession(){
    return sessionStorage.getItem('userName')
}

function renderUserName(divName) {
    divName.textContent = `Hello ${getUserNameFromSession()}, welcome back!`;
}

function renderUserAvt(divName) {
    const pictureLink = getUserAvtFromSession()
    if (pictureLink)
    divName.src = `${getUserAvtFromSession()}`;
}

//xu ly su kien chuyen huong (khi chua dang nhap va khi da danh nhap)
function redirectRouter(){
    if(redireRoute.textContent == 'Login'){
        window.location.href = '/login';
    }
    else if(redireRoute.textContent == 'My Info'){
        window.location.href = '/myinfo';
    }
}

//admin truy cap vao trang quan ly
const allowAccess = document.querySelector('.isAdmin');
function accessManagement(){
    const roleUser = sessionStorage.getItem('role');
    console.log(roleUser)
    if(roleUser == 'isAdmin'){
        allowAccess.style.display = 'block';
        return;
    }
    allowAccess.style.display = 'none';
}