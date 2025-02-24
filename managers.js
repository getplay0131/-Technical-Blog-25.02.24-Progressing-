// managers.js
import { CONFIG } from "./BlogCore.js";

// UI Manager
const UIManager = {
  init() {
    this.createBackToTopButton();
    this.setupHeader();
    this.setupSearch();
    this.setupQuoteRefresh();
    this.setupMobileMenu();
  },

  createBackToTopButton() {
    const backToTop = document.createElement("button");
    backToTop.className = "back-to-top";
    backToTop.innerHTML = '<i class="fas fa-arrow-up"></i>';
    backToTop.setAttribute("aria-label", "상단으로 이동");
    document.body.appendChild(backToTop);
  },

  setupHeader() {
    const header = document.querySelector(CONFIG.selectors.header);
    if (!header) return;

    let lastScroll = 0;
    window.addEventListener(
      "scroll",
      () => {
        const currentScroll = window.pageYOffset;
        header.classList.toggle("scrolled", currentScroll > 50);
        header.style.transform =
          currentScroll > lastScroll ? "translateY(-100%)" : "translateY(0)";
        lastScroll = currentScroll;
      },
      { passive: true }
    );
  },

  setupSearch() {
    const searchToggle = document.querySelector(CONFIG.selectors.searchToggle);
    const searchModal = document.querySelector(CONFIG.selectors.searchModal);
    if (!searchToggle || !searchModal) return;

    searchToggle.addEventListener("click", () => {
      searchModal.classList.toggle("active");
      const input = searchModal.querySelector("input");
      if (input && searchModal.classList.contains("active")) {
        input.focus();
      }
    });

    searchModal.addEventListener("click", (e) => {
      if (e.target === searchModal) {
        searchModal.classList.remove("active");
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && searchModal.classList.contains("active")) {
        searchModal.classList.remove("active");
      }
    });
  },

  setupQuoteRefresh() {
    const quoteContainer = document.querySelector(
      CONFIG.selectors.quoteContainer
    );
    if (!quoteContainer) return;

    const refreshBtn = document.createElement("button");
    refreshBtn.className = "quote-refresh-btn";
    refreshBtn.innerHTML = '<i class="fas fa-sync-alt"></i>';
    refreshBtn.setAttribute("aria-label", "새로운 명언 보기");
    quoteContainer.appendChild(refreshBtn);

    refreshBtn.addEventListener("click", () => {
      QuoteManager.updateQuote();
    });
  },

  setupMobileMenu() {
    const toggle = document.querySelector(".mobile-menu-toggle");
    const nav = document.querySelector(".nav-list");
    if (!toggle || !nav) return;

    toggle.addEventListener("click", () => {
      nav.classList.toggle("active");
      toggle.setAttribute(
        "aria-expanded",
        toggle.getAttribute("aria-expanded") === "true" ? "false" : "true"
      );
    });
  },
};

// Theme Manager
const ThemeManager = {
  init() {
    const toggle = document.querySelector(CONFIG.selectors.themeToggle);
    if (!toggle) return;

    const savedTheme = localStorage.getItem("theme") || "light";
    this.setTheme(savedTheme);

    toggle.addEventListener("click", () => {
      const newTheme =
        document.documentElement.dataset.theme === "dark" ? "light" : "dark";
      this.setTheme(newTheme);
    });
  },

  setTheme(theme) {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("theme", theme);
    const icon = document.querySelector(`${CONFIG.selectors.themeToggle} i`);
    if (icon) {
      icon.className = theme === "dark" ? "fas fa-sun" : "fas fa-moon";
    }
  },
};

// Scroll Manager
const ScrollManager = {
  init() {
    this.setupBackToTop();
    this.setupScrollDownButton();
    this.setupScrollPosition();
  },

  setupBackToTop() {
    const backToTop = document.querySelector(CONFIG.selectors.backToTop);
    if (!backToTop) return;

    window.addEventListener(
      "scroll",
      () => {
        backToTop.classList.toggle("visible", window.scrollY > 300);
      },
      { passive: true }
    );

    backToTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  },

  setupScrollDownButton() {
    const scrollDown = document.querySelector(".scroll-down-btn");
    if (!scrollDown) return;

    scrollDown.addEventListener("click", (e) => {
      e.preventDefault();
      const statsSection = document.querySelector("#stats-section");
      if (statsSection) {
        statsSection.scrollIntoView({ behavior: "smooth" });
      }
    });
  },

  setupScrollPosition() {
    window.addEventListener("beforeunload", () => {
      const position = window.scrollY;
      window.history.replaceState({ scrollPosition: position }, "");
    });

    window.addEventListener("popstate", () => {
      const position = window.history.state?.scrollPosition || 0;
      window.scrollTo(0, position);
    });
  },
};

