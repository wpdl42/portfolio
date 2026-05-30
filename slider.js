/**
 * 팀 프로젝트 드래그 슬라이더 및 동적 상세 정보 로직
 */

document.addEventListener('DOMContentLoaded', function() {
    const sliderContainer = document.getElementById('sliderContainer');
    const projectCards = document.querySelectorAll('.project-card');
    const detailBox = document.getElementById('projectDetail');
    const detailContent = document.getElementById('detailContent');

    // 팀원 상세 데이터 (image 경로를 추가하여 직접 이미지를 넣으실 수 있습니다)
    const membersData = {
        '장주민': { github: 'https://github.com/wpdl42', blog: 'https://it-bookmark.tistory.com/', role: 'Frontend', image: 'img/jumin.png', bio: '_팀원_' },
        '안성원': { github: '#', blog: '#', role: 'Frontend', image: 'img/anseongwon.jpg', bio: '_팀장_' },
        '장  현': { github: '#', blog: '#', role: 'Frontend', image: 'img/hyun.jpg', bio: '_팀원_' },
        '최윤성': { github: '#', blog: '#', role: 'Frontend', image: 'img/ys.png', bio: '_팀원_' },
        '팀원 A': { github: '#', blog: '#', role: 'UI Designer', image: '', bio: '심미성과 사용성을 동시에 잡는 디자인을 지향합니다.' },
        '팀원 B': { github: '#', blog: '#', role: 'Frontend', image: '', bio: '최신 웹 기술을 탐구하고 적용하는 것을 즐깁니다.' },
        '팀원 C': { github: '#', blog: '#', role: 'Security Analyst', image: '', bio: '안전한 디지털 세상을 위해 보안 취약점을 분석합니다.' },
        '팀원 D': { github: '#', blog: '#', role: 'System Admin', image: '', bio: '안정적인 인프라 운영과 자동화를 책임집니다.' },
        '팀원 E': { github: '#', blog: '#', role: 'Automation Engineer', image: '', bio: '반복되는 업무를 효율적으로 자동화하는 전문가입니다.' },
        '팀원 F': { github: '#', blog: '#', role: 'Backend Developer', image: '', bio: '데이터의 흐름을 최적화하고 안정적인 서버를 구축합니다.' },
        '팀원 G': { github: '#', blog: '#', role: 'Database Admin', image: '', bio: '데이터의 무결성과 효율적인 쿼리 성능을 보장합니다.' },
        '팀원 H': { github: '#', blog: '#', role: 'Full Stack', image: '', bio: '프론트와 백엔드를 아우르는 폭넓은 기술 스택을 보유하고 있습니다.' }
    };

    // 프로젝트 상세 데이터 (객체 배열)
    const projectsData = {
        '1': {
            title: 'NeoCore Team Project',
            members: ['안성원', '장주민', '장  현', '최윤성'],
            description: '중간고사 및 기말고사 평가 프로젝트 입니다. 학기중 학습한 웹 프로그래밍 기술을 활용하여 협업경험을 쌓고, 실제 웹 사이트 제작을 목표로 진행했습니다. 주제는 AI으로 선정되었으며, 아직 팀플 완성 안되서 생략합니다.',
            role: '프론트엔드 개발 및 UI Design',
            period: '2026.04 - 2026.06',
            link: 'https://neo-core-ai.vercel.app/' 
        },
        '2': {
            title: 'Java 학사관리 시스템',
            members: ['장주민', '팀원 C'],
            description: '교내 네트워크 환경에서의 보안 취약점을 점검하고, 방화벽 설정 및 침입 탐지 시스템(IDS) 구축 시나리오를 설계한 프로젝트입니다.',
            role: '취약점 스캐닝 및 보고서 작성',
            period: '2023.09 - 2023.12',
            link: '#'
        },
        '3': {
            title: '서버 자동화 구축',
            members: ['장주민', '팀원 D', '팀원 E'],
            description: 'n8n 워크플로우 자동화 도구와 리눅스 서버를 연동하여, 매일 특정 시간대에 데이터를 수집하고 텔레그램으로 알림을 보내는 시스템을 구축했습니다.',
            role: '리눅스 서버 관리 및 n8n 워크플로우 설계',
            period: '2024.01 - 2024.02',
            link: '#'
        },
        '4': {
            title: '커뮤니티 플랫폼 개발',
            members: ['장주민', '팀원 F', '팀원 G', '팀원 H'],
            description: '정보보호학과 학생들을 위한 지식 공유 커뮤니티 플랫폼입니다. 게시판 기능, 자료실, 실시간 채팅 기능을 포함하고 있습니다.',
            role: 'DB 스키마 설계 및 백엔드 API 보조',
            period: '2023.03 - 2023.06',
            link: '#'// 실제 프로젝트 URL을 여기에 넣으세요
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

        // 팀원 섹션 숨기기 (새 프로젝트 클릭 시)
        const membersSection = document.getElementById('teamMembersSection');
        membersSection.style.display = 'none';

        // 상세 내용 생성
        detailContent.innerHTML = `
            <div class="detail-content-wrapper">
                <div class="row">
                    <div class="col-md-8">
                        <div class="d-flex justify-content-between align-items-start mb-3">
                            <div>
                                <h2 class="fw-bold mb-1">${data.title}</h2>
                                <p class="text-muted mb-0">${data.period}</p>
                            </div>
                            ${data.link && data.link !== '#' ? `
                                <a href="${data.link}" target="_blank" class="btn btn-primary btn-sm px-4 py-2 rounded-pill shadow-sm">
                                    <i class="fas fa-external-link-alt me-2"></i>프로젝트 방문하기
                                </a>
                            ` : `
                                <button class="btn btn-outline-secondary btn-sm px-4 py-2 rounded-pill disabled" style="opacity: 0.6;">
                                    준비 중인 프로젝트
                                </button>
                            `}
                        </div>
                        <hr class="my-4 opacity-10">
                        <h5 class="fw-bold mb-2">프로젝트 소개</h5>
                        <p class="lead mb-4" style="font-size: 1.1rem;">${data.description}</p>
                        <h5 class="fw-bold mb-2">주요 역할</h5>
                        <p>${data.role}</p>
                    </div>
                    <div class="col-md-4 border-start">
                        <div id="membersClickArea" class="p-3 rounded hover-effect" style="cursor: pointer; transition: all 0.3s ease;">
                            <h5 class="fw-bold mb-3">참여 팀원 <small style="font-size: 0.7rem; color: #007bff;">(클릭 시 소개 이동)</small></h5>
                            <div class="d-flex flex-wrap">
                                ${data.members.map(m => `<span class="member-badge">${m}</span>`).join('')}
                            </div>
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
            
            // 참여 팀원 영역 클릭 이벤트 추가
            const membersClickArea = document.getElementById('membersClickArea');
            membersClickArea.addEventListener('click', () => {
                showTeamMembers(data.members);
            });
        }, 100);
    }

    function showTeamMembers(members) {
        const membersSection = document.getElementById('teamMembersSection');
        const membersList = document.getElementById('membersList');
        
        // 팀원 카드 생성
        membersList.innerHTML = members.map(name => {
            const mData = membersData[name] || { github: '#', blog: '#', role: 'Team Member', image: '', bio: '프로젝트의 성공을 위해 최선을 다한 소중한 팀원입니다.' };
            
            // 이미지가 있으면 이미지를 보여주고, 없으면 이름 첫 글자 아이콘을 보여줌
            const profileDisplay = mData.image 
                ? `<img src="${mData.image}" alt="${name}" class="rounded-circle shadow-sm" style="width: 80px; height: 80px; object-fit: cover;">`
                : `<div class="rounded-circle bg-primary text-white d-inline-flex align-items-center justify-content-center shadow-sm" style="width: 80px; height: 80px; font-size: 2rem;">${name[0]}</div>`;

            return `
                <div class="col-md-4 col-lg-3 fade-in-up">
                    <div class="card h-100 shadow-sm text-center p-4 hover-card">
                        <div class="mb-3">
                            ${profileDisplay}
                        </div>
                        <h5 class="fw-bold mb-1">${name}</h5>
                        <p class="text-primary small mb-3">${mData.role}</p>
                        <p class="small text-muted mb-4">${mData.bio}</p>
                        <div class="d-flex justify-content-center gap-2 mt-auto">
                            <a href="${mData.github}" target="_blank" class="btn btn-outline-dark btn-sm px-3" ${mData.github === '#' ? 'onclick="return false;" style="opacity:0.5; cursor:default;"' : ''}>GitHub</a>
                            <a href="${mData.blog}" target="_blank" class="btn btn-outline-primary btn-sm px-3" ${mData.blog === '#' ? 'onclick="return false;" style="opacity:0.5; cursor:default;"' : ''}>Blog</a>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        // 섹션 표시
        membersSection.style.display = 'block';
        
        // 부드럽게 스크롤 이동
        setTimeout(() => {
            membersSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    }
});
