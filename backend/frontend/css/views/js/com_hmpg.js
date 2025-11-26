// 언어 변경 관련 객체
var com_hmpg = com_hmpg || {};

// 한국어/영어 번역 데이터
var translations = {
    ko: {
        // 헤더 메뉴
        'logout': '로그아웃',
        'welcome': '님 반갑습니다.',
        'language': '한국어',
        
        // 메인 콘텐츠
        'course_registration': '수강신청',
        'course_registration_year_semester': '수강신청 연도학기',
        'course_registration_info': '2025학년도 계절학기(동계) 수강신청입니다.',
        'year_semester': '학년도 계절학기(동계)',
        
        // 테이블 헤더
        'student_id': '학번',
        'name': '성명',
        'affiliation': '소속',
        'available_credits': '수강신청<br>가능학점',
        'registered_credits': '수강신청학점',
        
        // 검색 폼
        'course_number': '강좌번호',
        'captcha': '자동입력방지 문자',
        'image_change': '이미지변경',
        'confirm': '확인',
        'search': '조회',
        'input_11_digits': '11자리 입력',
        'input_4_digits': '왼쪽/상단 이미지 4자리 입력',
        
        // 탭 메뉴
        'course_search': '과목 검색',
        'package_list': '꾸러미신청목록',
        
        // 테이블
        'course_list': '교과목목록',
        'registration_list': '수강신청목록',
        'package_application_list': '꾸러미신청목록',
        'apply': '신청',
        'delete': '삭제',
        'course_code': '교과목코드',
        'course_name': '교과목명',
        'division': '분반',
        'subject_classification': '교과구분',
        'credits': '학점',
        'retake_year': '재이수년도',
        'retake_semester': '재이수학기',
        'lecture_time': '강의시간',
        'limit': '제한인원',
        'enrolled': '수강인원',
        'click_count': '신청클릭수',
        'cases': '건',
        
        // 알림 메시지
        'no_data': '조회된 데이터가 없습니다.',
        'save': '저장',
        'info1': '수강신청의  [신청]을 500회 이상  클릭 시 수강꾸러미목록에서 해당 과목이 삭제됩니다.',
        'info2': '교과구분변경은 이수 후 통합정보시스템에서 변경 가능 합니다.',
        
        // 기타
        'skip_menu': '본문 바로가기',
        'privacy_policy': '개인정보처리방침',
        'privacy_notice': '본 사이트에서 제공되는 정보에 대한 무단 수집을 거부하며, 위반시 정보통신망법에 의해 처벌됨을 유념하시기 바랍니다.',
        'address': '41566 대구광역시 북구 대학로 80 (산격동, 경북대학교)',
        'school_info': '학교 안내전화',
        'duty_office': '당직실',
        'it_services': '정보화본부 IT서비스팀',
        'top': 'TOP'
    },
    en: {
        // 헤더 메뉴
        'logout': 'Logout',
        'welcome': ' Welcome.',
        'language': 'ENGLISH',
        
        // 메인 콘텐츠
        'course_registration': 'Course Registration',
        'course_registration_year_semester': 'Course registration Year/Term',
        'course_registration_info': '2025Year Winter Semester Course Registration.',
        'year_semester': '2025Year Winter Semester',
        
        // 테이블 헤더
        'student_id': 'Student ID',
        'name': 'Name',
        'affiliation': 'Department',
        'available_credits': 'Course registration AvailableCredit',
        'registered_credits': 'Credits of course registration',
        
        // 검색 폼
        'course_number': 'Course Number',
        'captcha': 'CAPTCHA',
        'image_change': 'Change Image',
        'confirm': 'Confirm',
        'search': 'Search',
        'input_11_digits': 'Enter 11 digits',
        'input_4_digits': 'Enter 4 digits from the left/top',
        
        // 탭 메뉴
        'course_search': 'Search subject',
        'package_list': 'Registration list in cart',
        
        // 테이블
        'course_list': 'Course subject list',
        'registration_list': 'Registration List',
        'package_application_list': 'Package Application List',
        'apply': 'Delete',
        'delete': 'Delete',
        'course_code': 'Code of course subject',
        'course_name': 'Name of course subject',
        'division': 'Class',
        'subject_classification': 'Course division',
        'credits': 'Credit',
        'retake_year': 'Year of course retake',
        'retake_semester': 'Course retake semester',
        'lecture_time': 'Lecture Time',
        'limit': 'Limited',
        'enrolled': 'Enrolled',
        'click_count': 'Click Count',
        'cases': '건',
        
        // 알림 메시지
        'no_data': 'No data found.',
        'save': 'Save',
        'info1': 'If you click [Register] in the course registration more than 500 times, the corresponding course will be deleted from the course cart list.',
        'info2': 'You can change the course classification in the Integrated Information System after completion.',
        
        // 기타
        'skip_menu': 'Skip to content',
        'privacy_policy': 'Privacy Policy',
        'privacy_notice': 'Unauthorized collection of information on this site is prohibited and punishable by law.',
        'address': '41566 80, Daehak-ro, Buk-gu, Daegu, Republic of Korea.',
        'school_info': 'School Information Desk',
        'duty_office': 'On-duty Office',
        'it_services': 'IT Services Team, Office of Information Technology',
        'top': 'TOP'
    }
};

