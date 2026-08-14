const ship = document.getElementById("ship");
const storyTitle = document.getElementById("storyTitle");
const storyText = document.getElementById("storyText");
const routePath = document.getElementById("routePath");
const buttons = document.querySelectorAll(".route-button");

const shipSound = document.getElementById("shipSound");
const jetSound = document.getElementById("jetSound");

shipSound.volume = 0.4;
jetSound.volume = 0.3;

// 地図上の位置（%）
const places = {
  Africa: { x: 20.2, y: 67 },
  Japan: { x: 47.5, y: 54.4 },
  Brazil: { x: 89, y: 76.1 }
};

// ここを書き換えると、家族の名前や説明を変更できます。
const routes = {
  AfricaBrazil: {
    title: "父の先祖の航路",
    text: `父の祖先をずっと辿っていくと、アフリカからブラジルへ渡った人に行き着く。
何世代も前のことなので、その人がどこで生まれ、どんな人生を送り、どの船に乗ったのか、私には分からない。ただ、かつて多くのアフリカの人々が奴隷として大西洋を渡り、ブラジルへ連れてこられた歴史がある。
自由を奪われ、故郷や家族から引き離された人々が、どれほどの恐怖や悲しみを抱えていたのか。今を生きる私には、想像することしかできない。

その人がブラジルのどこに辿り着き、どんな人生を送ったのかも分からない。
けれど、その人生はそこで途切れなかった。

一世代、また一世代と命が受け継がれ、何世代もの時を越えた。
そして後に、私の父につながる祖父と、ブラジルの先住民の血を引く祖母が出会った。

アフリカから大西洋を渡ってきた人々の旅と、ブラジルの大地で長い時間を生きてきた人々の旅。

私は、その二つの旅が出会った先にいる。
祖先たちは、何百年も後に自分たちの子孫が日本で暮らすことになるなんて、想像もしなかっただろう。`,
    start: "Africa",
    end: "Brazil",
    type: "wrap",
    vehicle: "🚢"
  },
  JapanBrazil: {
    title: "曾祖母と祖父の航路",
    text:`母方の曾祖母は、女手一つで5人の子どもを連れ、ブラジルへ渡った。

1908年4月28日、神戸を出発した笠戸丸は、長い航海の末、6月18日にブラジルのサントス港へ到着した。
ブラジルでの生活は決して楽ではなかった。コーヒー農園では過酷な労働が待っていた。それでも、5人の子どもを抱えながら、ひいばあちゃんは生き抜いた。当時、どんな思いで日本を離れ、どんな未来を思い描いていたのか、私は知らない。

ただ、一人の女性が5人の子どもを連れて海を渡り、新しい土地で人生を築いた。

その子どもたちから孫が生まれ、ひ孫が生まれ、百年以上の時間を越えて、今ではたくさんの家族へと命がつながっている。

アフリカからブラジルへ渡ってきた遠い祖先の旅と、日本からブラジルへ渡ったひいばあちゃんの旅。

私は、その二つの長い旅の先にいる。`,
    start: "Japan",
    end: "Brazil",
    type: "normal",
    vehicle: "🚢"
  },
  BrazilJapan: {
    title: "両親と私の航路",
    text: `両親と私は、1991年6月、ブラジルから日本へ来た。

日本へ行くことが決まったとき、ひいばあちゃんに言われた。「日本人はきっちりしているのが好きだから、きちんとした服を着ていかないといけないよ」私たちはその言葉を信じ、家族全員で一番上等な服を着て日本へ向かった。

そして、「おかえり」と言ってもらえると信じていた。

それから、本当にいろいろなことがあった。大変なことも、楽しいこともあった。待っていた「おかえり」を聞くことはできなかったけれど、それでも私は日本が好きだ。たくさんの時間をここで過ごし、人と出会い、笑い、悩みながら生きてきた。

今、私は日本で家族を持っている。
家に帰れば、毎日「おかえり」が待っている。

アフリカからブラジルへ渡った祖先。
日本からブラジルへ渡ったひいばあちゃん。
ブラジルから日本へ渡った両親と私。

海を越え、私の家族の旅は新しい場所で続いてきた。

その旅の先に、今の私がいる。

そして、私の旅はまだ続く。`,
    start: "Brazil",
    end: "Japan",
    type: "normal",
    vehicle: "✈️"
  }
};

let animationId = null;

buttons.forEach((button) => {
  button.addEventListener("click", () => {
    buttons.forEach((b) => b.classList.remove("active"));
    button.classList.add("active");
    moveShip(button.dataset.route);
  });
});

