/* ====== CONFIG ======
 Replace PUBLIC_KEY with your Paystack public key (test key first)
 Example test public key: pk_test_xxxxxxxxxxxxx
 ===================== */
const PAYSTACK_PUBLIC_KEY = 'YOUR_PAYSTACK_PUBLIC_KEY'; // <-- REPLACE WITH YOUR KEY

document.addEventListener('DOMContentLoaded', () => {
  // Set current year in footer
  document.getElementById('year').textContent = new Date().getFullYear();

  // Handle image loading
  document.querySelectorAll('img').forEach(img => {
    if (img.complete) {
      img.classList.add('loaded');
    } else {
      img.addEventListener('load', () => {
        img.classList.add('loaded');
      });
      img.addEventListener('error', () => {
        console.warn('Failed to load image:', img.src);
        img.classList.add('loaded'); // Still show with fallback styling
      });
    }
  });

  // Hamburger menu toggle
  const hamburger = document.getElementById('hamburger');
  const navbar = document.getElementById('navbar');
  
  hamburger.addEventListener('click', () => {
    navbar.classList.toggle('open');
  });

  // Close mobile menu when clicking on a link
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      navbar.classList.remove('open');
    });
  });

  // Smooth scrolling for navigation links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // Gallery carousel
  const galleryTrack = document.querySelector('.gallery-track');
  const gallerySlides = document.querySelectorAll('.gallery-slide');
  let galleryIndex = 0;

  function updateGalleryCarousel() {
    if (gallerySlides.length === 0) return;
    const slideWidth = gallerySlides[0].getBoundingClientRect().width + 16;
    galleryTrack.style.transform = `translateX(-${galleryIndex * slideWidth}px)`;
  }

  // Gallery carousel controls
  document.querySelectorAll('#galleryCarousel .carousel-arrow').forEach(btn => {
    btn.addEventListener('click', () => {
      const direction = btn.dataset.dir;
      if (direction === 'next') {
        galleryIndex = (galleryIndex + 1) % gallerySlides.length;
      } else if (direction === 'prev') {
        galleryIndex = galleryIndex === 0 ? gallerySlides.length - 1 : galleryIndex - 1;
      }
      updateGalleryCarousel();
    });
  });

  // Auto-play gallery carousel
  setInterval(() => {
    if (gallerySlides.length > 0) {
      galleryIndex = (galleryIndex + 1) % gallerySlides.length;
      updateGalleryCarousel();
    }
  }, 4000);

  // Gallery lightbox
  document.querySelectorAll('.gallery-slide img').forEach(img => {
    img.addEventListener('click', () => {
      const overlay = document.createElement('div');
      overlay.style.cssText = `
        position: fixed;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        cursor: pointer;
      `;
      
      const bigImg = document.createElement('img');
      bigImg.src = img.src;
      bigImg.style.cssText = `
        max-width: 95%;
        max-height: 95%;
        border-radius: 8px;
      `;
      
      overlay.appendChild(bigImg);
      overlay.addEventListener('click', () => document.body.removeChild(overlay));
      document.body.appendChild(overlay);
    });
  });

  // Contact form handling
  const contactForm = document.getElementById('contactForm');
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Get form data
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;
    
    // Simple validation
    if (!name || !email || !message) {
      alert('Please fill in all fields.');
      return;
    }
    
    // Simulate form submission
    alert(`Thanks ${name}! Your message has been received. We will get back to you at ${email}.`);
    contactForm.reset();
  });

  // Payment button handlers
  document.querySelectorAll('.pay-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const amountKES = btn.dataset.amount;
      const plan = btn.dataset.plan || 'Ticket';
      
      startPaystackPayment({
        amount: Math.round(Number(amountKES) * 100), // Convert to kobo (cents)
        metadata: { plan }
      });
    });
  });

  // Carousel functionality
  const track = document.querySelector('.carousel-track');
  const slides = document.querySelectorAll('.slide');
  let currentIndex = 0;

  function updateCarousel() {
    if (slides.length === 0) return;
    
    const slideWidth = slides[0].getBoundingClientRect().width + 16; // Include gap
    track.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
  }

  // Carousel arrow controls
  document.querySelectorAll('.carousel-arrow').forEach(btn => {
    btn.addEventListener('click', () => {
      const direction = btn.dataset.dir;
      
      if (direction === 'next') {
        currentIndex = (currentIndex + 1) % slides.length;
      } else if (direction === 'prev') {
        currentIndex = currentIndex === 0 ? slides.length - 1 : currentIndex - 1;
      }
      
      updateCarousel();
    });
  });

  // Auto-play carousel every 5 seconds
  setInterval(() => {
    if (slides.length > 0) {
      currentIndex = (currentIndex + 1) % slides.length;
      updateCarousel();
    }
  }, 5000);

  // Update carousels on window resize
  window.addEventListener('resize', () => {
    updateCarousel();
    updateGalleryCarousel();
  });
  
  // Initial carousel setup
  updateCarousel();
  updateGalleryCarousel();
});

/* ===== PAYSTACK PAYMENT FLOW =====
  This handles the client-side payment with Paystack
  Remember to verify payments server-side for security
*/
function startPaystackPayment({ amount = 200000, metadata = {} } = {}) {
  // Check if Paystack key is configured
  if (!PAYSTACK_PUBLIC_KEY || PAYSTACK_PUBLIC_KEY.includes('YOUR_PAYSTACK_PUBLIC_KEY')) {
    alert('Please configure your Paystack public key in script.js before testing payments.');
    return;
  }

  // Get customer email
  const email = prompt('Please enter your email for the ticket receipt:', 'customer@example.com') || 'customer@example.com';
  
  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    alert('Please enter a valid email address.');
    return;
  }

  // Initialize Paystack payment
  const handler = window.PaystackPop.setup({
    key: PAYSTACK_PUBLIC_KEY,
    email: email,
    amount: amount, // Amount in kobo (100 kobo = 1 KES)
    currency: 'KES',
    metadata: {
      custom_fields: [
        {
          display_name: "Package",
          variable_name: "package",
          value: metadata.plan || 'Ticket'
        }
      ]
    },
    callback: function(response) {
      // Payment successful
      console.log('Payment Success:', response);
      
      alert(`Payment successful! 
Reference: ${response.reference}
Package: ${metadata.plan}

Please save this reference number for your records.
You will receive a confirmation email shortly.`);
      
      // TODO: Send reference to your server to verify payment
      // Example: verifyPayment(response.reference);
    },
    onClose: function() {
      console.log('Payment window closed');
      alert('Payment window was closed. No payment was made.');
    }
  });
  
  handler.openIframe();
}

/* ===== PAYMENT VERIFICATION (Optional) =====
  Uncomment and modify this function to verify payments on your server
*/
/*
async function verifyPayment(reference) {
  try {
    const response = await fetch(`/verify-payment/${reference}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    const result = await response.json();
    
    if (result.success) {
      console.log('Payment verified successfully');
      // Handle successful verification
    } else {
      console.error('Payment verification failed');
      // Handle verification failure
    }
  } catch (error) {
    console.error('Error verifying payment:', error);
  }
}
*/