// 언어 변경 함수
com_hmpg.fn_goLang = function() {
    var select = document.getElementById('selGoLang');
    if (!select) return;
    
    var lang = select.value; // 'ko' or 'en'
    window.gLang = lang;
    
    // localStorage에 저장
    localStorage.setItem('preferredLang', lang);
    
    // 페이지 새로고침
    location.reload();
};

// 페이지 언어 업데이트 함수
function updatePageLanguage(lang) {
    var trans = translations[lang];
    
    // 헤더 영역 번역
    translateHeader(lang);
    
    // 메인 콘텐츠 영역 번역
    translateMainContent(lang);
    
    // 테이블 헤더 번역
    translateTableHeaders(lang);
    
    // 폼 요소 번역
    translateFormElements(lang);
    
    // 푸터 영역 번역
    translateFooter(lang);
    
    // gMessages 업데이트
    updateMessages(lang);
}

// 헤더 영역 번역
function translateHeader(lang) {
    var trans = translations[lang];
    
    // 로그아웃 버튼
    var logoutBtn = document.querySelector('.top-sub-link-login');
    if (logoutBtn) {
        logoutBtn.textContent = trans.logout;
    }
    
    // 환영 메시지
    var welcomeElements = document.querySelectorAll('#gnb li span');
    welcomeElements.forEach(function(element) {
        var text = element.textContent;
        if (text.includes('님 반갑습니다.')) {
            var nameMatch = text.match(/(.+?)\s*님 반갑습니다/);
            if (nameMatch) {
                var name = nameMatch[1];
                element.innerHTML = '<strong>' + name + '</strong>' + trans.welcome;
            }
        }
    });
}

