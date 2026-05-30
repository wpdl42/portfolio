
//다크모드 테마 토글 기능
//로컬 스토리지에 사용자 선택을 저장하여 페이지 재방문 시 유지

document.addEventListener('DOMContentLoaded', function() {
  const themeToggle = document.getElementById('themeToggle');
  const htmlElement = document.documentElement;
  const body = document.body;

  // 저장된 테마 설정 불러오기
  const savedTheme = localStorage.getItem('theme') || 'light';
  
  // 초기 테마 적용
  applyTheme(savedTheme);

  // 테마 토글 버튼 클릭 이벤트
  themeToggle.addEventListener('click', function() {
    const currentTheme = body.classList.contains('dark-mode') ? 'dark' : 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    applyTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  });


  // 이 주석 처리는 신기하네
  /**
   * 테마 적용 함수
   * @param {string} theme - 'light' 또는 'dark'
   */
  function applyTheme(theme) {
    const themeIcon = document.querySelector('.theme-icon');
    
    if (theme === 'dark') {
      body.classList.add('dark-mode');
      htmlElement.setAttribute('data-bs-theme', 'dark');
      themeIcon.textContent = '☀️';
      themeIcon.title = '라이트 모드로 전환';
    } else {
      body.classList.remove('dark-mode');
      htmlElement.setAttribute('data-bs-theme', 'light');
      themeIcon.textContent = '🌙';
      themeIcon.title = '다크 모드로 전환';
    }
  }

  // 시스템 다크모드 감지 (사용자가 선택하지 않았을 때만)
  if (!localStorage.getItem('theme')) {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    applyTheme(prefersDark ? 'dark' : 'light');
  }
});
