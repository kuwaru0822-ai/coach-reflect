const problem =
  document.getElementById("problem");
const startButton =
  document.getElementById("startButton");
const analyzeButton =
  document.getElementById("analyzeButton");
const saveButton =
  document.getElementById("saveButton");
const reflection =
  document.getElementById("reflection");
const result =
  document.getElementById("result");
const trend =
  document.getElementById("trend");
const chartSection =
  document.getElementById("chartSection");
let currentRecord = null;
/* ==========================
   振り返り開始
========================== */
startButton.addEventListener(
  "click",
  () => {
    if (!problem.value.trim()) {
      alert(
        "今日の出来事を入力してください。"
      );
      return;
    }
    reflection.classList.remove(
      "hidden"
    );
    reflection.scrollIntoView({
      behavior: "smooth"
    });
  }
);
/* ==========================
   振り返りを整理
========================== */
analyzeButton.addEventListener(
  "click",
  () => {
    const emotion =
      document.getElementById(
        "emotion"
      ).value.trim();
    const playerReaction =
      document.getElementById(
        "playerReaction"
      ).value.trim();
    const good =
      document.getElementById(
        "good"
      ).value.trim();
    const change =
      document.getElementById(
        "change"
      ).value.trim();
    if (!emotion || !playerReaction) {
      alert(
        "「自分の気持ち」と「選手の反応」を入力してください。"
      );
      return;
    }
    /* 自己評価 */
    const emotionScore =
      Number(
        document.getElementById(
          "emotionScore"
        ).value
      );
    const specificityScore =
      Number(
        document.getElementById(
          "specificityScore"
        ).value
      );
    const relationshipScore =
      Number(
        document.getElementById(
          "relationshipScore"
        ).value
      );
    const autonomyScore =
      Number(
        document.getElementById(
          "autonomyScore"
        ).value
      );
    /* 選手への影響 */
    let playerMessage;
    if (
      playerReaction.includes("萎縮") ||
      playerReaction.includes("黙") ||
      playerReaction.includes("怖")
    ) {
      playerMessage =
        "選手が萎縮した可能性がある場合、指導内容だけでなく、伝え方やタイミングも振り返る価値があります。選手が「何を直せばよいのか」を理解できていたかも確認してみましょう。";
    } else {
      playerMessage =
        "選手の反応について、指導した側の見方だけで判断せず、選手自身がどう受け止めたのかを考えてみると、次の指導につながります。";
    }
    currentRecord = {
      date:
        new Date().toLocaleString(
          "ja-JP"
        ),
      problem:
        problem.value,
      emotion:
        emotion,
      playerReaction:
        playerReaction,
      good:
        good,
      change:
        change,
      playerMessage:
        playerMessage,
      scores: {
        emotion:
          emotionScore,
        specificity:
          specificityScore,
        relationship:
          relationshipScore,
        autonomy:
          autonomyScore
      }
    };
    /* 結果表示 */
    document.getElementById(
      "resultEmotion"
    ).textContent =
      emotion;
    document.getElementById(
      "resultPlayer"
    ).textContent =
      playerMessage;
    document.getElementById(
      "resultGood"
    ).textContent =
      good ||
      "特に記録されていません。";
    document.getElementById(
      "resultChange"
    ).textContent =
      change ||
      "次回のテーマを考えてみましょう。";
    document.getElementById(
      "resultScore"
    ).textContent =
      createScoreText(
        currentRecord.scores
      );
    result.classList.remove(
      "hidden"
    );
    result.scrollIntoView({
      behavior: "smooth"
    });
  }
);
/* ==========================
   評価を文章にする
========================== */
function createScoreText(scores) {
  return (
    "感情 " +
    scores.emotion +
    " / 5　" +
    "具体性 " +
    scores.specificity +
    " / 5　" +
    "関係 " +
    scores.relationship +
    " / 5　" +
    "主体性 " +
    scores.autonomy +
    " / 5"
  );
}
/* ==========================
   保存
========================== */
saveButton.addEventListener(
  "click",
  () => {
    if (!currentRecord) {
      return;
    }
    const history =
      JSON.parse(
        localStorage.getItem(
          "coachReflectHistory"
        ) || "[]"
      );
    history.unshift(
      currentRecord
    );
    localStorage.setItem(
      "coachReflectHistory",
      JSON.stringify(
        history
      )
    );
    loadHistory();
    calculateTrend();
    drawChart();
    alert(
      "振り返りを保存しました。"
    );
  }
);
/* ==========================
   履歴
========================== */
function loadHistory() {
  const history =
    JSON.parse(
      localStorage.getItem(
        "coachReflectHistory"
      ) || "[]"
      );
  const container =
    document.getElementById(
      "history"
    );
  if (history.length === 0) {
    container.innerHTML =
      '<p class="empty">まだ振り返り記録がありません。</p>';
    return;
  }
  container.innerHTML = "";
  history.forEach(
    (record) => {
      const item =
        document.createElement(
          "div"
        );
      item.className =
        "history-item";
      const date =
        document.createElement(
          "div"
        );
      date.className =
        "history-date";
      date.textContent =
        record.date;
      const text =
        document.createElement(
          "div"
        );
      text.className =
        "history-text";
      text.textContent =
        record.problem;
      item.appendChild(date);
      item.appendChild(text);
      container.appendChild(item);
    }
  );
}
/* ==========================
   指導傾向
========================== */
function calculateTrend() {
  const history =
    JSON.parse(
      localStorage.getItem(
        "coachReflectHistory"
      ) || "[]"
    );
  if (history.length === 0) {
    return;
  }
  const recent =
    history.slice(0, 10);
  let emotionCount = 0;
  let strictCount = 0;
  let playerCount = 0;
  recent.forEach(
    (record) => {
      const text =
        (
          record.problem +
          record.emotion +
          record.change
        ).toLowerCase();
      if (
        text.includes("イライラ") ||
        text.includes("怒") ||
        text.includes("焦")
      ) {
        emotionCount++;
      }
      if (
        text.includes("ミス") ||
        text.includes("注意") ||
        text.includes("厳")
      ) {
        strictCount++;
      }
      if (
        text.includes("選手") ||
        text.includes("萎縮") ||
        text.includes("声")
      ) {
        playerCount++;
      }
    }
  );
  let message =
    "最近の記録から、";
  if (emotionCount >= 3) {
    message +=
      "指導中の感情について考える機会が多いようです。";
  } else if (strictCount >= 3) {
    message +=
      "ミスや注意に関する悩みが多いようです。";
  } else if (playerCount >= 3) {
    message +=
      "選手との関わり方について考える機会が多いようです。";
  } else {
    message +=
      "さまざまな視点から自分の指導を振り返っています。";
  }
  trend.classList.remove(
    "hidden"
  );
  document.getElementById(
    "trendText"
  ).textContent =
    message;
}
/* ==========================
   グラフ
========================== */
function drawChart() {
  const history =
    JSON.parse(
      localStorage.getItem(
        "coachReflectHistory"
      ) || "[]"
    );
  if (history.length === 0) {
    return;
  }
  const recent =
    history
      .filter(
        record =>
          record.scores
      )
      .slice(0, 10);
  if (recent.length === 0) {
    return;
  }
  const emotion =
    average(
      recent.map(
        record =>
          record.scores.emotion
      )
    );
  const specificity =
    average(
      recent.map(
        record =>
          record.scores.specificity
      )
    );
  const relationship =
    average(
      recent.map(
        record =>
          record.scores.relationship
      )
    );
  const autonomy =
    average(
      recent.map(
        record =>
          record.scores.autonomy
      )
    );
  setBar(
    "emotionBar",
    "emotionAverage",
    emotion
  );
  setBar(
    "specificityBar",
    "specificityAverage",
    specificity
  );
  setBar(
    "relationshipBar",
    "relationshipAverage",
    relationship
  );
  setBar(
    "autonomyBar",
    "autonomyAverage",
    autonomy
  );
  chartSection.classList.remove(
    "hidden"
  );
}
/* ==========================
   平均値
========================== */
function average(values) {
  if (values.length === 0) {
    return 0;
  }
  const total =
    values.reduce(
      (sum, value) =>
        sum + value,
      0
    );
  return total / values.length;
}
/* ==========================
   グラフ表示
========================== */
function setBar(
  barId,
  textId,
  value
) {
  const percentage =
    (value / 5) * 100;
  document.getElementById(
    barId
  ).style.width =
    percentage + "%";
  document.getElementById(
    textId
  ).textContent =
    value.toFixed(1);
}
/* ==========================
   起動時
========================== */
loadHistory();
calculateTrend();
drawChart();