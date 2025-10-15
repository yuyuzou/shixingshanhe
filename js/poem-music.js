// 诗句音频控制模块 - 基于global-icon逻辑的重构版本
// 实现类似bgm-control.js的点击切换功能，同时支持动态数据获取

document.addEventListener('DOMContentLoaded', function() {
  console.log('poem-music.js已加载，开始初始化');
  
  // 获取必要的DOM元素
  const poemMusic = document.querySelector('#detail-page .poemDetail .leftTop .title .poemMusic');
  const poemAudio = document.querySelector('#detail-page .poemDetail .leftTop .title .poemMusic audio');
  const poemOn = document.querySelector('#detail-page .poemDetail .leftTop .title .poemMusic .poemOn');
  const poemOff = document.querySelector('#detail-page .poemDetail .leftTop .title .poemMusic .poemOff');
  
  // 设置初始样式
  if (poemMusic && poemOn && poemOff) {
    // 设置鼠标样式
    poemMusic.style.cursor = 'none';
    poemOn.style.cursor = 'none';
    poemOff.style.cursor = 'none';
    
    // 初始状态：隐藏播放图标，显示停止图标
    poemOn.style.display = 'none';
    poemOff.style.display = 'inline-block';
  }
  
  // 点击切换播放/暂停状态
  if (poemMusic && poemAudio && poemOn && poemOff) {
    poemMusic.addEventListener('click', function(e) {
      e.stopPropagation(); // 阻止事件冒泡
      console.log('poemMusic: 点击事件触发');
      
      if (poemAudio.paused) {
        // 当前未播放，点击后播放音频
        console.log('切换到播放状态');
        
        // 获取当前诗句标题
        const titleElement = document.querySelector('#detail-page .poemDetail .leftTop .title');
        if (!titleElement) {
          console.error('未找到标题元素');
          return;
        }
        
        // 创建临时元素获取不包含poemMusic的标题文本
        const tempElement = titleElement.cloneNode(true);
        const tempPoemMusic = tempElement.querySelector('.poemMusic');
        if (tempPoemMusic) {
          tempElement.removeChild(tempPoemMusic);
        }
        
        const titleText = tempElement.textContent.trim();
        if (!titleText) {
          console.error('未找到诗句标题');
          return;
        }
        
        // 构建音频文件路径
        const poemTitle = titleText.replace(/《|》/g, '');
        const audioPath = `audio/诗词/${poemTitle}.mp3`;
        
        // 设置音频源并播放
        poemAudio.src = audioPath;
        poemAudio.loop = false;
        
        // 播放音频
        poemAudio.play().then(() => {
          console.log(`诗句音频播放成功: ${audioPath}`);
          // 切换图标状态
          poemOn.style.display = 'inline-block';
          poemOff.style.display = 'none';
        }).catch(error => {
          console.error('诗句音频播放失败:', error);
          alert('诗句音频播放失败，请检查网络连接');
        });
      } else {
        // 当前正在播放，点击后暂停音频
        console.log('切换到暂停状态');
        poemAudio.pause();
        // 切换图标状态
        poemOn.style.display = 'none';
        poemOff.style.display = 'inline-block';
      }
    });
    
    // 音频播放结束后自动切换图标状态
    poemAudio.addEventListener('ended', function() {
      console.log('诗句音频播放结束');
      poemOn.style.display = 'none';
      poemOff.style.display = 'inline-block';
    });
    
    // 音频加载错误处理
    poemAudio.addEventListener('error', function() {
      console.error('诗句音频加载失败:', poemAudio.error);
      poemOn.style.display = 'none';
      poemOff.style.display = 'inline-block';
    });
  } else {
    console.error('缺少必要的DOM元素');
    // 尝试延迟查找元素，因为详情页可能是动态加载的
    setTimeout(() => setupDelayedPoemMusic(), 1000);
  }
  
  // 页面切换时的清理工作
  setupPageChangeObserver();
});

// 延迟设置poemMusic功能（当DOM元素初始不可见时）
function setupDelayedPoemMusic() {
  console.log('尝试延迟设置poemMusic功能');
  
  const poemMusic = document.querySelector('#detail-page .poemDetail .leftTop .title .poemMusic');
  const poemAudio = document.querySelector('#detail-page .poemDetail .leftTop .title .poemMusic audio');
  const poemOn = document.querySelector('#detail-page .poemDetail .leftTop .title .poemMusic .poemOn');
  const poemOff = document.querySelector('#detail-page .poemDetail .leftTop .title .poemMusic .poemOff');
  
  if (poemMusic && poemAudio && poemOn && poemOff) {
    console.log('延迟设置成功，找到所有必要元素');
    
    // 设置鼠标样式
    poemMusic.style.cursor = 'none';
    poemOn.style.cursor = 'none';
    poemOff.style.cursor = 'none';
    
    // 初始状态
    poemOn.style.display = 'none';
    poemOff.style.display = 'inline-block';
    
    // 添加点击事件
    poemMusic.addEventListener('click', function(e) {
      e.stopPropagation();
      console.log('poemMusic: 延迟设置后的点击事件触发');
      
      if (poemAudio.paused) {
        // 播放逻辑
        console.log('切换到播放状态');
        
        const titleElement = document.querySelector('#detail-page .poemDetail .leftTop .title');
        if (!titleElement) {
          console.error('未找到标题元素');
          return;
        }
        
        const tempElement = titleElement.cloneNode(true);
        const tempPoemMusic = tempElement.querySelector('.poemMusic');
        if (tempPoemMusic) {
          tempElement.removeChild(tempPoemMusic);
        }
        
        const titleText = tempElement.textContent.trim();
        if (!titleText) {
          console.error('未找到诗句标题');
          return;
        }
        
        const poemTitle = titleText.replace(/《|》/g, '');
        const audioPath = `audio/诗词/${poemTitle}.mp3`;
        
        poemAudio.src = audioPath;
        poemAudio.loop = false;
        
        poemAudio.play().then(() => {
          console.log(`诗句音频播放成功: ${audioPath}`);
          poemOn.style.display = 'inline-block';
          poemOff.style.display = 'none';
        }).catch(error => {
          console.error('诗句音频播放失败:', error);
          alert('诗句音频播放失败，请检查网络连接');
        });
      } else {
        // 暂停逻辑
        console.log('切换到暂停状态');
        poemAudio.pause();
        poemOn.style.display = 'none';
        poemOff.style.display = 'inline-block';
      }
    });
    
    // 添加事件监听器
    poemAudio.addEventListener('ended', function() {
      console.log('诗句音频播放结束');
      poemOn.style.display = 'none';
      poemOff.style.display = 'inline-block';
    });
    
    poemAudio.addEventListener('error', function() {
      console.error('诗句音频加载失败:', poemAudio.error);
      poemOn.style.display = 'none';
      poemOff.style.display = 'inline-block';
    });
  }
}

