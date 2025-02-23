// ListManager: 리스트 페이지의 모든 기능을 관리하는 클래스
class ListManager {
  constructor() {
    // DOM 요소 캐싱
    this.listContent = document.querySelector(".list-content");
    this.articleList = document.querySelector(".article_list");
    this.pagination = document.querySelector(".pagination");

    // 초기화
    this.init();
  }

  init() {
    this.setupLazyLoading();
    this.setupImageHandling();
    this.setupFilterSystem();
    this.setupPagination();
    this.addEmptyStateHandling();
  }

  // 이미지 지연 로딩 설정
  setupLazyLoading() {
    const images = document.querySelectorAll(".thumbnail_post img");

    if ("IntersectionObserver" in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.add("loaded");
            imageObserver.unobserve(img);
          }
        });
      });

      images.forEach((img) => {
        if (img.dataset.src) {
          imageObserver.observe(img);
        }
      });
    } else {
      // IntersectionObserver가 지원되지 않는 브라우저를 위한 폴백
      images.forEach((img) => {
        if (img.dataset.src) {
          img.src = img.dataset.src;
        }
      });
    }
  }

  // 이미지 처리 개선
  setupImageHandling() {
    const thumbnails = document.querySelectorAll(".thumbnail_post");

    thumbnails.forEach((thumbnail) => {
      const img = thumbnail.querySelector("img");

      // 이미지 로드 에러 처리
      if (img) {
        img.onerror = () => {
          thumbnail.innerHTML = `
                        <div class="thumbnail-placeholder">
                            <i class="fas fa-image"></i>
                        </div>
                    `;
        };
      }

      // 이미지가 없는 경우 플레이스홀더 표시
      if (!img) {
        thumbnail.innerHTML = `
                    <div class="thumbnail-placeholder">
                        <i class="fas fa-image"></i>
                    </div>
                `;
      }
    });
  }

  // 필터 시스템 설정
  setupFilterSystem() {
    // 정렬 옵션 추가
    this.addSortingOptions();

    // 카테고리 필터 추가
    this.addCategoryFilter();
  }

  addSortingOptions() {
    const sortingContainer = document.createElement("div");
    sortingContainer.className = "sorting-options";
    sortingContainer.innerHTML = `
            <select class="sort-select">
                <option value="latest">최신순</option>
                <option value="popular">인기순</option>
                <option value="comments">댓글순</option>
            </select>
        `;

    // 정렬 이벤트 리스너
    const sortSelect = sortingContainer.querySelector(".sort-select");
    sortSelect.addEventListener("change", (e) => {
      const value = e.target.value;
      this.sortArticles(value);
    });

    // 리스트 상단에 삽입
    if (this.articleList) {
      this.articleList.parentNode.insertBefore(
        sortingContainer,
        this.articleList
      );
    }
  }

  sortArticles(criterion) {
    if (!this.articleList) return;

    const articles = Array.from(this.articleList.children);

    articles.sort((a, b) => {
      switch (criterion) {
        case "latest":
          return this.getDateValue(b) - this.getDateValue(a);
        case "popular":
          return this.getViewCount(b) - this.getViewCount(a);
        case "comments":
          return this.getCommentCount(b) - this.getCommentCount(a);
        default:
          return 0;
      }
    });

    // DOM 재구성
    articles.forEach((article) => this.articleList.appendChild(article));
  }

  getDateValue(article) {
    const dateElement = article.querySelector(".article_date");
    return dateElement ? new Date(dateElement.textContent).getTime() : 0;
  }

  getViewCount(article) {
    const viewElement = article.querySelector(".article_views");
    return viewElement ? parseInt(viewElement.textContent) : 0;
  }

  getCommentCount(article) {
    const commentElement = article.querySelector(".article_comments");
    return commentElement ? parseInt(commentElement.textContent) : 0;
  }

  addCategoryFilter() {
    const categories = this.getUniqueCategories();
    if (categories.length <= 1) return;

    const filterContainer = document.createElement("div");
    filterContainer.className = "category-filter";
    filterContainer.innerHTML = `
            <select class="category-select">
                <option value="all">전체 카테고리</option>
                ${categories
                  .map(
                    (category) => `
                    <option value="${category}">${category}</option>
                `
                  )
                  .join("")}
            </select>
        `;

    // 필터 이벤트 리스너
    const filterSelect = filterContainer.querySelector(".category-select");
    filterSelect.addEventListener("change", (e) => {
      const value = e.target.value;
      this.filterByCategory(value);
    });

    // 정렬 옵션 다음에 삽입
    const sortingOptions = document.querySelector(".sorting-options");
    if (sortingOptions) {
      sortingOptions.after(filterContainer);
    }
  }

  getUniqueCategories() {
    if (!this.articleList) return [];

    const categories = new Set();
    this.articleList
      .querySelectorAll(".article_category")
      .forEach((category) => {
        categories.add(category.textContent.trim());
      });
    return Array.from(categories);
  }

  filterByCategory(category) {
    if (!this.articleList) return;

    const articles = this.articleList.querySelectorAll(".article_rep");
    articles.forEach((article) => {
      const articleCategory = article
        .querySelector(".article_category")
        ?.textContent.trim();
      if (category === "all" || articleCategory === category) {
        article.style.display = "";
      } else {
        article.style.display = "none";
      }
    });
  }

  // 페이지네이션 설정
  setupPagination() {
    if (!this.pagination) return;

    // 페이지 이동 애니메이션
    const pageLinks = this.pagination.querySelectorAll("a");
    pageLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        // 티스토리 기본 동작은 유지하고 로딩 표시만 추가
        this.showLoadingState();
      });
    });
  }

  showLoadingState() {
    const loader = document.createElement("div");
    loader.className = "page-loader";
    loader.innerHTML = '<div class="loader-spinner"></div>';
    document.body.appendChild(loader);

    // 페이지 전환 시 자동으로 제거됨
    setTimeout(() => loader.remove(), 5000); // 안전장치
  }

  // 빈 상태 처리
  addEmptyStateHandling() {
    if (!this.articleList || this.articleList.children.length > 0) return;

    const emptyState = document.createElement("div");
    emptyState.className = "empty-state";
    emptyState.innerHTML = `
            <div class="empty-icon">📝</div>
            <p>아직 작성된 글이 없습니다.</p>
        `;

    this.articleList.appendChild(emptyState);
  }
}

// 페이지 로드시 ListManager 인스턴스 생성
document.addEventListener("DOMContentLoaded", () => {
  window.listManager = new ListManager();
});
