// BlogCore.js
const CONFIG = {
  selectors: {
    header: ".site-header",
    loader: "#page-loader",
    themeToggle: ".theme-toggle",
    searchToggle: ".search-toggle",
    searchModal: "#search-modal",
    backToTop: ".back-to-top",
    statsNumbers: "[data-count]",
    typingText: ".typing-text",
    quoteContainer: ".quote-container",
  },
  classes: {
    active: "active",
    visible: "visible",
    loaded: "loaded",
  },
  paths: {
    isTistory: window.location.hostname.includes("tistory.com"),
    get base() {
      return this.isTistory ? "/skin" : ".";
    },
  },
};

class BlogCore {
  constructor() {
    this.managers = {};
    this.isInitialized = false;
  }

  // 매니저 등록
  registerManager(name, manager) {
    this.managers[name] = manager;
  }

  // 매니저 가져오기
  getManager(name) {
    return this.managers[name];
  }

  // 초기화
  async init() {
    try {
      console.log("Initializing BlogCore...");

      // 스타일 로드
      await this.loadStyles();

      // 각 매니저 초기화
      for (const [name, manager] of Object.entries(this.managers)) {
        if (manager.init) {
          await manager.init();
          console.log(`${name} initialized`);
        }
      }

      this.isInitialized = true;
      console.log("BlogCore initialized successfully");
    } catch (error) {
      console.error("Failed to initialize BlogCore:", error);
      throw error;
    }
  }

  // CSS 로드
  async loadStyles() {
    const styles = {
      critical: `${CONFIG.paths.base}/critical.css`,
      main: `${CONFIG.paths.base}/style.css`,
    };

    // Critical CSS
    const criticalCSS = document.createElement("link");
    criticalCSS.rel = "stylesheet";
    criticalCSS.href = styles.critical;
    document.head.appendChild(criticalCSS);

    // Main CSS
    return new Promise((resolve, reject) => {
      const mainCSS = document.createElement("link");
      mainCSS.rel = "stylesheet";
      mainCSS.href = styles.main;
      mainCSS.media = "print";
      mainCSS.onload = () => {
        mainCSS.media = "all";
        resolve();
      };
      mainCSS.onerror = reject;
      document.head.appendChild(mainCSS);
    });
  }

  // 이벤트 리스너 설정
  setupEventListeners() {
    document.addEventListener("DOMContentLoaded", () => {
      this.handleDOMContentLoaded();
    });

    window.addEventListener("load", () => {
      this.handleWindowLoad();
    });
  }

  // DOM 로드 완료 핸들러
  handleDOMContentLoaded() {
    this.managers.ui?.setupInitialUI();
    this.managers.theme?.initTheme();
  }

  // 윈도우 로드 완료 핸들러
  handleWindowLoad() {
    const loader = document.querySelector(CONFIG.selectors.loader);
    if (loader) {
      loader.style.opacity = "0";
      setTimeout(() => loader.remove(), 500);
    }
  }
}

// 싱글톤 인스턴스 생성 및 내보내기
const blogCore = new BlogCore();
export { CONFIG };
export default blogCore;
