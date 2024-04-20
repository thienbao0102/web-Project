const fixedBox = document.getElementById("fixedBox");
const btnMoreOpt = document.getElementById("moreOpt")
const searchInput = document.getElementById("searchInput");
let searchExpand = !0;
let timerId;
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
                Html += `<a href="" style="text-decoration: none; color: #222831;">`;
                Html += checkTag(product);
                console.log(Html);
                Html += `<img src="${product.imageURL}" onerror="this.onerror=null; this.src='../productPic/ads.webp';" alt="Product Image" class="product-image">`;
                Html += `<div class="product-info">`;
                Html += `<h4 class="product-title">${product.name}</h4>`;
                Html += `<span id="productPrice">`;
                Html += `<p class="product-price old-price">$${product.price}</p>`;
                Html += `<p id="newPrice"></p>`;
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