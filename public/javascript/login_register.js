fixedBox = document.getElementById("fixedBox");
document.addEventListener("DOMContentLoaded", () => {
    var lastScrollTop = 0;
    window.addEventListener("scroll", function () {
        var st = window.pageYOffset || document.documentElement.scrollTop;
        if (st > lastScrollTop || st == 0) {
            fixedBox.style.top = 0 + "px"
            console.log(lastScrollTop);
        } else if (st < lastScrollTop) {
            fixedBox.style.top = lastScrollTop + "px"
            console.log(lastScrollTop);
        }
        lastScrollTop = st <= 0 ? 0 : st;
    });
})

//chuyen doi dang nhap ddang ky
const changeFunc = document.getElementById('change');
function changeStatus(option)
{
    if(option === 1)
    {
        changeFunc.style.left = 50 + "%";
        document.getElementById('textContent').textContent = "Register";
        document.getElementById('next').style.display = 'none';
        document.getElementById('pre').style.display = 'block';
    }
    else if(option === -1)
    {
        changeFunc.style.left = 0 + "%";
        document.getElementById('textContent').textContent = "Login";
        document.getElementById('pre').style.display = 'none';
        document.getElementById('next').style.display = 'block';
    }
}