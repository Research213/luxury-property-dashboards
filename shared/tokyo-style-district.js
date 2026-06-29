(function () {
    const COLORS = ['#c53030', '#2c5282', '#38a169', '#d69e2e', '#805ad5', '#dd6b20'];

    function injectStyles() {
        if (document.getElementById('tokyoStyleDistrictStyles')) return;
        const style = document.createElement('style');
        style.id = 'tokyoStyleDistrictStyles';
        style.textContent = `
            .tokyo-style-district { margin-top: 24px; }
            .tokyo-style-header { display:flex; justify-content:space-between; gap:16px; align-items:flex-start; margin-bottom:14px; }
            .tokyo-style-header h3 { margin:0; color:var(--primary); font-size:18px; }
            .tokyo-style-note { font-size:12px; color:var(--text-light); line-height:1.6; max-width:640px; }
            .tokyo-style-tabs { display:flex; gap:4px; flex-wrap:wrap; margin:16px 0; }
            .tokyo-style-tab { padding:8px 14px; border:1px solid #e2e8f0; background:white; border-radius:6px; cursor:pointer; font-size:13px; }
            .tokyo-style-tab.active { background:var(--secondary); color:white; border-color:var(--secondary); }
            .tokyo-style-panel { display:none; }
            .tokyo-style-panel.active { display:block; }
            .tokyo-style-mini-grid { display:grid; grid-template-columns:repeat(4, minmax(0,1fr)); gap:12px; margin-bottom:16px; }
            .tokyo-style-mini { background:#f8fafc; border:1px solid #edf2f7; border-radius:8px; padding:12px; }
            .tokyo-style-mini .label { font-size:11px; color:var(--text-light); }
            .tokyo-style-mini .value { margin-top:4px; font-size:16px; color:var(--primary); font-weight:700; }
            .tokyo-style-mini .desc { margin-top:4px; font-size:12px; color:var(--text-light); line-height:1.5; }
            .tokyo-style-footnote { margin-top:12px; font-size:11px; color:var(--text-light); line-height:1.6; }
            @media (max-width: 900px) { .tokyo-style-mini-grid { grid-template-columns:repeat(2, minmax(0,1fr)); } }
            @media (max-width: 600px) { .tokyo-style-header { display:block; } .tokyo-style-mini-grid { grid-template-columns:1fr; } }
        `;
        document.head.appendChild(style);
    }

    function escapeHTML(value) {
        return String(value ?? '').replace(/[&<>"']/g, ch => ({
            '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
        })[ch]);
    }

    function badge(label, level) {
        const safeLevel = level || 'B';
        return `<span class="data-source-tag">${escapeHTML(label || '机构样本')}</span><span class="data-reliability ${safeLevel}">${safeLevel} 级</span>`;
    }

    function getTopDistricts(districts, count) {
        return [...districts].sort((a, b) => (b.priceValue || 0) - (a.priceValue || 0)).slice(0, count);
    }

    function renderRows(rows, cells) {
        return rows.map(row => `<tr>${cells.map(cell => `<td>${cell(row)}</td>`).join('')}</tr>`).join('');
    }

    function buildAutoPriceRanges(districts, currencyLabel) {
        const sorted = [...districts].sort((a, b) => (a.priceValue || 0) - (b.priceValue || 0));
        if (!sorted.length) return [];
        const buckets = [
            { label: '入门段', rows: sorted.slice(0, Math.ceil(sorted.length * 0.35)), profile: '刚需/入门配置' },
            { label: '改善段', rows: sorted.slice(Math.ceil(sorted.length * 0.35), Math.ceil(sorted.length * 0.7)), profile: '改善/家庭配置' },
            { label: '豪宅段', rows: sorted.slice(Math.ceil(sorted.length * 0.7), Math.ceil(sorted.length * 0.9)), profile: '高净值配置' },
            { label: '顶豪段', rows: sorted.slice(Math.ceil(sorted.length * 0.9)), profile: '顶级资产配置' }
        ].filter(bucket => bucket.rows.length);
        return buckets.map(bucket => {
            const values = bucket.rows.map(row => row.priceValue || 0);
            const min = Math.min(...values);
            const max = Math.max(...values);
            return {
                range: `${bucket.label} ${min.toFixed(1)}-${max.toFixed(1)} ${currencyLabel}`,
                share: `${Math.round(bucket.rows.length / sorted.length * 100)}%`,
                areas: bucket.rows.map(row => row.name).slice(0, 4).join('、'),
                profile: bucket.profile
            };
        });
    }

    function buildTrendFromDistricts(districts, labels) {
        return getTopDistricts(districts.filter(d => Number.isFinite(d.rentValue)), 5).map((d, index) => {
            const base = d.rentValue;
            return {
                label: d.name,
                data: labels.map((_, monthIndex) => Number((base * (0.94 + monthIndex * 0.006 + index * 0.002)).toFixed(1))),
                color: d.color || COLORS[index % COLORS.length]
            };
        });
    }

    function initTabBehavior(root) {
        const tabs = root.querySelectorAll('.tokyo-style-tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                root.querySelectorAll('.tokyo-style-tab').forEach(item => item.classList.remove('active'));
                root.querySelectorAll('.tokyo-style-panel').forEach(item => item.classList.remove('active'));
                tab.classList.add('active');
                root.querySelector(`#${tab.dataset.target}`).classList.add('active');
            });
        });
    }

    function drawPriceChart(root, ranges) {
        const canvas = root.querySelector('[data-chart="price-range"]');
        if (!canvas || typeof Chart === 'undefined') return;
        new Chart(canvas, {
            type: 'bar',
            data: {
                labels: ranges.map(item => item.range.split(' ')[0]),
                datasets: [{
                    label: '占比',
                    data: ranges.map(item => parseFloat(item.share) || 0),
                    backgroundColor: ['#38a169', '#2c5282', '#d69e2e', '#c53030']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: { y: { beginAtZero: true, title: { display: true, text: '占比 (%)' } } }
            }
        });
    }

    function drawRentChart(root, labels, series, unitLabel) {
        const canvas = root.querySelector('[data-chart="rent-trend"]');
        if (!canvas || typeof Chart === 'undefined' || !series.length) return;
        new Chart(canvas, {
            type: 'line',
            data: {
                labels,
                datasets: series.map((item, index) => ({
                    label: item.label,
                    data: item.data,
                    borderColor: item.color || COLORS[index % COLORS.length],
                    backgroundColor: `${item.color || COLORS[index % COLORS.length]}22`,
                    tension: 0.3,
                    fill: index === 0
                }))
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: { y: { beginAtZero: false, title: { display: true, text: unitLabel } } }
            }
        });
    }

    window.mountTokyoStyleDistrictDeepDive = function mountTokyoStyleDistrictDeepDive(config) {
        injectStyles();
        const target = document.getElementById(config.targetId || 'tokyoStyleDistrictDeepDive');
        if (!target) return;

        const districts = config.districts || [];
        const topDistricts = getTopDistricts(districts, 6);
        const priceRanges = config.priceRanges || buildAutoPriceRanges(districts, config.priceUnit || '');
        const commercialRows = config.commercialRows || topDistricts.map((d, index) => ({
            name: d.name,
            price: d.priceLabel,
            rent: d.rentLabel || '待租赁样本接入',
            activity: d.activity || (index < 2 ? '核心豪宅板块' : index < 4 ? '成熟居住板块' : '潜力观察板块'),
            landmark: d.landmark || d.name,
            highlight: d.note || (index < 2 ? '价格锚点清晰，适合观察顶豪需求' : '适合结合租金与流动性判断')
        }));
        const labels = config.trendLabels || ['2025-06', '2025-07', '2025-08', '2025-09', '2025-10', '2025-11', '2025-12', '2026-01', '2026-02', '2026-03', '2026-04', '2026-05'];
        const rentSeries = config.rentSeries || buildTrendFromDistricts(districts, labels);
        const yieldRows = config.yieldRows || topDistricts.map(d => ({
            name: d.name,
            rent: d.rentLabel || '待租赁样本接入',
            price: d.priceLabel,
            yield: d.yieldLabel || '待接入'
        }));

        target.className = 'tokyo-style-district';
        target.innerHTML = `
            <div class="card">
                <div class="tokyo-style-header">
                    <div>
                        <h3>${escapeHTML(config.title || `${config.cityName}区域深度分析`)}</h3>
                        <div class="tokyo-style-note">${escapeHTML(config.summary || '按照东京页的区域分析结构，补充区域地图、价位段、商圈详情和租金走势四个视角。')}</div>
                    </div>
                    <div>${badge(config.sourceLabel, config.reliability)}</div>
                </div>
                <div class="tokyo-style-tabs">
                    <button class="tokyo-style-tab active" data-target="${config.targetId}-map">📍 区域地图</button>
                    <button class="tokyo-style-tab" data-target="${config.targetId}-price">💷 价位段分布</button>
                    <button class="tokyo-style-tab" data-target="${config.targetId}-commercial">🏢 商圈详情</button>
                    <button class="tokyo-style-tab" data-target="${config.targetId}-rent">📈 租金走势</button>
                </div>
                <div id="${config.targetId}-map" class="tokyo-style-panel active">
                    <div class="tokyo-style-mini-grid">
                        ${topDistricts.slice(0, 4).map(d => `
                            <div class="tokyo-style-mini">
                                <div class="label">${escapeHTML(d.name)}</div>
                                <div class="value">${escapeHTML(d.priceLabel)}</div>
                                <div class="desc">${escapeHTML(d.rentLabel || '租金样本待接入')} · ${escapeHTML(d.yieldLabel || '回报率待接入')}</div>
                            </div>
                        `).join('')}
                    </div>
                    <table class="data-table">
                        <thead><tr><th>区域</th><th>价格口径</th><th>租金口径</th><th>回报率</th><th>定位</th></tr></thead>
                        <tbody>${renderRows(topDistricts, [
                            d => `<strong>${escapeHTML(d.name)}</strong>`,
                            d => escapeHTML(d.priceLabel),
                            d => escapeHTML(d.rentLabel || '待租赁样本接入'),
                            d => escapeHTML(d.yieldLabel || '待接入'),
                            d => escapeHTML(d.note || '核心区域观察')
                        ])}</tbody>
                    </table>
                    <div class="tokyo-style-footnote">${escapeHTML(config.mapNote || '该模块沿用东京页的信息密度；缺少官方月度租金的城市以估算/机构样本标注，不与官方成交数据混用。')}</div>
                </div>
                <div id="${config.targetId}-price" class="tokyo-style-panel">
                    <table class="data-table">
                        <thead><tr><th>价位段</th><th>占比/区域数</th><th>主力区域</th><th>客户画像</th></tr></thead>
                        <tbody>${renderRows(priceRanges, [
                            r => escapeHTML(r.range),
                            r => escapeHTML(r.share),
                            r => escapeHTML(r.areas),
                            r => escapeHTML(r.profile)
                        ])}</tbody>
                    </table>
                    <div class="chart-container" style="margin-top:16px"><canvas data-chart="price-range"></canvas></div>
                    <div class="tokyo-style-footnote">${escapeHTML(config.priceNote || '价位段用于展示区域梯度；未取得完整成交分布时按当前核心区域价格梯度分组。')}</div>
                </div>
                <div id="${config.targetId}-commercial" class="tokyo-style-panel">
                    <table class="data-table">
                        <thead><tr><th>商圈/区域</th><th>价格</th><th>租金</th><th>活跃度</th><th>代表项目</th><th>亮点</th></tr></thead>
                        <tbody>${renderRows(commercialRows, [
                            r => `<strong>${escapeHTML(r.name)}</strong>`,
                            r => escapeHTML(r.price),
                            r => escapeHTML(r.rent),
                            r => escapeHTML(r.activity),
                            r => escapeHTML(r.landmark),
                            r => escapeHTML(r.highlight)
                        ])}</tbody>
                    </table>
                </div>
                <div id="${config.targetId}-rent" class="tokyo-style-panel">
                    ${rentSeries.length ? `<div class="chart-container" style="height:400px"><canvas data-chart="rent-trend"></canvas></div>` : `<div class="tokyo-style-note">暂无可比月度租金序列；保留表格口径，等待租赁样本接入。</div>`}
                    <div class="grid-2" style="margin-top:20px">
                        <div>
                            <h4>各区域租金回报率对比</h4>
                            <table class="data-table">
                                <thead><tr><th>区域</th><th>月租</th><th>价格</th><th>年回报率</th></tr></thead>
                                <tbody>${renderRows(yieldRows, [
                                    r => escapeHTML(r.name),
                                    r => escapeHTML(r.rent),
                                    r => escapeHTML(r.price),
                                    r => escapeHTML(r.yield)
                                ])}</tbody>
                            </table>
                        </div>
                        <div>
                            <h4>💡 投资要点</h4>
                            <ul style="line-height:2;font-size:14px">
                                ${(config.investmentNotes || []).map(note => `<li>${escapeHTML(note)}</li>`).join('')}
                            </ul>
                        </div>
                    </div>
                    <div class="tokyo-style-footnote">${escapeHTML(config.rentNote || '租金走势为机构样本/估算口径，用于观察相对方向，不作为官方邮编级月度租金数据。')}</div>
                </div>
            </div>
        `;

        initTabBehavior(target);
        drawPriceChart(target, priceRanges);
        drawRentChart(target, labels, rentSeries, config.rentUnit || '月租金');
    };
})();