// 메인 콘텐츠 영역 번역
function translateMainContent(lang) {
    var trans = translations[lang];
    var koTrans = translations.ko;
    var enTrans = translations.en;
    
    // 제목
    var title = document.querySelector('.cont-tit');
    if (title) {
        var currentText = title.textContent.trim();
        // 현재 텍스트가 영어인지 한국어인지 확인
        if (lang === 'ko') {
            title.textContent = koTrans.course_registration;
        } else {
            title.textContent = trans.course_registration;
        }
    }
    
    // 수강신청 연도학기
    var yearSemesterLabel = document.querySelector('.top-search-box .tit');
    if (yearSemesterLabel) {
        var html = yearSemesterLabel.innerHTML;
        // 영어와 한국어 모두 처리
        html = html.replace(/Course registration Year\/Term/g, koTrans.course_registration_year_semester);
        html = html.replace(/수강신청 연도학기/g, trans.course_registration_year_semester);
        yearSemesterLabel.innerHTML = html;
    }
    
    // 안내 텍스트
    var infoText = document.getElementById('txtYrsmt');
    if (infoText) {
        var currentText = infoText.textContent;
        if (lang === 'ko') {    
            // 한국어로 복원 - 항상 전체 문장으로 설정
            infoText.textContent = koTrans.course_registration_info;
        } else {
            // 영어로 번역 - 항상 전체 문장으로 설정
            infoText.textContent = trans.course_registration_info;
        }
    }
    
    // 학년도 계절학기(동계) 번역 - select 옵션
    var selectOption = document.querySelector('#slbYrsmt option');
    if (selectOption) {
        var optionText = selectOption.textContent;
        // 영어와 한국어 모두 처리
        if (lang === 'ko') {
            // 한국어로 복원
            if (optionText.includes('2025 Year Winter Semester')) {
                optionText = optionText.replace(/2025 Year Winter Semester/g, '2025학년도 계절학기(동계)');
            }
            // 이미 한국어면 그대로 유지
        } else {
            // 영어로 번역
            if (optionText.includes('2025학년도 계절학기(동계)')) {
                optionText = optionText.replace(/2025학년도 계절학기\(동계\)/g, trans.year_semester);
            }
        }
        selectOption.textContent = optionText;
    }
    
    // 테이블 항목
    var allTitleBoxes = document.querySelectorAll('.b-title-box');
    allTitleBoxes.forEach(function(box) {
        var text = box.textContent.trim();
        var html = box.innerHTML;
        var label = box.querySelector('label');
        
        // 한국어로 복원 또는 영어로 번역
        if (lang === 'ko') {
            // 한국어로 복원
            if (text === enTrans.student_id || text === 'Student ID') {
                box.textContent = koTrans.student_id;
            } else if (text === enTrans.name || text === 'Name' || text.includes('Name')) {
                if (label) {
                    // label이 있으면 label만 수정
                    label.textContent = ' ' + koTrans.name + ' ';
                } else {
                    box.textContent = koTrans.name;
                }
            } else if (text === enTrans.affiliation || text === 'Department' || text.includes('Department')) {
                if (label) {
                    // label이 있으면 label만 수정
                    label.textContent = ' ' + koTrans.affiliation + ' ';
                } else {
                    box.textContent = koTrans.affiliation;
                }
            } else if (html.includes(enTrans.available_credits) || text.includes('Available')) {
                box.innerHTML = koTrans.available_credits;
            } else if (text === enTrans.registered_credits || text.includes('Credits of course registration')) {
                box.textContent = koTrans.registered_credits;
            } else if (text === koTrans.student_id || text === koTrans.name || text === koTrans.affiliation) {
                // 이미 한국어이면 유지
            }
        } else {
            // 영어로 번역
            if (text === '학번' || text === koTrans.student_id) {
                box.textContent = trans.student_id;
            } else if (text === '성명' || text === koTrans.name || text.includes('성명')) {
                if (label) {
                    // label이 있으면 label만 수정
                    label.textContent = ' ' + trans.name + ' ';
                } else {
                    box.innerHTML = html.replace(/성명/g, trans.name).replace(koTrans.name, trans.name);
                }
            } else if (text === '소속' || text === koTrans.affiliation || text.includes('소속')) {
                if (label) {
                    // label이 있으면 label만 수정
                    label.textContent = ' ' + trans.affiliation + ' ';
                } else {
                    box.innerHTML = html.replace(/소속/g, trans.affiliation).replace(koTrans.affiliation, trans.affiliation);
                }
            } else if (html.includes('수강신청') && html.includes('가능학점')) {
                box.innerHTML = trans.available_credits;
            } else if (text.includes('수강신청학점') || text === koTrans.registered_credits) {
                box.textContent = trans.registered_credits;
            }
        }
    });
    
    // 라벨 요소
    var labels = document.querySelectorAll('label');
    labels.forEach(function(label) {
        var text = label.textContent.trim();
        if (lang === 'ko') {
            if (text === enTrans.name || text === 'Name') {
                label.textContent = koTrans.name;
            } else if (text === enTrans.affiliation || text === 'Department') {
                label.textContent = koTrans.affiliation;
            }
        } else {
            if (text === '성명' || text === koTrans.name) {
                label.textContent = trans.name;
            } else if (text === '소속' || text === koTrans.affiliation) {
                label.textContent = trans.affiliation;
            }
        }
    });
    
    // 탭 메뉴
    var tab1 = document.querySelector('#tabs1');
    if (tab1) {
        if (lang === 'ko') {
            tab1.textContent = koTrans.course_search;
        } else {
            tab1.textContent = trans.course_search;
        }
    }
    
    var tab2 = document.querySelector('#tabs2');
    if (tab2) {
        if (lang === 'ko') {
            tab2.textContent = koTrans.package_list;
        } else {
            tab2.textContent = trans.package_list;
        }
    }
    
    // 섹션 제목 - 모든 .tit-h4 요소 처리
    var allTitles = document.querySelectorAll('.tit-h4');
    allTitles.forEach(function(title) {
        var html = title.innerHTML;
        if (lang === 'ko') {
            // 한국어로 복원
            html = html.replace(/Course subject list/g, koTrans.course_list);
            html = html.replace(/Course List/g, koTrans.course_list);
            html = html.replace(/Package Application List/g, koTrans.package_application_list);
            html = html.replace(/Registration list in cart/g, koTrans.package_list);
            html = html.replace(/Registration List/g, koTrans.registration_list);
        } else {
            // 영어로 번역
            if (html.includes('교과목목록')) {
                html = html.replace(/교과목목록/g, trans.course_list);
            }
            if (html.includes('꾸러미신청목록')) {
                html = html.replace(/꾸러미신청목록/g, trans.package_application_list);
            }
            if (html.includes('수강신청목록')) {
                html = html.replace(/수강신청목록/g, trans.registration_list);
            }
        }
        title.innerHTML = html;
    });
    
    // 건 수
    var caseElements = document.querySelectorAll('small');
    caseElements.forEach(function(el) {
        var html = el.innerHTML;
        // '건'은 항상 그대로 유지 (이미 번역 객체에서 '건'으로 설정됨)
        // 변경할 필요 없음
    });
}

