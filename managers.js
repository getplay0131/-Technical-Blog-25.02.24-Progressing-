// managers.js
import { CONFIG } from "./BlogCore.js";

// ====================
// UI Manager
// ====================

const UIManager = {
  init() {
    console.log("UI Manager initializing...");

    // DOM이 완전히 로드된 후 실행
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => {
        this.setupAllComponents();
      });
    } else {
      this.setupAllComponents();
    }
  },

  setupAllComponents() {
    // 순서 주의 - 애니메이션 스타일 먼저 설정
    managers.animation.addAnimationStyles();

    // 그 다음 컴포넌트 추가
    this.createBackToTopButton();
    this.setupHeader();
    this.setupSearch();
    this.setupMobileMenu();

    // 스크롤 다운 버튼 설정
    this.setupScrollDownButton();

    // 명언 새로고침 버튼은 마지막에 설정
    // 약간의 지연을 두어 DOM 요소가 확실히 준비되도록 함
    setTimeout(() => {
      this.setupQuoteRefresh();
    }, 100);
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

  // UIManager의 setupQuoteRefresh 메서드 수정
  setupQuoteRefresh() {
    console.log("Setting up quote refresh button");

    // 버튼을 'I LOVE WHAT I DO' 뱃지 옆에 배치
    const heroBadge = document.querySelector(".hero-badge");
    if (!heroBadge) {
      console.error("Hero badge not found");
      return;
    }

    // 기존 버튼 제거 (중복 방지)
    const existingBtn = document.querySelector("#quote-refresh-button");
    if (existingBtn) existingBtn.remove();

    // 새 버튼 생성
    const refreshBtn = document.createElement("button");
    refreshBtn.id = "quote-refresh-button";
    refreshBtn.innerHTML = '<i class="fas fa-sync-alt"></i>';
    refreshBtn.style.cssText = `
    width: 36px;
    height: 36px;
    background-color: rgba(255, 255, 255, 0.15);
    border: none;
    border-radius: 50%;
    color: white;
    font-size: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s ease;
    margin-left: 10px;
  `;

    // 버튼을 뱃지와 같은 라인에 배치하기 위한 컨테이너
    const badgeContainer = document.createElement("div");
    badgeContainer.style.cssText = `
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: var(--space-lg, 1.5rem);
  `;

    // 부모 요소에서 뱃지 제거하고 컨테이너에 추가
    const badgeParent = heroBadge.parentNode;
    badgeParent.removeChild(heroBadge);

    badgeContainer.appendChild(heroBadge);
    badgeContainer.appendChild(refreshBtn);

    // 컨테이너를 원래 위치에 삽입
    badgeParent.insertBefore(badgeContainer, badgeParent.firstChild);

    // 이벤트 리스너
    refreshBtn.addEventListener("click", () => {
      refreshBtn.style.animation = "rotating 1s linear";
      managers.quote.updateQuote();
      setTimeout(() => {
        refreshBtn.style.animation = "";
      }, 1000);
    });

    // 호버 효과
    refreshBtn.addEventListener("mouseenter", () => {
      refreshBtn.style.backgroundColor = "rgba(255, 255, 255, 0.3)";
      refreshBtn.style.transform = "scale(1.1)";
    });

    refreshBtn.addEventListener("mouseleave", () => {
      refreshBtn.style.backgroundColor = "rgba(255, 255, 255, 0.15)";
      refreshBtn.style.transform = "scale(1)";
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

  setupScrollDownButton() {
    console.log("Setting up scroll down button");

    const scrollDownBtn = document.querySelector(".scroll-down-btn");
    if (!scrollDownBtn) {
      console.error("Scroll down button not found");
      return;
    }

    // 더 세련된 디자인
    scrollDownBtn.innerHTML = `
    <span class="scroll-icon" style="
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 8px;
    ">
      <i class="fas fa-chevron-down"></i>
    </span>
    <span class="scroll-text" style="
      font-weight: 500;
      font-size: 14px;
      letter-spacing: 0.5px;
    ">Explore More</span>
  `;

    // 버튼 전체 스타일 적용
    scrollDownBtn.style.cssText = `
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 12px 24px;
    background-color: rgba(255, 255, 255, 0.1);
    color: white;
    border-radius: 50px;
    text-decoration: none;
    cursor: pointer;
    transition: all 0.3s ease;
    animation: bounce 2s infinite;
    backdrop-filter: blur(8px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  `;

    // 호버 효과
    scrollDownBtn.addEventListener("mouseenter", () => {
      scrollDownBtn.style.backgroundColor = "rgba(255, 255, 255, 0.2)";
      scrollDownBtn.style.transform = "translateY(5px)";
      scrollDownBtn.style.boxShadow = "0 6px 15px rgba(0, 0, 0, 0.25)";
    });

    scrollDownBtn.addEventListener("mouseleave", () => {
      scrollDownBtn.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
      scrollDownBtn.style.transform = "translateY(0)";
      scrollDownBtn.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.15)";
    });
  },
};

// ====================
// Animation Manager
// ====================
const AnimationManager = {
  init() {
    this.setupTypingEffect();
    this.addAnimationStyles();
    this.setupStatsCards();
  },

  addAnimationStyles() {
    // 기존 스타일 요소 제거 (중복 방지)
    const existingStyle = document.getElementById("blog-animations");
    if (existingStyle) existingStyle.remove();

    const style = document.createElement("style");
    style.textContent = `
      @keyframes bounce {
        0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
        40% { transform: translateY(-10px); }
        60% { transform: translateY(-5px); }
      }
      
      @keyframes rotating {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
      
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
      }
      
      @keyframes fadeOut {
        from { opacity: 1; transform: translateY(0); }
        to { opacity: 0; transform: translateY(-20px); }
      }
      
      .fade-in {
        animation: fadeIn 0.5s ease forwards;
      }
      
      .fade-out {
        animation: fadeOut 0.5s ease forwards;
      }
      
      .rotating {
        animation: rotating 1s linear infinite;
      }
      
      .quote-refresh-btn {
        position: absolute;
        right: 10px;
        top: 10px;
        width: 36px;
        height: 36px;
        background-color: rgba(255, 255, 255, 0.2);
        border: none;
        border-radius: 50%;
        color: white;
        font-size: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.3s ease;
        z-index: 10;
        opacity: 0.8;
      }
      
      .quote-refresh-btn:hover {
        background-color: rgba(255, 255, 255, 0.3);
        transform: scale(1.1);
        opacity: 1;
      }
    `;
    document.head.appendChild(style);
  },

  setupTypingEffect() {
    const element = document.querySelector(".typing-text");
    if (!element) return;

    // 다양한 프로그래밍 언어
    const languages = [
      "JavaScript",
      "Python",
      "Java",
      "TypeScript",
      "Kotlin",
      "Go",
      "Rust",
      "Swift",
    ];

    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let isWaiting = false;

    // 더 부드러운 타이핑 효과
    const type = () => {
      const currentWord = languages[wordIndex];

      if (isWaiting) {
        setTimeout(type, 1500);
        isWaiting = false;
        return;
      }

      // 지우는 중
      if (isDeleting) {
        element.textContent = currentWord.substring(0, charIndex - 1);
        charIndex--;
        setTimeout(type, 50); // 더 빠르게 지움
      }
      // 타이핑 중
      else {
        element.textContent = currentWord.substring(0, charIndex + 1);
        charIndex++;

        // 타이핑 속도 변화 (자연스러운 느낌)
        const typeSpeed = Math.random() * 50 + 100;
        setTimeout(type, typeSpeed);
      }

      // 단어 완성
      if (!isDeleting && charIndex === currentWord.length) {
        isWaiting = true;
        isDeleting = true;
        return;
      }

      // 단어 삭제 완료
      if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % languages.length;
      }
    };

    // 커서 효과 추가
    const styleEl = document.createElement("style");
    styleEl.textContent = `
    .typing-text {
      position: relative;
      color: #64b5f6;
      font-weight: 500;
    }
    
    .typing-text::after {
      content: '|';
      position: absolute;
      right: -4px;
      color: #64b5f6;
      animation: blink 0.7s infinite;
    }
    
    @keyframes blink {
      0%, 100% { opacity: 1; }
      50% { opacity: 0; }
    }
  `;
    document.head.appendChild(styleEl);

    type();
  },

  animateRotation(element) {
    element.classList.add("rotating");
    setTimeout(() => {
      element.classList.remove("rotating");
    }, 1000);
  },

  setupStatsCards() {
    const statsCards = document.querySelectorAll(".stats-card");
    if (!statsCards.length) return;

    statsCards.forEach((card) => {
      // 카드 스타일 향상
      card.style.cssText = `
      background: rgba(255, 255, 255, 0.05);
      backdrop-filter: blur(10px);
      border-radius: 16px;
      padding: 2rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
      border: 1px solid rgba(255, 255, 255, 0.1);
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
    `;

      // 아이콘 스타일
      const icon = card.querySelector(".stats-icon");
      if (icon) {
        icon.style.cssText = `
        font-size: 2.5rem;
        margin-bottom: 1rem;
      `;
      }

      // 숫자 스타일
      const number = card.querySelector(".stats-number");
      if (number) {
        number.style.cssText = `
        font-size: 2.5rem;
        font-weight: 700;
        color: #90caf9;
        margin: 0.5rem 0;
      `;
      }

      // 레이블 스타일
      const label = card.querySelector(".stats-label");
      if (label) {
        label.style.cssText = `
        font-size: 1rem;
        color: rgba(255, 255, 255, 0.8);
        font-weight: 500;
      `;
      }

      // 호버 효과
      card.addEventListener("mouseenter", () => {
        card.style.transform = "translateY(-10px)";
        card.style.boxShadow = "0 10px 25px rgba(0, 0, 0, 0.3)";
      });

      card.addEventListener("mouseleave", () => {
        card.style.transform = "translateY(0)";
        card.style.boxShadow = "0 4px 20px rgba(0, 0, 0, 0.2)";
      });
    });
  },
};

// ====================
// Theme Manager
// ====================

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

// ====================
// Scroll Manager
// ====================

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

// ====================
// Quote Manager
// ====================

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

    // 이전 명언과 다른 명언 선택
    const currentText =
      quoteContainer.querySelector(".quote-text")?.textContent;
    let quote;
    do {
      quote = this.quotes[Math.floor(Math.random() * this.quotes.length)];
    } while (quote.text === currentText && this.quotes.length > 1);

    // 애니메이션 적용
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

// ====================
// Data Manager
// ====================

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

// ====================
// Init
// ====================
export const managers = {
  ui: UIManager,
  theme: ThemeManager,
  scroll: ScrollManager,
  quote: QuoteManager,
  data: DataManager,
  animation: AnimationManager,
};
