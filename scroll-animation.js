/**
 * 스크롤 애니메이션 및 상단 이동 버튼 기능
 */

document.addEventListener('DOMContentLoaded', function() {
  // 상단 이동 버튼 요소
  const scrollTopBtn = document.getElementById('scrollTopBtn');

  // ============================================
  // 상단 이동 버튼 기능
  // ============================================

  // 스크롤 이벤트 리스너
  window.addEventListener('scroll', function() {
    if (scrollTopBtn) {
      if (window.scrollY > 300) {
        scrollTopBtn.classList.add('show');
      } else {
        scrollTopBtn.classList.remove('show');
      }
    }
  });

  // 상단 이동 버튼 클릭 이벤트
  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', function(e) {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // ============================================
  // 스크롤 애니메이션 (Intersection Observer)
  // ============================================

  // Intersection Observer 설정
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
  };

  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // 요소가 뷰포트에 진입할 때 visible 클래스 추가
        entry.target.classList.add('visible');
        // 한 번 애니메이션이 실행되면 관찰 중지
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // fade-in-up 클래스를 가진 모든 요소 관찰
  const fadeInElements = document.querySelectorAll('.fade-in-up');
  fadeInElements.forEach(element => {
    observer.observe(element);
  });

  // ============================================
  // 부드러운 스크롤 (앵커 링크)
  // ============================================

  // 모든 앵커 링크에 부드러운 스크롤 적용
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href !== '#' && document.querySelector(href)) {
        e.preventDefault();
        const target = document.querySelector(href);
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // ============================================
  // 네비게이션 바 활성 링크 표시
  // ============================================

  function updateActiveLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      
      // 현재 페이지와 링크 href 비교
      if (href === currentPage || 
          (currentPage === '' && href === 'index.html') ||
          (currentPage === '/' && href === 'index.html')) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  // 페이지 로드 시 활성 링크 업데이트
  updateActiveLink();

  // ============================================
  // 페이드인 애니메이션 초기화
  // ============================================

  // 페이지 로드 시 fade-in 클래스 요소들이 보이도록 설정
  const fadeInInstant = document.querySelectorAll('.fade-in');
  fadeInInstant.forEach(element => {
    element.style.opacity = '1';
  });

  // ============================================
  // 카드 호버 효과 개선
  // ============================================

  const hoverCards = document.querySelectorAll('.hover-card');
  hoverCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.style.transition = 'all 0.3s ease';
    });

    card.addEventListener('mouseleave', function() {
      this.style.transition = 'all 0.3s ease';
    });
  });

  // ============================================
  // 페이지 전환 시 스크롤 위치 초기화
  // ============================================

  // 페이지 로드 시 스크롤을 맨 위로 이동
  window.addEventListener('pageshow', function() {
    window.scrollTo(0, 0);
  });

  // ============================================
  // 모바일 네비게이션 자동 닫기
  // ============================================

  const navbarCollapse = document.querySelector('.navbar-collapse');
  const navLinks = document.querySelectorAll('.navbar-collapse .nav-link');

  navLinks.forEach(link => {
    link.addEventListener('click', function() {
      // 외부 링크가 아닌 경우에만 네비게이션 닫기
      if (!this.getAttribute('href').startsWith('http')) {
        const bsCollapse = new bootstrap.Collapse(navbarCollapse, {
          toggle: false
        });
        bsCollapse.hide();
      }
    });
  });
});

// ============================================
// 페이지 언로드 시 스크롤 위치 저장
// ============================================

window.addEventListener('beforeunload', function() {
  sessionStorage.setItem('scrollPosition', window.scrollY);
});

// 페이지 로드 시 저장된 스크롤 위치로 이동
window.addEventListener('load', function() {
  const scrollPosition = sessionStorage.getItem('scrollPosition');
  if (scrollPosition) {
    window.scrollTo(0, parseInt(scrollPosition));
    sessionStorage.removeItem('scrollPosition');
  }
});
