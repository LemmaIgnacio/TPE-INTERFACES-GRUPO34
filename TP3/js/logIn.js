const $submit = document.getElementById("submit");
const $username = document.getElementById("username");
const $password = document.getElementById("password");
const $signupLink = document.getElementById("signup-link");

document.addEventListener("click", (e) => {
    if (e.target === $submit) {
        if ($username.value !== "" && $password.value !== "") {
            e.preventDefault();
            document.querySelector('.login-form').classList.add('success-animate');
            setTimeout(() => {
                window.location.href = '../html/home.html';
            }, 800);
        }
    }

    if (e.target === $signupLink) {
        e.preventDefault();
        window.location.href = "signUp.html";
    }
});



