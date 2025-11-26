const worker = new Worker('js/timeworker.js');
worker.postMessage({ interval: 1000 }); // 1초 간격으로 타이머 실행

/* DOM */
const goToTop = document.querySelector('.go-to-top');
const hwakin = document.querySelector('.btn.btn-outline-primary.ml-1');
const tgyogwa = document.getElementById('grid02');
const tsincung = document.getElementById('grid03');
const timerElm = document.getElementById('lbl_sessionTimeOutDisp');
const capchaReroll = document.querySelector('.btn.btn-primary.btn-refresh');

let SUBJECTS = [];
let srchedSbjCrseNos = [];
let sinchgdSbjCrseNos = [];


/* load lectures.json */
async function loadLectures() {
  try {
    const res = await fetch('/api/lectures');
    if (!res.ok) throw new Error('Failed to fetch lectures');
    const lectures = await res.json();

    SUBJECTS = lectures.map(l => ({
      estblYear: l.estblYear || 'unknown',  // 년도
      estblSmstrSctcd : l.estblSmstrSctcd || 'unknown',   //학기
      sbjetCd : l.sbjetCd || '',  //  과목코드( - 뒤에 제외 )
      crseNo: l.crseNo || '',    // 과목코드
      sbjetDvnno: l.sbjetDvnno || '', // 분반 (과목 코드의 - 뒤에 있는거 )
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
    }));
  } catch (err) {
    console.error(err);
  }
}

loadLectures();



// go-to-top
goToTop.addEventListener('click', e => window.scrollTo(0,0));


// hwakin clickEvent 확인 버튼
hwakin.addEventListener('click', e => {
    const capchainput = document.getElementById("schCapcha2");
    
    if(!checkCaptcha()) {
        alert('자동입력방지 문자가 틀립니다.');
        capchainput.value = '';
        return;
    };

    const inputSbjet = document.querySelector('#schSbjetNo');
    const inputSbjetNo = inputSbjet.value;
    var tsub = null;

    SUBJECTS.some(sub => {
        if(sub.sbjetCd + sub.sbjetDvnno == inputSbjetNo){
            tsub = sub;
            console.log(sub);
            return true;
        }
    });

    if(tsub == null) {
        alert('조회된 데이터가 없습니다.');
        capchainput.value = '';
        inputSbjet.value = '';
        return;
    }

    if(srchedSbjCrseNos.map(item => item.sub).includes(tsub) || sinchgdSbjCrseNos.map(item => item.sub).includes(tsub)){
      alert('이미 조회하거나 신청한 과목입니다.');
      capchainput.value = '';
      inputSbjet.value = '';
      return;
    }

    // '조회된 데이터가 없습니다' 삭제
    const noData = document.getElementById('divNoData02');
    if(noData) noData.remove();

    // 테이블 추가
    let tr = document.createElement('tr');

    tr.innerHTML = `
        <td class="idx">${srchedSbjCrseNos.length+1}</td>
        <td>
            <a href="#none" onclick="sinchung(${srchedSbjCrseNos.length})"; class="btn btn-sm btn-primary"; style="min-width:50px";>신청</a>
        </td>
        <td class="text-nowrap">${tsub.sbjetCd}</td>
        <td class="text-nowrap">${tsub.sbjetNm}</td>
        <td>${tsub.sbjetDvnno}</td>
        <td>${tsub.sbjetSctnm}</td>
        <td>${tsub.crdit}</td>
        <td>?</td>
        <td></td>
        <td class="text-nowrap">
            ${tsub.lssnsRealTimeInfo}
        </td>
        <td>?</td>
        <td>?</td>
    `;
    

    tgyogwa.appendChild(tr);
    srchedSbjCrseNos.push({elm:tr, sub:tsub});

    capchainput.value = '';
    drawCaptcha();
    inputSbjet.value = '';
});



