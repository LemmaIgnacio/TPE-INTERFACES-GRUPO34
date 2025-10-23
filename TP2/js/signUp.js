const $form = document.querySelector('.form-card form');
const $name = document.getElementById("name");
const $lastname = document.getElementById("lastname");
const $age = document.getElementById("age");
const $email = document.getElementById("email");
const $password = document.getElementById("password");
const $confirmPassword = document.getElementById("confirm-password");
const $signinLink = document.getElementById("signin-link");

// Animación y validación en el submit del formulario
if ($form) {
    $form.addEventListener("submit", (e) => {
        e.preventDefault();
        if ($name.value !== "" && $lastname.value !== "" 
            && ($age.value !== "" && $age.value > 0) && $email.value !== "" 
            && $password.value !== "" 
            && $confirmPassword.value !== "") {

                document.querySelector('.form-card').classList.add('success-animate');
                setTimeout(() => {
                    window.location.href = '../html/home.html';
                }, 800);
        }
    });
}

// Redirección al login
if ($signinLink) {
    $signinLink.addEventListener("click", (e) => {
        e.preventDefault();
        window.location.href = "LogIn.html";
    });
}

const $togglePasswordBtn = document.getElementById('toggle-password-btn');
const $toggleConfirmPasswordBtn = document.getElementById('toggle-confirm-password-btn');
const $eyeIconPassword = document.getElementById('eye-icon-password');
const $eyeIconConfirm = document.getElementById('eye-icon-confirm');
const eyeOpen = '../assets/icon/enabled_visible.svg';
const eyeClosed = '../assets/icon/disabled_visible.svg'; 

let passwordVisible = false;
let confirmPasswordVisible = false;

function updateEyeIcon($icon, visible) {
    $icon.innerHTML = `<img src="${visible ? eyeOpen : eyeClosed}" alt="ojo" style="width:24px;vertical-align:middle;">`;
}

if ($togglePasswordBtn && $password && $eyeIconPassword) {
    $togglePasswordBtn.addEventListener('click', () => {
        passwordVisible = !passwordVisible;
        $password.type = passwordVisible ? 'text' : 'password';
        updateEyeIcon($eyeIconPassword, passwordVisible);
    });
    updateEyeIcon($eyeIconPassword, false);
}

if ($toggleConfirmPasswordBtn && $confirmPassword && $eyeIconConfirm) {
    $toggleConfirmPasswordBtn.addEventListener('click', () => {
        confirmPasswordVisible = !confirmPasswordVisible;
        $confirmPassword.type = confirmPasswordVisible ? 'text' : 'password';
        updateEyeIcon($eyeIconConfirm, confirmPasswordVisible);
    });
    updateEyeIcon($eyeIconConfirm, false);
}