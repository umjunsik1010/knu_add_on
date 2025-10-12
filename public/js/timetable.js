const H_START = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--hours-start')) || 8;
const H_END = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--hours-end')) || 24;
const SLOT_MINUTES = 30; // 30-minute slots
const LOAD_STEP = 30; // 한번에 로드할 개수

const SLOT_HEIGHT = 66.67;


/* 과목, 교수 -> 무작위 색 생성 함수 */
const generateColors = (subject, professor) => {
  const hash = str => [...String(str)].reduce((h,c)=>c.charCodeAt(0)+((h<<5)-h),0);
  const intToRGB = i => "#" + ((i & 0x00FFFFFF).toString(16).padStart(6,"0"));
  const adjust = (c,str)=>{ 
      const amount = (hash(str) % 81) - 40; // -20~20, 항상 같은 subject는 같은 변형
      return "#"+[0,2,4].map(i=>Math.min(255,Math.max(0,parseInt(c.substr(i+1,2),16)+amount)).toString(16).padStart(2,"0")).join("");
  };
  
  const profColor = intToRGB(hash(professor));
  const subjColor = adjust(profColor, subject);
  return subjColor;
};


function getTextColorByBackgroundColor (hexColor) {
  const c = hexColor.substring(1)   // 색상 앞의 # 제거
  const rgb = parseInt(c, 16)   // rrggbb를 10진수로 변환
  const r = (rgb >> 16) & 0xff    // red 추출
  const g = (rgb >> 8) & 0xff   // green 추출
  const b = (rgb >> 0) & 0xff   // blue 추출
  const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b   //per ITU-R BT.709
  return luma < 127.5 ? "white" : "black"
}



function getTextColorByModi (hexColor, scale) {
  const c = hexColor.substring(1)   // 색상 앞의 # 제거
  const rgb = parseInt(c, 16)   // rrggbb를 10진수로 변환
  const r = (rgb >> 16) & 0xff    // red 추출
  const g = (rgb >> 8) & 0xff   // green 추출
  const b = (rgb >> 0) & 0xff   // blue 추출
  const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b   //per ITU-R BT.709
  // return luma < 127.5 ? `${r + scale}, ${g + scale}, ${b + scale}` : `${r - scale}, ${g - scale}, ${b - scale}`
  return  `${r + scale}, ${g + scale}, ${b + scale}`
}


function hexColor2rgb (hexColor) {
  const c = hexColor.substring(1)   // 색상 앞의 # 제거
  const rgb = parseInt(c, 16)   // rrggbb를 10진수로 변환
  const r = (rgb >> 16) & 0xff    // red 추출
  const g = (rgb >> 8) & 0xff   // green 추출
  const b = (rgb >> 0) & 0xff   // blue 추출
  return `${r}, ${g}, ${b}`
}

/* 시간차 계산 후 멋지게 반환 */
function timeDiffnice(time1, time2) {
  const [h1, m1] = time1.split(':').map(Number);
  const [h2, m2] = time2.split(':').map(Number);

  const t1 = h1 * 60 + m1;
  const t2 = h2 * 60 + m2;

  const dt = t2 - t1;
  let dh = String(Math.floor(dt/60));
  let dm = String(dt%60);

  if(dm == '0') return dh + "시간";

  return dh + "시간 " + dm + "분"
}


/* 과목 시간을 멋지게 */
const makeTimeNice = (realtimeinfo) => {
  const arr = realtimeinfo?.split(",") || [];
  if(arr.length <= 1) return '';

  const order = { '월': 0, '화': 1, '수': 2, '목': 3, '금': 4, '토': 5 };
  arr.sort((a, b) => {
    let cmp = order[a[0]] - order[b[0]];
    if(cmp !== 0) return cmp;

    return a.localeCompare(b);
  });

  // console.log(arr);

  const new_arr = [];
  let tmpTime = arr[0];

  arr.push('end');
  for(let i=0; i<arr.length-1; i++) {
    if(arr[i].slice(10, 15) == arr[i+1].slice(2, 7)) {
      tmpTime = tmpTime.slice(0, 10) + arr[i+1].slice(10, 15);
      continue;
    } else {
      new_arr.push(tmpTime);
      tmpTime = arr[i+1];
      
    }
  }

  for(let i=0; i<new_arr.length; i++){
    const t1 = new_arr[i].slice(2, 7);
    const t2 = new_arr[i].slice(10, 15);
    const dt = timeDiffnice(t1, t2); 

    new_arr[i] = new_arr[i] + " - " + dt;
  }
  
  return new_arr.join(",<br>");
};





let SUBJECTS = [];
let filtered_SUBJECTS = [];

