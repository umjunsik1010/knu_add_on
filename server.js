// server.js
const express = require('express');
const path = require('path');
const axios = require('axios');
const cors = require('cors');

const app = express();

const PORT = 3000;

// CORS 설정 - 모두 개방
app.use(cors());

// body parser
app.use(express.json());
app.use(express.urlencoded({extended:true}));


// 정적 파일 제공 (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));


// 간단한 API 예시
app.get('/api/hello', (req, res) => {
  res.json({ message: '안녕하세요, Express!' });
});


// 각 HTML 파일을 직접 라우팅
app.get('/timetable', (req, res) =>
  res.sendFile(path.join(__dirname, 'public', 'timetable.html'))
);
app.get('/gradecalc', (req, res) =>
  res.sendFile(path.join(__dirname, 'public', 'gradecalc.html'))
);
app.get('/scorecalc', (req, res) =>
  res.sendFile(path.join(__dirname, 'public', 'scorecalc.html'))
);


// 수업계획표 json API
app.post('/api/gehwek', async (req, res) => {
    try {
        const { estblYear, estblSmstrSctcd, sbjetCd, sbjetDvnno} = req.body;

        // 원격 API 요청 body 구성
        const payload = {
        search: {
            estblYear: estblYear || "2025",     // 년도
            estblSmstrSctcd: estblSmstrSctcd || "CMBS001400001",    // 학기
            sbjetCd: sbjetCd || "",   // 과목 코드
            sbjetDvnno: sbjetDvnno || "",   // 분반?
            lctreLnggeSctcd: "STCU001400001",   // 이것도 뭐지
            doPlan: "Kor",
            // estblDprtnCd: "1",   // 이게 뭐지
            readOnlyYn: "Y",
            isApi: "Y",
            nncrsCntctYn: ""
        }
        };

        const response = await axios.post(
        "https://knuin.knu.ac.kr/public/web/stddm/lsspr/syllabus/lectPlnInputDtl/selectListLectPlnInputDtl",
        payload,
        {
            headers: {
            "accept": "application/json, text/javascript, */*; q=0.01",
            "content-type": "application/json",
            "x-requested-with": "XMLHttpRequest"
            }
        }
        );

        res.json(response.data);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch gehwek' });
    }
});



// 서버 실행
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});