// 테이블 헤더 번역
function translateTableHeaders(lang) {
    var trans = translations[lang];
    var koTrans = translations.ko;
    var enTrans = translations.en;
    var headers = document.querySelectorAll('thead th');
    
    headers.forEach(function(header) {
        var text = header.textContent.trim();
        
        if (lang === 'ko') {
            // 한국어로 복원
            switch(text) {
                case enTrans.apply:
                case 'Delete': // 사용자가 apply를 Delete로 변경했음
                case 'Apply':
                    header.textContent = koTrans.apply;
                    break;
                case enTrans.delete:
                case 'Delete':
                    header.textContent = koTrans.delete;
                    break;
                case enTrans.course_code:
                case 'Code of course subject':
                    header.textContent = koTrans.course_code;
                    break;
                case enTrans.course_name:
                case 'Name of course subject':
                    header.textContent = koTrans.course_name;
                    break;
                case enTrans.division:
                case 'Class':
                    header.textContent = koTrans.division;
                    break;
                case enTrans.subject_classification:
                case 'Course division':
                    header.textContent = koTrans.subject_classification;
                    break;
                case enTrans.credits:
                case 'Credit':
                    header.textContent = koTrans.credits;
                    break;
                case enTrans.retake_year:
                case 'Year of course retake':
                    header.textContent = koTrans.retake_year;
                    break;
                case enTrans.retake_semester:
                case 'Course retake semester':
                    header.textContent = koTrans.retake_semester;
                    break;
                case enTrans.lecture_time:
                case 'Lecture Time':
                    header.textContent = koTrans.lecture_time;
                    break;
                case enTrans.limit:
                case 'Limited':
                    header.textContent = koTrans.limit;
                    break;
                case enTrans.enrolled:
                case 'Enrolled':
                    header.textContent = koTrans.enrolled;
                    break;
                case enTrans.click_count:
                case 'Click Count':
                    header.textContent = koTrans.click_count;
                    break;
            }
        } else {
            // 영어로 번역
            switch(text) {
                case '신청':
                case koTrans.apply:
                    header.textContent = trans.apply;
                    break;
                case '삭제':
                case koTrans.delete:
                    header.textContent = trans.delete;
                    break;
                case '교과목코드':
                case koTrans.course_code:
                    header.textContent = trans.course_code;
                    break;
                case '교과목명':
                case koTrans.course_name:
                    header.textContent = trans.course_name;
                    break;
                case '분반':
                case koTrans.division:
                    header.textContent = trans.division;
                    break;
                case '교과구분':
                case koTrans.subject_classification:
                    header.textContent = trans.subject_classification;
                    break;
                case '학점':
                case koTrans.credits:
                    header.textContent = trans.credits;
                    break;
                case '재이수년도':
                case koTrans.retake_year:
                    header.textContent = trans.retake_year;
                    break;
                case '재이수학기':
                case koTrans.retake_semester:
                    header.textContent = trans.retake_semester;
                    break;
                case '강의시간':
                case koTrans.lecture_time:
                    header.textContent = trans.lecture_time;
                    break;
                case '제한인원':
                case koTrans.limit:
                    header.textContent = trans.limit;
                    break;
                case '수강인원':
                case koTrans.enrolled:
                    header.textContent = trans.enrolled;
                    break;
                case '신청클릭수':
                case koTrans.click_count:
                    header.textContent = trans.click_count;
                    break;
            }
        }
    });
}

