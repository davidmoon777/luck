// ----------------------
// 회원가입 / 이벤트
// ----------------------
let money = 0;
let username = "";

function registerUser() {
    username = document.getElementById("username-input").value.trim();
    let password = document.getElementById("password-input").value.trim();
    if (!username || !password) return alert("아이디와 비밀번호를 입력하세요.");

    // 계정 저장 (localStorage)
    localStorage.setItem("username", username);
    localStorage.setItem("password", password);
    money = 10000000; // 이벤트 지급
    localStorage.setItem("money", money);

    document.getElementById("signup-screen").classList.add("hidden");
    document.getElementById("event-popup").classList.remove("hidden");
}

function closePopup() {
    document.getElementById("event-popup").classList.add("hidden");
    showGameScreen();
}

function showGameScreen() {
    document.getElementById("game-screen").classList.remove("hidden");
    document.getElementById("display-username").innerText = "계정: " + username;
    updateMoneyDisplay();
    startNewsFeed();
}

function updateMoneyDisplay() {
    document.getElementById("display-money").innerText = "보유 금액: " + money.toLocaleString() + "원";
}

// ----------------------
// 게임 선택
// ----------------------
function showGame(name) {
    if (name === "slot") slotGame();
    if (name === "matgo") matgoGame();
    if (name === "seotda") seotdaGame();
    if (name === "blackjack") blackjackUI();
    if (name === "holjak") holjakGame();
    if (name === "management") managementUI();
}

// ==============================
// 슬롯, 맞고, 섯다, 홀짝, 블랙잭 함수는 이전 버전 유지
// ==============================

// 간단히 랜덤 함수
function rand(min,max){ return Math.floor(Math.random()*(max-min+1)+min); }

// ==============================
// 관리 탭
// ==============================
function managementUI(){
    document.getElementById("game-area").innerHTML=`
        <h2>🛠 관리</h2>
        <p>계정: ${username}</p>
        <p>보유 금액: ${money.toLocaleString()}원</p>
        <input id="withdraw-account" placeholder="계좌번호">
        <input id="withdraw-pass" placeholder="계좌 비밀번호">
        <input id="withdraw-amount" placeholder="출금 금액">
        <button onclick="withdraw()">출금</button>
        <button onclick="showGameScreen()">뒤로</button>
    `;
}

function withdraw(){
    let acct = document.getElementById("withdraw-account").value;
    let pass = document.getElementById("withdraw-pass").value;
    let amt = parseInt(document.getElementById("withdraw-amount").value);

    if(!acct || !pass || !amt) return alert("모든 값을 입력하세요.");
    if(amt>money) return alert("보유 금액 초과!");
    money -= amt;
    updateMoneyDisplay();
    alert(`💸 ${amt.toLocaleString()}원 출금 완료!`);
}

// ==============================
// 실시간 뉴스 피드
// ==============================
const newsMessages = [
    "님이 잭팟 당첨!",
    "님이 출금 완료!",
    "님이 50,000,000원 잭팟!",
    "님이 25,000,000원 출금!",
    "님이 블랙잭 승리!",
    "님이 슬롯 잭팟!",
];

const nicknames = ["행운이", "카지노왕", "리치맨", "슬롯마스터", "블랙잭킹", "머니헌터"];

function randomColor() {
    return `hsl(${rand(0,360)},80%,60%)`;
}

function startNewsFeed() {
    const feed = document.getElementById("news-feed");
    setInterval(() => {
        let nick = nicknames[rand(0,nicknames.length-1)];
        let msg = newsMessages[rand(0,newsMessages.length-1)];
        let amount = rand(10000000,100000000).toLocaleString();
        if(msg.includes("원")) msg = msg.replace(/\d{1,3}(,\d{3})*/,""+amount);
        let span = document.createElement("span");
        span.innerText = nick + msg;
        span.style.color = randomColor();
        feed.appendChild(span);
        // 10개 이상이면 제거
        if(feed.children.length>10) feed.removeChild(feed.firstChild);
    }, 3000);
}