/* load lectures.json */
async function loadSubjects() {
  try {
    const res = await fetch('./json/lectures.json'); // JSON 파일 경로
    if (!res.ok) throw new Error('Failed to fetch JSON: ' + res.status);

    const lectures = await res.json(); // JSON 파싱
    // lectures 데이터를 SUBJECTS로 변환 (예시)
    // JSON 구조에 맞게 적절히 매핑
    SUBJECTS = lectures.map(l => ({
      estblYear: l.estblYear || 'unknown',  // 년도
      estblSmstrSctcd : l.estblSmstrSctcd || 'unknown',   //학기
      sbjetCd : l.sbjetCd || '',  //  과목코드( - 뒤에 제외 )
      crseNo: l.crseNo || '',    // 과목코드
      sbjetDvnno: l.sbjetDvnno || '', // 분반? (과목 코드의 - 뒤에 있는거 )
      sbjetNm: l.sbjetNm || 'Unnamed',    // 과목명
      totalPrfssNm: l.totalPrfssNm || 'Unknown',
      lssnsRealTimeInfo: l.lssnsRealTimeInfo || '',
      crdit: l.crdit || '',
      lssnsTimeInfo : l.lssnsTimeInfo || '',
      sbjetSctnm : l.sbjetSctnm || '',    // 종류 (전공, 교양)
      estblGrade : l.estblGrade || '',    // 학년
      estblUnivNm : l.estblUnivNm || '',
      estblDprtnNm : l.estblDprtnNm || '',
      lctrmInfo : l.lctrmInfo || '', // 수업 건물
      rmnmCd : l.rmnmCd || '', // 수업 장소 호실 번호
      niceTime : makeTimeNice(l.lssnsRealTimeInfo),
      color: generateColors(l.totalPrfssNm, l.sbjetNm) || '#3b82f6'
    }));
    renderNextSubjects();
  } catch (err) {
    console.error(err);
  }
}



/* 수업계획표 가져오기  api*/
async function loadSubGehwek(sub) {
  try {
    const res = await fetch('/api/gehwek', { 
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        estblYear: sub.estblYear,
        estblSmstrSctcd: sub.estblSmstrSctcd,
        sbjetCd: sub.sbjetCd,
        sbjetDvnno: sub.sbjetDvnno,
      })
    });
    const data = await res.json();
    return data
  } catch (err) {
    console.error(err);
  }
}



/* DOM references */
const sidebar = document.getElementById('sidebar');
const openBtn = document.getElementById('openSidebar');
const subjectList = document.getElementById('subjectList');
const timetable = document.getElementById('timetable');
const timetableWrap = document.getElementById('timetableWrap');
const timecol = document.getElementById('timecol');
const syllabus    = document.getElementById('syllabus-panel');
const syllabusContent  = document.getElementById('syllabus-content');

// 시간표에 드간 과목
const subInside = {
  crseNo : new Set(),
  time : { 'mon':Array(), 'tue':Array(), 'wed':Array(), 'thu':Array(), 'fri':Array(), 'sat':Array()}  
  // ex) 02:30 ~ 23:00
}


let selectedSubject = null;
let lessonIdCounter = 1;


function renderSubjects(subjects) {
  subjectList.innerHTML = '';

  subjects.forEach(s => {
    const el = document.createElement('div');
    el.className = 'subject';
    el.dataset.id = s.id;
    el.style.borderLeftColor = s.color;

    // Flexbox로 선생님 / 시간 정렬
    el.innerHTML = `
      <div>
        ${s.sbjetNm}
        <div style="display:flex;font-size:12px;color:${getComputedStyle(document.documentElement).getPropertyValue('--muted')};font-weight:600;">
          <span style="flex: 0 1 auto;max-width:80px;overflow-wrap:break-word;">${s.totalPrfssNm}</span>
          <span style="flex: 0 1 auto;position:relative;left:30px;">${s.niceTime}</span>
        </div>    
      </div>
      <small style="position:relative;">${s.sbjetSctnm} ${s.crdit}</small>
      
    `;

    el.addEventListener('click', () => {
      if(selectedSubject != s){
        document.querySelectorAll('.subject').forEach(x=>x.style.opacity='1');
        el.style.opacity='0.6';
        selectedSubject = s;
      } else {
        el.style.opacity='1';
        selectedSubject = null;
      }
    });

    subjectList.appendChild(el);
  });
}




let loadedCount = 0; // 현재 로드된 과목 수

