// script.js
import BlogCore from "./BlogCore.js";
import { managers } from "./managers.js";

// 앱 초기화 및 관리
const App = {
  async init() {
    try {
      // 로딩 상태 시작
      document.body.classList.add("loading");

      // BlogCore 매니저 등록
      Object.entries(managers).forEach(([name, manager]) => {
        BlogCore.registerManager(name, manager);
      });

      // BlogCore 초기화
      await BlogCore.init();

      // Font Awesome 로드 확인
      this.ensureFontAwesome();

      // 이벤트 리스너 설정
      this.setupEventListeners();

      // 로딩 상태 제거
      this.removeLoader();

      console.log("Application initialized successfully");
    } catch (error) {
      console.error("Failed to initialize application:", error);
      this.handleInitError(error);
    }
  },

  // Font Awesome 로드 확인 및 재시도
  ensureFontAwesome() {
    const isFontAwesomeLoaded = !!document.querySelector(
      'link[href*="font-awesome"]'
    );
    if (!isFontAwesomeLoaded) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href =
        "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css";
      document.head.appendChild(link);
    }
  },

  // 이벤트 리스너 설정
  setupEventListeners() {
    // 이미지 지연 로딩
    document.querySelectorAll('img[loading="lazy"]').forEach((img) => {
      if (img.complete) {
        img.classList.add("loaded");
      } else {
        img.addEventListener("load", () => img.classList.add("loaded"));
      }
    });

    // 오프라인/온라인 상태 처리
    window.addEventListener("offline", () => {
      document.body.classList.add("offline");
      console.log("Network connection lost");
    });

    window.addEventListener("online", () => {
      document.body.classList.remove("offline");
      console.log("Network connection restored");
    });
  },

  // 로더 제거
  removeLoader() {
    const loader = document.querySelector("#page-loader");
    if (loader) {
      loader.style.opacity = "0";
      setTimeout(() => {
        loader.remove();
        document.body.classList.remove("loading");
      }, 500);
    }
  },

  // 초기화 에러 처리
  handleInitError(error) {
    const loader = document.querySelector("#page-loader");
    if (loader) {
      loader.innerHTML = `
       <div class="error-message">
         <p>블로그 초기화 중 문제가 발생했습니다.</p>
         <button onclick="window.location.reload()">새로고침</button>
       </div>
     `;
    }
  },
};

// DOMContentLoaded 이벤트에서 앱 초기화
document.addEventListener("DOMContentLoaded", () => {
  App.init().catch((error) => {
    console.error("Failed to initialize application:", error);
  });
});

// 성능 모니터링
window.addEventListener("load", () => {
  setTimeout(() => {
    if (window.performance && window.performance.memory) {
      console.log("Memory usage:", window.performance.memory);
    }
  }, 3000);
});
