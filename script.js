import BlogCore from "./BlogCore.js";
// ==========================
// Core Configuration
// ==========================
const CONFIG = {
  selectors: {
    header: ".site-header",
    loader: "#page-loader",
    themeToggle: ".theme-toggle",
    searchToggle: ".search-toggle",
    mobileMenuToggle: ".mobile-menu-toggle",
    navList: ".nav-list",
    statsNumbers: "[data-count]",
    lazyImages: "img[data-src]",
    searchModal: "#search-modal",
    searchClose: ".search-close",
    searchInput: ".search-input",
    categoryWrapper: ".category-wrapper",
    categoryLinks: ".category-card, .subcategory-list a",
    postLinks: ".post-link",
    totalVisitors: ".total-visitors",
    totalPosts: ".total-posts",
    typingText: ".typing-text",
  },
  classes: {
    loaded: "loaded",
    active: "active",
    scrolled: "scrolled",
    hidden: "hidden",
  },
  thresholds: {
    scroll: 50,
  },
  animation: {
    duration: 2000,
    steps: 60,
  },
  theme: {
    light: {
      bgPrimary: "#ffffff",
      bgSecondary: "#f3f4f6",
      textPrimary: "#1f2937",
      textSecondary: "#4b5563",
    },
    dark: {
      bgPrimary: "#1f2937",
      bgSecondary: "#374151",
      textPrimary: "#e5e7eb",
      textSecondary: "#9ca3af",
    },
  },
};

// ==========================
// Utility Functions
// ==========================
const Utils = {
  formatNumber(num) {
    return new Intl.NumberFormat().format(num);
  },

  parseNumber(str) {
    return parseInt(str.replace(/[^0-9]/g, "")) || 0;
  },

  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  setThemeColors(theme) {
    const colors = CONFIG.theme[theme];
    Object.entries(colors).forEach(([key, value]) => {
      document.documentElement.style.setProperty(`--${key}`, value);
    });
  },
};

// ==========================
// Resource Manager
// ==========================
const ResourceManager = {
  init() {
    console.warn("ResourceManager: Migrating to BlogCore");
    if (!window.BlogCore?.isInitialized) {
      console.warn(
        "BlogCore not initialized, resource management may be limited"
      );
    }
  },
};
// ==========================
// Data Manager
// ==========================
const DataManager = {
  init() {
    console.warn("DataManager: Migrating to BlogCore");

    if (!window.BlogCore?.isInitialized) {
      console.warn("BlogCore not initialized, data management may be limited");
    }
  },
};

// ==========================
// Post Manager
// ==========================
const PostManager = {
  init() {
    console.warn("PostManager: Migrating to BlogCore");

    if (!window.BlogCore?.isInitialized) {
      console.warn("BlogCore not initialized, post management may be limited");
    }
  },
};

// ==========================
// Theme Manager
// ==========================
const ThemeManager = {
  init() {
    console.warn("ThemeManager: Migrating to BlogCore");

    // BlogCore가 초기화되었는지만 확인하고 끝
    if (!window.BlogCore?.isInitialized) {
      console.warn(
        "BlogCore not initialized, theme functionality may be limited"
      );
    }
  },
};

