// PostManager: 포스트 페이지의 모든 기능을 관리하는 클래스
class PostManager {
  constructor() {
    // 주요 DOM 요소 캐싱
    this.postContent = document.querySelector(".post-content");
    this.tocContainer = document.querySelector(".table-of-contents");
    this.shareButtons = document.querySelectorAll(".share-button");
    this.commentForm = document.querySelector(".comment-form");

    // 초기화
    this.init();
  }

  init() {
    // 각 기능 초기화
    this.initCodeBlocks();
    this.initTableOfContents();
    this.initImageHandling();
    this.initShareButtons();
    this.initCommentSystem();
  }

  // 코드 블록 관련 기능
  initCodeBlocks() {
    const codeBlocks = document.querySelectorAll("pre code");

    codeBlocks.forEach((code) => {
      // 코드 블록에 복사 버튼 추가
      const copyButton = this.createCopyButton();
      code.parentNode.insertBefore(copyButton, code);

      // 코드 하이라이팅 적용
      hljs.highlightElement(code);
    });
  }

  createCopyButton() {
    const button = document.createElement("button");
    button.className = "code-copy-button";
    button.innerHTML = '<i class="fas fa-copy"></i>';
    button.title = "코드 복사";

    button.addEventListener("click", async (e) => {
      const code = e.target.closest("pre").querySelector("code");
      try {
        await navigator.clipboard.writeText(code.textContent);

        // 복사 성공 표시
        button.innerHTML = '<i class="fas fa-check"></i>';
        button.classList.add("success");

        // 2초 후 원래 아이콘으로 복구
        setTimeout(() => {
          button.innerHTML = '<i class="fas fa-copy"></i>';
          button.classList.remove("success");
        }, 2000);
      } catch (err) {
        console.error("코드 복사 실패:", err);
        alert("코드 복사에 실패했습니다.");
      }
    });

    return button;
  }

  // 목차(TOC) 생성 및 관리
  initTableOfContents() {
    if (!this.postContent || !this.tocContainer) return;

    // 헤더 요소 수집
    const headers = this.postContent.querySelectorAll("h2, h3, h4");
    if (headers.length === 0) return;

    // TOC HTML 생성
    const tocHtml = this.generateTocHtml(headers);
    this.tocContainer.innerHTML = `
            <div class="toc-title">목차</div>
            <nav class="toc-nav">${tocHtml}</nav>
        `;

    // 스크롤 스파이 설정
    this.setupScrollSpy(headers);
  }

  generateTocHtml(headers) {
    let html = '<ul class="toc-list">';
    let prevLevel = 2; // h2부터 시작

    headers.forEach((header) => {
      const level = parseInt(header.tagName.charAt(1));
      const id = this.generateHeaderId(header);
      const text = header.textContent;

      // 들여쓰기 처리
      if (level > prevLevel) {
        html += '<ul class="toc-sublist">';
      } else if (level < prevLevel) {
        html += "</ul>";
      }

      html += `
                <li class="toc-item">
                    <a href="#${id}" class="toc-link">${text}</a>
                </li>
            `;

      prevLevel = level;
    });

    html += "</ul>";
    return html;
  }

  generateHeaderId(header) {
    if (!header.id) {
      header.id = header.textContent
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
    }
    return header.id;
  }

  setupScrollSpy(headers) {
    const tocLinks = this.tocContainer.querySelectorAll(".toc-link");

    // Intersection Observer 설정
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = entry.target.getAttribute("id");
          const link = this.tocContainer.querySelector(`a[href="#${id}"]`);

          if (entry.isIntersecting) {
            link?.classList.add("active");
          } else {
            link?.classList.remove("active");
          }
        });
      },
      {
        rootMargin: "-20% 0px -80% 0px",
      }
    );

    // 각 헤더 관찰 시작
    headers.forEach((header) => observer.observe(header));

    // 부드러운 스크롤
    tocLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const targetId = link.getAttribute("href").substring(1);
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      });
    });
  }

  // 이미지 처리
  initImageHandling() {
    const images = this.postContent.querySelectorAll("img");

    images.forEach((img) => {
      // 이미지 로딩 최적화
      img.loading = "lazy";

      // 이미지 클릭시 라이트박스 열기
      img.addEventListener("click", () => {
        this.openLightbox(img.src);
      });
    });
  }

  openLightbox(src) {
    const lightbox = document.createElement("div");
    lightbox.className = "lightbox";
    lightbox.innerHTML = `
            <div class="lightbox-content">
                <img src="${src}" alt="확대된 이미지">
                <button class="lightbox-close">&times;</button>
            </div>
        `;

    // 클릭시 라이트박스 닫기
    lightbox.addEventListener("click", (e) => {
      if (
        e.target === lightbox ||
        e.target.classList.contains("lightbox-close")
      ) {
        lightbox.remove();
      }
    });

    document.body.appendChild(lightbox);
  }

  // 공유 버튼 초기화
  initShareButtons() {
    this.shareButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
        e.preventDefault();

        const url = window.location.href;
        const title = document.title;

        switch (button.dataset.platform) {
          case "twitter":
            window.open(
              `https://twitter.com/intent/tweet?url=${encodeURIComponent(
                url
              )}&text=${encodeURIComponent(title)}`
            );
            break;
          case "facebook":
            window.open(
              `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                url
              )}`
            );
            break;
          case "link":
            this.copyToClipboard(url);
            break;
        }
      });
    });
  }

  async copyToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text);
      alert("링크가 복사되었습니다!");
    } catch (err) {
      console.error("클립보드 복사 실패:", err);
      alert("링크 복사에 실패했습니다.");
    }
  }

  // 댓글 시스템 초기화
  initCommentSystem() {
    if (!this.commentForm) return;

    this.commentForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const textarea = this.commentForm.querySelector("textarea");
      if (!textarea.value.trim()) {
        alert("댓글 내용을 입력해주세요.");
        return;
      }

      // 티스토리 댓글 API 호출 또는 기본 동작 수행
      this.commentForm.submit();
    });
  }
}

// 페이지 로드시 PostManager 인스턴스 생성
document.addEventListener("DOMContentLoaded", () => {
  window.postManager = new PostManager();
});
