// 诗句音频控制模块 - detail-page版
let currentAudio = null;
let currentPoemId = null;

// 初始化音频控制功能
document.addEventListener('DOMContentLoaded', function() {
    console.log('poem-music.js已加载，开始初始化');
    setupPoemMusicInDetailPage();
    observeDetailPageChanges();
    cleanupOnPageChange();
});

// 设置detail-page中的poemMusic功能
function setupPoemMusicInDetailPage() {
    console.log('setupPoemMusicInDetailPage: 开始设置poemMusic功能');
    
    const poemMusicElement = document.querySelector('#detail-page .poemDetail .leftTop .title .poemMusic');
    if (!poemMusicElement) {
        console.error('未找到detail-page中的poemMusic元素');
        // 尝试延迟查找，因为详情页内容可能是动态加载的
        setTimeout(() => {
            console.log('setupPoemMusicInDetailPage: 延迟查找poemMusic元素');
            const delayedPoemMusicElement = document.querySelector('#detail-page .poemDetail .leftTop .title .poemMusic');
            if (delayedPoemMusicElement) {
                console.log('setupPoemMusicInDetailPage: 延迟查找成功');
                // 递归调用，设置元素
                setupDelayedPoemMusic(delayedPoemMusicElement);
            }
        }, 1000);
        return;
    }

    setupDelayedPoemMusic(poemMusicElement);
}

// 延迟设置poemMusic元素的功能
function setupDelayedPoemMusic(poemMusicElement) {
    // 获取图标元素
    const imgOn = poemMusicElement.querySelector('.poemOn');
    const imgOff = poemMusicElement.querySelector('.poemOff');
    const audioElement = poemMusicElement.querySelector('audio');

    if (!imgOn || !imgOff || !audioElement) {
        console.error('poemMusic元素缺少必要的子元素');
        return;
    }

    console.log('setupDelayedPoemMusic: 成功获取所有必要元素');
    
    // 初始状态：显示静音图标，隐藏播放图标
    imgOn.style.display = 'none';
    imgOff.style.display = 'inline-block';

    // 添加点击事件监听
    poemMusicElement.addEventListener('click', function(e) {
        e.stopPropagation(); // 阻止事件冒泡
        console.log('poemMusicElement: 点击事件触发');

        const poemId = parseInt(this.getAttribute('data-poem-id'));
        console.log('poemMusicElement: 当前poem-id:', poemId);
        
        if (isNaN(poemId)) {
            console.error('无效的poem-id，尝试获取当前诗句数据');
            // 如果没有有效的poem-id，尝试获取当前诗句数据
            const currentPoemData = getCurrentDetailPagePoemData();
            if (currentPoemData && currentPoemData.id) {
                console.log('poemMusicElement: 成功获取当前诗句数据，id:', currentPoemData.id);
                this.setAttribute('data-poem-id', currentPoemData.id);
                playPoemAudio(currentPoemData.id, audioElement);
                imgOn.style.display = 'inline-block';
                imgOff.style.display = 'none';
                return;
            }
            console.error('无法获取当前诗句数据');
            return;
        }

        // 切换显示状态
        if (imgOn.style.display === 'none' || imgOn.style.display === '') {
            // 播放状态
            console.log('poemMusicElement: 切换到播放状态');
            imgOn.style.display = 'inline-block';
            imgOff.style.display = 'none';
            playPoemAudio(poemId, audioElement);
        } else {
            // 暂停状态
            console.log('poemMusicElement: 切换到暂停状态');
            imgOn.style.display = 'none';
            imgOff.style.display = 'inline-block';
            pausePoemAudio(audioElement);
        }
    });
}

