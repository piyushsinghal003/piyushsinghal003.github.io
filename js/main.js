const header = document.querySelector(".nav");
const toggle = document.querySelector(".menu-toggle");
const links = document.querySelector(".nav-links");

const closeMenu = () => {
  if (!links || !toggle) return;
  links.classList.remove("open");
  toggle.setAttribute("aria-expanded", "false");
};

if (toggle && links) {
  toggle.addEventListener("click", (event) => {
    event.stopPropagation();
    const open = links.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
  });

  links.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("click", (event) => {
    if (!links.classList.contains("open")) return;
    if (links.contains(event.target) || toggle.contains(event.target)) return;
    closeMenu();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });
}

if (header) {
  const onScroll = () => {
    header.classList.toggle("is-scrolled", window.scrollY > 8);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}

const sectionNavLinks = document.querySelectorAll('.nav-links a[href^="#"]');
const trackedSections = [...sectionNavLinks]
  .map((link) => {
    const id = link.getAttribute("href")?.slice(1);
    const section = id ? document.getElementById(id) : null;
    return section ? { id, section, link } : null;
  })
  .filter(Boolean);

if (trackedSections.length) {
  const setActive = (id) => {
    sectionNavLinks.forEach((link) => {
      const active = link.getAttribute("href") === `#${id}`;
      link.classList.toggle("is-active", active);
      if (active) {
        link.setAttribute("aria-current", "true");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  };

  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
      if (visible[0]?.target.id) {
        setActive(visible[0].target.id);
      }
    },
    { rootMargin: "-40% 0px -45% 0px", threshold: [0, 0.2, 0.45, 0.7] }
  );

  trackedSections.forEach(({ section }) => observer.observe(section));
}