function sinchung(idx) {
    // '조회된 데이터가 없습니다' 삭제
    const noData = document.getElementById('divNoData03');
    if(noData) noData.remove();

    // 테이블 추가
    let tr2 = document.createElement('tr');

    tr2.innerHTML = `
    <tr>
        <td class="idx">${sinchgdSbjCrseNos.length+1}</td>
        <td>
            <a href="#none" onclick="deleteSub(${sinchgdSbjCrseNos.length})" class="btn btn-sm btn-primary" style="min-width:50px";>삭제</a>
        </td>
        <td class="text-nowrap">${srchedSbjCrseNos[idx].sub.sbjetCd}</td>
        <td class="text-nowrap">${srchedSbjCrseNos[idx].sub.sbjetNm}</td>
        <td>${srchedSbjCrseNos[idx].sub.sbjetDvnno}</td>
        <td><select class="form-control form-control-sm w-100" disabled=""><option value="">선택</option><option value="STCU000800001">교양</option><option value="STCU000800002">전공기초</option><option value="STCU000800004">전공</option><option value="STCU000800005">부전공</option><option value="STCU000800006">복수전공</option><option value="STCU000800007">교직</option><option value="STCU000800012">전공필수</option><option value="STCU000800010">연계전공</option><option value="STCU000800023">융합전공</option><option value="STCU000800024">전공심화</option><option value="STCU000800025" selected="">일반선택</option><option value="STCU000800026">공학전공</option><option value="STCU000800027">전공기반</option><option value="STCU000800028">기본소양</option></select></td>
        <td>${srchedSbjCrseNos[idx].sub.crdit}</td>
        <td></td>
        <td></td>
        <td>${srchedSbjCrseNos[idx].sub.lssnsRealTimeInfo}</td>
    </tr>
    `;

    tsincung.appendChild(tr2);

    sinchgdSbjCrseNos.push({elm:tr2, sub:srchedSbjCrseNos[idx].sub});


    // srchedSbjCrseNos 삭제
    srchedSbjCrseNos[idx].elm.remove();
    srchedSbjCrseNos.splice(idx, 1);
    srchedSbjIdxing();

    alert('신청되었습니다.');
}


function deleteSub(idx){

    if(!confirm('정말로 삭제하시겠습니까?')) return;

    // sinchgdSbjCrseNos 삭제
    sinchgdSbjCrseNos[idx].elm.remove();
    sinchgdSbjCrseNos.splice(idx, 1);
    sinchgdSbjIdxing();

    alert('삭제되었습니다.');

    if(sinchgdSbjCrseNos.length == 0) {
        const noData = document.createElement('div');
        const table = document.querySelector('.table-responsive.mt-3');
        noData.innerHTML = `
            <div id="divNoData03" class="mt-3 pt-4 mb-3 pb-4 border border-dark border-left-0 border-right-0" style="">
                <div class="non-page board">
                    <h3>조회된 데이터가 없습니다.</h3>
                </div>
            </div>
        `;
        table.appendChild(noData);
    }
}


function srchedSbjIdxing() {
    srchedSbjCrseNos.forEach((tuple, idx) => {
        tuple.elm.querySelector('.idx').textContent = idx+1; 
        tuple.elm.querySelector('.btn.btn-sm.btn-primary').onclick = () => sinchung(idx);
    });
}

function sinchgdSbjIdxing() {
    sinchgdSbjCrseNos.forEach((tuple, idx) => {
        tuple.elm.querySelector('.idx').textContent = idx+1; 
        tuple.elm.querySelector('.btn.btn-sm.btn-primary').onclick = () => deleteSub(idx);
    });
}


/* 캡차 */
function generateCaptchaText(length = 4) {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ123456789";
    let text = "";
    for (let i = 0; i < length; i++) {
        text += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return text;
}

let captchaText = "";

function drawCaptcha() {
  captchaText = generateCaptchaText();
  const canvas = document.getElementById("captchaCanvas");
  const ctx = canvas.getContext("2d");

  // 배경
  ctx.fillStyle = "#f0f0f0";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // 텍스트 스타일
  ctx.font = "30px Arial";
  ctx.fillStyle = "#333";

  // 텍스트 약간 랜덤 배치
  const x = 20 + Math.random() * 15;
  const y = 25 + Math.random() * 3;

  // 약간 회전
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate((Math.random() - 0.5) * 0.2);
  ctx.fillText(captchaText, 0, 0);
  ctx.restore();

  // 라인(봇 방해)
  for (let i = 0; i < 4; i++) {
    ctx.beginPath();
    ctx.moveTo(Math.random() * 150, Math.random() * 50);
    ctx.lineTo(Math.random() * 150, Math.random() * 50);
    ctx.strokeStyle = "#615656ff";
    ctx.stroke();
  }
}

function checkCaptcha() {
  const value = document.getElementById("schCapcha2").value;
  const result = document.getElementById("result");

  if (value === captchaText) {
    return true;
  } else {
    drawCaptcha();
    return false;
  }
}

// 캡차 다시 생성하는 버튼
capchaReroll.addEventListener('click', () => {
    drawCaptcha();
});


// timer
worker.onmessage = function (e) {
  const { type, count, delay, timeMMSS, timeLeft } = e.data;
  switch (type) {
    case 'timer':
      // console.log(`${count}회 실행 | 지연 시간: ${delay}ms, ${timeLeft}`);
      timerElm.textContent = timeMMSS;
      break;
    case 'timer-end':
      console.log('타이머 종료');
      alert('시간이 다 됐습니다!');
      break;
  }
};


/* init */

// 타이머 실행
worker.postMessage({ type: 'start-timer', second: 1200});

drawCaptcha();