// Quote Manager
const QuoteManager = {
  quotes: [
    {
      text: "문제를 해결하고 나서 코드를 작성하라.",
      originalText: "First, solve the problem. Then, write the code.",
      author: "John Johnson",
    },
    {
      text: "작동하게 만들고, 올바르게 만들고, 빠르게 만들어라.",
      originalText: "Make it work, make it right, make it fast.",
      author: "Kent Beck",
    },
    {
      text: "컴퓨터가 이해할 수 있는 코드는 어떤 바보도 작성할 수 있다. 좋은 프로그래머는 사람이 이해할 수 있는 코드를 작성한다.",
      originalText:
        "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
      author: "Martin Fowler",
    },
    {
      text: "실패는 또 다른 시도를 할 수 있는 기회다.",
      originalText:
        "Failure is an opportunity to begin again more intelligently.",
      author: "Henry Ford",
    },
    {
      text: "완벽함은 사소한 것들의 집합이 아닌, 사소한 것들이 없어질 때 달성된다.",
      originalText:
        "Perfection is achieved not when there is nothing more to add, but when there is nothing left to take away.",
      author: "Antoine de Saint-Exupery",
    },
    {
      text: "단순함이 신뢰성의 선결 조건이다.",
      originalText: "Simplicity is prerequisite for reliability.",
      author: "Edsger W. Dijkstra",
    },
    {
      text: "프로그래밍은 무엇을 아느냐가 아니라 무엇을 알아낼 수 있느냐에 대한 것이다.",
      originalText:
        "Programming isn't about what you know; it's about what you can figure out.",
      author: "Chris Pine",
    },
    {
      text: "코드 한 줄 한 줄을 예술 작품처럼 다듬어라.",
      originalText:
        "Clean code always looks like it was written by someone who cares.",
      author: "Robert C. Martin",
    },
    {
      text: "나중은 결코 오지 않는다.",
      originalText: "Later equals never.",
      author: "LeBlanc's Law",
    },
    {
      text: "복잡함 속에서 단순함을 찾아라.",
      originalText: "Seek simplicity in complexity.",
      author: "Ken Thompson",
    },
    {
      text: "좋은 코드는 좋은 문서보다 낫다.",
      originalText: "Good code is better than good documentation.",
      author: "Steve Jobs",
    },
    {
      text: "가장 좋은 버그 리포트는 수정된 코드이다.",
      originalText: "The best bug report is a pull request.",
      author: "Unknown",
    },
    {
      text: "어제보다 나은 코드를 작성하라.",
      originalText: "Write better code than yesterday.",
      author: "Anonymous",
    },
    {
      text: "코드는 시가 아닌 산문처럼 작성하라.",
      originalText: "Write code like prose.",
      author: "Yukihiro Matsumoto",
    },
    {
      text: "테스트하기 쉬운 코드가 좋은 코드다.",
      originalText: "Code that is easy to test is good code.",
      author: "Dave Thomas",
    },
  ],
  isAnimating: false,
  intervalId: null,

  init() {
    this.setupQuoteRotation();
    this.updateQuote();
  },

  setupQuoteRotation() {
    const quoteContainer = document.querySelector(
      CONFIG.selectors.quoteContainer
    );
    if (!quoteContainer) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.startRotation();
          } else {
            this.stopRotation();
          }
        });
      },
      { threshold: 0.5 }
    );

    observer.observe(quoteContainer);
  },

  startRotation() {
    this.stopRotation();
    this.intervalId = setInterval(() => {
      if (!this.isAnimating) {
        this.updateQuote();
      }
    }, 5000);
  },

  stopRotation() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  },

  updateQuote() {
    if (this.isAnimating) return;

    const quoteContainer = document.querySelector(
      CONFIG.selectors.quoteContainer
    );
    if (!quoteContainer) return;

    this.isAnimating = true;
    const quote = this.quotes[Math.floor(Math.random() * this.quotes.length)];

    quoteContainer.classList.add("fade-out");

    setTimeout(() => {
      quoteContainer.innerHTML = `
       <p class="quote-text">${quote.text}</p>
       <p class="quote-original">(${quote.originalText})</p>
       <p class="quote-author">- ${quote.author}</p>
     `;

      quoteContainer.classList.remove("fade-out");
      quoteContainer.classList.add("fade-in");

      setTimeout(() => {
        this.isAnimating = false;
      }, 500);
    }, 500);
  },
};

// Data Manager
const DataManager = {
  init() {
    this.initializeStats();
    this.handleTistoryVariables();
  },

  initializeStats() {
    document
      .querySelectorAll(CONFIG.selectors.statsNumbers)
      .forEach((element) => {
        const count = parseInt(element.dataset.count);
        if (!isNaN(count)) {
          this.animateNumber(element, count);
        }
      });
  },

  animateNumber(element, target) {
    let current = 0;
    const duration = 2000;
    const steps = 60;
    const increment = target / steps;

    const animate = () => {
      current += increment;
      if (current <= target) {
        element.textContent = Math.floor(current).toLocaleString();
        requestAnimationFrame(animate);
      } else {
        element.textContent = target.toLocaleString();
      }
    };

    animate();
  },

  handleTistoryVariables() {
    // 티스토리 변수 처리 로직
    this.processTistoryVariables();
  },

  processTistoryVariables() {
    const postsGrid = document.querySelector(".posts-grid");
    if (postsGrid && postsGrid.textContent.includes("[##_")) {
      // 티스토리 변수가 처리될 때까지 대기
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (!mutation.target.textContent.includes("[##_")) {
            observer.disconnect();
            this.setupPostsGrid(postsGrid);
          }
        });
      });

      observer.observe(postsGrid, {
        childList: true,
        subtree: true,
        characterData: true,
      });
    }
  },
};

export const managers = {
  ui: UIManager,
  theme: ThemeManager,
  scroll: ScrollManager,
  quote: QuoteManager,
  data: DataManager,
};
