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

