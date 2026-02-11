/**
 * 1. 공통 유틸리티 함수
 */

// 날짜를 "2024년 5월 20일" 형식으로 변환하는 함수
function formatDate(date) {
  return date.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' });
}

// 결과 리스트를 생성하여 화면에 추가하는 함수
function renderItem(target, label, date) {
  let remindDate = new Date(date);
  remindDate.setDate(date.getDate() - 7); // 접종일 7일 전을 안내일로 설정
  
  const li = document.createElement('li');
  li.className = 'schedule-item';
  li.innerHTML = `
    <div>
      <strong style="color:#1e293b">${label}</strong>
    </div>
    <div style="text-align:right">
      <div style="font-size:12px; color:#64748b">접종 예정일: ${formatDate(date)}</div>
      <span class="remind-tag">🔔 문자 안내: ${formatDate(remindDate)}</span>
    </div>
  `;
  target.appendChild(li);
}

/**
 * 2. 비타민D 계산 로직
 */
function calcVit() {
  const start = document.getElementById('vitDate').value;
  if (!start) return alert("비타민D 1차 접종일을 선택해 주세요.");
  
  const list = document.getElementById('vitList');
  list.innerHTML = ''; // 이전 결과 초기화
  
  // 3개월 간격으로 2, 3, 4차 계산
  for (let i = 2; i <= 4; i++) {
    let d = new Date(start);
    d.setMonth(d.getMonth() + (3 * (i - 1)));
    renderItem(list, `${i}차 접종`, d);
  }
  
  const resultDiv = document.getElementById('vitResult');
  resultDiv.classList.remove('hidden');
  resultDiv.style.display = 'block';
}

/**
 * 3. B형간염 계산 로직 (유효성 검사 포함)
 */
function calcHepFinal() {
  const date1Input = document.getElementById('hepDate1').value;
  const date2Input = document.getElementById('hepDate2').value;
  
  if (!date1Input) return alert("B형간염 1차 접종일을 입력해 주세요.");
  
  const date1 = new Date(date1Input);
  const list = document.getElementById('hepList');
  list.innerHTML = ''; // 이전 결과 초기화
  
  // [STEP 1] 2차 예정일 계산 (1차 기준 1개월 후)
  let d2_plan = new Date(date1);
  d2_plan.setMonth(d2_plan.getMonth() + 1);
  renderItem(list, "2차 접종 예정", d2_plan);
  
  // [STEP 2] 3차 기준일 설정
  let baseFor3rd = d2_plan; // 기본값은 2차 예정일
  let label3rd = "3차 접종(예정)";

  // 2차 실제 접종일이 입력된 경우
  if (date2Input) {
    const date2 = new Date(date2Input);
    
    // ⚠️ 유효성 검사: 2차가 1차보다 빠르면 경고
    if (date2 < date1) {
      alert("오류: 2차 접종일은 1차 접종일보다 빠를 수 없습니다. 날짜를 다시 확인해 주세요! 😊");
      document.getElementById('hepDate2').value = ""; // 입력창 비우기
      return; // 계산 중단
    }
    
    baseFor3rd = date2; // 3차 계산 기준을 실제 2차 접종일로 변경
    label3rd = "3차 접종(확정)";
  }
  
  // [STEP 3] 3차 예정일 계산 (기준일로부터 5개월 뒤)
  let d3_plan = new Date(baseFor3rd);
  d3_plan.setMonth(baseFor3rd.getMonth() + 5);
  
  renderItem(list, label3rd, d3_plan);
  
  const resultDiv = document.getElementById('hepResult');
  resultDiv.classList.remove('hidden');
  resultDiv.style.display = 'block';
}