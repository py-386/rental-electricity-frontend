document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const manualEntrySection = document.getElementById('manual-entry');
    const manualEntryForm = document.getElementById('manual-entry-form');
    const roomSelect = document.getElementById('entry-room');
    const eventControl = document.getElementById('event-control');

    let authToken = null;

    // 根據選擇的房間顯示/隱藏事件欄位
    const toggleEventControl = () => {
        if (roomSelect.value === '801') {
            eventControl.classList.remove('hidden');
        } else {
            eventControl.classList.add('hidden');
        }
    };

    // 登入邏輯
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        const result = await API.login(username, password);

        if (result.success) {
            authToken = result.token;
            UI.showMessage('登入成功');
            loginForm.classList.add('hidden');
            manualEntrySection.classList.remove('hidden');
            toggleEventControl(); // 登入後立即檢查一次
        } else {
            UI.showMessage(result.message, true);
        }
    });

    // 房間選擇變更時的邏輯
    roomSelect.addEventListener('change', toggleEventControl);

    // 手動輸入邏輯
    manualEntryForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const room = roomSelect.value;
        const reading = document.getElementById('entry-reading').value;
        const event = document.getElementById('entry-event').value;

        if (!authToken) {
            UI.showMessage('請先登入', true);
            return;
        }

        const result = await API.postManualEntry(authToken, room, reading, event);

        if (result.success) {
            UI.showMessage(result.message);
            manualEntryForm.reset();
            toggleEventControl(); // 重設後再次檢查
        } else {
            UI.showMessage(result.message, true);
        }
    });
});