// 폼 요소 번역
function translateFormElements(lang) {
    var trans = translations[lang];
    var koTrans = translations.ko;
    var enTrans = translations.en;
    
    // 강좌번호
    var allTitleBoxes = document.querySelectorAll('.b-title-box');
    allTitleBoxes.forEach(function(box) {
        var html = box.innerHTML;
        if (lang === 'ko') {
            // 한국어로 복원
            html = html.replace(/Course Number/g, koTrans.course_number);
            html = html.replace(/강좌번호/g, koTrans.course_number);
        } else {
            // 영어로 번역
            if (html.includes('강좌번호')) {
                html = html.replace(/강좌번호/g, trans.course_number);
            }
        }
        box.innerHTML = html;
    });
    
    // 자동입력방지 문자
    var captchaLabel = document.querySelector('label[for="schCapcha2"]');
    if (captchaLabel) {
        var html = captchaLabel.innerHTML;
        if (lang === 'ko') {
            html = html.replace(/CAPTCHA/g, koTrans.captcha);
            html = html.replace(/자동입력방지 문자/g, koTrans.captcha);
        } else {
            html = html.replace(/자동입력방지 문자/g, trans.captcha);
        }
        captchaLabel.innerHTML = html;
    }
    
    // 입력 필드 placeholder
    var input11 = document.getElementById('schSbjetNo');
    if (input11) {
        input11.placeholder = trans.input_11_digits;
        input11.title = trans.input_11_digits;
    }
    
    var input4 = document.getElementById('schCapcha2');
    if (input4) {
        input4.placeholder = trans.input_4_digits;
        input4.title = trans.input_4_digits;
    }
    
    // 버튼
    var buttons = document.querySelectorAll('button');
    buttons.forEach(function(btn) {
        var text = btn.textContent.trim();
        if (lang === 'ko') {
            // 한국어로 복원
            if (text === enTrans.confirm || text === 'Confirm') {
                btn.textContent = koTrans.confirm;
            } else if (text === enTrans.search || text === 'Search') {
                btn.textContent = koTrans.search;
            } else if (text === enTrans.save || text === 'Save') {
                btn.textContent = koTrans.save;
            } else if (text === enTrans.image_change || text === 'Change Image') {
                btn.querySelector('.sr-only').textContent = koTrans.image_change;
            }
        } else {
            // 영어로 번역
            if (text === '확인' || text === koTrans.confirm) {
                btn.textContent = trans.confirm;
            } else if (text === '조회' || text === koTrans.search) {
                btn.textContent = trans.search;
            } else if (text === '저장' || text === koTrans.save) {
                btn.textContent = trans.save;
            }
        }
    });
    
    // 링크 버튼 (신청, 삭제, 저장)
    var links = document.querySelectorAll('a.btn');
    links.forEach(function(link) {
        var text = link.textContent.trim();
        if (lang === 'ko') {
            // 한국어로 복원
            if (text === enTrans.apply || text === 'Delete' || text === 'Apply') {
                link.textContent = koTrans.apply;
            } else if (text === enTrans.delete || text === 'Delete') {
                link.textContent = koTrans.delete;
            } else if (text === enTrans.save || text === 'Save') {
                link.textContent = koTrans.save;
            }
        } else {
            // 영어로 번역
            if (text === '신청' || text === koTrans.apply) {
                link.textContent = trans.apply;
            } else if (text === '삭제' || text === koTrans.delete) {
                link.textContent = trans.delete;
            } else if (text === '저장' || text === koTrans.save) {
                link.textContent = trans.save;
            }
        }
    });
    
    // 이미지 변경 버튼
    var imageChange = document.querySelector('.sr-only');
    if (imageChange) {
        var text = imageChange.textContent;
        if (lang === 'ko') {
            if (text.includes('Change Image') || text === enTrans.image_change) {
                imageChange.textContent = koTrans.image_change;
            }
        } else {
            if (text.includes('이미지변경') || text === koTrans.image_change) {
                imageChange.textContent = trans.image_change;
            }
        }
    }
}

