/**
 * 팀 프로젝트 드래그 슬라이더 및 동적 상세 정보 로직
 */

document.addEventListener('DOMContentLoaded', function() {
    const sliderContainer = document.getElementById('sliderContainer');
    const projectCards = document.querySelectorAll('.project-card');
    const detailBox = document.getElementById('projectDetail');
    const detailContent = document.getElementById('detailContent');

    // 프로젝트 상세 데이터 (객체 배열)
    const projectsData = {
        '1': {
            title: '웹 프로그래밍 프로젝트 1',
            members: ['장주민', '팀원 A', '팀원 B'],
            description: '부트스트랩과 바닐라 자바스크립트를 활용하여 제작한 개인 포트폴리오 사이트입니다. 다크모드, 애니메이션 효과, 동적 데이터 처리 등을 포함하고 있습니다.',
            role: '프론트엔드 개발 및 UI/UX 디자인',
            period: '2024.03 - 2024.05'
        },
        '2': {
            title: '네트워크 보안 분석',
            members: ['장주민', '팀원 C'],
            description: '교내 네트워크 환경에서의 보안 취약점을 점검하고, 방화벽 설정 및 침입 탐지 시스템(IDS) 구축 시나리오를 설계한 프로젝트입니다.',
            role: '취약점 스캐닝 및 보고서 작성',
            period: '2023.09 - 2023.12'
        },
        '3': {
            title: '서버 자동화 구축',
            members: ['장주민', '팀원 D', '팀원 E'],
            description: 'n8n 워크플로우 자동화 도구와 리눅스 서버를 연동하여, 매일 특정 시간대에 데이터를 수집하고 텔레그램으로 알림을 보내는 시스템을 구축했습니다.',
            role: '리눅스 서버 관리 및 n8n 워크플로우 설계',
            period: '2024.01 - 2024.02'
        },
        '4': {
            title: '커뮤니티 플랫폼 개발',
            members: ['장주민', '팀원 F', '팀원 G', '팀원 H'],
            description: '정보보호학과 학생들을 위한 지식 공유 커뮤니티 플랫폼입니다. 게시판 기능, 자료실, 실시간 채팅 기능을 포함하고 있습니다.',
            role: 'DB 스키마 설계 및 백엔드 API 보조',
            period: '2023.03 - 2023.06'
        }
    };

    let isDragging = false;
    let startX;
    let scrollLeft;
    let currentTranslate = 0;
    let prevTranslate = 0;
    let animationID;
    let currentIndex = 0;
    let isMoving = false; // 실제 드래그 이동 여부 확인

    // 초기 설정: 첫 번째 카드 중앙 배치
    updateSlider();

    // 화면 크기 변경 시 재계산
    window.addEventListener('resize', updateSlider);

    // 마우스 이벤트
    sliderContainer.addEventListener('mousedown', dragStart);
    sliderContainer.addEventListener('touchstart', dragStart);

    window.addEventListener('mousemove', dragAction);
    window.addEventListener('touchmove', dragAction);

    window.addEventListener('mouseup', dragEnd);
    window.addEventListener('touchend', dragEnd);

    function dragStart(e) {
        isDragging = true;
        isMoving = false;
        startX = getPositionX(e);
        sliderContainer.style.transition = 'none';
        cancelAnimationFrame(animationID);
    }

    function dragAction(e) {
        if (!isDragging) return;
        const currentX = getPositionX(e);
        const diff = currentX - startX;
        
        // 미세한 움직임은 드래그로 치지 않음 (클릭 보호)
        if (Math.abs(diff) > 5) {
            isMoving = true;
        }

        currentTranslate = prevTranslate + diff;
        setSliderPosition();
    }

    function dragEnd() {
        if (!isDragging) return;
        isDragging = false;
        
        // 가장 가까운 카드로 스냅
        const movedBy = currentTranslate - prevTranslate;
        
        // 드래그 거리가 충분할 때만 페이지 전환
        if (movedBy < -100 && currentIndex < projectCards.length - 1) {
            currentIndex += 1;
        } else if (movedBy > 100 && currentIndex > 0) {
            currentIndex -= 1;
        }

        updateSlider();
        
        // 드래그가 끝난 후 아주 짧은 시간 동안만 isMoving 유지 (클릭 방지용)
        setTimeout(() => {
            isMoving = false;
        }, 50);
    }

    function getPositionX(e) {
        return e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
    }

    function setSliderPosition() {
        sliderContainer.style.transform = `translateX(${currentTranslate}px)`;
    }

    function updateSlider() {
        const containerWidth = sliderContainer.parentElement.offsetWidth;
        const card = projectCards[currentIndex];
        const cardWidth = card.offsetWidth;
        
        // 실제 적용된 gap 값을 계산 (브라우저 계산값 사용)
        const style = window.getComputedStyle(sliderContainer);
        const gap = parseInt(style.gap) || 0;
        
        // 중앙 정렬 오프셋: (화면중앙) - (현재카드너비/2) - (현재카드까지의 누적 거리)
        // 누적 거리 = 인덱스 * (카드너비 + 간격)
        currentTranslate = (containerWidth / 2) - (cardWidth / 2) - (currentIndex * (cardWidth + gap));
        
        prevTranslate = currentTranslate;
        
        sliderContainer.style.transition = 'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)';
        setSliderPosition();

        // 활성 카드 표시
        projectCards.forEach((card, index) => {
            if (index === currentIndex) {
                card.classList.add('active');
            } else {
                card.classList.remove('active');
            }
        });
    }

    // 카드 클릭 이벤트 (상세 정보 표시)
    projectCards.forEach((card, index) => {
        card.addEventListener('click', () => {
            // 드래그 중이었다면 클릭 무시
            if (isMoving) return;

            // 클릭한 카드가 중앙이 아니면 중앙으로 이동
            if (index !== currentIndex) {
                currentIndex = index;
                updateSlider();
                return;
            }

            // 중앙 카드 클릭 시 상세 정보 표시
            const projectId = card.getAttribute('data-project');
            showDetail(projectId);
        });
    });

    function showDetail(id) {
        const data = projectsData[id];
        if (!data) return;

        // 상세 내용 생성
        detailContent.innerHTML = `
            <div class="detail-content-wrapper">
                <div class="row">
                    <div class="col-md-8">
                        <h2 class="fw-bold mb-3">${data.title}</h2>
                        <p class="text-muted mb-4">${data.period}</p>
                        <h5 class="fw-bold mb-2">프로젝트 소개</h5>
                        <p class="lead mb-4" style="font-size: 1.1rem;">${data.description}</p>
                        <h5 class="fw-bold mb-2">주요 역할</h5>
                        <p>${data.role}</p>
                    </div>
                    <div class="col-md-4 border-start">
                        <h5 class="fw-bold mb-3">참여 팀원</h5>
                        <div class="d-flex flex-wrap">
                            ${data.members.map(m => `<span class="member-badge">${m}</span>`).join('')}
                        </div>
                    </div>
                </div>
            </div>
        `;

        // 박스 표시
        detailBox.classList.add('show');
        
        // 상세 정보 영역으로 부드럽게 스크롤
        setTimeout(() => {
            detailBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
    }
});
