var game = "logictrainer";
var timerId;
var startTime;
var elapsedTime = 0;

function onBuildLoaded() {
    console.log("On build loaded. Starting timer");
    startTimer();
    document.addEventListener("visibilitychange", onVisibilityChange);
}

function onVisibilityChange() {
    if (document.visibilityState !== "visible") {
        console.log("Timer Stopped");
        stopTimer();
    } else {
        console.log("Timer started again");
        startTimer();
    }
}

function pause() {

}

function resume() {

}


// Функция для обновления таймера на странице
function updateTimer() {
    var currentTime = Math.floor((Date.now() - startTime + elapsedTime) / 1000);
    console.log("curretnTime: " + currentTime);
}

// Функция для запуска таймера
function startTimer() {
    startTime = Date.now();
    timerId = setInterval(updateTimer, 1000);
}

// Функция для остановки таймера
function stopTimer() {
    clearInterval(timerId);
    elapsedTime += Date.now() - startTime;
}

window.addEventListener('unload', function (event) {
    
    // Проверяем, подтверждено ли закрытие вкладки
    if (navigator.sendBeacon && timerId) {
        var timerValue = Math.floor(elapsedTime / 1000);
        var isDeveloper;
        if(localStorage.getItem('IsDeveloper')) isDeveloper = true;
        var url = `https://us-central1-dzgames-12ad8.cloudfunctions.net/DZGameAnalyticsPlayTimeEvent?` +
            `uid=${getCookieValue("userId")}&date=${formatTime(Date.now())}&game=${game}&time=${timerValue}&isDeveloper=${isDeveloper}`;
            
            gameanalytics.GameAnalytics.addDesignEvent("PlayTime", timerValue);
            navigator.sendBeacon(url);
        console.log('Закрытие вкладки было подтверждено');
    }
});


function getCookieValue(cookieName) {
    var name = cookieName + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var cookieArray = decodedCookie.split(';');

    for (var i = 0; i < cookieArray.length; i++) {
        var cookie = cookieArray[i].trim();

        if (cookie.indexOf(name) === 0) {
            return cookie.substring(name.length, cookie.length);
        }
    }

    return '';
}

// Функция для преобразования времени в нужный формат
function formatTime(time) {
    var dateObject = new Date(time);
    var day = ("0" + dateObject.getDate()).slice(-2);
    var month = ("0" + (dateObject.getMonth() + 1)).slice(-2);
    var year = dateObject.getFullYear();
    var hours = ("0" + dateObject.getHours()).slice(-2);
    var minutes = ("0" + dateObject.getMinutes()).slice(-2);
    var seconds = ("0" + dateObject.getSeconds()).slice(-2);
    
    var formattedTime = day + "." + month + "." + year + " " + hours + ":" + minutes + ":" + seconds;
    return formattedTime;
}