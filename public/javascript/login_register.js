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
        document.getElementById('textContent').textContent = "Hello, Friend";
        document.getElementById('textMore').textContent = "Click arrow to Register";
        document.getElementById('next').style.display = 'none';
        document.getElementById('pre').style.display = 'block';
    }
    else if(option === -1)
    {
        changeFunc.style.left = 0 + "%";
        document.getElementById('textContent').textContent = "Welcome To My Website";
        document.getElementById('textMore').textContent = "Click arrow to Login";
        document.getElementById('pre').style.display = 'none';
        document.getElementById('next').style.display = 'block';
    }
}

// show or hide password
const showEye = document.getElementsByClassName('fa-eye');
const hideEye = document.getElementsByClassName('fa-eye-slash');
function showPassword(idname, id){
    var type = "password";
    
    if(showEye[id].style.display == 'block')
    {     
        showEye[id].style.display = 'none';
        hideEye[id].style.display = 'block';
        type = "password";
    }
    else
    {
        hideEye[id].style.display = 'none';
        showEye[id].style.display = 'block';
        type = "text";
    }
    document.getElementById(idname).type = type;
}

// validation login
const emailLogin = document.getElementById('email');
const passwordLogin = document.getElementById('password');
const formEmail = /^[a-zA-Z0-9*!-=+]+@gmail.com$/;
function validationLogin(){
    //check email
    if(emailLogin.value == ''){
        document.querySelector('.email').style.display = 'block';
        document.querySelector('.email').textContent = 'Email connot be empty';
    }
    else if(!formEmail.test(emailLogin.value)){
        document.querySelector('.email').style.display = 'block';
        document.querySelector('.email').textContent = 'Email is not correct format';
    }
    else{
        document.querySelector('.email').style.display = 'none' ;
    }

    //check password
    if((passwordLogin.value).length < 8)
    {
        document.querySelector('.password').style.display = 'block';
        document.querySelector('.password').textContent = 'Minimum character requirement not met';
    }
    else{
        document.querySelector('.password').style.display = 'none';
    }
}

//validation register
const fullNameResgister = document.getElementById('fullName');
const emailRegister = document.getElementById('registerEmail');
const phoneNumber = document.getElementById('phoneNumber');
const passwordRegister = document.getElementById('registerPassword');
function validationRegister(){
    //fullname
    if(fullNameResgister.value == '')
    {
        document.querySelector('.fullName').style.display = 'block';
        document.querySelector('.fullName').textContent = 'Name connot be empty';
    }
    else{
        document.querySelector('.fullName').style.display = 'none'
    }
    //check email
    if(emailRegister.value == ''){
        document.querySelector('.registerEmail').style.display = 'block';
        document.querySelector('.registerEmail').textContent = 'Email connot be empty';
    }
    else if(!formEmail.test(emailRegister.value)){
        document.querySelector('.registerEmail').style.display = 'block';
        document.querySelector('.registerEmail').textContent = 'Email is not correct format';
    }
    else{
        document.querySelector('.registerEmail').style.display = 'none' ;
    }

    //check phone
    if(phoneNumber.value.length < 10 || phoneNumber.value.length > 11){
        document.querySelector('.phoneNumber').style.display = 'block';
        document.querySelector('.phoneNumber').textContent = 'Phone number is not valid';
    }
    else{
        document.querySelector('.phoneNumber').style.display = 'none';
    }

    //check password
    if((passwordLogin.value).length < 8)
    {
        document.querySelector('.registerPassword').style.display = 'block';
        document.querySelector('.registerPassword').textContent = 'Minimum character requirement not met';
    }
    else{
        document.querySelector('.registerPassword').style.display = 'none';
    }
}