// ==========================
// UI Manager
// ==========================
const UIManager = {
  init() {
    console.warn("UIManager: Migrating to BlogCore");

    if (!window.BlogCore?.isInitialized) {
      console.warn("BlogCore not initialized, UI management may be limited");
    }
  },
};
const TistoryUrlHandler = {
  processCategoryUrl(url) {
    if (!url) return "";

    // 티스토리 변수 제거
    let processedUrl = url.replace(/\[##_|_##\]/g, "");

    // 카테고리 경로 확인
    if (!processedUrl.startsWith("/category/")) {
      processedUrl = `/category/${processedUrl}`;
    }

    // 특수문자 처리
    return encodeURI(processedUrl);
  },
};
// ==========================
// Animation Manager
// ==========================
const AnimationManager = {
  init() {
    console.warn("AnimationManager: Migrating to BlogCore");

    if (!window.BlogCore?.isInitialized) {
      console.warn(
        "BlogCore not initialized, animation management may be limited"
      );
    }
  },
};
// ==========================
// Category Manager
// ==========================
const CategoryManager = {
  init() {
    console.warn("CategoryManager: Migrating to BlogCore");

    if (!window.BlogCore?.isInitialized) {
      console.warn(
        "BlogCore not initialized, category management may be limited"
      );
    }
  },
};

// ==========================
// Content Manager
// ==========================
const ContentManager = {
  init() {
    console.warn("ContentManager: Migrating to BlogCore");

    if (!window.BlogCore?.isInitialized) {
      console.warn(
        "BlogCore not initialized, content management may be limited"
      );
    }
  },
};

// ==========================
// Scroll Manager
// ==========================
const ScrollManager = {
  init() {
    console.warn("ScrollManager: Migrating to BlogCore");

    if (!window.BlogCore?.isInitialized) {
      console.warn(
        "BlogCore not initialized, scroll management may be limited"
      );
    }
  },
};

// ==========================
// Quote Manager
// ==========================
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

  isAnimating: false, // 애니메이션 상태 추적
  intervalId: null, // interval ID 저장

  init() {
    console.log("Initializing QuoteManager...");
    this.setupQuoteRotation();
    this.setupRefreshButton();
    this.updateQuote(); // 초기 명언 표시
  },

  setupQuoteRotation() {
    const quoteContainer = document.querySelector(".quote-container");
    if (!quoteContainer) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            console.log("Quote section is visible, starting rotation");
            this.startRotation();
          } else {
            console.log("Quote section is hidden, stopping rotation");
            this.stopRotation();
          }
        });
      },
      {
        threshold: 0.5,
      }
    );

    observer.observe(quoteContainer);
  },

  startRotation() {
    // 이미 실행 중인 interval이 있다면 제거
    this.stopRotation();

    // 새로운 interval 시작
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

  getRandomQuote() {
    const currentQuote = document.querySelector(".quote-text")?.textContent;
    let newQuote;

    do {
      newQuote = this.quotes[Math.floor(Math.random() * this.quotes.length)];
    } while (newQuote.text === currentQuote && this.quotes.length > 1);

    return newQuote;
  },

  updateQuote() {
    if (this.isAnimating) return; // 애니메이션 중이면 실행하지 않음

    const quoteContainer = document.querySelector(".quote-container");
    if (!quoteContainer) return;

    this.isAnimating = true;
    const quote = this.getRandomQuote();

    // 페이드 아웃
    quoteContainer.classList.remove("fade-in");
    quoteContainer.classList.add("fade-out");

    setTimeout(() => {
      // 내용 업데이트
      quoteContainer.innerHTML = `
                <p class="quote-text">${quote.text}</p>
                <p class="quote-original">(${quote.originalText})</p>
                <p class="quote-author">- ${quote.author}</p>
            `;

      // 페이드 인
      quoteContainer.classList.remove("fade-out");
      quoteContainer.classList.add("fade-in");

      // 애니메이션 완료
      setTimeout(() => {
        this.isAnimating = false;
      }, 500);
    }, 500);
  },

  setupRefreshButton() {
    const refreshBtn = document.createElement("button");
    refreshBtn.className = "quote-refresh-btn";
    refreshBtn.innerHTML = '<i class="fas fa-sync-alt"></i>';
    refreshBtn.setAttribute("aria-label", "새로운 명언 보기");

    const heroContent = document.querySelector(".hero-content");
    if (heroContent) {
      heroContent.appendChild(refreshBtn);

      refreshBtn.addEventListener("click", () => {
        if (!this.isAnimating) {
          refreshBtn.classList.add("rotating");
          this.updateQuote();
          setTimeout(() => refreshBtn.classList.remove("rotating"), 1000);
        }
      });
    }
  },
};

const HeroTextManager = {
  init() {
    this.setupTypingText();
    QuoteManager.init(); // QuoteManager는 이후에 실행
  },

  setupTypingText() {
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

    const typingElement = document.querySelector(".typing-text");
    if (!typingElement) return;

    let languageIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let currentText = "";

    function type() {
      const currentLanguage = languages[languageIndex];

      if (isDeleting) {
        currentText = currentLanguage.substring(0, charIndex - 1);
        charIndex--;
      } else {
        currentText = currentLanguage.substring(0, charIndex + 1);
        charIndex++;
      }

      typingElement.textContent = currentText;

      let typeSpeed = isDeleting ? 100 : 200;

      if (!isDeleting && charIndex === currentLanguage.length) {
        isDeleting = true;
        typeSpeed = 2000; // 완성된 텍스트 표시 시간
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        languageIndex = (languageIndex + 1) % languages.length;
        typeSpeed = 500; // 다음 단어 시작 전 대기 시간
      }

      setTimeout(type, typeSpeed);
    }

    type();
  },
};
// ==========================
// Search Manager
// ==========================
const SearchManager = {
  init() {
    console.warn("SearchManager: Migrating to BlogCore");

    if (!window.BlogCore?.isInitialized) {
      console.warn(
        "BlogCore not initialized, search functionality may be limited"
      );
    }
  },
};

