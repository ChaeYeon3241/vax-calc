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
function calcHepFinal() {
  const date1 = document.getElementById('hepDate1').value;
  const date2 = document.getElementById('hepDate2').value;
  
  if (!date1) return alert("1차 접종일을 입력해 주세요.");
  
  const list = document.getElementById('hepList');
  list.innerHTML = '';
  
  // 2차 예정 (1차 + 1개월)
  let d2_plan = new Date(date1);
  d2_plan.setMonth(d2_plan.getMonth() + 1);
  renderItem(list, "2차 접종 예정", d2_plan);
  
  // 3차 예정 (2차 실제 접종일이 있으면 그 날부터 5개월 뒤)
  let baseFor3rd = date2 ? new Date(date2) : d2_plan;
  let d3_plan = new Date(baseFor3rd);
  d3_plan.setMonth(d3_plan.getMonth() + 5);
  
  const label3rd = date2 ? "3차 접종(확정)" : "3차 접종(예정)";
  renderItem(list, label3rd, d3_plan);
  
  document.getElementById('hepResult').classList.remove('hidden');
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