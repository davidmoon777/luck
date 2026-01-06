// ----------------------
// 유저 정보 및 초기화
// ----------------------
let money = 0;
let username = "";
let adminMode = {
    active: false,
    password: "admin123",
    slotMultiplier: 10,
    blackjackMultiplier: 2,
    oddEvenWinRate: 0.5,
    matgoMultiplier: 1
};

// ----------------------
// 회원가입 / 이벤트
// ----------------------
function registerUser() {
    username = document.getElementById("username-input").value.trim();
    let password = document.getElementById("password-input").value.trim();
    if(!username||!password) return alert("아이디와 비밀번호를 입력하세요.");
    localStorage.setItem("username", username);
    localStorage.setItem("password", password);
    money = 10000000;
    localStorage.setItem("money", money);
    document.getElementById("signup-screen").classList.add("hidden");
    document.getElementById("event-popup").classList.remove("hidden");
}

function closePopup(){
    document.getElementById("event-popup").classList.add("hidden");
    showGameScreen();
}

// ----------------------
// 게임 화면
// ----------------------
function showGameScreen(){
    document.getElementById("game-screen").classList.remove("hidden");
    document.getElementById("display-username").innerText = "계정: "+username;
    updateMoneyDisplay();
    startNewsFeed();
}

function updateMoneyDisplay(){
    document.getElementById("display-money").innerText = "보유 금액: "+money.toLocaleString()+"원";
}

// ----------------------
// 게임 선택
// ----------------------
function showGame(name){
    if(name==="slot") slotGame();
    if(name==="matgo") matgoGame();
    if(name==="seotda") seotdaGame();
    if(name==="blackjack") blackjackUI();
    if(name==="holjak") holjakGame();
}

// ==============================
// 슬롯 게임
// ==============================
function slotGame(){
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

function spinSlot(){
    let bet = parseInt(document.getElementById("slot-bet").value);
    if(!bet||bet>money) return alert("올바른 금액 입력");
    money-=bet;
    const a=rand(1,9),b=rand(1,9),c=rand(1,9);
    let winnings=0,msg="";
    if(a===b&&b===c){ winnings=bet*adminMode.slotMultiplier; msg="잭팟!";}
    else if(a===b||b===c||a===c){ winnings=Math.floor(bet*1.5); msg="두개 일치!";}
    else msg="꽝!";
    money+=winnings;
    updateMoneyDisplay();
    document.getElementById("slot-result").innerText=`결과: | ${a} | ${b} | ${c} | ${msg} ${winnings>0?winnings+"원 획득":""}`;
}

// ==============================
// 블랙잭 게임
// ==============================
let bjPlayer=[],bjDealer=[],bjDeck=[],bjBet=0;

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

function startBlackjack(){
    bjBet=parseInt(document.getElementById("bj-bet").value);
    if(!bjBet||bjBet>money) return alert("올바른 배팅금액");
    money-=bjBet; updateMoneyDisplay();
    bjDeck=[2,3,4,5,6,7,8,9,10,10,10,10,11].flatMap(n=>[n,n,n,n]);
    bjPlayer=[drawCard(),drawCard()]; bjDealer=[drawCard(),drawCard()];
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
    if(sum(bjPlayer)>21){ alert("버스트! 패배"); resetBlackjack(); return; }
    showBlackjack();
}

function stand(){
    while(sum(bjDealer)<17){
        bjDealer.push(drawCard());
        for(let i=0;i<bjDealer.length;i++) if(bjDealer[i]===11 && sum(bjDealer)>21) bjDealer[i]=1;
    }
    let playerTotal=sum(bjPlayer), dealerTotal=sum(bjDealer);
    let msg="";
    if(dealerTotal>21||playerTotal>dealerTotal){ money+=bjBet*adminMode.blackjackMultiplier; msg=`승리! ${bjBet*adminMode.blackjackMultiplier}원 획득`; }
    else if(playerTotal===dealerTotal){ money+=bjBet; msg="무승부!";}
    else msg="패배!";
    updateMoneyDisplay(); alert(`딜러: ${bjDealer.join(", ")}\n결과: ${msg}`);
    resetBlackjack();
}

function resetBlackjack(){
    bjPlayer=[]; bjDealer=[]; bjDeck=[]; bjBet=0;
    showGameScreen();
}

function sum(arr){ return arr.reduce((a,b)=>a+b,0); }

// ==============================
// 관리자 로그인
// ==============================
function showAdminLogin(){
    const area=document.getElementById("game-area");
    area.innerHTML=`
        <h3>관리자 로그인</h3>
        <input id="admin-name" placeholder="관리자명">
        <input id="admin-pass" placeholder="비밀번호" type="password">
        <button onclick="adminLogin()">로그인</button>
    `;
}

function adminLogin(){
    let pass = document.getElementById("admin-pass").value;
    if(pass===adminMode.password){
        adminMode.active=true;
        showAdminPanel();
    } else alert("비밀번호가 틀립니다.");
}

function showAdminPanel(){
    const area=document.getElementById("game-area");
    area.innerHTML=`
        <h3>관리자 모드</h3>
        <p>보유 금액 수정:</p>
        <input id="admin-money" placeholder="금액 입력"><button onclick="setMoney()">적용</button>
        <p>게임 배율 설정:</p>
        슬롯: <input id="slot-mult" placeholder="배율"><br>
        블랙잭: <input id="bj-mult" placeholder="배율"><br>
        홀짝 승률: <input id="oddEven-rate" placeholder="0~1"><br>
        맞고 배율: <input id="matgo-mult" placeholder="배율"><br>
        <button onclick="applyGameSettings()">적용</button>
        <button onclick="exitAdmin()">닫기</button>
    `;
}

function setMoney(){
    let m=parseInt(document.getElementById("admin-money").value);
    if(!isNaN(m)) money=m;
    updateMoneyDisplay();
}

function applyGameSettings(){
    let s=parseFloat(document.getElementById("slot-mult").value);
    let b=parseFloat(document.getElementById("bj-mult").value);
    let o=parseFloat(document.getElementById("oddEven-rate").value);
    let m=parseFloat(document.getElementById("matgo-mult").value);
    if(!isNaN(s)) adminMode.slotMultiplier=s;
    if(!isNaN(b)) adminMode.blackjackMultiplier=b;
    if(!isNaN(o)&&o>=0&&o<=1) adminMode.oddEvenWinRate=o;
    if(!isNaN(m)) adminMode.matgoMultiplier=m;
}

function exitAdmin(){
    adminMode.active=false;
    alert("관리자 모드 종료. 다시 로그인 필요.");
    showGameScreen();
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