// 播放指定诗句的音频
function playPoemAudio(poemId, audioElement) {
    try {
        // 直接从poemMusic元素获取标题文本
        const titleElement = document.querySelector('#detail-page .poemDetail .leftTop .title');
        if (!titleElement) {
            console.error('未找到标题元素');
            return;
        }
        
        // 获取图标元素（在函数内部重新获取，避免作用域问题）
        const poemMusicElement = document.querySelector('#detail-page .poemDetail .leftTop .title .poemMusic');
        const imgOn = poemMusicElement?.querySelector('.poemOn');
        const imgOff = poemMusicElement?.querySelector('.poemOff');
        
        if (!imgOn || !imgOff) {
            console.error('无法获取图标元素');
            return;
        }
        
        // 创建一个临时元素来获取不包含poemMusic的文本内容
        const tempElement = titleElement.cloneNode(true);
        const tempPoemMusicElement = tempElement.querySelector('.poemMusic');
        if (tempPoemMusicElement) {
            tempElement.removeChild(tempPoemMusicElement);
        }
        
        const titleText = tempElement.textContent.trim();
        
        if (titleText) {
            // 获取诗句标题作为音频文件名
            const poemTitle = titleText.replace(/《|》/g, '');
            // 构建正确的音频文件路径
            const audioPath = `audio/诗词/${poemTitle}.mp3`;
            
            // 如果正在播放同一首诗，则切换暂停/播放状态
            if (currentPoemId === poemId && !audioElement.paused) {
                audioElement.pause();
                imgOn.style.display = 'none';
                imgOff.style.display = 'inline-block';
                return;
            }
            
            // 重置音频元素并加载新音频
            audioElement.src = audioPath;
            currentPoemId = poemId;
            // 明确设置不循环播放
            audioElement.loop = false;
            audioElement.load();
            
            // 等待音频加载完成后播放
            audioElement.addEventListener('loadedmetadata', function playWhenReady() {
                audioElement.play().then(() => {
                    console.log(`正在播放诗句 "${titleText}" 的音频: ${audioPath}`);
                    // 确认播放状态的图标显示
                    imgOn.style.display = 'inline-block';
                    imgOff.style.display = 'none';
                }).catch(error => {
                    console.error('音频播放失败:', error);
                    // 播放失败时重置状态
                    imgOn.style.display = 'none';
                    imgOff.style.display = 'inline-block';
                });
                audioElement.removeEventListener('loadedmetadata', playWhenReady);
            });
            
            // 处理音频加载错误
            audioElement.addEventListener('error', function handleAudioError() {
                console.error('音频加载失败:', audioElement.error);
                imgOn.style.display = 'none';
                imgOff.style.display = 'inline-block';
                audioElement.removeEventListener('error', handleAudioError);
            });

            // 先移除可能存在的ended事件监听器（使用try-catch防止错误）
            try {
                // 为了确保移除所有旧的事件监听器，我们先暂停并重置音频
                audioElement.pause();
                audioElement.currentTime = 0;
                
                // 在标准DOM API中没有直接获取所有监听器的方法
                // 这里使用一种简单的方式来确保状态正确
            } catch (e) {
                console.log('移除旧监听器时出错，继续执行:', e);
            }
            
            // 添加音频结束事件监听，确保播放一次后停止并重置状态
            const handleAudioEnded = function() {
                console.log('音频播放结束，重置状态');
                // 确保暂停音频
                audioElement.pause();
                // 重置播放位置到开始
                audioElement.currentTime = 0;
                // 重置图标状态
                imgOn.style.display = 'none';
                imgOff.style.display = 'inline-block';
                // 移除事件监听器
                audioElement.removeEventListener('ended', handleAudioEnded);
            };
            audioElement.addEventListener('ended', handleAudioEnded);
        } else {
            console.error('未找到诗句标题');
        }
    } catch (error) {
        console.error('播放音频时出错:', error);
    }
}

// 暂停音频
function pausePoemAudio(audioElement) {
    try {
        audioElement.pause();
        console.log('已暂停音频');
    } catch (error) {
        console.error('暂停音频时出错:', error);
    }
}

// 监听detail-page页面中诗句的变化
function observeDetailPageChanges() {
    console.log('observeDetailPageChanges: 开始监听详情页变化');
    
    const detailPage = document.getElementById('detail-page');
    if (!detailPage) {
        console.error('未找到detail-page元素');
        return;
    }

    // 监听detail-page是否激活显示
    const observer = new MutationObserver(function(mutations) {
        console.log('observeDetailPageChanges: 检测到详情页变化');
        
        // 检查detail-page是否显示
        if (detailPage.classList.contains('active')) {
            console.log('observeDetailPageChanges: 详情页已激活');
            // 获取当前选中的诗句ID
            const currentPoemData = getCurrentDetailPagePoemData();
            if (currentPoemData && currentPoemData.id) {
                console.log('observeDetailPageChanges: 成功获取当前诗句数据，id:', currentPoemData.id);
                updatePoemMusicId(currentPoemData.id);
            } else {
                console.log('observeDetailPageChanges: 无法获取当前诗句数据');
            }
        }
    });

    // 监听class变化以检测页面切换
    observer.observe(detailPage, {
        attributes: true,
        attributeFilter: ['class']
    });

    // 监听title内容变化，因为title通常会显示诗句标题
    const titleElement = document.querySelector('#detail-page .poemDetail .leftTop .title');
    if (titleElement) {
        console.log('observeDetailPageChanges: 开始监听标题变化');
        observer.observe(titleElement, {
            childList: true,
            subtree: true,
            characterData: true
        });
    }

    // 也监听页面切换按钮的点击事件
    document.querySelectorAll('[id^="backToPoem"], #poem-page .back').forEach(button => {
        button.addEventListener('click', function() {
            console.log('observeDetailPageChanges: 检测到页面切换按钮点击');
            setTimeout(() => {
                // 页面切换后检查
                if (detailPage.classList.contains('active')) {
                    const currentPoemData = getCurrentDetailPagePoemData();
                    if (currentPoemData && currentPoemData.id) {
                        updatePoemMusicId(currentPoemData.id);
                    }
                }
            }, 500);
        });
    });
}

