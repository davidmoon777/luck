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
// 슬롯 게임 UI
// ==============================
function slotGame() {
    const area = document.getElementById("game-area");
    area.innerHTML=`
        <h2>🎰 슬롯 머신</h2>
        <p>배팅 금액 입력:</p>
        <input id="slot-bet" placeholder="배팅 금액">
        <button onclick="spinSlot()">스핀!</button>
        <div id="slot-result"></div>
        <button onclick="showGameScreen()">뒤로</button>
    `;
}

function spinSlot() {
    let bet = parseInt(document.getElementById("slot-bet").value);
    if (!bet || bet>money) return alert("올바른 금액 입력");
    money -= bet;
    const a = rand(1,9), b=rand(1,9), c=rand(1,9);
    let winnings = 0;
    let msg="";
    if(a===b && b===c){ winnings = bet*10; msg="잭팟!";}
    else if(a===b || b===c || a===c){ winnings = Math.floor(bet*1.5); msg="두개 일치!";}
    else msg="꽝!";
    money+=winnings;
    updateMoneyDisplay();
    document.getElementById("slot-result").innerText=`결과: | ${a} | ${b} | ${c} |  ${msg} ${winnings>0?winnings+"원 획득":""}`;
}

// ==============================
// 블랙잭 UI
// ==============================
function blackjackUI(){
    const area = document.getElementById("game-area");
    area.innerHTML=`
        <h2>♠ 블랙잭</h2>
        <p>배팅 금액 입력:</p>
        <input id="bj-bet" placeholder="배팅 금액">
        <button onclick="startBlackjack()">게임 시작</button>
        <div id="bj-area"></div>
        <button onclick="showGameScreen()">뒤로</button>
    `;
}

let bjPlayer=[], bjDealer=[], bjDeck=[], bjBet=0;

function startBlackjack(){
    bjBet=parseInt(document.getElementById("bj-bet").value);
    if(!bjBet || bjBet>money) return alert("올바른 배팅금액");
    money-=bjBet;
    updateMoneyDisplay();
    bjDeck = [2,3,4,5,6,7,8,9,10,10,10,10,11].flatMap(n=>[n,n,n,n]);
    bjPlayer=[drawCard(),drawCard()];
    bjDealer=[drawCard(),drawCard()];
    showBlackjack();
}

function drawCard(){ let idx=rand(0,bjDeck.length-1); return bjDeck.splice(idx,1)[0]; }

function showBlackjack(){
    const area=document.getElementById("bj-area");
    area.innerHTML=`
        <p>플레이어: ${bjPlayer.join(", ")} (합: ${sum(bjPlayer)})</p>
        <p>딜러: ${bjDealer[0]}, ?</p>
        <button onclick="hit()">히트</button>
        <button onclick="stand()">스탠드</button>
    `;
}

function hit(){
    bjPlayer.push(drawCard());
    for(let i=0;i<bjPlayer.length;i++) if(bjPlayer[i]===11 && sum(bjPlayer)>21) bjPlayer[i]=1;
    if(sum(bjPlayer)>21){ alert("버스트! 패배"); showGameScreen(); return; }
    showBlackjack();
}

function stand(){
    while(sum(bjDealer)<17){
        bjDealer.push(drawCard());
        for(let i=0;i<bjDealer.length;i++) if(bjDealer[i]===11 && sum(bjDealer)>21) bjDealer[i]=1;
    }
    let playerTotal=sum(bjPlayer), dealerTotal=sum(bjDealer);
    let msg="";
    if(dealerTotal>21 || playerTotal>dealerTotal){ money+=bjBet*2; msg=`승리! ${bjBet*2}원 획득`; }
    else if(playerTotal===dealerTotal){ money+=bjBet; msg="무승부!"; }
    else msg="패배!";
    updateMoneyDisplay();
    alert(`딜러: ${bjDealer.join(", ")}\n결과: ${msg}`);
    showGameScreen();
}

function sum(arr){ return arr.reduce((a,b)=>a+b,0); }

// ==============================
// 관리 탭
// ==============================
function managementUI(){
    const area = document.getElementById("game-area");
    area.innerHTML=`
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
    let acct=document.getElementById("withdraw-account").value;
    let pass=document.getElementById("withdraw-pass").value;
    let amt=parseInt(document.getElementById("withdraw-amount").value);
    if(!acct||!pass||!amt) return alert("모든 값을 입력하세요.");
    if(amt>money) return alert("보유 금액 초과!");
    money-=amt;
    updateMoneyDisplay();
    alert(`💸 ${amt.toLocaleString()}원 출금 완료!`);
}

// ==============================
// 뉴스 피드
// ==============================
const newsMessages=["님이 잭팟 당첨!","님이 출금 완료!","님이 블랙잭 승리!","님이 슬롯 잭팟!"];
const nicknames=["행운이","카지노왕","리치맨","슬롯마스터","블랙잭킹","머니헌터"];
function rand(min,max){return Math.floor(Math.random()*(max-min+1)+min);}
function randomColor(){return `hsl(${rand(0,360)},80%,60%)`;}
function startNewsFeed(){
    const feed=document.getElementById("news-feed");
    setInterval(()=>{
        let nick=nicknames[rand(0,nicknames.length-1)];
        let msg=newsMessages[rand(0,newsMessages.length-1)];
        if(msg.includes("원")) msg=msg.replace(/\d{1,3}(,\d{3})*/,""+rand(10000000,100000000).toLocaleString());
        let span=document.createElement("span");
        span.innerText=nick+msg;
        span.style.color=randomColor();
        feed.appendChild(span);
        if(feed.children.length>10) feed.removeChild(feed.firstChild);
    },3000);
}
