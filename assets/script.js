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

  // Load and display services from JSON
  const servicesPromise = loadServices();

  // Load and display projects from JSON
  const projectsPromise = loadProjects();

  // Initialize animations after all content is loaded
  Promise.allSettled([servicesPromise, projectsPromise]).then(() => {
    initializeAnimations();
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
  fetch("../content/testimonials.json")
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

  // Function to load services
  function loadServices() {
    const servicesGrid = document.querySelector(".services-grid");
    if (!servicesGrid) return Promise.resolve(); // Resolve if grid not found

    const loadingIndicator = servicesGrid.querySelector(".loading-indicator");

    return fetch("../content/services.json")
      .then(response => {
        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.statusText}`);
        }
        return response.json();
      })
      .then(services => {
        if (loadingIndicator) loadingIndicator.remove(); // Remove loading indicator

        if (!services || services.length === 0) {
          servicesGrid.innerHTML = "<p>No services to display at the moment.</p>";
          return;
        }

        // Clear existing content except loading indicator if it was already removed
        servicesGrid.innerHTML = "";

        services.forEach(service => {
          const serviceBox = document.createElement("div");
          serviceBox.className = "service-box";
          serviceBox.dataset.id = service.id;

          serviceBox.innerHTML = `
            <div class="service-icon">
              <i class="fas ${service.icon}"></i>
            </div>
            <h3>${service.title}</h3>
            <p>${service.description}</p>
          `;

          servicesGrid.appendChild(serviceBox);
        });

        // Note: initializeAnimations will be called globally after all promises settle
      })
      .catch(error => {
        console.error("Error loading services:", error);
        if (loadingIndicator) loadingIndicator.remove();
        servicesGrid.innerHTML = "<p>Unable to load services. Please try again later.</p>";
      });
  }

  // Function to load projects
  function loadProjects() {
    const workGrid = document.querySelector(".work-grid");
    const portfolioFilterContainer = document.querySelector(".portfolio-filter"); // Get the container for filter buttons
    if (!workGrid || !portfolioFilterContainer) return Promise.resolve();

    const loadingIndicator = workGrid.querySelector(".loading-indicator");

    return fetch("../content/projects.json")
      .then(response => {
        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.statusText}`);
        }
        return response.json();
      })
      .then(projects => {
        if (loadingIndicator) loadingIndicator.remove();

        if (!projects || projects.length === 0) {
          workGrid.innerHTML = "<p>No projects to display at the moment.</p>";
          portfolioFilterContainer.innerHTML = ""; // Clear any existing buttons if no projects
          return;
        }

        workGrid.innerHTML = "";
        projects.forEach(project => {
          const workItem = document.createElement("div");
          workItem.className = "work-item";
          workItem.dataset.category = project.category;

          workItem.innerHTML = `
            <img src="${project.imageUrl}" alt="${project.title}">
            <div class="work-overlay">
              <h3>${project.title}</h3>
              <p>${project.description}</p>
            </div>
          `;
          workGrid.appendChild(workItem);
        });

        // Dynamically create filter buttons
        const categories = ["all", ...new Set(projects.map(p => p.category))];
        portfolioFilterContainer.innerHTML = ""; // Clear existing static buttons

        categories.forEach(category => {
          const button = document.createElement("button");
          button.className = "filter-btn";
          button.dataset.filter = category;
          button.textContent = category.charAt(0).toUpperCase() + category.slice(1);
          if (category === "all") {
            button.classList.add("active"); // Set 'All' as active by default
          }
          portfolioFilterContainer.appendChild(button);
        });

        // Add project filtering functionality AFTER buttons are created
        setupProjectFiltering(portfolioFilterContainer.querySelectorAll(".filter-btn"));
      })
      .catch(error => {
        console.error("Error loading projects:", error);
        if (loadingIndicator) loadingIndicator.remove();
        workGrid.innerHTML = "<p>Unable to load projects. Please try again later.</p>";
        portfolioFilterContainer.innerHTML = ""; // Clear buttons on error too
      });
  }

  // Setup project filtering
  function setupProjectFiltering(filterButtons) {
    // Accept filterButtons as an argument
    if (!filterButtons || filterButtons.length === 0) return;

    filterButtons.forEach(button => {
      button.addEventListener("click", () => {
        // Remove active class from all buttons
        filterButtons.forEach(btn => btn.classList.remove("active"));

        // Add active class to clicked button
        button.classList.add("active");

        const filterValue = button.getAttribute("data-filter");
        const workItems = document.querySelectorAll(".work-item");

        workItems.forEach(item => {
          if (filterValue === "all" || item.dataset.category === filterValue) {
            item.style.display = "block";
          } else {
            item.style.display = "none";
          }
        });
      });
    });
  }

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
  // Refactored to be called once after content loads and to attach a single scroll listener
  let scrollListenerAttached = false;

  function initializeAnimations() {
    // Function to check if elements are in view and add 'visible' class
    function checkScrollAndAnimate() {
      const animatedElements = document.querySelectorAll(".service-box:not(.visible), .work-item:not(.visible)");
      animatedElements.forEach(el => {
        const elementTop = el.getBoundingClientRect().top;
        const elementVisibleThreshold = 150; // How much of the element should be visible to trigger animation

        if (elementTop < window.innerHeight - elementVisibleThreshold) {
          el.classList.add("visible");
        }
      });
    }

    // Run once to set initial state for any elements already in view
    checkScrollAndAnimate();

    // Attach scroll listener only once
    if (!scrollListenerAttached) {
      window.addEventListener("scroll", checkScrollAndAnimate);
      scrollListenerAttached = true;
    }
  }

  // Initial animation setup is now handled by Promise.allSettled after content loading
});
