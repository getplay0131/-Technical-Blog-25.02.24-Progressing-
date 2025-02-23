// Blog Core Module
const BlogCore = {
  // Configuration
  config: {
    selectors: {
      header: ".site-header",
      searchToggle: ".search-toggle",
      themeToggle: ".theme-toggle",
      searchModal: "#search-modal",
      lazyImages: "img[data-src]",
      backToTop: ".back-to-top",
      searchInput: ".search-input",
      searchClose: ".search-close",
      lazyImages: "img[data-src]",
      images: ".post-content img, .thumbnail img",
    },
    classes: {
      active: "active",
      loaded: "loaded",
      visible: "visible",
      scrolled: "scrolled",
    },
    thresholds: {
      scroll: 50,
    },
    placeholders: {
      image: "/assets/images/placeholder.jpg",
    },
  },

  // Initialization
  init() {
    this.initializeTheme();
    this.setupUI();
    this.handleResources();
    this.setupEventListeners();
    this.data.init();
    this.posts.init();
    this.categories.init();
    this.content.init();
    this.scroll.init();
    this.animations.init();
    this.search.init();
    this.quotes.init();
  },

  // ==========================
  // Theme Manager
  // ==========================
  theme: {
    init() {
      this.themeToggle = document.querySelector(CONFIG.selectors.themeToggle);
      this.themeIcon = this.themeToggle?.querySelector("i");
      if (!this.themeToggle) return;

      const savedTheme = localStorage.getItem("theme") || "light";
      this.setTheme(savedTheme);
      this.setupEventListeners();
    },

    setupEventListeners() {
      this.themeToggle.addEventListener("click", () => {
        const currentTheme =
          document.documentElement.getAttribute("data-theme");
        const newTheme = currentTheme === "dark" ? "light" : "dark";
        this.setTheme(newTheme);
      });
    },

    setTheme(theme) {
      document.documentElement.setAttribute("data-theme", theme);
      localStorage.setItem("theme", theme);
      this.updateThemeIcon(theme);
      Utils.setThemeColors(theme);
    },

    updateThemeIcon(theme) {
      if (this.themeIcon) {
        this.themeIcon.className =
          theme === "dark" ? "fas fa-sun" : "fas fa-moon";
      }
    },
  },

  // ==========================
  // UI Manager
  // ==========================
  ui: {
    init() {
      this.setupHeader();
      this.setupMobileMenu();
      this.setupSearch();
      this.setupBackToTop();
    },

    setupHeader() {
      const header = document.querySelector(CONFIG.selectors.header);
      if (!header) return;

      let lastScroll = 0;
      window.addEventListener(
        "scroll",
        () => {
          const currentScroll = window.pageYOffset;
          const shouldHide =
            currentScroll > lastScroll &&
            currentScroll > CONFIG.thresholds.scroll;

          header.classList.toggle(
            CONFIG.classes.scrolled,
            currentScroll > CONFIG.thresholds.scroll
          );
          header.style.transform = shouldHide
            ? "translateY(-100%)"
            : "translateY(0)";

          lastScroll = currentScroll;
        },
        { passive: true }
      );
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

    setupSearch() {
      const searchToggle = document.querySelector(
        CONFIG.selectors.searchToggle
      );
      const searchModal = document.querySelector(CONFIG.selectors.searchModal);
      if (!searchToggle || !searchModal) return;

      // 토글 버튼 클릭
      searchToggle.addEventListener("click", () => {
        searchModal.classList.toggle(CONFIG.classes.active);
        if (searchModal.classList.contains(CONFIG.classes.active)) {
          const input = searchModal.querySelector(CONFIG.selectors.searchInput);
          if (input) input.focus();
        }
      });

      // 닫기 버튼
      const closeButton = searchModal.querySelector(
        CONFIG.selectors.searchClose
      );
      if (closeButton) {
        closeButton.addEventListener("click", () => {
          searchModal.classList.remove(CONFIG.classes.active);
        });
      }

      // 외부 클릭
      searchModal.addEventListener("click", (e) => {
        if (e.target === searchModal) {
          searchModal.classList.remove(CONFIG.classes.active);
        }
      });

      // ESC 키
      document.addEventListener("keydown", (e) => {
        if (
          e.key === "Escape" &&
          searchModal.classList.contains(CONFIG.classes.active)
        ) {
          searchModal.classList.remove(CONFIG.classes.active);
        }
      });
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
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      });
    },
  },

  // ==========================
  // Resources Manager
  // ==========================
  resources: {
    init() {
      this.setupLazyLoading();
      this.setupResourceHandling();
      this.optimizeImages();
      this.resources.init();
    },

    setupLazyLoading() {
      const images = document.querySelectorAll(CONFIG.selectors.lazyImages);
      if (!images.length) return;

      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.classList.add(CONFIG.classes.loaded);
              imageObserver.unobserve(img);
            }
          }
        });
      });

      images.forEach((img) => imageObserver.observe(img));
    },

    setupResourceHandling() {
      // 스크립트 최적화
      document.querySelectorAll("script[data-defer]").forEach((script) => {
        script.setAttribute("defer", "");
      });

      // 스타일시트 최적화
      document.querySelectorAll('link[rel="stylesheet"]').forEach((link) => {
        if (!link.href.includes("critical")) {
          link.media = "print";
          link.onload = () => {
            link.media = "all";
          };
        }
      });
    },

    optimizeImages() {
      document.querySelectorAll(CONFIG.selectors.images).forEach((img) => {
        // 이미지 로딩 에러 처리
        img.onerror = () => {
          img.src = CONFIG.placeholders.image;
          img.classList.add("image-error");
        };

        // alt 텍스트 확인
        if (!img.alt) {
          img.alt = "Blog image";
        }

        // 반응형 이미지 처리
        if (!img.getAttribute("loading")) {
          img.loading = "lazy";
        }
      });
    },
  },

  // ==========================
  // Data Manager
  // ==========================
  data: {
    init() {
      this.initializeStats();
      this.initializeCategories();
    },

    initializeStats() {
      // 통계 데이터 애니메이션
      const animateNumber = (element, target) => {
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
      };

      // 총 방문자 수 처리
      const visitorsElement = document.querySelector(
        CONFIG.selectors.totalVisitors
      );
      if (visitorsElement) {
        const visitCount =
          parseInt(visitorsElement.textContent.replace(/[^0-9]/g, "")) || 0;
        animateNumber(visitorsElement, visitCount);
      }

      // 총 포스트 수 처리
      const postsElement = document.querySelector(CONFIG.selectors.totalPosts);
      if (postsElement) {
        const postCount =
          parseInt(postsElement.textContent.replace(/[^0-9]/g, "")) || 0;
        animateNumber(postsElement, postCount);
      }
    },

    initializeCategories() {
      const categoryGrid = document.querySelector(".category-grid");
      const template = document.querySelector("#categoryTemplate");

      if (!categoryGrid || !template) return;

      // 카테고리 아이콘 매핑
      const categoryIcons = {
        Java: "fas fa-coffee",
        Spring: "fas fa-leaf",
        JavaScript: "fab fa-js",
        Python: "fab fa-python",
        Database: "fas fa-database",
        DevOps: "fas fa-server",
        Algorithm: "fas fa-code",
        Web: "fas fa-globe",
        Mobile: "fas fa-mobile-alt",
        AI: "fas fa-brain",
        Default: "fas fa-folder",
      };

      const processCategory = (category) => {
        const icon = categoryIcons[category.name] || categoryIcons.Default;
        return template.innerHTML
          .replace("[##_category_name_##]", category.name)
          .replace("[##_category_link_##]", category.url)
          .replace("[##_category_total_##]", category.count)
          .replace("category-icon-[##_category_name_##]", icon);
      };

      const categoryList = window.TistoryBlog?.categoryList || [];
      if (categoryList.length > 0) {
        categoryGrid.innerHTML = categoryList.map(processCategory).join("");
      } else {
        categoryGrid.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">📁</div>
                    <p>아직 카테고리가 없습니다</p>
                </div>
            `;
      }
    },
  },

  // ==========================
  // Post Manager
  // ==========================
  posts: {
    init() {
      this.setupPostLinks();
      this.setupCategoryLinks();
    },

    setupPostLinks() {
      document.querySelectorAll(".post-link").forEach((link) => {
        link.addEventListener("click", (e) => {
          const href = link.getAttribute("href");
          if (href) {
            window.location.href = href;
          }
        });
      });
    },

    setupCategoryLinks() {
      document.querySelectorAll(".category-link").forEach((link) => {
        link.addEventListener("click", (e) => {
          e.preventDefault();
          const href = link.getAttribute("href");
          if (href) {
            const cleanHref = href.replace(/\[##_|_##\]/g, "");
            window.location.href = cleanHref;
          }
        });
      });
    },

    // Post 카드 처리
    setupPostCards() {
      const postCards = document.querySelectorAll(".post-card");

      postCards.forEach((card, index) => {
        const link = card.querySelector("a");
        if (!link) return;

        link.addEventListener("click", (e) => {
          e.preventDefault();
          const href = link.getAttribute("href");

          if (!href) {
            console.warn("No href attribute found for post link");
            return;
          }

          try {
            let finalUrl = href;
            if (href.includes("[##_") && href.includes("_##]")) {
              finalUrl = href.replace(/\[##_/g, "").replace(/_##\]/g, "");
              if (!finalUrl.startsWith("http") && !finalUrl.startsWith("/")) {
                finalUrl = "/" + finalUrl;
              }
            }

            window.location.href = new URL(
              finalUrl,
              window.location.origin
            ).href;
          } catch (error) {
            console.error("Error processing post URL:", error);
            window.location.href = href;
          }
        });
      });
    },
  },

  // ==========================
  // Category Manager
  // ==========================
  categories: {
    init() {
      this.reformatCategories();
      this.setupCategoryLinks();
      this.setupSubCategoryLinks();
      this.setupCategoryInteractions();
    },

    reformatCategories() {
      const categoryGrid = document.querySelector(".category-grid");
      if (!categoryGrid) return;

      const originalHTML = categoryGrid.innerHTML;
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = originalHTML;

      const categories = Array.from(tempDiv.querySelectorAll("li"));

      const newHTML = categories
        .map((category) => {
          const link = category.querySelector("a");
          if (!link) return "";

          const name = link.textContent;
          const href = link.getAttribute("href");
          const count =
            category
              .querySelector(".c_cnt")
              ?.textContent.replace(/[()]/g, "") || "0";
          const icon = this.getCategoryIcon(name);

          return `
                    <div class="category-wrapper">
                        <a href="${href}" class="category-card">
                            <div class="category-content">
                                <div class="category-icon">
                                    <i class="${icon}"></i>
                                </div>
                                <div class="category-info">
                                    <h3 class="category-name">${name}</h3>
                                    <div class="post-count">${count} Articles</div>
                                </div>
                            </div>
                        </a>
                    </div>
                `;
        })
        .join("");

      categoryGrid.innerHTML = newHTML;
    },

    getCategoryIcon(categoryName) {
      const iconMap = {
        Java: "fas fa-coffee",
        Spring: "fas fa-leaf",
        JavaScript: "fab fa-js",
        Python: "fab fa-python",
        Database: "fas fa-database",
        DevOps: "fas fa-server",
        Algorithm: "fas fa-code",
        Web: "fas fa-globe",
        Mobile: "fas fa-mobile-alt",
        AI: "fas fa-brain",
      };

      return iconMap[categoryName] || "fas fa-folder";
    },

    setupCategoryLinks() {
      document.querySelectorAll(".category-list a").forEach((link) => {
        link.addEventListener("click", (e) => {
          const href = link.getAttribute("href");
          if (href) {
            window.location.href = href;
          }
        });
      });
    },

    setupSubCategoryLinks() {
      const subCategoryLinks = document.querySelectorAll(".subcategory-list a");

      subCategoryLinks.forEach((link) => {
        link.addEventListener("click", (e) => {
          const href = link.getAttribute("href");
          if (!href) return;

          try {
            const processedUrl = this.processCategoryUrl(href);
            const finalUrl = window.location.origin + processedUrl;
            window.location.href = finalUrl;
          } catch (error) {
            console.error("Error processing subcategory URL:", error);
          }
        });
      });
    },

    setupCategoryInteractions() {
      document
        .querySelectorAll(CONFIG.selectors.categoryWrapper)
        .forEach((wrapper) => {
          const detail = wrapper.querySelector(".category-detail");
          if (!detail) return;

          wrapper.addEventListener("mouseenter", () => {
            detail.style.height = `${detail.scrollHeight}px`;
          });

          wrapper.addEventListener("mouseleave", () => {
            detail.style.height = "0";
          });
        });
    },

    processCategoryUrl(url) {
      if (!url) return "";

      let processedUrl = url.replace(/\[##_|_##\]/g, "");

      if (!processedUrl.startsWith("/category/")) {
        processedUrl = `/category/${processedUrl}`;
      }

      const pathMatch = processedUrl.match(/\/category\/(.+)/);
      if (!pathMatch) return processedUrl;

      const categoryPath = pathMatch[1];
      const processedPath = categoryPath
        .split("/")
        .map((segment) => {
          return /\p{Emoji}/u.test(segment)
            ? segment
            : encodeURIComponent(segment);
        })
        .join("/");

      return `/category/${processedPath}`;
    },
  },

  // ==========================
  // Content Manager
  // ==========================
  content: {
    init() {
      this.setupCategoryInteractions();
      this.setupPostLinks();
      this.initializeEmptyStates();
    },

    setupCategoryInteractions() {
      document
        .querySelectorAll(CONFIG.selectors.categoryWrapper)
        .forEach((wrapper) => {
          const detail = wrapper.querySelector(".category-detail");
          if (!detail) return;

          wrapper.addEventListener("mouseenter", () => {
            detail.style.height = `${detail.scrollHeight}px`;
          });

          wrapper.addEventListener("mouseleave", () => {
            detail.style.height = "0";
          });
        });

      this.setupLinks();
    },

    setupLinks() {
      const handleClick = (e) => {
        const link = e.currentTarget;
        const href = link.getAttribute("href");
        if (!href) return;

        e.preventDefault();
        window.location.href = href
          .replace(/\[##_|\[##_/g, "")
          .replace(/_##\]|_##\]/g, "");
      };

      document
        .querySelectorAll(CONFIG.selectors.categoryLinks)
        .forEach((link) => link.addEventListener("click", handleClick));
    },

    setupPostLinks() {
      document.querySelectorAll(CONFIG.selectors.postLinks).forEach((link) => {
        link.addEventListener("click", (e) => {
          e.preventDefault();
          const href = link.getAttribute("href");
          if (href) window.location.href = href;
        });
      });
    },

    initializeEmptyStates() {
      const createEmptyState = (icon, message) => `
            <div class="empty-state">
                <div class="empty-icon">${icon}</div>
                <p>${message}</p>
            </div>
        `;

      const categoryGrid = document.querySelector(".category-grid");
      if (categoryGrid && !categoryGrid.children.length) {
        categoryGrid.innerHTML = createEmptyState(
          "📁",
          "아직 카테고리가 없습니다."
        );
      }

      const postsGrid = document.querySelector(".posts-grid");
      if (
        postsGrid &&
        !postsGrid.querySelector(".main-post-card, .sub-post-card")
      ) {
        postsGrid.innerHTML = createEmptyState(
          "📝",
          "아직 작성된 글이 없습니다."
        );
      }
    },
  },

  // ==========================
  // Scroll Manager
  // ==========================
  scroll: {
    init() {
      this.setupScrollDownButton();
      this.setupBackToTop();
    },

    setupScrollDownButton() {
      const scrollDownBtn = document.querySelector(".scroll-down-btn");
      if (!scrollDownBtn) return;

      scrollDownBtn.addEventListener("click", (e) => {
        e.preventDefault();

        const statsSection = document.querySelector("#stats-section");
        if (statsSection) {
          statsSection.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      });
    },

    setupBackToTop() {
      const backToTop = document.querySelector(CONFIG.selectors.backToTop);
      if (!backToTop) return;

      // 스크롤 위치에 따라 버튼 표시/숨김
      window.addEventListener(
        "scroll",
        () => {
          backToTop.classList.toggle("visible", window.scrollY > 300);
        },
        { passive: true }
      );

      // 클릭 시 최상단으로 스크롤
      backToTop.addEventListener("click", () => {
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      });
    },

    // 새로운 메서드: 스크롤 위치 저장
    saveScrollPosition() {
      const scrollPosition = window.scrollY;
      window.history.replaceState({ scrollPosition }, "");
    },

    // 새로운 메서드: 스크롤 위치 복원
    restoreScrollPosition() {
      const scrollPosition = window.history.state?.scrollPosition || 0;
      window.scrollTo(0, scrollPosition);
    },
  },

  // ==========================
  // Animation Manager
  // ==========================
  animations: {
    init() {
      this.setupTypingEffect();
      this.setupNumberAnimations();
    },

    setupTypingEffect() {
      const element = document.querySelector(CONFIG.selectors.typingText);
      if (!element) return;

      const words = JSON.parse(element.dataset.words || "[]");
      if (!words.length) return;

      this.startTypingAnimation(element, words);
    },

    startTypingAnimation(element, words) {
      let wordIndex = 0;
      let charIndex = 0;
      let isDeleting = false;

      const type = () => {
        const currentWord = words[wordIndex];
        const speed = isDeleting ? 100 : 200;

        if (isDeleting) {
          element.textContent = currentWord.substring(0, charIndex - 1);
          charIndex--;
        } else {
          element.textContent = currentWord.substring(0, charIndex + 1);
          charIndex++;
        }

        if (!isDeleting && charIndex === currentWord.length) {
          isDeleting = true;
          setTimeout(type, 1500);
          return;
        }

        if (isDeleting && charIndex === 0) {
          isDeleting = false;
          wordIndex = (wordIndex + 1) % words.length;
        }

        setTimeout(type, speed);
      };

      type();
    },

    setupNumberAnimations() {
      const elements = document.querySelectorAll(CONFIG.selectors.statsNumbers);
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              this.animateNumber(entry.target);
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.5 }
      );

      elements.forEach((element) => observer.observe(element));
    },

    animateNumber(element) {
      const target = parseInt(element.dataset.count);
      const step = target / CONFIG.animation.steps;
      let current = 0;

      const animate = () => {
        current += step;
        if (current <= target) {
          element.textContent = Math.floor(current).toLocaleString();
          requestAnimationFrame(animate);
        } else {
          element.textContent = target.toLocaleString();
        }
      };

      animate();
    },
  },

  // ==========================
  // Search Manager
  // ==========================
  search: {
    init() {
      this.searchToggle = document.querySelector(CONFIG.selectors.searchToggle);
      this.searchClose = document.querySelector(CONFIG.selectors.searchClose);
      this.searchModal = document.querySelector(CONFIG.selectors.searchModal);
      this.searchForm = document.querySelector(".search-form");

      if (!this.searchToggle || !this.searchModal) return;

      this.setupEventListeners();
    },

    setupEventListeners() {
      // 검색 모달 열기/닫기
      this.searchToggle.addEventListener("click", () => this.openSearch());

      if (this.searchClose) {
        this.searchClose.addEventListener("click", () => this.closeSearch());
      }

      // 검색 폼 제출
      if (this.searchForm) {
        this.searchForm.addEventListener("submit", (e) => {
          const input = this.searchForm.querySelector('input[name="search"]');
          if (!input?.value.trim()) {
            e.preventDefault();
            alert("검색어를 입력해주세요.");
            return;
          }
        });
      }

      // 모달 외부 클릭시 닫기
      this.searchModal.addEventListener("click", (e) => {
        if (e.target === this.searchModal) {
          this.closeSearch();
        }
      });

      // ESC 키로 닫기
      document.addEventListener("keydown", (e) => {
        if (
          e.key === "Escape" &&
          this.searchModal.classList.contains(CONFIG.classes.active)
        ) {
          this.closeSearch();
        }
      });
    },

    openSearch() {
      this.searchModal.classList.add(CONFIG.classes.active);
      const input = this.searchModal.querySelector('input[name="search"]');
      if (input) input.focus();
    },

    closeSearch() {
      this.searchModal.classList.remove(CONFIG.classes.active);
    },
  },

  // ==========================
  // Quote Manager
  // 25.02.23 문제 발생
  // ==========================
  quotes: {
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
      this.setupRefreshButton();
      this.updateQuote();
    },

    setupQuoteRotation() {
      const quoteContainer = document.querySelector(".quote-container");
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

    getRandomQuote() {
      const currentQuote = document.querySelector(".quote-text")?.textContent;
      let newQuote;

      do {
        newQuote = this.quotes[Math.floor(Math.random() * this.quotes.length)];
      } while (newQuote.text === currentQuote && this.quotes.length > 1);

      return newQuote;
    },

    updateQuote() {
      if (this.isAnimating) return;

      const quoteContainer = document.querySelector(".quote-container");
      if (!quoteContainer) return;

      this.isAnimating = true;
      const quote = this.getRandomQuote();

      quoteContainer.classList.remove("fade-in");
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
  },

  // Event Listeners
  setupEventListeners() {
    // Initialize components after DOM content is loaded
    document.addEventListener("DOMContentLoaded", () => {
      this.initializeComponents();
    });

    // Handle page visibility changes
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") {
        this.handlePageVisible();
      }
    });

    // Handle network status changes
    window.addEventListener("online", () => this.handleNetworkChange(true));
    window.addEventListener("offline", () => this.handleNetworkChange(false));
    // 페이지 종료 시 스크롤 위치 저장
    window.addEventListener("beforeunload", () => {
      this.scroll.saveScrollPosition();
    });

    // 브라우저 뒤로가기 시 스크롤 위치 복원
    window.addEventListener("popstate", () => {
      this.scroll.restoreScrollPosition();
    });
  },

  initializeComponents() {
    // Initialize any additional components here
  },

  handlePageVisible() {
    // Handle page becoming visible
  },

  handleNetworkChange(isOnline) {
    document.body.classList.toggle("offline", !isOnline);
  },
};

// Export the module
export default BlogCore;
