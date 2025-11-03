const $submit = document.getElementById("submit");
const $username = document.getElementById("username");
const $password = document.getElementById("password");
const $signupLink = document.getElementById("signup-link");
const $togglePasswordBtn = document.getElementById("togglePassword");
const $eyeIcon = document.getElementById("eye-icon-login");
const eyeOpen = '../assets/icon/enabled_visible.svg';
const eyeClosed = '../assets/icon/disabled_visible.svg';
let passwordVisible = false;

if ($togglePasswordBtn && $password && $eyeIcon) {
    $togglePasswordBtn.addEventListener('click', () => {
        passwordVisible = !passwordVisible;
        $password.type = passwordVisible ? 'text' : 'password';
        $eyeIcon.src = passwordVisible ? eyeOpen : eyeClosed;
    });
    $eyeIcon.src = eyeClosed;
}

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



