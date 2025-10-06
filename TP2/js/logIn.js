const $submit = document.getElementById("submit");
const $username = document.getElementById("username");
const $password = document.getElementById("password");


document.addEventListener("click", (e) => {
    if (e.target === $submit) {
        if ($username.value !== "" && $password.value !== "") {
            e.preventDefault();
            window.location.href = "home.html";
        }
    }
});



