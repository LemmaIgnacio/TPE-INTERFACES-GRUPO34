document.addEventListener('DOMContentLoaded', () => {
  const togglePassword = document.getElementById('togglePassword');
  const passwordInput = document.getElementById('password');

  togglePassword.addEventListener('click', () => {
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
    togglePassword.src = type === 'password' ? 'placeholder-eye.png' : 'placeholder-eye-off.png';
  });

  document.getElementById('loginForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = passwordInput.value;
    console.log('Username:', username);
    console.log('Password:', password);
    // TODO: Implement actual sign-in logic
  });

  document.querySelectorAll('.social-icons img').forEach((icon) => {
    icon.addEventListener('click', () => {
      const provider = icon.alt;
      console.log(`Logging in with ${provider}`);
      // TODO: Implement social login for each provider
    });
  });
});