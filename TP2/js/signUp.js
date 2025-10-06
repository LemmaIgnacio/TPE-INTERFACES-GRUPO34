const $submit = document.getElementById("submit");
const $name = document.getElementById("name");
const $lastname = document.getElementById("lastname");
const $age = document.getElementById("age");
const $email = document.getElementById("email");
const $password = document.getElementById("password");
const $confirmPassword = document.getElementById("confirm-password");
const $signinLink = document.getElementById("signin-link");

document.addEventListener("click", (e) => {
    if (e.target === $submit) {
        if ($name.value !== "" && $lastname.value !== "" 
            && $age.value !== "" && $email.value !== "" 
            && $password.value !== "" 
            && $confirmPassword.value !== "" 
            && $confirmPassword.value !== "") {

            e.preventDefault();
            window.location.href = "home.html";
        }
    }

    if (e.target === $signinLink) {
        e.preventDefault();
        window.location.href = "LogIn.html";
    }
});

