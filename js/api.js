const API = {
    // 登入
    login: async (username, password) => {
        try {
            console.log(`${CONFIG.API_BASE_URL}`)
            const response = await fetch(`${CONFIG.API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            if (response.ok) {
                return { success: true, token: data.token };
            } else {
                return { success: false, message: data.message || '登入失敗' };
            }
        } catch (error) {
            console.error('Login API error:', error);
            return { success: false, message: '無法連接到伺服器' };
        }
    },

    // 獲取所有房間的用電數據
    getRoomData: async (room, start, end) => {
        try {
            const roomsToFetch = room === 'all' 
                ? ['801', '802', '803', '804', '805', '806', '807', '808'] 
                : [room];

            const fetchPromises = roomsToFetch.map(r => 
                fetch(`${CONFIG.RECORD_API_BASE_URL}/record/${r}/electricity`).then(res => res.json())
            );

            const results = await Promise.all(fetchPromises);
            
            // 將所有房間的數據合併為一個陣列
            const allData = results.flat(); 

            // TODO: 後端 API 支援時間篩選後，在這裡處理

            return { success: true, data: allData };

        } catch (error) {
            console.error('Get Room Data API error:', error);
            return { success: false, message: '無法獲取房間數據' };
        }
    },

    // 模擬獲取個人用電數據 (801房)
    getPersonalData: async (start, end) => {
        console.log(`查詢個人數據，開始: ${start}, 結束: ${end}`);
        await new Promise(resolve => setTimeout(resolve, 1000));

        const mockData = [];
        const startDate = new Date(start);
        const endDate = new Date(end);
        let current = startDate.getTime();
        let inRoom = true;

        while (current <= endDate.getTime()) {
            mockData.push({
                timestamp: new Date(current).toISOString(),
                room: '801',
                reading: Math.random() * 50 + 500,
                event: inRoom ? 'in' : 'out'
            });
            inRoom = !inRoom;
            current += (Math.random() * 5 + 3) * 3600 * 1000; // 3-8 小時切換一次狀態
        }

        return { success: true, data: mockData };
    },

    // 手動輸入
    postManualEntry: async (token, room, reading, event) => {
        try {
            const body = { reading: parseFloat(reading) };
            if (event) {
                body.event = event;
            }

            const response = await fetch(`${CONFIG.RECORD_API_BASE_URL}/record/${room}/electricity`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(body)
            });

            const data = await response.json();

            if (response.ok) {
                return { success: true, message: '資料已成功送出' };
            } else {
                return { success: false, message: data.message || '送出失敗' };
            }
        } catch (error) {
            console.error('Post Manual Entry API error:', error);
            return { success: false, message: '無法連接到伺服器' };
        }
    }
};