// 다음 과목 30개 렌더링
function renderNextSubjects() {
  let sub;

  if(filters.estblDprtnNm.length > 1 || filters.crdit.size > 0 || filters.estblGrade.size > 0 || filters.sbjetSctnm.size > 0) {
    sub = filtered_SUBJECTS;
  } else {
    sub = SUBJECTS;
  }

  const nextBatch = sub.slice(loadedCount, loadedCount + LOAD_STEP);

  nextBatch.forEach(s => {
    const card = document.createElement('div');
    card.className = 'subject-card';

    const el = document.createElement('div');
    el.className = 'subject';
    el.style.borderLeftColor = s.color

    const elBack = document.createElement('div');
    elBack.className = 'subject-back';
    elBack.style.borderLeftColor = s.color;
    elBack.style.background = `linear-gradient(45deg, rgb(${getTextColorByModi(s.color, 70)}), ${s.color})`;

    // Flexbox로 선생님 / 시간 정렬
    el.innerHTML = `
      <div>
        ${s.sbjetNm}
        <div style="display:flex;font-size:12px;color:${getComputedStyle(document.documentElement).getPropertyValue('--muted')};font-weight:600;">
          <span style="flex: 0 1 auto;max-width:80px;overflow-wrap:break-word;">${s.totalPrfssNm}</span>
          <span style="flex: 0 1 auto;position:relative;left:30px;">${s.niceTime}</span>
        </div>    
      </div>
      <small style="position:relative;">${s.sbjetSctnm} ${s.crdit}</small>
    `;

    elBack.innerHTML = `
      <div class="back-btn-wrap">
        <button class="back-btn">강의계획서</button>
        <button class="back-btn">확정</button>
      </div>
    `;

    el.addEventListener('click', () => {
        document.querySelectorAll('.subject-card.flip').forEach(x=>x.classList.toggle('flip'));
        selectedSubject = s;

        card.classList.toggle('flip');

        document.querySelectorAll('.overlay-block').forEach(l => l.remove());

        
        if(s.niceTime){
          const niceTimeArr = s.niceTime.split(",<br>");
          niceTimeArr.forEach(t => {
            // console.log(t);

            let strtime = t.slice(2,7);

            let totaltime = t[18]*2;
            if(t.slice(22, 24) == 30) totaltime += 1;
            let matcher = { '월': 'mon', '화': 'tue', '수': 'wed', '목': 'thu', '금': 'fri', '토': 'sat'};
            let yoil = matcher[t[0]];

            createTimeOverlay(yoil, strtime, totaltime, s.sbjetNm);

            const bl = document.querySelectorAll('.overlay-block')[0];
            bl.scrollIntoView({ behavior: 'smooth', block: 'center' });
          });
        }
        // createTimeOverlay('mon', '09:30', 4, s.sbjetNm);


        const gehwekData = loadSubGehwek({estblYear:s.estblYear, estblSmstrSctcd:s.estblSmstrSctcd, sbjetCd:s.sbjetCd, sbjetDvnno:s.sbjetDvnno});
        gehwekData.then(result => {
          buildContent(result.data, `rgba(${hexColor2rgb(s.color)}, 0.34)`);
        });
        syllabus.scrollTop = 0;

      });


    elBack.addEventListener('click', (e) => {
      if(e.target.closest('.back-btn')) {
        return;
      }

      selectedSubject = null;
      card.classList.toggle('flip');
      document.querySelectorAll('.overlay-block').forEach(l => l.remove());
      syllabus.classList.remove('open');
    });


    // 강의계획서 버튼
    elBack.querySelector('.back-btn:nth-child(1)').addEventListener('click', () => {
      if(syllabus.classList.contains('open')) syllabus.classList.remove('open');
      else syllabus.classList.add('open');
    });


    // 확정 버튼
    elBack.querySelector('.back-btn:nth-child(2)').addEventListener('click', () => {
      if(syllabus.classList.contains('open')) syllabus.classList.remove('open');
      else syllabus.classList.add('open');

      selectedSubject = null;
      card.classList.toggle('flip');

      document.querySelectorAll('.overlay-block').forEach(l => l.remove());
      syllabus.classList.remove('open');

      if(subInside.crseNo.has(s.crseNo)) alert('이미 시간표에 저장된 과목입니다.');
      else createSubjectBlock(s);

      // if(s.niceTime){
      //   const niceTimeArr = s.niceTime.split(",<br>");
      //   niceTimeArr.forEach(t => {
      //     // console.log(t);

      //     let yoil = t[0];
      //     let strtime = t.slice(2,7);

      //     let totaltime = t[18]*2;
      //     if(t.slice(22, 24) == 30) totaltime += 1;
      //     let matcher = { '월': 'mon', '화': 'tue', '수': 'wed', '목': 'thu', '금': 'fri', '토': 'sat'};
      //     yoil = matcher[yoil];

      //     createSubjectBlock(yoil, strtime, totaltime, s.sbjetNm);

      //     // const sbl = document.querySelectorAll('.subject-block')[0];
      //     // sbl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      //   });
      // }
    });

    card.appendChild(el);
    card.appendChild(elBack);
    subjectList.appendChild(card);
  });
  loadedCount += nextBatch.length;
}



