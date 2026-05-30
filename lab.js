/**
 * JS Lab - 데이터 처리 및 인터랙션 로직
 * 활용 기술: 배열, 객체, DOM 조작, 이벤트 처리, LocalStorage, 배열 메서드(filter, map, forEach)
 */

document.addEventListener('DOMContentLoaded', function() {
    
    // ============================================
    // 1. Dynamic Skills (배열 및 객체 처리)
    // ============================================
    
    // 스킬 데이터 (객체 배열)
    const skillsData = [
        { name: 'HTML5', category: 'frontend', level: '20%', color: 'bg-danger' },
        { name: 'CSS3', category: 'frontend', level: '23%', color: 'bg-primary' },
        { name: 'JavaScript', category: 'frontend', level: '32%', color: 'bg-warning' },
        { name: 'Python', category: 'backend', level: '10%', color: 'bg-info' },
        { name: 'Linux', category: 'backend', level: '32%', color: 'bg-secondary' },
        { name: 'Java', category: 'backend', level: '29%', color: 'bg-danger' },
        { name: 'Security', category: 'backend', level: '40%', color: 'bg-dark' },
        { name: 'Git', category: 'tools', level: '60%', color: 'bg-success' },
        { name: 'n8n', category: 'tools', level: '1%', color: 'bg-danger' },
        { name: 'Bootstrap', category: 'frontend', level: '55%', color: 'bg-primary' }
    ];

    const skillsContainer = document.getElementById('skillsContainer');
    const filterButtons = document.querySelectorAll('.filter-btn');

    /**
     * 스킬 렌더링 함수 (배열 메서드 활용)
     * @param {string} filter - 카테고리 필터
     */
    function renderSkills(filter = 'all') {
        // 필터링 (Array.filter)
        const filteredSkills = filter === 'all' 
            ? skillsData 
            : skillsData.filter(skill => skill.category === filter);

        // HTML 생성 (Array.map & join)
        skillsContainer.innerHTML = filteredSkills.map(skill => `
            <div class="col-md-4 col-sm-6 fade-in">
                <div class="card h-100 shadow-sm hover-card">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-center mb-2">
                            <h5 class="card-title mb-0">${skill.name}</h5>
                            <span class="badge ${skill.color}">${skill.category}</span>
                        </div>
                        <div class="progress" style="height: 10px;">
                            <div class="progress-bar ${skill.color}" role="progressbar" 
                                 style="width: ${skill.level}" aria-valuenow="${parseInt(skill.level)}" 
                                 aria-valuemin="0" aria-valuemax="100"></div>
                        </div>
                        <small class="text-muted mt-2 d-block">숙련도: ${skill.level}</small>
                    </div>
                </div>
            </div>
        `).join('');
    }

    // 필터 버튼 이벤트 리스너
    filterButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            // 버튼 활성화 상태 변경
            filterButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            // 데이터 필터링 및 재렌더링
            const filterValue = this.getAttribute('data-filter');
            renderSkills(filterValue);
        });
    });

    // 초기 렌더링
    renderSkills();


    // ============================================
    // 2. Guestbook (LocalStorage 및 이벤트 처리)
    // ============================================

    const guestbookForm = document.getElementById('guestbookForm');
    const guestbookList = document.getElementById('guestbookList');
    const nicknameInput = document.getElementById('nickname');
    const messageInput = document.getElementById('message');

    // 로컬 스토리지에서 데이터 불러오기 (JSON 파싱)
    let messages = JSON.parse(localStorage.getItem('guestbookMessages')) || [
        { id: 1, nickname: '방명록', message: '테스트 메세지', date: '2026-05-29' }
    ];

    /**
     * 방명록 렌더링 함수
     */
    function renderGuestbook() {
        if (messages.length === 0) {
            guestbookList.innerHTML = '<p class="text-center text-muted my-5"> 방명록이 비어 있습니다.</p>';
            return;
        }

        // 최신순 정렬 후 렌더링
        guestbookList.innerHTML = [...messages].reverse().map((msg, index) => `
            <div class="card guestbook-item shadow-sm fade-in-up visible" style="animation-delay: ${index * 0.1}s">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-start mb-2">
                        <h6 class="fw-bold mb-0">${msg.nickname}</h6>
                        <small class="text-muted">${msg.date}</small>
                    </div>
                    <p class="card-text mb-0">${msg.message}</p>
                    <div class="text-end mt-2">
                        <button class="btn btn-sm btn-link text-danger p-0" onclick="deleteMessage(${msg.id})">삭제</button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    /**
     * 메시지 추가 함수
     */
    guestbookForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // 폼 유효성 검사 (간단한 예시)
        if (!nicknameInput.value.trim() || !messageInput.value.trim()) {
            guestbookForm.classList.add('was-validated');
            return;
        }

        // 새 메시지 객체 생성
        const newMessage = {
            id: Date.now(),
            nickname: nicknameInput.value.trim(),
            message: messageInput.value.trim(),
            date: new Date().toISOString().split('T')[0]
        };

        // 배열에 추가 및 로컬 스토리지 저장
        messages.push(newMessage);
        localStorage.setItem('guestbookMessages', JSON.stringify(messages));

        // 폼 초기화 및 렌더링
        guestbookForm.reset();
        guestbookForm.classList.remove('was-validated');
        renderGuestbook();

    });

    /**
     * 메시지 삭제 함수 (전역 스코프에 노출)
     */
    window.deleteMessage = function(id) {
        if (confirm('정말 삭제하시겠습니까?')) {
            messages = messages.filter(msg => msg.id !== id);
            localStorage.setItem('guestbookMessages', JSON.stringify(messages));
            renderGuestbook();
        }
    };

    // 초기 렌더링
    renderGuestbook();

});
