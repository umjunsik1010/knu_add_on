// 기존 gradecalData 객체는 JSON 데이터를 fetch로 가져오므로 비워둡니다.
const gradecalData = {}; 

document.addEventListener('DOMContentLoaded', function() {
    // 1. 필요한 HTML 요소 가져오기
    const yearSelect = document.getElementById('admissionYear');
    const univSelect = document.getElementById('major1');
    const deptSelect = document.getElementById('major2');
    const majorCreditInput = document.getElementById('majorCredit');
    const liberalCreditInput = document.getElementById('liberalCredit');
    const submitBtn = document.getElementById('submitBtn');
    const resultBox = document.getElementById('resultBox');
    const resultText = resultBox.querySelector('.result-text');

    if (!yearSelect || !univSelect || !deptSelect || !majorCreditInput || !liberalCreditInput || !submitBtn || !resultBox || !resultText) {
        console.error('필수 HTML 요소를 찾을 수 없습니다.');
        return;
    }

    let creditData = {}; 

    // --- 교양 세부 요건 정의 (연도별) ---
    const liberalRequirements = {
        '2019': { requiredLiberal: 24, details: '영역별 필수과목 없음. 교양 총 24학점 이상 이수.' },
        '2020': { requiredLiberal: 24, details: '영역별 필수과목 없음. 교양 총 24학점 이상 이수.' },
        '2021': { requiredLiberal: 24, details: '영역별 필수과목 없음. 교양 총 24학점 이상 이수.' },
        '2022': { requiredLiberal: 24, details: '영역별 필수과목 없음. 교양 총 24학점 이상 이수.' },
        '2023': { 
            requiredLiberal: 30,
            details: `
                <div style="font-weight: 700; color: #2563eb; margin-top: 15px;">※ 교양 세부 이수 기준 (총 ${30}학점 이상)</div>
                <ul style="margin-top: 5px; padding-left: 20px; list-style-type: disc;">
                    <li>SDG 교양 3학점 포함 이수 필요.</li>
                    <li>첨성인 기초(독서와 토론, 사고교육, 글쓰기, 외국어 중 3학점 이상) 이수 필요.</li>
                    <li>첨성인 핵심 - 인문·사회 영역 3학점 이상 이수 필요.</li>
                    <li>첨성인 핵심 - 자연·과학 영역 3학점 이상 이수 필요.</li>
                </ul>
                <p style="margin-top: 10px; font-size: 0.9rem; color: #6b7280;">※ 일반편입생, 외국인 학생은 영역 구분 없이 이수</p>
            `,
            requiredSDG: 3,
            requiredBasic: 3,
            requiredHSS: 3,
            requiredNS: 3
        },
        '2024': { 
            requiredLiberal: 30, 
            details: `
                <div style="font-weight: 700; color: #2563eb; margin-top: 15px;">※ 교양 세부 이수 기준 (총 ${30}학점 이상)</div>
                <ul style="margin-top: 5px; padding-left: 20px; list-style-type: disc;">
                    <li>SDG 교양 3학점 포함 이수 필요. (일반편입생, 외국인 학생 제외)</li>
                    <li>첨성인 기초 (독서와 토론, 사고교육, 글쓰기, 외국어 중 3학점 이상) 이수 필요.</li>
                    <li>첨성인 핵심 - 인문·사회 영역 3학점 이상 이수 필요.</li>
                    <li>첨성인 핵심 - 자연·과학 영역 3학점 이상 이수 필요.</li>
                </ul>
                <p style="margin-top: 10px; font-size: 0.9rem; color: #6b7280;">※ 일반편입생, 외국인 학생은 영역 구분 없이 이수</p>
            `,
            requiredSDG: 3,
            requiredBasic: 3,
            requiredHSS: 3,
            requiredNS: 3
        },
        '2025': { 
            requiredLiberal: 30, 
            details: `
                <div style="font-weight: 700; color: #2563eb; margin-top: 15px;">※ 교양 세부 이수 기준 (총 ${30}학점 이상)</div>
                <ul style="margin-top: 5px; padding-left: 20px; list-style-type: disc;">
                    <li>SDG 교양 3학점 포함 이수 필요. (일반편입생, 외국인 학생 제외)</li>
                    <li>첨성인 기초 (독서와 토론, 사고교육, 글쓰기, 외국어 중 3학점 이상) 이수 필요.</li>
                    <li>첨성인 핵심 - 인문·사회 영역 3학점 이상 이수 필요.</li>
                    <li>첨성인 핵심 - 자연·과학 영역 3학점 이상 이수 필요.</li>
                </ul>
                <p style="margin-top: 10px; font-size: 0.9rem; color: #6b7280;">※ 일반편입생, 외국인 학생은 영역 구분 없이 이수</p>
            `,
            requiredSDG: 3,
            requiredBasic: 3,
            requiredHSS: 3,
            requiredNS: 3
        }
    };


    // --- 데이터 로드 및 가공 함수 (변경 없음) ---
    async function loadAndProcessData() {
        try {
            const response = await fetch('/api/gradecal');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const rawData = await response.json();

            const processedData = {};
            rawData.forEach(item => {
                const year = item['년도'];
                const univ = item.estblUnivNm;
                const dept = item.estblDprtnNm;

                if (!processedData[year]) {
                    processedData[year] = {};
                }
                if (!processedData[year][univ]) {
                    processedData[year][univ] = {};
                }

                processedData[year][univ][dept] = {
                    total: item['졸업학점'],
                    major: item['전공이수학점'],
                    liberal: item['교양이수학점'] 
                };
            });
            
            creditData = processedData;
            initializeSelects();
            
        } catch (e) {
            console.error('데이터 로드 또는 파싱 오류:', e);
            resultText.innerHTML = '⚠️ 졸업 요건 데이터를 불러오는 데 실패했습니다.';
            resultBox.style.display = 'block';
            univSelect.disabled = true;
            deptSelect.disabled = true;
        }
    }

    // --- 초기화 함수 (변경 없음) ---
    function initializeSelects() {
        const years = Object.keys(creditData).sort((a, b) => b - a); 
        
        yearSelect.innerHTML = '<option value="">입학년도 선택</option>';
        univSelect.innerHTML = '<option value="">대학 선택</option>';
        deptSelect.innerHTML = '<option value="">전공 선택</option>';
        
        years.forEach(year => {
            const option = new Option(year, year);
            yearSelect.add(option);
            option.style.borderRadius='8px';
        });
        
        univSelect.disabled = false;
        deptSelect.disabled = false;

        univSelect.classList.add('locked');
        deptSelect.classList.add('locked');

        univSelect.classList.remove('has-value');
        deptSelect.classList.remove('has-value');
        yearSelect.classList.remove('has-value');

        resultBox.style.display = 'none';
    }

    // --- 이벤트 리스너 ---

    // 대학 선택 시 (특수 요건을 결과 계산 시에만 표시하도록 변경했으므로, 대학 선택 시에는 결과 박스만 숨깁니다.)
    univSelect.addEventListener('change', function() {
        const selectedYear = yearSelect.value;
        const selectedUniv = this.value;

        toggleHasValue(this);
        
        updateDepartmentOptions(selectedYear, selectedUniv);
        
        resultBox.style.display = 'none'; 
    });

    yearSelect.addEventListener('change', function() {
        const selectedYear = this.value;
        toggleHasValue(this);
        updateUniversityOptions(selectedYear);
        resultBox.style.display = 'none'; 
    });

    deptSelect.addEventListener('change', function() {
        toggleHasValue(this);
        resultBox.style.display = 'none';
    });
    
    majorCreditInput.addEventListener('input', function() { 
        toggleInputStyle(this); 
        resultBox.style.display = 'none';
    });
    liberalCreditInput.addEventListener('input', function() { 
        toggleInputStyle(this); 
        resultBox.style.display = 'none';
    });
    // 입학년도 먼저 입력 부탁드립니다.
    // 공통으로 사용할 잠금 확인 함수
    function checkLocked(e) {
        // 만약 yearSelect에 값이 없다면 (아직 입학년도 선택 안 함)
        if (yearSelect.value === "") {
            e.preventDefault(); // 드롭다운이 열리는 것을 막음 (핵심!)
            this.blur();        // 포커스를 해제해서 깜빡임 방지
            alert("입학년도를 먼저 선택해주세요"); // 알림창 띄우기
            return false;
        }
    }

    // 대학 선택창을 누를 때 검사
    univSelect.addEventListener('mousedown', checkLocked);

    // 전공 선택창을 누를 때 검사
    deptSelect.addEventListener('mousedown', checkLocked);
    
    // 학점 입력시 음수 일때 alert
    
    function handleCreditInput(element) {
        // 1. 음수 입력 방지 로직
        if (element.value < 0) {
            element.value = 0; // 음수면 강제로 0으로 변경
            alert("올바른 학점을 입력해주세요"); // (선택사항) 사용자에게 알림
        }
        toggleInputStyle(element);
        resultBox.style.display = 'none';
    }

    majorCreditInput.addEventListener('input', function() { 
        handleCreditInput(this);
    });

    liberalCreditInput.addEventListener('input', function() { 
        handleCreditInput(this);
    });

    // 5. 완료 버튼 클릭 이벤트 
    submitBtn.addEventListener('click', function() {
        calculateAndDisplayResult();
    });
    
    function updateUniversityOptions(selectedYear) {
        deptSelect.innerHTML = '<option value="">전공 선택</option>';

        deptSelect.classList.add('locked');
        deptSelect.classList.remove('has-value');
        
        univSelect.innerHTML = '<option value="">대학 선택</option>';
        univSelect.classList.remove('has-value');
        
        if (selectedYear && creditData[selectedYear]) {
            const universities = Object.keys(creditData[selectedYear]).sort();
            
            universities.forEach(univ => {
                const option = new Option(univ, univ);
                univSelect.add(option);
            });
            univSelect.classList.remove('locked');
        } else {
            univSelect.classList.add('locked');
        }
    }

    function updateDepartmentOptions(selectedYear, selectedUniv) {
        deptSelect.innerHTML = '<option value="">전공 선택</option>';
        deptSelect.classList.remove('has-value');
        
        if (selectedYear && selectedUniv && creditData[selectedYear] && creditData[selectedYear][selectedUniv]) {
            const departments = Object.keys(creditData[selectedYear][selectedUniv]).sort(); 
            
            departments.forEach(dept => {
                const option = new Option(dept, dept);
                deptSelect.add(option);
            });
            deptSelect.disabled = false;
        } else {
            deptSelect.disabled = true;
        }
    }

    function toggleHasValue(element) {
        if (element.value === '') {
            element.classList.remove('has-value');
        } else {
            element.classList.add('has-value');
        }
    }

    function toggleInputStyle(element) {
        if (element.value && element.value.trim().length > 0) {
            element.classList.add('has-value');
        } else {
            element.classList.remove('has-value');
        }
    }

    // --- 핵심 로직: 결과 출력 함수 (특수 요건을 결과 HTML에 통합) ---
    function calculateAndDisplayResult() {
        const year = yearSelect.value;
        const univ = univSelect.value;
        const dept = deptSelect.value;
        
        const currentMajorCredit = parseInt(majorCreditInput.value) || 0; 
        const currentLiberalCredit = parseInt(liberalCreditInput.value) || 0;

        if (!year || !univ || !dept) {
            resultText.innerHTML = '⚠️ 입학년도, 대학, 전공을 모두 선택해주세요.';
            resultBox.style.display = 'block';
            return;
        }

        const requiredCredits = creditData[year]?.[univ]?.[dept];
        const liberalReqDetails = liberalRequirements[year] || { requiredLiberal: 0, details: '세부 교양 기준 정보 없음.' };

        if (!requiredCredits) {
            resultText.innerHTML = `⚠️ 선택하신 ${year}학년도 ${dept}의 졸업 요건 정보를 찾을 수 없습니다.`;
            resultBox.style.display = 'block';
            return;
        }

        // 초기 요구 학점 설정
        const requiredTotal = requiredCredits.total;
        const requiredMajor = requiredCredits.major;
        const requiredLiberal = requiredCredits.liberal;
        let specialNoteHtml = ''; // 특수 요건 HTML을 담을 변수

        
        // --- 1. 사범대학 특수 요건 안내 ---
        if (univ === '사범대학') {
            specialNoteHtml += `
                <div style="border: 1px solid #2563eb; border-radius: 5px; padding: 10px; margin-top: 15px; background-color: #eff6ff;">
                    <p style="font-weight: 700; color: #2563eb; margin: 0;">
                        📝 *사범대학 특수 졸업 요건 (전공)*
                    </p>
                    <ul style="margin-top: 5px; padding-left: 20px; list-style-type: square;">
                        <li>전공 필수 외, 교과교육 영역 과목을 8학점 이상 포함하여 이수해야 합니다.</li>
                    </ul>
                </div>
            `;
            
            // 2023년 이후 입학생 사범대학 복수전공 교양 예외 안내
            if (year >= '2023') {
                specialNoteHtml += `
                    <p style="font-size: 0.95rem; color: #ef4444; margin-top: 10px;">
                        ⚠️ 사범대학 학생이 사범대학 내 학과를 복수전공하는 경우, 교양 학점 요구치가 24학점 이상으로 변경됩니다. (기존: 30학점)
                    </p>
                `;
            }
        }

        // --- 2. 간호대학 특수 요건 안내 ---
        if (univ === '간호대학') {
            specialNoteHtml += `
                <div style="border: 1px solid #10b981; border-radius: 5px; padding: 10px; margin-top: 15px; background-color: #ecfdf5;">
                    <p style="font-weight: 700; color: #10b981; margin: 0;">
                        🏥 간호대학 특수 졸업 요건 (전공)
                    </p>
                    <ul style="margin-top: 5px; padding-left: 20px; list-style-type: square;">
                        <li>간호교육프로그램 평가인증을 받는 학생은 전공필수 과목을 94학점 이상 이수해야 합니다.</li>
                    </ul>
                </div>
            `;
        }

        
        // 부족 학점 계산
        const remainingMajor = Math.max(0, requiredMajor - currentMajorCredit);
        const remainingLiberal = Math.max(0, requiredLiberal - currentLiberalCredit);
        const totalCurrent = currentMajorCredit + currentLiberalCredit;
        const totalRemaining = Math.max(0, requiredTotal - totalCurrent); 

        // 4. 결과 HTML 생성
        let htmlContent = `
            <div class="result-header">
                🎓 ${year}학년도 ${dept} 졸업 학점 확인 결과
            </div>
            <table style="width:100%; border-collapse: collapse; margin-bottom: 25px; text-align: left;">
                <thead>
                    <tr style="background-color: #f3f4f6;">
                        <th style="padding: 12px; border-bottom: 2px solid #e5e7eb;">구분</th>
                        <th style="padding: 12px; border-bottom: 2px solid #e5e7eb;">요구 학점</th>
                        <th style="padding: 12px; border-bottom: 2px solid #e5e7eb;">이수 학점</th>
                        <th style="padding: 12px; border-bottom: 2px solid #e5e7eb; color: var(--accent);">부족 학점</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">전공</td>
                        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${requiredMajor} 학점</td>
                        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${currentMajorCredit} 학점</td>
                        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; color: ${remainingMajor > 0 ? '#ef4444' : '#10b981'}; font-weight: 600;">${remainingMajor} 학점</td>
                    </tr>
                    <tr>
                        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">교양</td>
                        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${requiredLiberal} 학점</td>
                        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${currentLiberalCredit} 학점</td>
                        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; color: ${remainingLiberal > 0 ? '#ef4444' : '#10b981'}; font-weight: 600;">${remainingLiberal} 학점</td>
                    </tr>
                </tbody>
            </table>

            ${specialNoteHtml}

            ${liberalReqDetails.details}
            
            <div style="font-size: 1.1rem; font-weight: 600; margin-top: 20px; border-top: 1px dashed #e5e7eb; padding-top: 15px;">
                총 졸업 요구 학점: <span style="color: var(--accent-dark);">${requiredTotal}</span> 학점
            </div>
            <div style="font-size: 1.1rem; font-weight: 600;">
                총 이수 학점: <span style="color: #10b981;">${totalCurrent}</span> 학점
            </div>
            <div style="font-size: 1.2rem; font-weight: 700; margin-top: 15px; padding-top: 10px; border-top: 2px solid var(--accent-dark);">
                총 부족 학점: <span style="color: ${totalRemaining > 0 ? '#ef4444' : '#10b981'};">${totalRemaining} 학점</span>
            </div>
            <p style="margin-top: 30px; border-top: 1px solid #ccc; padding-top: 15px; color: ${(totalRemaining <= 0 && remainingMajor <= 0 && remainingLiberal <= 0) ? '#10b981':'#ef4444' }; font-weight: 700;">
               ${(totalRemaining <= 0 && remainingMajor <= 0 && remainingLiberal <= 0) ? '🎉 졸업 요건을 충족하셨습니다! (단, 특수 및 세부 요건은 별도 확인 필요합니다)' : '⚠️ 아직 졸업까지 들어야 할 학점이 남았습니다. 힘내세요! (특수 및 세부 요건을 반드시 확인하세요!)'}
            </p>
        `;

        // 5. 결과 출력
        resultText.innerHTML = htmlContent;
        resultBox.style.display = 'block';
    }

    // 페이지 로드 시, 데이터 로드 함수를 먼저 실행
    loadAndProcessData();
});