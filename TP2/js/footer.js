//Componwente para el icono de flecha en los links del footer 
  class FooterArrowLinks extends HTMLElement {
    constructor() {
      super();
      // Attach a shadow DOM for encapsulation (optional but recommended)
      this.attachShadow({ mode: 'open' });
      // Initialize component's internal state or properties
    }

    connectedCallback() {
      // This method is called when the element is added to the DOM
      this.shadowRoot.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3.50004 14.9999L17.3564 6.99992M17.3564 6.99992L7.79427 4.43774M17.3564 6.99992L14.7943 16.5621" stroke="#F5F5F5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      `;
    }
  }
  customElements.define('footer-arrow-links', FooterArrowLinks);

// JavaScript for collapsible sections in the footer
  document.addEventListener("DOMContentLoaded", function () {
    const collapsibleBtn = document.querySelector(".collapsible-btn");
    const collapsibleMenu = document.querySelector(".collapsible-menu");

    collapsibleBtn.addEventListener("click", function () {
      collapsibleMenu.classList.toggle("open");
      collapsibleBtn.classList.toggle("active");
    });
  });
