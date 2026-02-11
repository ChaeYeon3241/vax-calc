function formatDate(date) {
  return date.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' });
}

// 비타민D: 1차 기준 3개월 간격
function calcVit() {
  const start = document.getElementById('vitDate').value;
  if (!start) return alert("1차 접종일을 선택해 주세요.");
  
  const list = document.getElementById('vitList');
  list.innerHTML = '';
  
  for (let i = 2; i <= 4; i++) {
    let d = new Date(start);
    d.setMonth(d.getMonth() + (3 * (i - 1)));
    renderItem(list, `${i}차 접종`, d);
  }
  document.getElementById('vitResult').classList.remove('hidden');
}

// B형간염: 2차 입력 여부에 따른 유연한 계산
// B형간염 계산 로직 (유효성 검사 추가)
function calcHepFinal() {
  const date1Input = document.getElementById('hepDate1').value;
  const date2Input = document.getElementById('hepDate2').value;
  
  if (!date1Input) return alert("1차 접종일을 입력해 주세요.");
  
  const date1 = new Date(date1Input);
  const list = document.getElementById('hepList');
  list.innerHTML = '';
  
  // 2차 예정일 (1차 기준 1개월 후)
  let d2_plan = new Date(date1);
  d2_plan.setMonth(d2_plan.getMonth() + 1);
  renderItem(list, "2차 접종 예정", d2_plan);
  
  // 2차 실제 접종일 입력 시 유효성 검사
  let baseFor3rd = d2_plan;
  let label3rd = "3차 접종(예정)";

  if (date2Input) {
    const date2 = new Date(date2Input);
    
    // ⚠️ 2차 접종일이 1차 접종일보다 이전인지 확인
    if (date2 < date1) {
      alert("오류: 2차 접종일은 1차 접종일보다 빠를 수 없습니다. 날짜를 다시 입력해주세요! 😊");
      document.getElementById('hepDate2').value = ""; // 입력창 초기화
      return; // 함수 종료
    }
    
    baseFor3rd = date2;
    label3rd = "3차 접종(확정)";
  }
  
  // 3차 예정일 계산 (base일 기준 5개월 뒤)
  let d3_plan = new Date(baseFor3rd);
  d3_plan.setMonth(baseFor3rd.getMonth() + 5);
  
  renderItem(list, label3rd, d3_plan);
  
  document.getElementById('hepResult').classList.remove('hidden');
  document.getElementById('hepResult').style.display = 'block';
}
function renderItem(target, label, date) {
  let remindDate = new Date(date);
  remindDate.setDate(date.getDate() - 7);
  
  const li = document.createElement('li');
  li.className = 'schedule-item';
  li.innerHTML = `
    <div><strong>${label}</strong></div>
    <div style="text-align:right">
      <div style="font-size:12px; color:#64748b">접종일: ${formatDate(date)}</div>
      <span class="remind-tag">🔔 안내: ${formatDate(remindDate)}</span>
    </div>
  `;
  target.appendChild(li);
}
