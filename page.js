// PageManager: 페이지 관련 기능을 관리하는 클래스
class PageManager {
  constructor() {
    // DOM 요소 캐싱
    this.pageContent = document.querySelector(".page-content");
    this.guestbookForm = document.querySelector(".guestbook_input");
    this.guestbookList = document.querySelector(".guestbook_list");

    // 초기화
    this.init();
  }

  init() {
    this.setupGuestbook();
    this.setupContentEnhancements();
    this.setupFormValidation();
    this.setupCommentActions();
  }

  // 방명록 기능 설정
  setupGuestbook() {
    if (!this.guestbookForm || !this.guestbookList) return;

    // 방명록 폼 제출 처리
    this.guestbookForm.addEventListener("submit", (e) => {
      const textarea = this.guestbookForm.querySelector("textarea");
      if (!textarea?.value.trim()) {
        e.preventDefault();
        this.showNotification("내용을 입력해주세요.", "error");
        textarea?.focus();
      }
    });

    // 새로운 방명록 작성 시 동적 업데이트
    this.setupDynamicUpdate();
  }

  // 방명록 동적 업데이트
  setupDynamicUpdate() {
    const config = { childList: true, subtree: true };

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
          mutation.addedNodes.forEach((node) => {
            if (node.classList?.contains("guestbook_item")) {
              this.animateNewComment(node);
            }
          });
        }
      });
    });

    if (this.guestbookList) {
      observer.observe(this.guestbookList, config);
    }
  }

  // 새 댓글 애니메이션
  animateNewComment(element) {
    element.style.opacity = "0";
    element.style.transform = "translateY(20px)";

    requestAnimationFrame(() => {
      element.style.transition = "all 0.5s ease";
      element.style.opacity = "1";
      element.style.transform = "translateY(0)";
    });
  }

  // 컨텐츠 개선
  setupContentEnhancements() {
    if (!this.pageContent) return;

    // 외부 링크 처리
    this.handleExternalLinks();

    // 이미지 처리
    this.handleImages();

    // 테이블 반응형 처리
    this.makeTablesResponsive();
  }

  // 외부 링크 처리
  handleExternalLinks() {
    const links = this.pageContent.querySelectorAll("a");

    links.forEach((link) => {
      const href = link.getAttribute("href");
      if (
        href &&
        href.startsWith("http") &&
        !href.includes(window.location.hostname)
      ) {
        link.setAttribute("target", "_blank");
        link.setAttribute("rel", "noopener noreferrer");

        // 외부 링크 아이콘 추가
        const icon = document.createElement("i");
        icon.className = "fas fa-external-link-alt";
        icon.style.marginLeft = "0.25em";
        icon.style.fontSize = "0.875em";
        link.appendChild(icon);
      }
    });
  }

  // 이미지 처리
  handleImages() {
    const images = this.pageContent.querySelectorAll("img");

    images.forEach((img) => {
      // 지연 로딩 설정
      img.loading = "lazy";

      // 이미지 래퍼 추가
      const wrapper = document.createElement("div");
      wrapper.className = "image-wrapper";
      img.parentNode.insertBefore(wrapper, img);
      wrapper.appendChild(img);

      // 이미지 클릭시 원본 크기로 보기
      img.addEventListener("click", () => {
        this.showImageViewer(img.src);
      });
    });
  }

  // 이미지 뷰어
  showImageViewer(src) {
    const viewer = document.createElement("div");
    viewer.className = "image-viewer";
    viewer.innerHTML = `
            <div class="viewer-content">
                <img src="${src}" alt="확대된 이미지">
                <button class="viewer-close">&times;</button>
            </div>
        `;

    viewer.addEventListener("click", (e) => {
      if (e.target === viewer || e.target.className === "viewer-close") {
        viewer.remove();
      }
    });

    document.body.appendChild(viewer);
  }

  // 테이블 반응형 처리
  makeTablesResponsive() {
    const tables = this.pageContent.querySelectorAll("table");

    tables.forEach((table) => {
      const wrapper = document.createElement("div");
      wrapper.className = "table-wrapper";
      table.parentNode.insertBefore(wrapper, table);
      wrapper.appendChild(table);
    });
  }

  // 폼 유효성 검사
  setupFormValidation() {
    const forms = this.pageContent.querySelectorAll("form");

    forms.forEach((form) => {
      form.addEventListener("submit", (e) => {
        const requiredFields = form.querySelectorAll("[required]");
        let isValid = true;

        requiredFields.forEach((field) => {
          if (!field.value.trim()) {
            e.preventDefault();
            isValid = false;
            this.showFieldError(field);
          }
        });

        if (!isValid) {
          this.showNotification("필수 항목을 입력해주세요.", "error");
        }
      });
    });
  }

  // 필드 에러 표시
  showFieldError(field) {
    field.classList.add("error");
    field.addEventListener(
      "input",
      () => {
        field.classList.remove("error");
      },
      { once: true }
    );
  }

  // 댓글 액션 설정
  setupCommentActions() {
    if (!this.guestbookList) return;

    this.guestbookList.addEventListener("click", (e) => {
      const target = e.target;

      // 수정 버튼
      if (target.matches(".edit-button")) {
        this.handleEdit(target);
      }

      // 삭제 버튼
      if (target.matches(".delete-button")) {
        this.handleDelete(target);
      }
    });
  }

  // 수정 처리
  handleEdit(button) {
    const commentItem = button.closest(".guestbook_item");
    const content = commentItem.querySelector(".guest_content");
    const originalText = content.textContent;

    // 수정 폼으로 변환
    content.innerHTML = `
            <textarea class="edit-textarea">${originalText}</textarea>
            <div class="edit-actions">
                <button class="save-edit">저장</button>
                <button class="cancel-edit">취소</button>
            </div>
        `;

    const editForm = content.querySelector(".edit-actions");
    editForm.addEventListener("click", (e) => {
      if (e.target.matches(".save-edit")) {
        const newText = content.querySelector(".edit-textarea").value;
        if (newText.trim()) {
          content.innerHTML = newText;
          this.showNotification("댓글이 수정되었습니다.", "success");
        }
      } else if (e.target.matches(".cancel-edit")) {
        content.innerHTML = originalText;
      }
    });
  }

  // 삭제 처리
  handleDelete(button) {
    if (confirm("정말 삭제하시겠습니까?")) {
      const commentItem = button.closest(".guestbook_item");
      commentItem.style.opacity = "0";
      commentItem.style.transform = "translateY(-20px)";

      setTimeout(() => {
        commentItem.remove();
        this.showNotification("댓글이 삭제되었습니다.", "success");
      }, 300);
    }
  }

  // 알림 표시
  showNotification(message, type = "info") {
    const notification = document.createElement("div");
    notification.className = `notification ${type}`;
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.opacity = "0";
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }
}

// 페이지 로드시 PageManager 인스턴스 생성
document.addEventListener("DOMContentLoaded", () => {
  window.pageManager = new PageManager();
});