// script.js에 추가
const DataLoader = {
  init() {
    this.loadPostCount();
    this.loadLatestPosts();
  },

  loadPostCount() {
    const countElement = document.querySelector(".stats-number");
    if (countElement) {
      // 티스토리 변수 직접 사용
      countElement.textContent = "[##_count_post_##]";
    }
  },

  loadLatestPosts() {
    const postsGrid = document.querySelector(".posts-grid");
    if (postsGrid) {
      // 티스토리 변수 직접 사용
      postsGrid.innerHTML = "[##_notice_rep_##][##_article_rep_##]";
    }
  },
};

// ==========================
// Error Handler
// ==========================
const ErrorHandler = {
  init() {
    window.onerror = this.handleError.bind(this);
    window.addEventListener(
      "unhandledrejection",
      this.handlePromiseRejection.bind(this)
    );
  },

  handleError(msg, url, lineNo, columnNo, error) {
    // 더 자세한 에러 로깅
    const errorInfo = {
      message: msg,
      url,
      line: lineNo,
      column: columnNo,
      stack: error?.stack,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString(),
    };

    console.error("Detailed Error Information:", errorInfo);
    return false;
  },

  handlePromiseRejection(event) {
    console.error("Unhandled Promise Rejection:", {
      reason: event.reason,
      timestamp: new Date().toISOString(),
    });
  },
};

// ==========================
// Initialize Application
// ==========================
const App = {
  async init() {
    try {
      // 초기 로딩 상태 처리
      document.body.classList.add("loading");
      const savedTheme = localStorage.getItem("theme") || "light";
      document.documentElement.setAttribute("data-theme", savedTheme);

      // 매니저 초기화 순서
      const managers = [
        ErrorHandler,
        ResourceManager,
        ThemeManager,
        UIManager,
        CategoryManager,
        HeroTextManager,
        DataManager,
        AnimationManager,
        ScrollManager,
        SearchManager,
        DataLoader,
      ];

      // 각 매니저 순차적 초기화
      for (const manager of managers) {
        if (manager.init) {
          if (manager === ResourceManager) {
            await manager.init();
          } else {
            manager.init();
          }
        }
      }

      // QuoteManager는 HeroTextManager 이후에 초기화
      setTimeout(() => {
        if (QuoteManager && QuoteManager.init) {
          QuoteManager.init();
        }
      }, 500);

      // 모바일 뷰포트 설정
      const viewport = document.querySelector('meta[name="viewport"]');
      if (viewport && window.innerWidth < 768) {
        viewport.content =
          "width=device-width, initial-scale=1.0, maximum-scale=1.0";
      }

      // 로더 제거
      const loader = document.querySelector(CONFIG.selectors.loader);
      if (loader) {
        loader.style.opacity = "0";
        setTimeout(() => {
          loader.remove();
          document.body.classList.remove("loading");
        }, 500);
      }

      console.log("Application initialized successfully");
    } catch (error) {
      console.error("Failed to initialize application:", error);
      const loader = document.querySelector(CONFIG.selectors.loader);
      if (loader) {
        loader.innerHTML = `
                    <div class="error-message">
                        <p>블로그 초기화 중 문제가 발생했습니다.</p>
                        <button onclick="window.location.reload()">새로고침</button>
                    </div>
                `;
      }
    }
  },
};

// 애플리케이션 시작
document.addEventListener("DOMContentLoaded", () => {
  App.init().catch((error) => {
    console.error("Failed to initialize application:", error);
  });
});

// 페이지 완전 로드 시 추가 최적화
window.addEventListener("load", () => {
  // 지연 로딩 이미지 처리
  document.querySelectorAll('img[loading="lazy"]').forEach((img) => {
    if (img.complete) {
      img.classList.add("loaded");
    } else {
      img.addEventListener("load", () => img.classList.add("loaded"));
    }
  });

  // 성능 최적화를 위한 불필요한 리소스 정리
  setTimeout(() => {
    if (window.performance && window.performance.memory) {
      console.log("Memory usage:", window.performance.memory);
    }
  }, 3000);
});

// 오프라인 지원 (PWA를 위한 기초 작업)
window.addEventListener("offline", () => {
  console.log("Network connection lost");
  document.body.classList.add("offline");
});

window.addEventListener("online", () => {
  console.log("Network connection restored");
  document.body.classList.remove("offline");
});

// 브라우저 뒤로가기 처리
window.addEventListener("popstate", () => {
  // 페이지 상태 복원
  const scrollPosition = window.history.state?.scrollPosition || 0;
  window.scrollTo(0, scrollPosition);
});

// 페이지 종료 시 정리
window.addEventListener("beforeunload", () => {
  // 현재 스크롤 위치 저장
  const scrollPosition = window.scrollY;
  window.history.replaceState({ scrollPosition }, "");
});