// 푸터 영역 번역
function translateFooter(lang) {
    var trans = translations[lang];
    var koTrans = translations.ko;
    var enTrans = translations.en;
    
    // 개인정보처리방침
    var links = document.querySelectorAll('#footer a');
    links.forEach(function(link) {
        var text = link.textContent;
        if (lang === 'ko') {
            if (text.includes('Privacy Policy') || text === enTrans.privacy_policy) {
                link.textContent = koTrans.privacy_policy;
            }
        } else {
            if (text.includes('개인정보처리방침') || text === koTrans.privacy_policy) {
                link.textContent = trans.privacy_policy;
            }
        }
    });
    
    // 개인정보 안내 문구
    var privacyText = document.querySelector('.text-desc');
    if (privacyText) {
        privacyText.textContent = trans.privacy_notice;
    }
    
    // 주소 번역
    var address = document.querySelector('address');
    if (address) {
        var addressSpans = address.querySelectorAll('span');
        // 첫 번째 span: 주소
        if (addressSpans.length > 0) {
            var addressSpan = addressSpans[0];
            var addressText = addressSpan.textContent.trim();
            if (lang === 'ko') {
                // 한국어로 복원
                if (addressText.includes('41566 80, Daehak-ro') || addressText.includes('Republic of Korea')) {
                    addressSpan.textContent = koTrans.address;
                }
            } else {
                // 영어로 번역
                if (addressText.includes('대구광역시') || addressText.includes('산격동')) {
                    addressSpan.textContent = enTrans.address;
                }
            }
        }
        // 두 번째 span: 학교 안내전화
        if (addressSpans.length > 1) {
            var schoolInfoSpan = addressSpans[1];
            var schoolInfoText = schoolInfoSpan.textContent.trim();
            var phoneLink = schoolInfoSpan.querySelector('a');
            var phoneNumber = phoneLink ? phoneLink.outerHTML : '';
            
            if (lang === 'ko') {
                // 한국어로 복원
                if (schoolInfoText.includes('School Information Desk')) {
                    schoolInfoSpan.innerHTML = koTrans.school_info + (phoneLink ? ' ' + phoneNumber : '');
                }
            } else {
                // 영어로 번역
                if (schoolInfoText.includes('학교 안내전화')) {
                    schoolInfoSpan.innerHTML = enTrans.school_info + (phoneLink ? ' ' + phoneNumber : '');
                }
            }
        }
        // 세 번째 span: 당직실
        if (addressSpans.length > 2) {
            var dutyOfficeSpan = addressSpans[2];
            var dutyOfficeText = dutyOfficeSpan.textContent.trim();
            var phoneLink = dutyOfficeSpan.querySelector('a');
            var phoneNumber = phoneLink ? phoneLink.outerHTML : '';
            
            if (lang === 'ko') {
                // 한국어로 복원
                if (dutyOfficeText.includes('On-duty Office')) {
                    dutyOfficeSpan.innerHTML = koTrans.duty_office + (phoneLink ? ' ' + phoneNumber : '');
                }
            } else {
                // 영어로 번역
                if (dutyOfficeText.includes('당직실')) {
                    dutyOfficeSpan.innerHTML = enTrans.duty_office + (phoneLink ? ' ' + phoneNumber : '');
                }
            }
        }
        // 네 번째 span: 정보화본부 IT서비스팀
        if (addressSpans.length > 3) {
            var itServicesSpan = addressSpans[3];
            var itServicesText = itServicesSpan.textContent.trim();
            var phoneLink = itServicesSpan.querySelector('a');
            var phoneNumber = phoneLink ? phoneLink.outerHTML : '';
            
            if (lang === 'ko') {
                // 한국어로 복원
                if (itServicesText.includes('IT Services Team') || itServicesText.includes('Office of Information Technology')) {
                    itServicesSpan.innerHTML = koTrans.it_services + (phoneLink ? ' ' + phoneNumber : '');
                }
            } else {
                // 영어로 번역
                if (itServicesText.includes('정보화본부') || itServicesText.includes('IT서비스팀')) {
                    itServicesSpan.innerHTML = enTrans.it_services + (phoneLink ? ' ' + phoneNumber : '');
                }
            }
        }
    }
    
    // 본문 바로가기
    var skipLink = document.querySelector('#accessibility a');
    if (skipLink) {
        var text = skipLink.textContent;
        if (lang === 'ko') {
            if (text.includes('Skip to content') || text === enTrans.skip_menu) {
                skipLink.textContent = koTrans.skip_menu;
            }
        } else {
            if (text.includes('본문 바로가기') || text === koTrans.skip_menu) {
                skipLink.textContent = trans.skip_menu;
            }
        }
    }
    
    // TOP 버튼
    var topBtn = document.querySelector('.go-to-top span');
    if (topBtn) {
        topBtn.textContent = trans.top;
    }
}