function moveShip(routeName) {
  const route = routes[routeName];
 
  if (!route) {
    console.error("ルートが見つかりません:", routeName);
    return;
  }

  const start = places[route.start];
  const end = places[route.end];

  storyTitle.textContent = route.title;
  storyText.textContent = route.text;
  ship.textContent = route.vehicle;

//いったん音を停止
  shipSound.pause();
  jetSound.pause();

  shipSound.currentTime = 0;
  jetSound.currentTime = 0;

  //航路によって音を変更
  if (routeName === "AfricaBrazil" || routeName === "JapanBrazil") {shipSound.play();
    
  }
  if (routeName === "BrazilJapan") {
    jetSound.play();
  }
  if (animationId) {
    cancelAnimationFrame(animationId);
  }

  if (route.type === "wrap") {
    animateWrappedRoute(start, end);
  } else {
    animateCurvedRoute(start, end);
  }
}

// 日本⇄ブラジルなど、画面内を曲線で移動
function animateCurvedRoute(start, end) {
  const control = {
    x: (start.x + end.x) / 2,
    y: Math.min(start.y, end.y) - 18
  };

  drawPath(start, control, end);
  animateBezier(start, control, end, 2600);
}

// 日本中心の地図では大西洋が左右に分かれているため、
// アフリカ→ブラジルは「左端まで」と「右端から」の2本に分けて表示する。
function animateWrappedRoute(start, end) {
  const firstPathEnd = { x: 0, y: 67 };
  const firstControl = { x: 6, y: 60 };

  const secondPathStart = { x: 100, y: 70 };
  const secondControl = { x: 94, y: 68 };

  // SVGのviewBox（1000 × 687）に合わせて座標を変換
  const sx1 = start.x * 10;
  const sy1 = start.y * 6.87;
  const cx1 = firstControl.x * 10;
  const cy1 = firstControl.y * 6.87;
  const ex1 = firstPathEnd.x * 10;
  const ey1 = firstPathEnd.y * 6.87;

  const sx2 = secondPathStart.x * 10;
  const sy2 = secondPathStart.y * 6.87;
  const cx2 = secondControl.x * 10;
  const cy2 = secondControl.y * 6.87;
  const ex2 = end.x * 10;
  const ey2 = end.y * 6.87;

  // アフリカ→左端、右端→ブラジルの2本の点線を同時に描く
  routePath.setAttribute(
    "d",
    `M ${sx1} ${sy1} Q ${cx1} ${cy1} ${ex1} ${ey1} ` +
    `M ${sx2} ${sy2} Q ${cx2} ${cy2} ${ex2} ${ey2}`
  );
  routePath.classList.add("show");

  // 船も同じルートをたどる
  const firstEnd = { x: -4, y: 67 };

  animateBezier(start, firstControl, firstEnd, 1300, () => {
    const secondStart = { x: 104, y: 70 };

    setShipPosition(secondStart.x, secondStart.y);
    animateBezier(secondStart, secondControl, end, 1300);
  });
}

function drawPath(start, control, end) {
  const sx = start.x * 10;
  const sy = start.y * 6.87;
  const cx = control.x * 10;
  const cy = control.y * 6.87;
  const ex = end.x * 10;
  const ey = end.y * 6.87;

  routePath.setAttribute("d", `M ${sx} ${sy} Q ${cx} ${cy} ${ex} ${ey}`);
  routePath.classList.add("show");
}

function animateBezier(start, control, end, duration, onComplete) {
  const startTime = performance.now();

  function frame(now) {
    const elapsed = now - startTime;
    const t = Math.min(elapsed / duration, 1);
    const eased = easeInOutCubic(t);

    const x =
      (1 - eased) * (1 - eased) * start.x +
      2 * (1 - eased) * eased * control.x +
      eased * eased * end.x;

    const y =
      (1 - eased) * (1 - eased) * start.y +
      2 * (1 - eased) * eased * control.y +
      eased * eased * end.y;

    setShipPosition(x, y);

    if (t < 1) {
      animationId = requestAnimationFrame(frame);
    } else if (onComplete) {
      onComplete();
    }
  }

  animationId = requestAnimationFrame(frame);
}

function setShipPosition(x, y) {
  ship.style.left = `${x}%`;
  ship.style.top = `${y}%`;
}

function easeInOutCubic(t) {
  return t < 0.5
    ? 4 * t * t * t
    : 1 - Math.pow(-2 * t + 2, 3) / 2;
}