/* build time column and slots */
function buildGrid(){
  // times
  for(let h=H_START; h<H_END; ++h){
    for(let half=0; half<2; ++half){
      const tm = `${String(h).padStart(2,'0')}:${half===0?'00':'30'}`;
      const timecell = document.createElement('div');
      timecell.className='timecell';
      timecell.textContent = tm;
      timecol.appendChild(timecell);
    }
  }

  // for each day column, insert slots
  const daycols = timetable.querySelectorAll('.daycol');
  daycols.forEach(col=>{
    col.querySelectorAll('.slot').forEach(n=>n.remove());
    for(let h=H_START; h<H_END; ++h){
      for(let half=0; half<2; ++half){
        const slot = document.createElement('div');
        slot.className='slot';
        slot.dataset.time = `${String(h).padStart(2,'0')}:${half===0?'00':'30'}`;
        slot.addEventListener('click',(ev)=>onCellClick(ev, col));
        col.appendChild(slot);
      }
    }
  })
}


/* 클릭 시 과목 배치 (추가 구현 가능) */
function onCellClick(ev, col){
  if(!selectedSubject) return;
  alert(`${selectedSubject.name} (${selectedSubject.teacher}) 선택됨 - ${col.dataset.day} ${ev.currentTarget.dataset.time} 클릭`);
}

/* sidebar toggle */
openBtn.addEventListener('click',()=>{ 
  sidebar.classList.toggle('open');
  timetableWrap.classList.toggle('open'); 

  const overlayBlock = document.querySelector('.overlay-block');
  if(overlayBlock) overlayBlock.classList.toggle('open');

});


// 토글 버튼 클릭 → 해당 옵션 박스 열기/닫기
document.querySelectorAll('.filter-toggle').forEach(btn => {
  btn.addEventListener('click', e => {
    const section = e.currentTarget.closest('.filter-section');
    const box = section.querySelector('.filter-options');
    box.classList.toggle('open');

    // 다른 열려있는 박스 닫기
    document.querySelectorAll('.filter-options.open').forEach(o => {
      if (o !== box) o.classList.remove('open');
    });
  });
});



// ---- 검색 필터 ----
const filters = {
  estblDprtnNm: '',          // 전공/영역 : 문자열 (단일 선택)
  crdit: new Set(),   // 학점 : Set (다중 선택)
  estblGrade: new Set(),  // 학년
  sbjetSctnm: new Set(),  // 종류
};

// 칩 선택 시 기존 필터 로직 재사용
document.querySelectorAll('.filter-options .chip').forEach(chip => {
  chip.addEventListener('click', () => {
    const key = chip.dataset.estblDprtnNm ? 'estblDprtnNm' :
                chip.dataset.crdit ? 'crdit' : 
                chip.dataset.estblGrade ? 'estblGrade' :
                chip.dataset.sbjetSctnm ? 'sbjetSctnm' : null;
    const value = chip.dataset.estblDprtnNm || chip.dataset.crdit || chip.dataset.estblGrade || chip.dataset.sbjetSctnm;

    if (!key) return;

    // 단일/다중 선택 예시
    if (key === 'estblDprtnNm') {
      filters.estblDprtnNm = (filters.estblDprtnNm === value) ? '' : value;
      document.querySelectorAll('[data-estbl-dprtn-nm]').forEach(c => c.classList.remove('active'));
      if (filters.estblDprtnNm) chip.classList.add('active');
      else chip.classList.remove('active');
    } else if (key === 'crdit') {
      if (filters.crdit.has(value)) {
        filters.crdit.delete(value);
        chip.classList.remove('active');
      } else {
        filters.crdit.add(value);
        chip.classList.add('active');
      }
    } else if (key === 'estblGrade') {
      if (filters.estblGrade.has(value)) {
        filters.estblGrade.delete(value);
        chip.classList.remove('active');
      } else {
        filters.estblGrade.add(value);
        chip.classList.add('active');
      }
    } else if (key === 'sbjetSctnm') {
      if (filters.sbjetSctnm.has(value)) {
        filters.sbjetSctnm.delete(value);
        chip.classList.remove('active');
      } else {
        filters.sbjetSctnm.add(value);
        chip.classList.add('active');
      }
    }
    applyFilters();
  });
});

// 바깥 클릭 시 닫기
document.addEventListener('click', e => {
  if (!e.target.closest('.filter-section')) {
    document.querySelectorAll('.filter-options.open').forEach(o => o.classList.remove('open'));
  }
});



