var __typeError = (msg) => {
  throw TypeError(msg);
};
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), setter ? setter.call(obj, value) : member.set(obj, value), value);
var __privateMethod = (obj, member, method) => (__accessCheck(obj, member, "access private method"), method);
var _numbers, _Lotto_instances, validate_fn, _rank, _lottoList, _winningNumbers, _bonusNumber;
(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) {
    return;
  }
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
    processPreload(link);
  }
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") {
        continue;
      }
      for (const node of mutation.addedNodes) {
        if (node.tagName === "LINK" && node.rel === "modulepreload")
          processPreload(node);
      }
    }
  }).observe(document, { childList: true, subtree: true });
  function getFetchOpts(link) {
    const fetchOpts = {};
    if (link.integrity) fetchOpts.integrity = link.integrity;
    if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
    if (link.crossOrigin === "use-credentials")
      fetchOpts.credentials = "include";
    else if (link.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
    else fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep)
      return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
})();
const LOTTO_CONDITION = {
  COUNT: 6,
  MIN_NUMBER: 1,
  MAX_NUMBER: 45,
  PRICE: 1e3
};
const LOTTO_NUMBER_ERROR_MESSAGES = {
  COUNT: `${LOTTO_CONDITION.COUNT}자리 숫자를 입력해주세요.`,
  INTIGER: "정수를 입력해주세요.",
  RANGE: `${LOTTO_CONDITION.MIN_NUMBER}~${LOTTO_CONDITION.MAX_NUMBER} 사이의 숫자를 입력해주세요.`,
  DUPLICATE: "중복된 숫자가 존재합니다."
};
const PURCHASE_NUMBER_ERROR_MESSAGES = {
  INTIGER: "정수를 입력해주세요.",
  UNIT: `${LOTTO_CONDITION.PRICE}원 단위로 입력해주세요.`,
  MIN: `${LOTTO_CONDITION.PRICE}원 이상 입력해주세요.`
};
const BONUS_NUMBER_ERROR_MESSAGES = {
  INTIGER: "정수를 입력해주세요.",
  RANGE: `${LOTTO_CONDITION.MIN_NUMBER}~${LOTTO_CONDITION.MAX_NUMBER} 사이의 숫자를 입력해주세요.`,
  DUPLICATE: "당첨 번호와 중복되었습니다."
};
const RANKING = {
  FIRST: { RANK: 1, MATCH_COUNT: 6, PRIZE: 2e9 },
  SECOND: { RANK: 2, MATCH_COUNT: 5, PRIZE: 3e7 },
  THIRD: { RANK: 3, MATCH_COUNT: 5, PRIZE: 15e5 },
  FOURTH: { RANK: 4, MATCH_COUNT: 4, PRIZE: 5e4 },
  FIFTH: { RANK: 5, MATCH_COUNT: 3, PRIZE: 5e3 }
};
const LottoNumberValidator = {
  isValidCount(numbers) {
    return numbers.length !== LOTTO_CONDITION.COUNT;
  },
  isInteger(numbers) {
    return Number.isInteger(numbers);
  },
  isValidRange(number) {
    return number >= LOTTO_CONDITION.MIN_NUMBER && number <= LOTTO_CONDITION.MAX_NUMBER;
  },
  isDuplicated(numbers) {
    const lottoSet = new Set(numbers);
    return numbers.length !== lottoSet.size;
  }
};
const runValidators = (validators, ...input) => validators.forEach((validate) => validate(...input));
const $lottoFormError$1 = document.getElementById("lotto-form__error");
const validateLottoCount = (numbers) => {
  if (LottoNumberValidator.isValidCount(numbers)) {
    $lottoFormError$1.textContent = LOTTO_NUMBER_ERROR_MESSAGES.COUNT;
    throw new Error(LOTTO_NUMBER_ERROR_MESSAGES.COUNT);
  }
};
const validateLottoNumberInteger = (numbers) => {
  numbers.forEach((numbers2) => {
    if (!LottoNumberValidator.isInteger(numbers2)) {
      $lottoFormError$1.textContent = LOTTO_NUMBER_ERROR_MESSAGES.INTIGER;
      throw new Error(LOTTO_NUMBER_ERROR_MESSAGES.INTIGER);
    }
  });
};
const validateLottoNumberRange = (numbers) => {
  numbers.forEach((number) => {
    if (!LottoNumberValidator.isValidRange(number)) {
      $lottoFormError$1.textContent = LOTTO_NUMBER_ERROR_MESSAGES.RANGE;
      throw new Error(LOTTO_NUMBER_ERROR_MESSAGES.RANGE);
    }
  });
};
const validateLottoNumberDuplicate = (numbers) => {
  if (LottoNumberValidator.isDuplicated(numbers)) {
    $lottoFormError$1.textContent = LOTTO_NUMBER_ERROR_MESSAGES.DUPLICATE;
    throw new Error(LOTTO_NUMBER_ERROR_MESSAGES.DUPLICATE);
  }
};
const validateLottoNumber = (lottoNumbers) => runValidators(
  [validateLottoCount, validateLottoNumberInteger, validateLottoNumberRange, validateLottoNumberDuplicate],
  lottoNumbers
);
class Lotto {
  constructor(numbers) {
    __privateAdd(this, _Lotto_instances);
    __privateAdd(this, _numbers);
    __privateMethod(this, _Lotto_instances, validate_fn).call(this, numbers);
    __privateSet(this, _numbers, numbers.sort((a, b) => a - b));
  }
  hasBonusNumber(winningNumber) {
    return __privateGet(this, _numbers).includes(winningNumber);
  }
  get numbers() {
    return [...__privateGet(this, _numbers)];
  }
}
_numbers = new WeakMap();
_Lotto_instances = new WeakSet();
validate_fn = function(numbers) {
  validateLottoNumber(numbers);
};
class LottoGame {
  constructor() {
    __privateAdd(this, _rank);
    __privateSet(this, _rank, {
      [RANKING.FIRST.RANK]: 0,
      [RANKING.SECOND.RANK]: 0,
      [RANKING.THIRD.RANK]: 0,
      [RANKING.FOURTH.RANK]: 0,
      [RANKING.FIFTH.RANK]: 0
    });
  }
  addRankingCount(ranking) {
    __privateGet(this, _rank)[ranking] += 1;
  }
  static calculateRank(matchCount, isBonusMatch) {
    if (matchCount === RANKING.FIRST.MATCH_COUNT) return RANKING.FIRST.RANK;
    if (matchCount === RANKING.SECOND.MATCH_COUNT && isBonusMatch) return RANKING.SECOND.RANK;
    if (matchCount === RANKING.THIRD.MATCH_COUNT) return RANKING.THIRD.RANK;
    if (matchCount === RANKING.FOURTH.MATCH_COUNT) return RANKING.FOURTH.RANK;
    if (matchCount === RANKING.FIFTH.MATCH_COUNT) return RANKING.FIFTH.RANK;
    return 0;
  }
  static calculateTotalPrize(rank) {
    return rank[RANKING.FIRST.RANK] * RANKING.FIRST.PRIZE + rank[RANKING.SECOND.RANK] * RANKING.SECOND.PRIZE + rank[RANKING.THIRD.RANK] * RANKING.THIRD.PRIZE + rank[RANKING.FOURTH.RANK] * RANKING.FOURTH.PRIZE + rank[RANKING.FIFTH.RANK] * RANKING.FIFTH.PRIZE;
  }
  static calculateWinningRate(price, prize) {
    const rate = prize / price * 100;
    if (rate % 1 === 0) return Number(rate.toString());
    return Number(rate.toFixed(2));
  }
  get rank() {
    return __privateGet(this, _rank);
  }
}
_rank = new WeakMap();
function getRandomNumber() {
  const numbers = /* @__PURE__ */ new Set();
  while (numbers.size < LOTTO_CONDITION.COUNT) {
    const randomNumber = Math.floor(Math.random() * LOTTO_CONDITION.MAX_NUMBER) + LOTTO_CONDITION.MIN_NUMBER;
    numbers.add(randomNumber);
  }
  return [...numbers];
}
const _LottoMaker = class _LottoMaker {
  constructor(purchaseMoney) {
    __privateAdd(this, _lottoList);
    const purchaseCount = _LottoMaker.calculatePurchaseCount(purchaseMoney);
    __privateSet(this, _lottoList, this.purchase(purchaseCount));
  }
  static calculatePurchaseCount(purchaseMoney) {
    return Math.floor(purchaseMoney / LOTTO_CONDITION.PRICE);
  }
  purchase(purchaseCount) {
    return Array.from({ length: purchaseCount }, () => this.create(getRandomNumber()));
  }
  create(randomNumber) {
    return new Lotto(randomNumber);
  }
  get lottoList() {
    return [...__privateGet(this, _lottoList)];
  }
};
_lottoList = new WeakMap();
let LottoMaker = _LottoMaker;
class LottoMatch {
  constructor(winningNumbers, bonusNumber) {
    __privateAdd(this, _winningNumbers);
    __privateAdd(this, _bonusNumber);
    __privateSet(this, _winningNumbers, winningNumbers);
    __privateSet(this, _bonusNumber, bonusNumber);
  }
  countMatchingNumbers(lotto) {
    return __privateGet(this, _winningNumbers).numbers.filter((number) => lotto.hasBonusNumber(number)).length;
  }
  hasBonusNumber(lotto) {
    return lotto.hasBonusNumber(__privateGet(this, _bonusNumber));
  }
}
_winningNumbers = new WeakMap();
_bonusNumber = new WeakMap();
const OutputView = {
  print(message) {
    return console.log(message);
  }
};
const printLottoRank = (rank) => {
  const lottoRankList = [];
  Object.keys(RANKING).reverse().forEach((key) => {
    const ranking = RANKING[key];
    const rankCount = rank[ranking.RANK];
    lottoRankList.push([ranking.MATCH_COUNT, ranking.PRIZE.toLocaleString(), rankCount]);
    return checkSecond(ranking, rankCount);
  });
  return lottoRankList;
};
const checkSecond = (ranking, rankCount) => {
  if (ranking.RANK === 2) {
    print(`${ranking.MATCH_COUNT}개 일치, 보너스 볼 일치 (${ranking.PRIZE.toLocaleString()}원) - ${rankCount}개`);
  }
  if (ranking.RANK !== 2) {
    print(`${ranking.MATCH_COUNT}개 일치 (${ranking.PRIZE.toLocaleString()}원) - ${rankCount}개`);
  }
  return [ranking.MATCH_COUNT, ranking.PRIZE.toLocaleString(), rankCount];
};
const print = (rank) => {
  OutputView.print(rank);
};
const BonusNumberValidator = {
  isInteger(number) {
    return Number.isInteger(number);
  },
  isValidRange(number) {
    return number >= LOTTO_CONDITION.MIN_NUMBER && number <= LOTTO_CONDITION.MAX_NUMBER;
  },
  isDuplicated(winningNumbers, bonusNumber) {
    return winningNumbers.includes(bonusNumber);
  }
};
const $lottoFormError = document.getElementById("lotto-form__error");
const validateInteger = (winningNumbers, bonusNumber) => {
  if (!BonusNumberValidator.isInteger(bonusNumber)) {
    $lottoFormError.textContent = BONUS_NUMBER_ERROR_MESSAGES.INTIGER;
    throw new Error(BONUS_NUMBER_ERROR_MESSAGES.INTIGER);
  }
};
const validateRange$1 = (winningNumbers, bonusNumber) => {
  if (!BonusNumberValidator.isValidRange(bonusNumber)) {
    $lottoFormError.textContent = BONUS_NUMBER_ERROR_MESSAGES.RANGE;
    throw new Error(BONUS_NUMBER_ERROR_MESSAGES.RANGE);
  }
};
const validateDuplicate = (winningNumbers, bonusNumber) => {
  if (BonusNumberValidator.isDuplicated(winningNumbers, bonusNumber)) {
    $lottoFormError.textContent = BONUS_NUMBER_ERROR_MESSAGES.DUPLICATE;
    throw new Error(BONUS_NUMBER_ERROR_MESSAGES.DUPLICATE);
  }
};
const validateBonusNumber = (winningNumbers, bonusNumber) => runValidators([validateInteger, validateRange$1, validateDuplicate], winningNumbers, bonusNumber);
const PurchaseMoneyValidator = {
  isInteger(input) {
    return Number.isInteger(input);
  },
  isValidUnit(input) {
    return input % LOTTO_CONDITION.PRICE === 0;
  },
  isValidRange(input) {
    return LOTTO_CONDITION.PRICE <= input;
  }
};
const $purchaseFormError$1 = document.getElementById("purchase-form__error");
const validatePurchaseMoneyInteger = (input) => {
  if (!PurchaseMoneyValidator.isInteger(input)) {
    $purchaseFormError$1.textContent = PURCHASE_NUMBER_ERROR_MESSAGES.INTIGER;
    throw new Error(PURCHASE_NUMBER_ERROR_MESSAGES.INTIGER);
  }
};
const validateUnit = (input) => {
  if (!PurchaseMoneyValidator.isValidUnit(input)) {
    $purchaseFormError$1.textContent = PURCHASE_NUMBER_ERROR_MESSAGES.UNIT;
    throw new Error(PURCHASE_NUMBER_ERROR_MESSAGES.UNIT);
  }
};
const validateRange = (input) => {
  if (!PurchaseMoneyValidator.isValidRange(input)) {
    $purchaseFormError$1.textContent = PURCHASE_NUMBER_ERROR_MESSAGES.MIN;
    throw new Error(PURCHASE_NUMBER_ERROR_MESSAGES.MIN);
  }
};
const validatePurchaseMoney = (input) => runValidators([validatePurchaseMoneyInteger, validateRange, validateUnit], input);
const $purchaseForm = document.getElementById("purchase-form");
const $purchaseInput = document.getElementById("purchase-form__input");
const $purchaseBtn = document.getElementById("purchase-form__btn");
const $purchaseFormError = document.getElementById("purchase-form__error");
const $afterPurchaseWrap = document.getElementById("after-purchase-wrap");
const $lottoList = document.getElementById("lotto-list");
const $lottoCount = document.getElementById("lotto-count");
$purchaseInput.addEventListener("input", () => {
  if ($purchaseInput.value) {
    $purchaseBtn.disabled = false;
    return;
  }
  $purchaseBtn.disabled = true;
});
let lottoMaker;
let lottoGame;
$purchaseForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const purchaseMoney = $purchaseInput.valueAsNumber;
  validatePurchaseMoney(purchaseMoney);
  $afterPurchaseWrap.classList.remove("hidden");
  lottoMaker = new LottoMaker(purchaseMoney);
  lottoMaker.lottoList;
  $purchaseFormError.textContent = "";
  $purchaseBtn.disabled = true;
  $purchaseInput.disabled = true;
  lottoMaker.lottoList.forEach((lotto) => {
    const li = document.createElement("li");
    li.textContent = "🎟️ " + lotto.numbers;
    $lottoList.appendChild(li);
  });
  $lottoCount.textContent = lottoMaker.lottoList.length;
});
const $lottoForm = document.getElementById("lotto-form");
const $winningNumbersInput = document.querySelectorAll(".winning-numbers__input");
const $bonusNumber = document.getElementById("bonus-number__input");
const $lottoResultTable = document.getElementById("lotto-result-table");
const $winningRate = document.getElementById("winningRate");
$lottoForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const numbers = [];
  $winningNumbersInput.forEach((input) => {
    numbers.push(Number(input.value));
  });
  const winningNumbers = new Lotto(numbers);
  const bonusNumber = $bonusNumber.valueAsNumber;
  validateBonusNumber(winningNumbers.numbers, bonusNumber);
  const lottoMatch = new LottoMatch(winningNumbers, bonusNumber);
  lottoGame = new LottoGame();
  lottoMaker.lottoList.forEach((lotto) => {
    lottoGame.addRankingCount(
      LottoGame.calculateRank(lottoMatch.countMatchingNumbers(lotto), lottoMatch.hasBonusNumber(lotto))
    );
  });
  const rankList = printLottoRank(lottoGame.rank);
  let tableHTML = `
      <tr>
        <th scope="col">일치 갯수</th>
        <th scope="col">당첨금</th>
        <th scope="col">당첨 갯수</th>
      </tr>`;
  rankList.forEach((row, index) => {
    if (index === 3) {
      tableHTML += `
      <tr>
        <td>${row[0]}개+보너스볼</td>
        <td>${row[1]}</td>
        <td>${row[2]}개</td>
      </tr>`;
    }
    if (index !== 3) {
      tableHTML += `
      <tr>
        <td>${row[0]}개</td>
        <td>${row[1]}</td>
        <td>${row[2]}개</td>
      </tr>`;
    }
  });
  $lottoResultTable.innerHTML = tableHTML;
  const winningRate = LottoGame.calculateWinningRate(
    LOTTO_CONDITION.PRICE * lottoMaker.lottoList.length,
    LottoGame.calculateTotalPrize(lottoGame.rank)
  );
  $winningRate.innerText = winningRate;
});
const $lottoFormBtn = document.getElementById("lotto-form__btn");
const $modalWrap = document.getElementById("modal-wrap");
const $app = document.getElementById("app");
const $modalCloseBtn = document.getElementById("modal__close-btn");
const $retryBtn = document.getElementById("modal__retry-btn");
$lottoFormBtn.addEventListener("click", () => {
  $modalWrap.classList.remove("hidden");
  $app.style.backgroundColor = "rgba(0,0,0,0.5)";
});
$modalCloseBtn.addEventListener("click", () => {
  $modalWrap.classList.add("hidden");
  $app.style.backgroundColor = "white";
});
$retryBtn.addEventListener("click", () => {
  $afterPurchaseWrap.classList.add("hidden");
  $modalWrap.classList.add("hidden");
  $purchaseInput.disabled = false;
  $app.style.backgroundColor = "white";
  $purchaseForm.reset();
  $lottoForm.reset();
  while ($lottoList.firstChild) {
    $lottoList.removeChild($lottoList.firstChild);
  }
});
