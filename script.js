document.addEventListener("DOMContentLoaded", function () {
  // Header scroll effect
  const header = document.querySelector("header");
  const hamburgerMenu = document.querySelector(".hamburger-menu");
  const mainNav = document.querySelector(".main-nav");

  // Scroll event for header styling
  window.addEventListener("scroll", function () {
    if (window.scrollY > 50) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  });

  // Mobile menu toggle
  hamburgerMenu.addEventListener("click", function () {
    mainNav.classList.toggle("active");
    hamburgerMenu.classList.toggle("active");
  });

  // Close mobile menu when clicking a nav link
  const navLinks = document.querySelectorAll(".main-nav a");
  navLinks.forEach(link => {
    link.addEventListener("click", () => {
      mainNav.classList.remove("active");
      hamburgerMenu.classList.remove("active");
    });
  });

  // Testimonial slider functionality
  let testimonials = [];
  let currentTestimonial = 0;
  const testimonialContent = document.querySelector(".testimonial-content p");
  const testimonialAuthor = document.querySelector(".client-info h4");
  const testimonialLocation = document.querySelector(".client-info p");

  const prevBtn = document.querySelector(".prev-btn");
  const nextBtn = document.querySelector(".next-btn");

  // Fetch testimonials from JSON file
  fetch("testimonials.json")
    .then(response => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then(data => {
      testimonials = data;
      // Display the first testimonial after loading
      updateTestimonial();

      // Start auto rotation after data is loaded
      startAutoRotation();
    })
    .catch(error => {
      console.error("Error loading testimonials:", error);
      // Fallback testimonial in case of error
      testimonials = [
        {
          content: "Daniel provides exceptional remodeling services in Washington DC.",
          author: "Happy Customer",
          location: "Washington, DC",
          rating: 5
        }
      ];
      updateTestimonial();
    });

  // Update testimonial content
  function updateTestimonial() {
    if (testimonials.length === 0) return;

    const testimonial = testimonials[currentTestimonial];

    // Fade out effect
    testimonialContent.style.opacity = 0;
    testimonialAuthor.style.opacity = 0;
    testimonialLocation.style.opacity = 0;

    setTimeout(() => {
      testimonialContent.textContent = testimonial.content;
      testimonialAuthor.textContent = testimonial.author;
      testimonialLocation.textContent = testimonial.location;

      // Fade in effect
      testimonialContent.style.opacity = 1;
      testimonialAuthor.style.opacity = 1;
      testimonialLocation.style.opacity = 1;
    }, 300);
  }

  function startAutoRotation() {
    setInterval(() => {
      currentTestimonial = (currentTestimonial + 1) % testimonials.length;
      updateTestimonial();
    }, 10000);
  }

  prevBtn.addEventListener("click", () => {
    if (testimonials.length === 0) return;
    currentTestimonial = (currentTestimonial - 1 + testimonials.length) % testimonials.length;
    updateTestimonial();
  });

  nextBtn.addEventListener("click", () => {
    if (testimonials.length === 0) return;
    currentTestimonial = (currentTestimonial + 1) % testimonials.length;
    updateTestimonial();
  });

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();

      const target = document.querySelector(this.getAttribute("href"));
      const headerHeight = document.querySelector("header").offsetHeight;

      window.scrollTo({
        top: target.offsetTop - headerHeight,
        behavior: "smooth"
      });
    });
  });

  // Form submission
  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();

      // You would normally handle the form submission with AJAX
      // This is just a simulation
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;

      submitBtn.textContent = "Sending...";

      setTimeout(() => {
        alert("Thank you for your message! We will get back to you soon.");
        contactForm.reset();
        submitBtn.textContent = originalText;
      }, 1500);
    });
  }

  // Initialize any animations or effects
  initializeAnimations();

  function initializeAnimations() {
    // Add animation classes when scrolling into view
    const animatedElements = document.querySelectorAll(".service-box, .work-item");

    function checkScroll() {
      animatedElements.forEach(el => {
        const elementTop = el.getBoundingClientRect().top;
        const elementVisible = 150;

        if (elementTop < window.innerHeight - elementVisible) {
          el.classList.add("visible");
        }
      });
    }

    // Run once to set initial state
    checkScroll();

    // Listen for scroll events
    window.addEventListener("scroll", checkScroll);
  }
});
