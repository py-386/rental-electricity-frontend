const UI = {
    // 渲染儀表板圖表
    renderDashboardChart: (data) => {
        const chartContainer = document.getElementById('chart-container');
        chartContainer.innerHTML = ''; // 清除舊圖表
        const canvas = document.createElement('canvas');
        chartContainer.appendChild(canvas);

        const ctx = canvas.getContext('2d');

        const datasets = {};
        data.forEach(d => {
            if (!datasets[d.room]) {
                datasets[d.room] = {
                    label: `房間 ${d.room}`,
                    data: [],
                    borderColor: `hsl(${Math.random() * 360}, 70%, 50%)`,
                    fill: false,
                    tension: 0.1
                };
            }
            datasets[d.room].data.push({ x: d.timestamp, y: d.reading });
        });

        new Chart(ctx, {
            type: 'line',
            data: {
                datasets: Object.values(datasets)
            },
            options: {
                scales: {
                    x: {
                        type: 'time',
                        time: {
                            unit: 'hour'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: '電錶度數'
                        }
                    }
                }
            }
        });
    },

    // 渲染個人用電數據
    renderPersonalData: (data) => {
        const container = document.getElementById('personal-data-container');
        container.innerHTML = '';

        if (data.length === 0) {
            container.innerHTML = '<p>沒有資料</p>';
            return;
        }

        const table = document.createElement('table');
        table.innerHTML = `
            <thead>
                <tr>
                    <th>時段</th>
                    <th>狀態</th>
                    <th>用電量 (度)</th>
                    <th>每小時平均耗電量 (度)</th>
                </tr>
            </thead>
            <tbody>
            </tbody>
        `;
        const tbody = table.querySelector('tbody');

        for (let i = 0; i < data.length - 1; i++) {
            const start = data[i];
            const end = data[i + 1];

            const startTime = new Date(start.timestamp);
            const endTime = new Date(end.timestamp);
            const durationHours = (endTime - startTime) / (1000 * 60 * 60);
            const consumption = end.reading - start.reading;
            const avgConsumption = consumption / durationHours;

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${startTime.toLocaleString()} - ${endTime.toLocaleString()}</td>
                <td>${start.event === 'in' ? '在房間' : '不在房間'}</td>
                <td>${consumption.toFixed(2)}</td>
                <td>${avgConsumption.toFixed(2)}</td>
            `;
            tbody.appendChild(tr);
        }

        container.appendChild(table);
    },

    // 顯示訊息
    showMessage: (message, isError = false) => {
        alert(message);
    }
};