function applyFilters() {
  let result = SUBJECTS.filter(s => {
    // 전공/영역 필터
    if (filters.estblDprtnNm && s.estblDprtnNm !== filters.estblDprtnNm) return false;

    // 학점 필터
    if (filters.crdit.size > 0 && !filters.crdit.has(String(s.crdit))) return false;

    // 학년 필터
    if (filters.estblGrade.size > 0 && !filters.estblGrade.has(String(s.estblGrade))) return false;

    // 종류 필터
    if (filters.sbjetSctnm.size > 0 && !filters.sbjetSctnm.has(String(s.sbjetSctnm))) return false

    // (필요 시 다른 조건 추가)

    return true;
  });

  // console.log(filters, result);

  // subjectList 초기화
  subjectList.innerHTML = '';
  loadedCount = 0;
  
  // 
  filtered_SUBJECTS = result;
  renderNextSubjects();
}



// 맨 아래에 가까워지면 다음 배치 로드
subjectList.addEventListener('scroll', () => {
  if (subjectList.scrollTop + subjectList.clientHeight >= subjectList.scrollHeight - 5) {
    renderNextSubjects();
  }
});



// 요소 -> 정확한 좌표 함수
function getAbsolutePosSize(el) {
  const rect = el.getBoundingClientRect();
  const x = Math.round((rect.left + window.scrollX) * 100) / 100;
  const y = Math.round((rect.top + window.scrollY) * 100) / 100;
  const width = Math.round(rect.width * 100) / 100;
  const height = Math.round(rect.height * 100) / 100
  return { x, y, width, height};
}


// 부모 요소에서 상대적인 위치 함수
function getRelativePos(childEl, parentEl) {
  const childRect  = childEl.getBoundingClientRect();
  const parentRect = parentEl.getBoundingClientRect();

  const left = Math.round((childRect.left - parentRect.left) * 100) / 100;
  const top = Math.round((childRect.top  - parentRect.top) * 100) / 100;

  const width = Math.round(childRect.width * 100) / 100;
  const height = Math.round(childRect.height * 100) / 100;

  return {left:left, top:top, width:width, height:height};
}



// 시간표 위 투명한 오버레이 생성 함수
// function createOverlay(x, y, width, height, id) {
  // const block = document.createElement('div');
  // block.classList.add('overlay-block');
  // block.dataset.id = id;

  // block.style.left   = `${x}px`;
  // block.style.top    = `${y}px`;
  // block.style.width  = `${width}px`;
  // block.style.height = `${height}px`;

//   daycols.body.appendChild(block);
// }



/** 요일, 시작 시간, 수업시간으로 오버레이 생성하는 함수
 * 
 * 요일은 mon, tue, wed, thu, fri, sat, 아니면 한 글자
 * 
 * 시간은 09:30, HH:MM format
 * 
 * totaltime은 글쎄..
 * id는 있으면 드가도록
 * */
function createTimeOverlay(yoil, strtime, totaltime, id='') {
  const dayCols = document.querySelector(`.daycol[data-day="${yoil}"]`);
  const strSlot = dayCols.querySelector(`.slot[data-time="${strtime}"]`);
  
  const {left:x, top:y, width:wid, height:hei} = getRelativePos(strSlot, dayCols);
  
  const block = document.createElement('div');
  block.classList.add('overlay-block');
  block.dataset.id = id;

  block.style.width  = `${wid}px`;
  block.style.height = `${SLOT_HEIGHT*totaltime}px`;
  block.style.left   = `${x}px`;
  block.style.top    = `${y}px`;
  

  dayCols.appendChild(block);
}




