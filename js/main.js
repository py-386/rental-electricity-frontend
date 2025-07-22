document.addEventListener('DOMContentLoaded', () => {
    const roomSelect = document.getElementById('room-select');
    const startDate = document.getElementById('start-date');
    const endDate = document.getElementById('end-date');
    const queryBtn = document.getElementById('query-btn');

    const personalStartDate = document.getElementById('personal-start-date');
    const personalEndDate = document.getElementById('personal-end-date');
    const personalQueryBtn = document.getElementById('personal-query-btn');

    // 設定預設日期
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    startDate.value = yesterday.toISOString().split('T')[0];
    endDate.value = today.toISOString().split('T')[0];
    personalStartDate.value = yesterday.toISOString().split('T')[0];
    personalEndDate.value = today.toISOString().split('T')[0];


    // 查詢儀表板數據
    queryBtn.addEventListener('click', async () => {
        const room = roomSelect.value;
        const start = startDate.value;
        const end = endDate.value;

        if (!start || !end) {
            UI.showMessage('請選擇開始和結束日期');
            return;
        }

        const result = await API.getRoomData(room, start, end);
        if (result.success) {
            UI.renderDashboardChart(result.data);
        } else {
            UI.showMessage(result.message, true);
        }
    });

    // 查詢個人數據
    personalQueryBtn.addEventListener('click', async () => {
        const start = personalStartDate.value;
        const end = personalEndDate.value;

        if (!start || !end) {
            UI.showMessage('請選擇開始和結束日期');
            return;
        }

        const result = await API.getPersonalData(start, end);
        if (result.success) {
            UI.renderPersonalData(result.data);
        } else {
            UI.showMessage(result.message, true);
        }
    });

    // 頁面載入時自動查詢一次
    queryBtn.click();
    personalQueryBtn.click();
});
