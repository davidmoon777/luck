// ----------------------
// 회원가입 / 이벤트
// ----------------------
let money = 0;

function registerUser() {
    const name = document.getElementById("username-input").value.trim();
    if (name === "") return alert("이름을 입력하세요.");

    localStorage.setItem("username", name);
    money = 10000000; // 이벤트 1천만원 지급
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
    document.getElementById("display-username").innerText =
        "계정: " + localStorage.getItem("username");
    updateMoneyDisplay();
}

function updateMoneyDisplay() {
    document.getElementById("display-money").innerText =
        "보유 금액: " + money.toLocaleString() + "원";
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
}

// ==============================
// 🎰 슬롯 머신
// ==============================
function slotGame() {
    document.getElementById("game-area").innerHTML = `
        <h2>🎰 슬롯 머신</h2>
        <p>💰 현재 보유 금액: ${money.toLocaleString()}원</p>
        <input id="bet" placeholder="배팅 금액">
        <button onclick="slotPlay()">시작</button>
    `;
}

function slotPlay() {
    let bet = parseInt(document.getElementById("bet").value);
    if (!bet || bet <= 0 || bet > money) return alert("올바른 금액 입력!");

    money -= bet;
    const nums = [1,2,3,4,5,6,7,7,7];
    let a = nums[Math.floor(Math.random()*nums.length)];
    let b = nums[Math.floor(Math.random()*nums.length)];
    let c = nums[Math.floor(Math.random()*nums.length)];

    let result = `🎰 | ${a} | ${b} | ${c} | 🎰<br>`;

    if (a===7 && b===7 && c===7) { money += bet*50; result += `🎉 777 잭팟! ${ (bet*50).toLocaleString() }원`;}
    else if (a===b && b===c) { money += bet*10; result += `🔥 잭팟! ${ (bet*10).toLocaleString() }원`;}
    else if (a===b || b===c || a===c) { money += parseInt(bet*1.5); result += `⭐ 두 개 일치!`;}
    else result += `❌ 꽝!`;

    document.getElementById("game-area").innerHTML = `
        <h2>🎰 슬롯 머신</h2>
        <p>${result}</p>
        <p>💰 현재 보유 금액: ${money.toLocaleString()}원</p>
        <button onclick="slotGame()">다시하기</button>
    `;
}

// ==============================
// 🃏 맞고
// ==============================
function matgoGame() {
    let bet = parseInt(prompt("배팅 금액 입력:"));
    if (!bet || bet <=0 || bet>money) return alert("올바른 금액!");
    money -= bet;

    const ph=[rand(),rand(),rand()];
    const dh=[rand(),rand(),rand()];
    const ps = (ph[0]+ph[1]+ph[2])%10;
    const ds = (dh[0]+dh[1]+dh[2])%10;
    let result=`당신: ${ph} → ${ps}\n딜러: ${dh} → ${ds}\n`;

    if(ps>ds){money+=bet*2; result+="🎉 승리!";}
    else if(ps===ds){money+=bet; result+="😐 무승부";}
    else{result+="💸 패배";}
    alert(result);
    updateMoneyDisplay();
}

// ==============================
// 🎴 섯다
// ==============================
function seotdaGame() {
    let bet = parseInt(prompt("배팅 금액 입력:"));
    if (!bet || bet <=0 || bet>money) return alert("올바른 금액!");
    money -= bet;

    const p=[rand(),rand()];
    const d=[rand(),rand()];
    const ps = (p[0]+p[1])%10;
    const ds = (d[0]+d[1])%10;

    let result=`당신: ${p} → ${ps}\n딜러: ${d} → ${ds}\n`;

    if(ps>ds){money+=bet*2; result+="🎉 승리!";}
    else if(ps===ds){money+=bet; result+="😐 무승부";}
    else{result+="💸 패배";}
    alert(result);
    updateMoneyDisplay();
}

// ==============================
// ⚖ 홀짝
// ==============================
function holjakGame() {
    let bet=parseInt(prompt("배팅 금액 입력:"));
    if(!bet||bet<=0||bet>money)return alert("올바른 금액!");
    money-=bet;

    let user=prompt("홀(1) or 짝(2)?");
    let outcome=Math.ceil(Math.random()*2);
    let result=`결과: ${outcome===1?"홀":"짝"}\n`;

    if(parseInt(user)===outcome){money+=parseInt(bet*1.9); result+=`🎉 승리!`;}
    else{result+="💸 패배";}
    alert(result);
    updateMoneyDisplay();
}

// ==============================
// ♠ 블랙잭
// ==============================
let deck=[],player=[],dealer=[],gameOver=false;

function blackjackUI(){
    document.getElementById("game-area").innerHTML=`
        <h2>♠ 블랙잭</h2>
        <p id="status"></p>
        <div>
            <button onclick="startGame()">게임 시작</button>
            <button onclick="hit()">히트</button>
            <button onclick="stand()">스탠드</button>
        </div>
        <div class="cards"><h3>플레이어 카드</h3><p id="player-cards"></p><p id="player-total"></p></div>
        <div class="cards"><h3>딜러 카드</h3><p id="dealer-cards"></p><p id="dealer-total"></p></div>
    `;
}

function createDeck(){
    const suits=["♠","♥","♦","♣"];
    const values=["A","2","3","4","5","6","7","8","9","10","J","Q","K"];
    deck=[];
    for(let s of suits){for(let v of values){deck.push({value:v,suit:s});}}
    deck.sort(()=>Math.random()-0.5);
}

function cardValue(c){if(c.value==="A")return 11;if(["J","Q","K"].includes(c.value))return 10;return Number(c.value);}
function calcTotal(hand){
    let total=0,aces=0;
    for(let c of hand){total+=cardValue(c); if(c.value==="A") aces++;}
    while(total>21 && aces>0){total-=10; aces--;}
    return total;
}

function updateBJUI(){
    document.getElementById("player-cards").innerText=player.map(c=>c.value+c.suit).join(" ");
    document.getElementById("dealer-cards").innerText=dealer.map(c=>c.value+c.suit).join(" ");
    document.getElementById("player-total").innerText="합계: "+calcTotal(player);
    document.getElementById("dealer-total").innerText="합계: "+calcTotal(dealer);
}

function startGame(){
    createDeck();
    player=[deck.pop(),deck.pop()];
    dealer=[deck.pop(),deck.pop()];
    gameOver=false;
    document.getElementById("status").innerText="";
    updateBJUI();
}

function hit(){
    if(gameOver) return;
    player.push(deck.pop());
    updateBJUI();
    if(calcTotal(player)>21){endGame("플레이어 버스트! 딜러 승!");loseBJMoney();}
}

function stand(){
    if(gameOver) return;
    while(calcTotal(dealer)<17){dealer.push(deck.pop());}
    const p=calcTotal(player),d=calcTotal(dealer);
    if(d>21||p>d){endGame("플레이어 승리!");winBJMoney();}
    else if(p<d){endGame("딜러 승!");loseBJMoney();}
    else{endGame("무승부!");}
}

function endGame(msg){
    document.getElementById("status").innerText=msg;
    gameOver=true;
    updateBJUI();
}

function winBJMoney(){money+=500000; updateMoneyDisplay();}
function loseBJMoney(){money-=500000; updateMoneyDisplay();}

function rand(){return Math.ceil(Math.random()*10);}
