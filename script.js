let money = 10000000;

function showGame(name) {
    if (name === "slot") slotGame();
    if (name === "matgo") matgoGame();
    if (name === "seotda") seotdaGame();
    if (name === "blackjack") blackjackGame();
    if (name === "holjak") holjakGame();
}

function updateMoney() {
    return `<p>💰 현재 보유 금액: ${money.toLocaleString()}원</p>`;
}

/* ===============================
   🎰 슬롯 머신
================================ */
function slotGame() {
    document.getElementById("gameArea").innerHTML = `
        ${updateMoney()}
        <h2>🎰 슬롯 머신</h2>
        <input id="bet" placeholder="베팅 금액 입력">
        <button onclick="slotPlay()">시작</button>
    `;
}

function slotPlay() {
    let bet = parseInt(document.getElementById("bet").value);
    if (!bet || bet <= 0 || bet > money) return alert("올바른 금액 입력!");

    money -= bet;

    const nums = [1,2,3,4,5,6,7,7,7];
    let a = nums[Math.floor(Math.random() * nums.length)];
    let b = nums[Math.floor(Math.random() * nums.length)];
    let c = nums[Math.floor(Math.random() * nums.length)];

    let result = `🎰 | ${a} | ${b} | ${c} | 🎰<br><br>`;

    if (a === 7 && b === 7 && c === 7) {
        let win = bet * 50;
        money += win;
        result += `🎉 777 잭팟! ${win.toLocaleString()}원 획득!`;
    } else if (a === b && b === c) {
        let win = bet * 10;
        money += win;
        result += `🔥 잭팟! ${win.toLocaleString()}원 획득!`;
    } else if (a === b || b === c || a === c) {
        let win = parseInt(bet * 1.5);
        money += win;
        result += `⭐ 두 개 일치! ${win.toLocaleString()}원 획득!`;
    } else {
        result += `❌ 꽝!`;
    }

    document.getElementById("gameArea").innerHTML = `
        ${updateMoney()}
        <h2>🎰 슬롯 머신</h2>
        ${result}
        <button onclick="slotGame()">다시하기</button>
    `;
}

/* ===============================
   🎴 섯다
================================ */
function seotdaGame() {
    let bet = prompt("배팅 금액 입력:");
    bet = parseInt(bet);
    if (!bet || bet <= 0 || bet > money) return alert("올바른 금액!");

    money -= bet;

    const p1 = Math.ceil(Math.random() * 10);
    const p2 = Math.ceil(Math.random() * 10);
    const d1 = Math.ceil(Math.random() * 10);
    const d2 = Math.ceil(Math.random() * 10);

    let ps = (p1 + p2) % 10;
    let ds = (d1 + d2) % 10;

    let result = `
        당신의 패: [${p1}, ${p2}] → ${ps}<br>
        딜러의 패: [${d1}, ${d2}] → ${ds}<br><br>
    `;

    if (ps > ds) {
        money += bet * 2;
        result += `🎉 승리!`;
    } else if (ps === ds) {
        money += bet;
        result += `😐 무승부`;
    } else {
        result += `💸 패배`;
    }

    alert(result);
    showGame("seotda");
}

/* ===============================
   🃏 맞고
================================ */
function matgoGame() {
    let bet = prompt("배팅 금액 입력:");
    bet = parseInt(bet);
    if (!bet || bet <= 0 || bet > money) return alert("올바른 금액!");

    money -= bet;

    const ph = [rand(), rand(), rand()];
    const dh = [rand(), rand(), rand()];

    const ps = (ph[0] + ph[1] + ph[2]) % 10;
    const ds = (dh[0] + dh[1] + dh[2]) % 10;

    let result = `
        당신: ${ph} → ${ps}<br>
        딜러: ${dh} → ${ds}<br><br>
    `;

    if (ps > ds) {
        money += bet * 2;
        result += "🎉 승리!";
    } else if (ps === ds) {
        money += bet;
        result += "😐 무승부";
    } else {
        result += "💸 패배";
    }

    alert(result);
    showGame("matgo");
}

function rand() {
    return Math.ceil(Math.random() * 10);
}

/* ===============================
   ♠ 블랙잭
================================ */
function blackjackGame() {
    alert("웹 버전 블랙잭은 간단화된 미니 버전으로 제공됩니다.");
}

/* ===============================
   ⚖ 홀짝
================================ */
function holjakGame() {
    let bet = prompt("배팅 금액 입력:");
    bet = parseInt(bet);
    if (!bet || bet <= 0 || bet > money) return alert("올바른 금액!");

    money -= bet;

    let user = prompt("홀(1) or 짝(2)?");

    let outcome = Math.ceil(Math.random() * 2); // 1=홀, 2=짝

    let result = `결과: ${outcome === 1 ? "홀" : "짝"}<br>`;

    if (parseInt(user) === outcome) {
        let win = parseInt(bet * 1.9);
        money += win;
        result += `🎉 승리! ${win.toLocaleString()}원 획득!`;
    } else {
        result += `💸 패배`;
    }
    alert(result);
    showGame("holjak");
}