// 获取detail-page当前显示的诗句数据
function getCurrentDetailPagePoemData() {
    // 尝试从页面标题推断诗句信息
    const titleElement = document.querySelector('#detail-page .poemDetail .leftTop .title');
    if (!titleElement) return null;
    
    // 创建一个临时元素来获取不包含poemMusic的文本内容
    const tempElement = titleElement.cloneNode(true);
    const poemMusicElement = tempElement.querySelector('.poemMusic');
    if (poemMusicElement) {
        tempElement.removeChild(poemMusicElement);
    }
    
    const titleText = tempElement.textContent.trim();
    
    if (titleText) {
        // 直接返回包含标题的对象，不需要依赖poemManager的数据结构
        return {
            title: titleText,
            id: titleText.hashCode() // 使用自定义的hashCode方法生成唯一ID
        };
    }

    // 如果无法确定，返回null
    return null;
}

// 为字符串添加hashCode方法
String.prototype.hashCode = function() {
    let hash = 0;
    if (this.length === 0) return hash;
    for (let i = 0; i < this.length; i++) {
        const char = this.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // 转换为32位整数
    }
    return hash;
};

// 更新poemMusic元素的data-poem-id属性
function updatePoemMusicId(poemId) {
    const poemMusicElement = document.querySelector('#detail-page .poemDetail .leftTop .title .poemMusic');
    const audioElement = document.querySelector('#detail-page .poemDetail .leftTop .title .poemMusic audio');
    const imgOn = document.querySelector('#detail-page .poemDetail .leftTop .title .poemMusic .poemOn');
    const imgOff = document.querySelector('#detail-page .poemDetail .leftTop .title .poemMusic .poemOff');

    if (poemMusicElement) {
        poemMusicElement.setAttribute('data-poem-id', poemId);
        console.log(`已更新poemMusic的data-poem-id为: ${poemId}`);
    }

    // 无论是否播放同一首诗，页面数据变化后都重置为关闭状态
    if (audioElement) {
        pausePoemAudio(audioElement);
    }
    
    // 重置图标状态为关闭
    if (imgOn && imgOff) {
        imgOn.style.display = 'none';
        imgOff.style.display = 'inline-block';
    }
}

// 页面切换时的清理工作
function cleanupOnPageChange() {
    // 监听页面切换事件
    const pageElements = document.querySelectorAll('.page');
    let lastActivePage = null;
    
    function checkPageChange() {
        const activePage = document.querySelector('.page.active');
        if (activePage && activePage !== lastActivePage) {
            lastActivePage = activePage;
            
            // 如果不是detail-page，暂停所有音频
            if (activePage.id !== 'detail-page') {
                const audioElement = document.querySelector('#detail-page .poemDetail .leftTop .title .poemMusic audio');
                if (audioElement) {
                    audioElement.pause();
                }
                
                // 重置图标状态
                const imgOn = document.querySelector('#detail-page .poemDetail .leftTop .title .poemMusic .poemOn');
                const imgOff = document.querySelector('#detail-page .poemDetail .leftTop .title .poemMusic .poemOff');
                if (imgOn && imgOff) {
                    imgOn.style.display = 'none';
                    imgOff.style.display = 'inline-block';
                }
            }
        }
        
        // 继续检查
        requestAnimationFrame(checkPageChange);
    }
    
    // 开始检查
    checkPageChange();
}

// 初始化函数
function initPoemMusic() {
    // 确保在DOM加载完成后执行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setupPoemMusicInDetailPage);
    } else {
        setupPoemMusicInDetailPage();
    }
}

// 导出init函数，方便外部调用
window.initPoemMusic = initPoemMusic;

// 添加一个直接测试音频播放的函数，方便调试
window.testPoemAudio = function(poemTitle) {
    console.log('testPoemAudio: 开始测试音频播放，标题:', poemTitle);
    try {
        const poemMusicElement = document.querySelector('#detail-page .poemDetail .leftTop .title .poemMusic');
        const audioElement = poemMusicElement?.querySelector('audio');
        const imgOn = poemMusicElement?.querySelector('.poemOn');
        const imgOff = poemMusicElement?.querySelector('.poemOff');
        
        if (!audioElement) {
            console.error('未找到音频元素');
            return;
        }
        
        // 构建音频路径
        const audioPath = `audio/诗词/${poemTitle || '望岳'}.mp3`;
        console.log('testPoemAudio: 尝试播放音频:', audioPath);
        
        // 重置并播放音频
        audioElement.src = audioPath;
        audioElement.load();
        
        // 等待音频加载完成后播放
        audioElement.addEventListener('loadedmetadata', function() {
            audioElement.play().then(() => {
                console.log('testPoemAudio: 音频播放成功!');
                if (imgOn && imgOff) {
                    imgOn.style.display = 'inline-block';
                    imgOff.style.display = 'none';
                }
            }).catch(error => {
                console.error('testPoemAudio: 音频播放失败:', error);
            });
        });
        
        // 处理音频加载错误
        audioElement.addEventListener('error', function() {
            console.error('testPoemAudio: 音频加载失败:', audioElement.error);
        });
        
    } catch (error) {
        console.error('testPoemAudio: 测试过程中出错:', error);
    }
};

console.log('提示：在控制台输入 testPoemAudio() 可以直接测试音频播放功能');
console.log('提示：输入 testPoemAudio("望岳") 可以测试特定诗句的音频');

// 自动初始化
if (typeof module === 'undefined') {
    // 在浏览器环境中自动初始化
    initPoemMusic();
}