// 地图页面功能
/**
 * 初始化地图上的诗句显示
 */
function initMapPoems() {
    // 注释掉renderShijuContainer()调用，避免在map-page渲染poem-page的内容
    // renderShijuContainer();
}
/**
 * 渲染shiju容器中的诗句
 */
function renderShijuContainer() {
    const shijuContainer = document.getElementById('shijuContainer');
    shijuContainer.innerHTML = '';
    
    // 获取所有诗句
    const allPoems = poemManager.getAllPoems();
    
    // 为每个句子创建span元素
    allPoems.forEach(poem => {
        const span = document.createElement('span');
        span.textContent = poem.text;
        span.style.opacity = poem.opacity;
        shijuContainer.appendChild(span);
    });
}