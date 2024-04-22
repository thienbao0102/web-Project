//khai bao bien
fixedBox = document.getElementById("fixedBox");
const changeFunc = document.getElementById('change');
const showEye = document.getElementsByClassName('fa-eye');//hien mk
const hideEye = document.getElementsByClassName('fa-eye-slash');//an mk
const emailLogin = document.getElementById('email');//email login
const passwordLogin = document.getElementById('password');//password dnh nhap
const formEmail = /^[a-zA-Z0-9*!_/.$-=+]+@gmail.com$/;//form check email
const fullNameResgister = document.getElementById('fullName');//fullname register
const emailRegister = document.getElementById('registerEmail');//email register
const phoneNumber = document.getElementById('phoneNumber');//phone number register
const passwordRegister = document.getElementById('registerPassword');//password register

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
function validationLogin(){
    //check email
    if(emailLogin.value == ''){
        document.querySelector('.email').style.display = 'block';
        document.querySelector('.email').textContent = 'Email connot be empty';
        return;
    }
    else if(!formEmail.test(emailLogin.value)){
        document.querySelector('.email').style.display = 'block';
        document.querySelector('.email').textContent = 'Email is not correct format';
        return;
    }
    else{
        document.querySelector('.email').style.display = 'none' ;
    }

    //check password
    if((passwordLogin.value).length < 8)
    {
        document.querySelector('.password').style.display = 'block';
        document.querySelector('.password').textContent = 'Minimum character requirement not met';
        return;
    }
    else{
        document.querySelector('.password').style.display = 'none';
    }
    return true;
}

//validation register
function validationRegister(){
    //fullname
    if(fullNameResgister.value == '')
    {
        document.querySelector('.fullName').style.display = 'block';
        document.querySelector('.fullName').textContent = 'Name connot be empty';
        return;
    }
    else{
        document.querySelector('.fullName').style.display = 'none'
    }
    //check email
    if(emailRegister.value == ''){
        document.querySelector('.registerEmail').style.display = 'block';
        document.querySelector('.registerEmail').textContent = 'Email connot be empty';
        return;
    }
    else if(!formEmail.test(emailRegister.value)){
        document.querySelector('.registerEmail').style.display = 'block';
        document.querySelector('.registerEmail').textContent = 'Email is not correct format';
        return;
    }
    else{
        document.querySelector('.registerEmail').style.display = 'none' ;
    }

    //check phone
    if(phoneNumber.value.length < 10 || phoneNumber.value.length > 11){
        document.querySelector('.phoneNumber').style.display = 'block';
        document.querySelector('.phoneNumber').textContent = 'Phone number is not valid';
        return;
    }
    else{
        document.querySelector('.phoneNumber').style.display = 'none';
    }

    //check password
    if((passwordRegister.value).length < 8)
    {
        document.querySelector('.registerPassword').style.display = 'block';
        document.querySelector('.registerPassword').textContent = 'Minimum character requirement not met';
        return;
    }
    else{
        document.querySelector('.registerPassword').style.display = 'none';
    }
    return true;
}

//dang nhap
function Login(){
    if(validationLogin() != true){
        return;
    }
    const dataLogin ={
        email: emailLogin.value,
        password: passwordLogin.value
    }

    fetch('/api/login', {
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
            alert("Login success user")
            localStorage.setItem('_id',data.dt,);
            localStorage.setItem('role','isUser');
        }
        else if(data.st == 1){
            alert("Login success admin")
            localStorage.setItem('_id',data.dt);
            localStorage.setItem('role', 'isAdmin');
        }
        else if(data.st == 2)
        {
            alert("No Account")
        }
        else{
            alert("Login Failed")
        }
    })
    .catch
    {
        console.log("err: " + Error);
    }
}

//Sign up
function SignUp(){
    if(validationRegister() != true){
        return;
    }
    const gender = document.getElementById('male').value;
    if(document.getElementById('famale').checked){
        gender = document.getElementById('male').value;
    }

    console.log("gender: " +gender);
    const dataSignUp ={
        'name': fullNameResgister.value,
        'email': emailRegister.value,
        'gender':gender,
        'phone': phoneNumber.value,
        'password':passwordRegister.value
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
            alert("Register success!");
        }
        else{
            alert("Register Failed!");
        }
    })
}

// check user đã đăng nhập hay chưa
const redireRoute = document.querySelector('.redirtUser');
function checkUserSignIn(){
    const checkSignin = localStorage.getItem('_id');
    console.log("Checksignin: " + checkSignin);
    if(checkSignin == null){
        redireRoute.textContent = 'Login';
        return;
    }
    redireRoute.textContent = 'My Info';
    accessManagement();
}

//xu ly su kien chuyen huong (khi chua dang nhap va khi da danh nhap)
function redirectRouter(){
    if(redireRoute.textContent == 'Login & SignUp'){
        window.location.href = '/login_orregister';
    }
    else if(redireRoute.textContent == 'My Info'){
        window.location.href = '/myinfo';
    }
}

//admin truy cap vao trang quan ly
const allowAccess = document.querySelector('.isAdmin');
function accessManagement(){
    const roleUser = localStorage.getItem('role');
    console.log(roleUser)
    if(roleUser == 'isAdmin'){
        allowAccess.style.display = 'block';
        return;
    }
    allowAccess.style.display = 'none';
}