function formatTime(ms) {
    ms = ms + 1000;     // 엄청난 하드 코딩
    
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    const mm = String(minutes).padStart(2, '0');
    const ss = String(seconds).padStart(2, '0');

    return `${mm}:${ss}`;
}

function intervalTimer(endTime, timeout) {
    let timerId;
    let count = 0;
    const start = Date.now();

    timerId = setInterval(() => {
        const now = Date.now();
        const timeLeft = endTime - now;
        const delay = now - start - (count + 1) * timeout;
        const timeMMSS = formatTime(timeLeft); 
        count += 1;
        postMessage({ type: 'timer', count, delay, timeMMSS, timeLeft });

        if (timeLeft <= 0) {
        postMessage({ type: 'timer-end' });
        timerId && clearInterval(timerId);
        }
    }, timeout);
}

onmessage = function (e) {
    const { type, second } = e.data;
    switch (type) {
        case 'start-timer':
        intervalTimer(Date.now() + second * 1000, 1000);
        break;
        case 'timer-end':
        postMessage({ type: 'timer-end' });
        break;
    }
};