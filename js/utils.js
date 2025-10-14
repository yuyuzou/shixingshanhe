// 工具函数

// 生成随机ID
function generateId() {
    return 'id_' + Math.random().toString(36).substr(2, 9);
}

// 格式化文本
function formatText(text, maxLength) {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
}

// 检查移动设备
function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// 防抖函数
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// 保存进度到本地存储
function saveProgress() {
    const visitedLocations = Array.from(document.querySelectorAll('.poem-marker.visited'))
        .map(marker => marker.id.replace('marker-', ''));
    localStorage.setItem('visitedLocations', JSON.stringify(visitedLocations));
}

// 从本地存储加载进度
function loadProgress() {
    const visitedLocations = JSON.parse(localStorage.getItem('visitedLocations') || '[]');
    visitedLocations.forEach(locationId => {
        const marker = document.getElementById(`marker-${locationId}`);
        if (marker) {
            marker.classList.add('visited');
        }
    });
    updateProgress();
}