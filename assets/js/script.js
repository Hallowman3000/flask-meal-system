// Homepage hero carousel interactions.
(function initHeroCarousel() {
  const carousel = document.querySelector('.hero-carousel');
  if (!carousel) return;

  const slides = Array.from(carousel.querySelectorAll('.hero-slide'));
  const dots = Array.from(carousel.querySelectorAll('.hero-dot'));
  if (!slides.length) return;

  let current = 0;
  let timer;

  const setActiveSlide = (index) => {
    current = (index + slides.length) % slides.length;

    slides.forEach((slide, i) => {
      const active = i === current;
      slide.classList.toggle('is-active', active);
      slide.setAttribute('aria-hidden', String(!active));
    });

    dots.forEach((dot, i) => {
      dot.classList.toggle('is-active', i === current);
    });
  };

  const startAutoSlide = () => {
    timer = window.setInterval(() => {
      setActiveSlide(current + 1);
    }, 4000);
  };

  const resetAutoSlide = () => {
    window.clearInterval(timer);
    startAutoSlide();
  };

  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      setActiveSlide(index);
      resetAutoSlide();
    });
  });

  setActiveSlide(0);
  startAutoSlide();
})();
