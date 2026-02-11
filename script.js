/**
 * 1. 공통 유틸리티 함수
 */

// 날짜를 한국 형식(예: 2024년 5월 20일)으로 변환
function formatDate(date) {
  return date.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' });
}

// 결과 리스트 아이템을 생성하여 화면에 추가
function renderItem(target, label, date) {
  let remindDate = new Date(date);
  remindDate.setDate(date.getDate() - 7); // 예정일 7일 전 계산
  
  const li = document.createElement('li');
  li.className = 'schedule-item';
  li.innerHTML = `
    <div>
      <strong style="color:#1e293b">${label}</strong>
    </div>
    <div style="text-align:right">
      <div style="font-size:12px; color:#64748b">접종 예정: ${formatDate(date)}</div>
      <span class="remind-tag">🔔 문자 안내: ${formatDate(remindDate)}</span>
    </div>
  `;
  target.appendChild(li);
}

/**
 * 2. 비타민D 계산 로직 (3개월 간격)
 */
function calcVit() {
  const start = document.getElementById('vitDate').value;
  if (!start) return alert("비타민D 1차 접종일을 선택해 주세요.");
  
  const list = document.getElementById('vitList');
  list.innerHTML = ''; 
  
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
 * 3. B형간염 계산 로직 (유연한 입력 대응 및 오류 검사)
 */
function calcHepFinal() {
  const date1Input = document.getElementById('hepDate1').value;
  const date2Input = document.getElementById('hepDate2').value;
  
  // 1차, 2차 둘 다 비어있는 경우만 경고
  if (!date1Input && !date2Input) {
    return alert("1차 또는 2차 접종일을 입력해 주세요.");
  }
  
  const list = document.getElementById('hepList');
  list.innerHTML = ''; 
  
  const d1 = date1Input ? new Date(date1Input) : null;
  const d2 = date2Input ? new Date(date2Input) : null;

  // [유효성 검사] 1차와 2차가 모두 입력되었을 때 선후 관계 확인
  if (d1 && d2 && d2 < d1) {
    alert("오류: 2차 접종일은 1차 접종일보다 빠를 수 없습니다. 날짜를 다시 확인해 주세요! 😊");
    document.getElementById('hepDate2').value = ""; // 잘못된 입력값 초기화
    return;
  }

  // [STEP 1] 2차 일정 표시 (1차 접종일이 있을 때만 예정일 계산)
  if (d1) {
    let d2_plan = new Date(d1);
    d2_plan.setMonth(d1.getMonth() + 1);
    renderItem(list, "2차 접종 예정", d2_plan);
  }

  // [STEP 2] 3차 일정 계산 및 표시
  let baseFor3rd = null;
  let label3rd = "3차 접종(예정)";

  if (d2) {
    // 실제 2차 접종일이 입력되었다면 그 날부터 5개월 뒤
    baseFor3rd = d2;
    label3rd = "3차 접종(확정)";
  } else if (d1) {
    // 1차만 있다면 1차로부터 6개월 뒤 (1개월 후 2차 + 5개월 대기)
    baseFor3rd = new Date(d1);
    baseFor3rd.setMonth(d1.getMonth() + 1);
  }

  if (baseFor3rd) {
    let d3_plan = new Date(baseFor3rd);
    d3_plan.setMonth(baseFor3rd.getMonth() + 5);
    renderItem(list, label3rd, d3_plan);
  }
  
  const resultDiv = document.getElementById('hepResult');
  resultDiv.classList.remove('hidden');
  resultDiv.style.display = 'block';
}