// 시간표에 추가된 과목 시간 누적 함수
// -> subInside.time 용
function saveTimebyNicetime(niceTime){
  const niceTimeArr = niceTime.split(",<br>");
  niceTimeArr.some(t => {

    let matcher = { '월': 'mon', '화': 'tue', '수': 'wed', '목': 'thu', '금': 'fri', '토': 'sat'};
    let yoil = matcher[t[0]];

    let strtime = t.slice(2,7);
    let endtime = t.slice(10, 15);

    let totaltime = t[18]*2;
    if(t.slice(22, 24) == 30) totaltime += 1;

    const timeRngArr = subInside.time[yoil];

    if(timeRngArr.includes(strtime+'~'+endtime)) return false;

    if(!timeRngArr.length) subInside.time[yoil].push(strtime+'~'+endtime);
    else if(timeRngArr.length == 1) {
      let strtimeRng = timeRngArr[0].slice(0,5);
      let endtimeRng = timeRngArr[0].slice(6,11);
      
      if(strtime > endtimeRng || endtime < strtimeRng) subInside.time[yoil].push(strtime + '~' + endtime)
      else { 
        if(strtime < strtimeRng) subInside.time[yoil][0] = strtime + '~' + endtimeRng;
        if(endtime > endtimeRng) subInside.time[yoil][0] = strtimeRng + '~' + endtime;
      }
    }
    else {
      let isDone = false;

      for(let i=0; i<timeRngArr.length-1; i++){
        var strtimeRng1 = timeRngArr[i].slice(0,5);
        var endtimeRng1 = timeRngArr[i].slice(6, 11);
        var strtimeRng2 = timeRngArr[i+1].slice(0,5);
        var endtimeRng2 = timeRngArr[i+1].slice(6, 11);

        // 읽을 수 있다면 읽어봐라.
        if(endtimeRng1 < strtime && strtimeRng2 > endtime) {
          subInside.time[yoil][i] = strtimeRng1 + '~' + endtimeRng2;
          subInside.time[yoil].splice(i+1, 1);
        } else if(strtime <= strtimeRng1 && endtime >= endtimeRng2) {
          subInside.time[yoil].push(strtime + '~' + endtime);
          subInside.time[yoil].splice(i, 2);
        } else if(strtime <= strtimeRng1 && endtime >= endtimeRng1) {
          subInside.time[yoil][i] = strtime + '~' + endtime;
        } else if(strtime <= strtimeRng2 && endtime >= endtimeRng2) {
          subInside.time[yoil][i+1] = strtime + '~' + endtime;
        } else if(endtime >= strtimeRng1 && strtime <= strtimeRng1) {
          subInside.time[yoil][i] = strtime + '~' + endtimeRng1;
        } else if(strtime <= endtimeRng1 && endtime >= endtimeRng1) {
          subInside.time[yoil][i] = strtimeRng1 + '~' + endtime;
        } else if(strtime <= strtimeRng2 && endtime >= strtimeRng2) {
          subInside.time[yoil][i+1] = strtime + '~' + endtimeRng2;
        } else if(strtime <= endtimeRng2 && endtime >= endtimeRng2) {
          subInside.time[yoil][i+1] = strtimeRng2 + '~' + endtime;
        } else if(strtimeRng1 <= strtime && endtime <= endtimeRng1) {
          isDone = true;
          break;
        } else if(strtimeRng2 <= strtime && endtime <= endtimeRng2) {
          isDone = true;
          break;
        } else {
          continue;
        }
        isDone = true;
        break;
      }

      if(!isDone) subInside.time[yoil].push(strtime + '~' + endtime);
      console.log(isDone);
    }

    // 정렬
    if(subInside.time[yoil].length > 1){
      subInside.time[yoil].sort((a, b) => {
        const [aStart] = a.split('~');
        const [bStart] = b.split('~');

        const [aH, aM] = aStart.split(':').map(Number);
        const [bH, bM] = bStart.split(':').map(Number);

        return (aH * 60 + aM) - (bH * 60 + bM);
      });
    }
  });

}


// 수업 블록 생성
function createSubjectBlock(sub){
  if(!sub.niceTime) return

  const niceTimeArr = sub.niceTime.split(",<br>");
  niceTimeArr.forEach(t => {
    let yoil = t[0];
    let strtime = t.slice(2,7);

    let totaltime = t[18]*2;
    if(t.slice(22, 24) == 30) totaltime += 1;
    let matcher = { '월': 'mon', '화': 'tue', '수': 'wed', '목': 'thu', '금': 'fri', '토': 'sat'};
    yoil = matcher[yoil];

    const dayCols = document.querySelector(`.daycol[data-day="${yoil}"]`);
    const strSlot = dayCols.querySelector(`.slot[data-time="${strtime}"]`);
    
    const {left:x, top:y, width:wid, height:hei} = getRelativePos(strSlot, dayCols);
    
    const block = document.createElement('div');
    block.classList.add('subject-block');
    block.dataset.id = `${sub.id}Block`;

    block.style.width  = `${wid}px`;
    block.style.height = `${SLOT_HEIGHT*totaltime}px`;
    block.style.left   = `${x}px`;
    block.style.top    = `${y}px`;

    block.style.background = `linear-gradient(45deg, rgb(${getTextColorByModi(sub.color, 70)}), ${sub.color})`;
    block.style.color = `${getTextColorByBackgroundColor(sub.color)}`;

    block.innerHTML = `
      <div class="subject-block-title">${sub.sbjetNm}</div>
      <div class="subject-block-detail">${sub.lctrmInfo}&nbsp${sub.rmnmCd}호<br><br>${sub.niceTime}</div>
    `;
    
    subInside.crseNo.add(sub.crseNo);
    saveTimebyNicetime(sub.niceTime);
    
    dayCols.appendChild(block);

    console.log(subInside);

    block.classList.add('drop');
  });
}






// === 필드 라벨 매핑 ===
const fieldMap = {
  sbjetNm:        "과목명",
  rprsnStfnoNm:   "담당 교수",
  lssnsTimeInfo:  "수업 시간",
  lctrmCd:        "강의실",
  lctreGoalCntns: "강의 목표",
  smmryPrpsCntns: "개요",
  taskEvltnMethdCntns: "평가 방법",
  tchmtRefLtrtuCntns:  "교재 / 참고문헌",
  oriAttlcRefMtterCntns : "참고사항",
  rcmmdPlrSbjetInfo: "권장선수교과목",
  rcmmdSbstsSbjetInfo : "권장후수교과목",
  cntacEmail:    "이메일",
  cntacMtlno:    "전화번호"
};

