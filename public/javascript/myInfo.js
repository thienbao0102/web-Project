// fixedBox = document.getElementById("fixedBox");
// document.addEventListener("DOMContentLoaded", () => {
//     var lastScrollTop = 0;
//     window.addEventListener("scroll", function () {
//         var st = window.pageYOffset || document.documentElement.scrollTop;
//         if (st > lastScrollTop || st == 0) {
//             fixedBox.style.top = 0 + "px"
//             console.log(lastScrollTop);
//         } else if (st < lastScrollTop) {
//             fixedBox.style.top = lastScrollTop + "px"
//             console.log(lastScrollTop);
//         }
//         lastScrollTop = st <= 0 ? 0 : st;
//     });
// })

//chuyen qua laij giua my profile va change password
const changeColor = document.querySelectorAll('.options')
changeColor.forEach((el)=>{   
    el.addEventListener('click', ()=>{     
        changeColor.forEach((orderEl)=>{
            orderEl.style.color = 'rgb(110, 110, 110)';
        })
        el.style.color = 'black'
        console.log(el.textContent)
        if(el.textContent === 'My Profile'){
            document.getElementsByClassName('user-maininfo')[0].style.display = 'block';
            document.getElementsByClassName('change-pass')[0].style.display = 'none'
        }
        else
        {
            document.getElementsByClassName('change-pass')[0].style.display = 'block'
            document.getElementsByClassName('user-maininfo')[0].style.display = 'none';
        }
    })
})
