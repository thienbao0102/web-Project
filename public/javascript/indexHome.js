const fixedBox = document.getElementById("fixedBox");
const btnMoreOpt = document.getElementById("moreOpt")
const searchInput = document.getElementById("searchInput");
//const category = document.getElementById("price");
let searchExpand = false;
let timerId;
document.addEventListener("click", function(e){
    
    // if(parentNode.parentNode == "searchInput" || parentNode.id == "moreOpt"){
    let element = checkParentNode(e.target);

    if(e.target.id == "searchInput"){
        expandDiv.style.display = "block";
        searchExpand = false;
    }else if(e.target.id == "moreOpt"){
        expandDiv.style.display = "block";
        searchExpand = !searchExpand;
    }else if(element.id == "expandDiv" && element.id){
        expandDiv.style.display = "block";
    }else{
        expandDiv.style.display = "none";
        searchExpand = false;
    }

    function checkParentNode(element){
        while (element.parentNode && element.parentNode !== fixedBox) {
            let highestParent = null;
            highestParent = element.parentNode;
            element = highestParent;
        }
        return element || null;
    }
    
    handleMoreOptClick()

    function handleMoreOptClick() {
        const expandDiv = document.getElementById("expandDiv");
        expandDiv.classList.toggle("expanded");
        if (searchExpand) {
            // searchExpand = false;
            // expandDiv.style.display = "block";
            document.getElementById("filter").style.display = "block";
            document.getElementById("searchResult").innerHTML = "";
        } else {
            // expandDiv.style.display = "none";
            // searchExpand = true;
            document.getElementById("filter").style.display = "none";
            if (searchInput.value && searchInput.value.trim() != "") {
                const data = {
                    name: searchInput.value,
                };
                getSearch(data);
            }
        }
    };

    function getSearch(data) {
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
                renderProducts(data.dt)
            })
            .catch(error => {
                console.error('Error:', error);
                // Xử lý lỗi ở đây nếu cần thiết
            });
    }

    function renderProducts(products) {
        let Html = ' ';
        if (products !== null && products.length > 0) {
            products.forEach(product => {
                Html += `<a href="" style="text-decoration: none; color: #222831;">`;
                Html += checkTag(product);
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
    
});

document.addEventListener("DOMContentLoaded", () => {

    handleGoogleHash()

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

    searchInput.addEventListener("input", debounceInput);

    function debounceInput(e) {     //hàm debounce dùng để chờ người dùng nhập xong mới tìm
        clearTimeout(timerId);
        timerId = setTimeout(() => {
            handleInput(e);
        }, 1000); // Thời gian chờ là milliseconds

        function handleInput(e) {   // Lấy giá trị của các ô input vào data để fetch
            e.preventDefault();
            if (searchInput.value && searchInput.value.trim() != "") {
                const data = {
                    name: searchInput.value,
                };
                getSearch(data);
            } else {
                document.getElementById("searchResult").innerHTML = "";
            }
        }
    }

    function getSearch(data) {
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
                renderProducts(data.dt)
            })
            .catch(error => {
                console.error('Error:', error);
                // Xử lý lỗi ở đây nếu cần thiết
            });
    }

    function renderProducts(products) {
        let Html = ' ';
        if (products !== null && products.length > 0) {
            products.forEach(product => {
                Html += `<a href="product?id=${product._id}" style="text-decoration: none; color: #222831;">`;
                Html += checkTag(product);
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

function handleBuyNowClick(event) {
    const productId = event.target.dataset.id;
    if (productId) {
        window.location.href = `/product?id=${productId}`;
    }
}

async function handleGoogleHash() {
    // Kiểm tra nếu đoạn hash chứa access_token
    if (window.location.hash.includes('access_token')) {
        // Lấy URL trước khi hash
        const urlWithoutHash = window.location.href.split('#')[0];

        const data = await getUserInfo(getToken());
        Login(data);

        // Thay đổi URL bằng cách loại bỏ đoạn hash
        window.history.replaceState({}, document.title, urlWithoutHash);
    }
}

function getToken() {
    const url = new URLSearchParams(window.location.hash.substring(1));
    const token = url.get("access_token");
    return token;
}

async function getUserInfo(access_token){
    const accessToken = access_token;
    const respone = await fetch(
        `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${accessToken}`
    );
    const data = await respone.json();
    setUserPictureToSession(data);
    setUserNameToSession(data);
    return data;
}

async function setUserPictureToSession(data){
    sessionStorage.setItem('imageUrl', data.picture);
}

async function setUserNameToSession(data){
    sessionStorage.setItem('userName', data.name);
}


function Login(dataLogin){
    fetch('/api/loginWithGoogle', {
        method: 'post',
        headers:{
            "Content-Type": "application/json",
        },
        body: JSON.stringify(dataLogin)
    })
    .then(res => res.json())
    .then(data=>{
        console.log("_id: " + data.dt);
        if(data.st == 0){
            sessionStorage.setItem('_id',data.dt,);
            sessionStorage.setItem('role','isUser');
            location.reload(true);
        }else{
            SignUp(dataLogin);
        }
    })
    .catch
    {
        console.log("err: " + Error);
    }
}

function SignUp(userData){
    const dataSignUp ={
        'name': userData.name,
        'email': userData.email,
        'gender':"",
        'phone':"",
        'password': userData.picture,
    }

    console.log(dataSignUp)

    fetch('/api/SignUp', {
        method: 'post',
        headers:{
            "Content-Type": "application/json",
        },
        body: JSON.stringify(dataSignUp)
    })
    .then(res => res.json())
    .then(data=>{
        if(data.st == 0){
            Login(dataSignUp);
        }
        else{
            console.log("Register Failed!");
        }
    })
}

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

// check user đã đăng nhập hay chưa
const redireRoute = document.querySelector('.redirtUser');
function checkUserSignIn(){
    const userBox = document.getElementById("userBox")
    const wellcomeName = document.getElementById("wellcomeName");
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

    renderCartNumber();
    userBox.style.display = "flex";
    wellcomeName.style.display = "block";
    renderUserName(wellcomeName)
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

//xu li so luong san pham trong gio hang

function getUserIdFromSessionStorage(){
    const _id = sessionStorage.getItem("_id");
    return _id;
}

async function getCartFromServer(userId){
    const data = {
        _id : userId
    };
    const queryParams = new URLSearchParams(data).toString();
    try {
        const response = await fetch(`/api/getCarts?${queryParams}`, {
            method: 'GET',
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        const cart = data.dt;
        return cart;
    } catch (error) {
        console.error('Error:', error);
        // Xử lý lỗi ở đây nếu cần thiết
        return null; // hoặc trả về một giá trị mặc định nếu có lỗi
    }
}

async function renderCartNumber(){
    const cart = await getCartFromServer(getUserIdFromSessionStorage());
    items = cart.item;
    const numOfProductsInCart = Object.keys(items).length;
    const cartSpan = document.getElementById("cartSpan");
    cartSpan.setAttribute("data-numProducts", numOfProductsInCart);
};