// === 컨텐츠 생성 ===
function buildContent(data, color) {
  // syllabus.style.background = 'linear-gradient(45deg, rgba(172, 255, 47, 0.5), rgb(30, 144, 255, 0.5))'
  syllabus.style.background = `linear-gradient(45deg, rgba(172, 255, 47, 0.4), ${color})`
  syllabusContent.innerHTML = '';
  Object.entries(fieldMap).forEach(([key,label]) => {
    if(!data[key]) return;
    const section = document.createElement('section');
    section.innerHTML = `
      <h3>${label}<span>▾</span></h3>
      <div class="body">${data[key]}</div>
    `;
    // 접기/펼치기
    section.querySelector('h3').addEventListener('click', () => {
      section.classList.toggle('collapsed');
      section.querySelector('.body').classList.toggle('hidden');
    });
    syllabusContent.appendChild(section);
  });
}





/* init */
loadSubjects();
buildGrid();







// curl ^"https://knuin.knu.ac.kr/public/web/stddm/lsspr/syllabus/lectPlnInqr/selectListLectPlnInqr^" ^
//   -H ^"Accept: application/json, text/javascript, */*; q=0.01^" ^
//   -H ^"Content-Type: application/json^" ^
//   --data-raw ^"^{^\^"search^\^":^{^\^"estblYear^\^":^\^"2025^\^",^\^"estblSmstrSctcd^\^":^\^"CMBS001400002^\^",^\^"sbjetCd^\^":^\^"^\^",^\^"sbjetNm^\^":^\^"^\^",^\^"crgePrfssNm^\^":^\^"^\^",^\^"sbjetRelmCd^\^":^\^"^\^",^\^"sbjetSctcd^\^":^\^"^\^",^\^"estblDprtnCd^\^":^\^"1101^\^",^\^"rmtCrseYn^\^":^\^"^\^",^\^"rprsnLctreLnggeSctcd^\^":^\^"^\^",^\^"flplnCrseYn^\^":^\^"^\^",^\^"pstinNtnnvRmtCrseYn^\^":^\^"^\^",^\^"dgGbDstrcRmtCrseYn^\^":^\^"^\^",^\^"sugrdEvltnYn^\^":^\^"^\^",^\^"prctsExrmnYn^\^":^\^"^\^",^\^"gubun^\^":^\^"01^\^",^\^"isApi^\^":^\^"Y^\^",^\^"bldngSn^\^":^\^"^\^",^\^"bldngCd^\^":^\^"^\^",^\^"bldngNm^\^":^\^"^\^",^\^"lssnsLcttmUntcd^\^":^\^"^\^",^\^"sbjetSctcd2^\^":^\^"^\^",^\^"contents^\^":^\^"^\^",^\^"lctreLnggeSctcd^\^":^\^"ko^\^",^\^"knuFtrDesigYn^\^":^\^"^\^",^\^"cltreHmntsCltreYn^\^":^\^"^\^",^\^"sdgCltreYn^\^":^\^"^\^",^\^"rltmCrseYn^\^":^\^"^\^"^}^}^"

// curl ^"https://knuin.knu.ac.kr/public/web/stddm/lsspr/syllabus/lectPlnInqr/selectListLectPlnInqr^" ^
//   -H ^"Accept: application/json, text/javascript, */*; q=0.01^" ^
//   -H ^"Content-Type: application/json^" ^
//   --data-raw ^"^{^\^"search^\^":^{^\^"estblYear^\^":^\^"2025^\^",^\^"estblSmstrSctcd^\^":^\^"CMBS001400002^\^",^\^"sbjetCd^\^":^\^"^\^",^\^"sbjetNm^\^":^\^"^\^",^\^"crgePrfssNm^\^":^\^"^\^",^\^"sbjetRelmCd^\^":^\^"^\^",^\^"sbjetSctcd^\^":^\^"^\^",^\^"estblDprtnCd^\^":^\^"1O14^\^",^\^"rmtCrseYn^\^":^\^"^\^",^\^"rprsnLctreLnggeSctcd^\^":^\^"^\^",^\^"flplnCrseYn^\^":^\^"^\^",^\^"pstinNtnnvRmtCrseYn^\^":^\^"^\^",^\^"dgGbDstrcRmtCrseYn^\^":^\^"^\^",^\^"sugrdEvltnYn^\^":^\^"^\^",^\^"prctsExrmnYn^\^":^\^"^\^",^\^"gubun^\^":^\^"01^\^",^\^"isApi^\^":^\^"Y^\^",^\^"bldngSn^\^":^\^"^\^",^\^"bldngCd^\^":^\^"^\^",^\^"bldngNm^\^":^\^"^\^",^\^"lssnsLcttmUntcd^\^":^\^"^\^",^\^"sbjetSctcd2^\^":^\^"^\^",^\^"contents^\^":^\^"^\^",^\^"lctreLnggeSctcd^\^":^\^"ko^\^",^\^"knuFtrDesigYn^\^":^\^"^\^",^\^"cltreHmntsCltreYn^\^":^\^"^\^",^\^"sdgCltreYn^\^":^\^"^\^",^\^"rltmCrseYn^\^":^\^"^\^"^}^}^"