// gMessages 업데이트
function updateMessages(lang) {
    var trans = translations[lang];
    var koTrans = translations.ko;
    var enTrans = translations.en;
    
    if (window.gMessages) {
        gMessages['lb.inf.00024280'] = trans.captcha;
        gMessages['lb.inf.00024281'] = trans.input_11_digits;
        gMessages['lb.inf.00024282'] = trans.input_4_digits;
        gMessages['lb.inf.00024283'] = '{0} ' + trans.course_registration + '.';
        gMessages['lb.inf.00024284'] = trans.info2;
        gMessages['lb.inf.00024285'] = trans.no_data;
        gMessages['lb.inf.00024286'] = trans.logout + '?';
        gMessages['lb.inf.00024287'] = trans.welcome;
        gMessages['lb.inf.00024294'] = '{0} ' + trans.package_application_list + '.';
        gMessages['lb.inf.lgt'] = trans.logout;
    }
    
    // 안내 메시지 업데이트
    var infoBoxes = document.querySelectorAll('.info-box li');
    infoBoxes.forEach(function(li, index) {
        var text = li.textContent;
        if (lang === 'ko') {
            // 한국어로 복원
            if (index === 0) {
                li.textContent = koTrans.info1;
            } else if (index === 1) {
                li.textContent = koTrans.info2;
            }
        } else {
            // 영어로 번역
            if (index === 0) {
                li.textContent = trans.info1;
            } else if (index === 1) {
                li.textContent = trans.info2;
            }
        }
    });
    
    // 조회된 데이터가 없습니다
    var noDataMessages = document.querySelectorAll('.non-page.board h3');
    noDataMessages.forEach(function(h3) {
        var text = h3.textContent;
        if (lang === 'ko') {
            // 한국어로 복원
            if (text.includes('No data found') || text === enTrans.no_data) {
                h3.textContent = koTrans.no_data;
            }
        } else {
            // 영어로 번역
            if (text.includes('조회된 데이터가 없습니다') || text === koTrans.no_data) {
                h3.textContent = trans.no_data;
            }
        }
    });
}

// 페이지 로드 시 저장된 언어 설정 복원
(function() {
    function initLanguage() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', function() {
                restoreLanguage();
            });
        } else {
            restoreLanguage();
        }
    }
    
    function restoreLanguage() {
        var savedLang = localStorage.getItem('preferredLang');
        if (savedLang && savedLang !== 'ko') {
            var select = document.getElementById('selGoLang');
            if (select) {
                select.value = savedLang;
                window.gLang = savedLang;
                updatePageLanguage(savedLang);
            }
        }
    }
    
    initLanguage();
})();