// 设置页面切换观察器，确保切换页面时重置音频状态
function setupPageChangeObserver() {
  let lastActivePage = null;
  
  function checkPageChange() {
    const activePage = document.querySelector('.page.active');
    if (activePage && activePage !== lastActivePage) {
      lastActivePage = activePage;
      
      // 如果不是detail-page，暂停所有音频并重置图标
      if (activePage.id !== 'detail-page') {
        const poemAudio = document.querySelector('#detail-page .poemDetail .leftTop .title .poemMusic audio');
        const poemOn = document.querySelector('#detail-page .poemDetail .leftTop .title .poemMusic .poemOn');
        const poemOff = document.querySelector('#detail-page .poemDetail .leftTop .title .poemMusic .poemOff');
        
        if (poemAudio) {
          poemAudio.pause();
        }
        
        if (poemOn && poemOff) {
          poemOn.style.display = 'none';
          poemOff.style.display = 'inline-block';
        }
      }
    }
    
    // 继续检查
    requestAnimationFrame(checkPageChange);
  }
  
  // 开始检查
  checkPageChange();
}

// 监听detail-page页面变化，确保在切换到新诗句时重置音频状态
const detailPage = document.getElementById('detail-page');
if (detailPage) {
  const observer = new MutationObserver(function(mutations) {
    // 检查detail-page是否显示
    if (detailPage.classList.contains('active')) {
      console.log('detail-page已激活，重置音频状态');
      
      // 重置音频状态
      const poemAudio = document.querySelector('#detail-page .poemDetail .leftTop .title .poemMusic audio');
      const poemOn = document.querySelector('#detail-page .poemDetail .leftTop .title .poemMusic .poemOn');
      const poemOff = document.querySelector('#detail-page .poemDetail .leftTop .title .poemMusic .poemOff');
      
      if (poemAudio) {
        poemAudio.pause();
        poemAudio.currentTime = 0;
      }
      
      if (poemOn && poemOff) {
        poemOn.style.display = 'none';
        poemOff.style.display = 'inline-block';
      }
    }
  });
  
  // 监听class变化以检测页面切换
  observer.observe(detailPage, {
    attributes: true,
    attributeFilter: ['class']
  });
  
  // 监听标题元素变化，确保切换诗句数据时停止音频播放
  const titleElement = document.querySelector('#detail-page .poemDetail .leftTop .title');
  if (titleElement) {
    observer.observe(titleElement, {
      childList: true,
      subtree: true,
      characterData: true
    });
  }
  
  // 监听详情页内容变化，确保数据更新时停止音频
  const poemDetailElement = document.querySelector('#detail-page .poemDetail');
  if (poemDetailElement) {
    observer.observe(poemDetailElement, {
      childList: true,
      subtree: true
    });
  }
}

// 添加一个测试函数，方便调试
window.testPoemAudio = function(poemTitle) {
  console.log('testPoemAudio: 开始测试音频播放，标题:', poemTitle);
  
  const poemMusic = document.querySelector('#detail-page .poemDetail .leftTop .title .poemMusic');
  const poemAudio = document.querySelector('#detail-page .poemDetail .leftTop .title .poemMusic audio');
  const poemOn = document.querySelector('#detail-page .poemDetail .leftTop .title .poemMusic .poemOn');
  const poemOff = document.querySelector('#detail-page .poemDetail .leftTop .title .poemMusic .poemOff');
  
  if (!poemAudio) {
    console.error('未找到音频元素');
    return;
  }
  
  // 构建音频路径
  const audioPath = `audio/诗词/${poemTitle || '望岳'}.mp3`;
  console.log('testPoemAudio: 尝试播放音频:', audioPath);
  
  // 重置并播放音频
  poemAudio.src = audioPath;
  poemAudio.load();
  
  // 播放音频
  poemAudio.play().then(() => {
    console.log('testPoemAudio: 音频播放成功!');
    if (poemOn && poemOff) {
      poemOn.style.display = 'inline-block';
      poemOff.style.display = 'none';
    }
  }).catch(error => {
    console.error('testPoemAudio: 音频播放失败:', error);
  });
};

console.log('提示：在控制台输入 testPoemAudio() 可以直接测试音频播放功能');
console.log('提示：输入 testPoemAudio("望岳") 可以测试特定诗句的音频');