// curl ^"https://knuin.knu.ac.kr/public/web/stddm/lsspr/syllabus/lectPlnInqr/selectListLectPlnInqr^" ^
//   -H ^"Accept: application/json, text/javascript, */*; q=0.01^" ^
//   -H ^"Content-Type: application/json^" ^
//   --data-raw ^"^{^\^"search^\^":^{^\^"estblYear^\^":^\^"2025^\^",^\^"estblSmstrSctcd^\^":^\^"CMBS001400001^\^",^\^"sbjetCd^\^":^\^"^\^",^\^"sbjetNm^\^":^\^"^\^",^\^"crgePrfssNm^\^":^\^"^\^",^\^"sbjetRelmCd^\^":^\^"01^\^",^\^"sbjetSctcd^\^":^\^"^\^",^\^"estblDprtnCd^\^":^\^"^\^",^\^"rmtCrseYn^\^":^\^"^\^",^\^"rprsnLctreLnggeSctcd^\^":^\^"^\^",^\^"flplnCrseYn^\^":^\^"^\^",^\^"pstinNtnnvRmtCrseYn^\^":^\^"^\^",^\^"dgGbDstrcRmtCrseYn^\^":^\^"^\^",^\^"sugrdEvltnYn^\^":^\^"^\^",^\^"prctsExrmnYn^\^":^\^"^\^",^\^"gubun^\^":^\^"01^\^",^\^"isApi^\^":^\^"Y^\^",^\^"bldngSn^\^":^\^"^\^",^\^"bldngCd^\^":^\^"^\^",^\^"bldngNm^\^":^\^"^\^",^\^"lssnsLcttmUntcd^\^":^\^"^\^",^\^"sbjetSctcd2^\^":^\^"^\^",^\^"contents^\^":^\^"^\^",^\^"lctreLnggeSctcd^\^":^\^"ko^\^",^\^"knuFtrDesigYn^\^":^\^"^\^",^\^"cltreHmntsCltreYn^\^":^\^"^\^",^\^"sdgCltreYn^\^":^\^"^\^",^\^"rltmCrseYn^\^":^\^"^\^"^}^}^"

// curl ^"https://knuin.knu.ac.kr/public/web/stddm/lsspr/syllabus/lectPlnInqr/selectListLectPlnInqr^" ^
//   -H ^"Accept: application/json, text/javascript, */*; q=0.01^" ^
//   -H ^"Content-Type: application/json^" ^
//   --data-raw ^"^{^\^"search^\^":^{^\^"estblYear^\^":^\^"2025^\^",^\^"estblSmstrSctcd^\^":^\^"CMBS001400002^\^",^\^"sbjetCd^\^":^\^"^\^",^\^"sbjetNm^\^":^\^"^\^",^\^"crgePrfssNm^\^":^\^"^\^",^\^"sbjetRelmCd^\^":^\^"01^\^",^\^"sbjetSctcd^\^":^\^"^\^",^\^"estblDprtnCd^\^":^\^"^\^",^\^"rmtCrseYn^\^":^\^"^\^",^\^"rprsnLctreLnggeSctcd^\^":^\^"^\^",^\^"flplnCrseYn^\^":^\^"^\^",^\^"pstinNtnnvRmtCrseYn^\^":^\^"^\^",^\^"dgGbDstrcRmtCrseYn^\^":^\^"^\^",^\^"sugrdEvltnYn^\^":^\^"^\^",^\^"prctsExrmnYn^\^":^\^"^\^",^\^"gubun^\^":^\^"01^\^",^\^"isApi^\^":^\^"Y^\^",^\^"bldngSn^\^":^\^"^\^",^\^"bldngCd^\^":^\^"^\^",^\^"bldngNm^\^":^\^"^\^",^\^"lssnsLcttmUntcd^\^":^\^"^\^",^\^"sbjetSctcd2^\^":^\^"^\^",^\^"contents^\^":^\^"^\^",^\^"lctreLnggeSctcd^\^":^\^"ko^\^",^\^"knuFtrDesigYn^\^":^\^"^\^",^\^"cltreHmntsCltreYn^\^":^\^"^\^",^\^"sdgCltreYn^\^":^\^"^\^",^\^"rltmCrseYn^\^":^\^"^\^"^}^}^"

