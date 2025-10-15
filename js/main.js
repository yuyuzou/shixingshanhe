// 主程序入口
document.addEventListener('DOMContentLoaded', function() {
    // 初始化古今切换按钮
    try {
        const gujinElement = document.querySelector('.gujin');
        if (gujinElement) {
            // 默认显示"古"
            gujinElement.textContent = '古';
            
            // 添加点击事件监听器，实现点击切换
            gujinElement.addEventListener('click', function() {
                const poemDetail = document.querySelector('.poemDetail');
                if (gujinElement.textContent === '古') {
                    gujinElement.textContent = '今';
                    // 切换到现代图
                    if (poemDetail) {
                        poemDetail.classList.add('show-modern');
                    }
                } else {
                    gujinElement.textContent = '古';
                    // 切换到古代图
                    if (poemDetail) {
                        poemDetail.classList.remove('show-modern');
                    }
                }
                console.log('古今切换:', gujinElement.textContent);
            });
            
            console.log('古今切换功能已初始化');
        } else {
            console.error('.gujin元素未找到');
        }
    } catch (e) {
        console.error('初始化古今切换功能时出错:', e);
    }
    
    // 初始化诗句页面的函数
    function initPoemPage() {
        try {
            // 使用循环滚动方式渲染诗句
            if (typeof poemManager !== 'undefined' && typeof poemManager.createLoopScrollingPoems !== 'undefined') {
                // 获取所有诗句
                const allPoems = poemManager.getAllPoems();
                // 渲染到shijuContainer容器
                poemManager.createLoopScrollingPoems('shijuContainer', allPoems);
                console.log('诗句已使用循环滚动方式渲染');
            } else {
                console.error('poemManager未定义或缺少createLoopScrollingPoems方法');
            }
        } catch (e) {
            console.error('初始化诗句页面时出错:', e);
        }
    }
    
    // 实现加载条动画和页面切换功能
    try {
        // 模拟加载过程
        const loadingProgress = document.getElementById('loading-progress');
        const loadingPage = document.getElementById('loading-page');
        const mapPage = document.getElementById('map-page');
        
        console.log('初始化页面切换:', {
            loadingProgress: !!loadingProgress,
            loadingPage: !!loadingPage,
            mapPage: !!mapPage
        });
        
        // 确保初始状态正确
        if (loadingPage) {
            loadingPage.classList.add('active');
        }
        if (mapPage) {
            mapPage.classList.remove('active');
        }
        
        if (loadingProgress && loadingPage && mapPage) {
            let progress = 0;
            const duration = 2000; // 加载动画持续2秒
            const interval = 30; // 每30毫秒更新一次进度
            const totalSteps = duration / interval;
            const increment = 100 / totalSteps;
            
            // 开始加载动画
            const loadingInterval = setInterval(() => {
                progress += increment;
                // 确保进度不超过100%
                if (progress >= 100) {
                    progress = 100;
                    clearInterval(loadingInterval);
                    
                    // 更新到100%进度
                    loadingProgress.style.width = `${progress}%`;
                    console.log('加载完成，准备切换页面');
                    
                    // 当加载完成后，延迟一小段时间再切换页面
                    setTimeout(() => {
                        console.log('执行页面切换');
                        // 使用更直接的方式切换页面
                        if (loadingPage) {
                            loadingPage.style.display = 'none';
                            loadingPage.classList.remove('active');
                        }
                        if (mapPage) {
                            mapPage.style.display = 'block';
                            mapPage.classList.add('active');
                        }
                        console.log('页面已切换到map-page');
                        
                        // 尝试调用地图初始化函数
                        if (typeof initMapPoems !== 'undefined') {
                            try {
                                initMapPoems();
                            } catch (e) {
                                console.error('初始化地图诗句时出错:', e);
                            }
                        }
                    }, 300); // 延迟300毫秒切换页面
                } else {
                    // 更新加载条宽度
                    loadingProgress.style.width = `${progress}%`;
                }
            }, interval);
        } else {
            console.error('加载页面元素未找到，使用备用页面切换');
            // 备用方案：直接切换页面
            setTimeout(() => {
                if (loadingPage && mapPage) {
                    loadingPage.style.display = 'none';
                    loadingPage.classList.remove('active');
                    mapPage.style.display = 'block';
                    mapPage.classList.add('active');
                    
                    if (typeof initMapPoems !== 'undefined') {
                        try {
                            initMapPoems();
                        } catch (e) {
                            console.error('初始化地图诗句时出错:', e);
                        }
                    }
                }
            }, 1000);
        }
    } catch (e) {
        console.error('页面切换过程中出错:', e);
    }
    
    // 为卷轴图片添加点击事件，点击后切换到诗句选择页面
    try {
        const scrollImage = document.querySelector('.map-juanzhou img');
        const mapPage = document.getElementById('map-page');
        const poemPage = document.getElementById('poem-page');
        
        if (scrollImage && mapPage && poemPage) {
            scrollImage.addEventListener('click', function() {
                // 使用直接的display属性切换，确保页面正确显示/隐藏
                mapPage.style.display = 'none';
                mapPage.classList.remove('active');
                poemPage.style.display = 'block';
                poemPage.classList.add('active');
                console.log('页面已切换到poem-page');
                
                // 如果有初始化诗句选择页面的函数，可以在这里调用
                if (typeof initPoemPage !== 'undefined') {
                    try {
                        initPoemPage();
                    } catch (e) {
                        console.error('初始化诗句选择页面时出错:', e);
                    }
                }
            });
            
            console.log('卷轴点击事件已添加');
        } else {
            console.error('元素未找到: ' + (!scrollImage ? 'scrollImage ' : '') + (!mapPage ? 'mapPage ' : '') + (!poemPage ? 'poemPage' : ''));
        }
    } catch (e) {
        console.error('添加卷轴点击事件时出错:', e);
    }
    
    // 实现毛笔鼠标跟随效果
    try {
        const brushCursor = document.getElementById('brush-cursor');
        if (brushCursor) {
            // 鼠标移动事件处理函数
            document.addEventListener('mousemove', function(e) {
                // 获取毛笔图片元素
                const brushImg = brushCursor.querySelector('img');
                // 获取图片实际尺寸
                const imgWidth = brushImg.offsetWidth || 40; // 默认宽度（从HTML中获取的近似值）
                const imgHeight = brushImg.offsetHeight || 40; // 默认高度（从HTML中获取的近似值）
                
                // 设置毛笔光标位置，确保热点位于毛笔图片的左下角
                // 正确计算方式：
                // - 鼠标X坐标作为图片左侧位置（热点位于图片左边缘）
                // - 鼠标Y坐标作为图片底部位置（热点位于图片下边缘）
                brushCursor.style.left = e.clientX + 'px'; // 热点位于图片左侧
                brushCursor.style.top = (e.clientY - imgHeight) + 'px'; // 热点位于图片底部
            });
            
            // 鼠标离开页面时隐藏光标
            document.addEventListener('mouseleave', function() {
                brushCursor.style.opacity = '0';
            });
            
            // 鼠标进入页面时显示光标
            document.addEventListener('mouseenter', function() {
                brushCursor.style.opacity = '1';
            });
            
            console.log('毛笔鼠标跟随效果已初始化');
        } else {
            console.error('毛笔光标元素未找到');
        }
    } catch (e) {
        console.error('初始化毛笔鼠标跟随效果时出错:', e);
    }
    
    // 为#poem-page .back添加点击事件，点击后切换到map-page
    try {
        const backElement = document.querySelector('#poem-page .back');
        const mapPage = document.getElementById('map-page');
        const poemPage = document.getElementById('poem-page');
        
        if (backElement && mapPage && poemPage) {
            backElement.addEventListener('click', function() {
                // 使用直接的display属性切换，确保页面正确显示/隐藏
                poemPage.style.display = 'none';
                poemPage.classList.remove('active');
                mapPage.style.display = 'block';
                mapPage.classList.add('active');
                console.log('页面已切换到map-page');
            });
            
            console.log('#poem-page .back点击事件已添加');
        } else {
            console.error('元素未找到: ' + (!backElement ? 'backElement ' : '') + (!mapPage ? 'mapPage ' : '') + (!poemPage ? 'poemPage' : ''));
        }
    } catch (e) {
        console.error('添加返回按钮点击事件时出错:', e);
    }
    
    // 为#backToPoem添加点击事件，点击后从detail-page切换回poem-page
    try {
        const backToPoemButton = document.getElementById('backToPoem');
        const detailPage = document.getElementById('detail-page');
        const poemPage = document.getElementById('poem-page');
        
        if (backToPoemButton && detailPage && poemPage) {
            backToPoemButton.addEventListener('click', function() {
                // 使用直接的display属性切换，确保页面正确显示/隐藏
                detailPage.style.display = 'none';
                detailPage.classList.remove('active');
                poemPage.style.display = 'block';
                poemPage.classList.add('active');
                console.log('页面已从detail-page切换回poem-page');
            });
            
            console.log('#backToPoem点击事件已添加');
        } else {
            console.error('元素未找到: ' + (!backToPoemButton ? 'backToPoemButton ' : '') + (!detailPage ? 'detailPage ' : '') + (!poemPage ? 'poemPage' : ''));
        }
    } catch (e) {
        console.error('添加返回按钮点击事件时出错:', e);
    }
    
    // 为pgUp和pgDown按钮添加点击事件
    try {
        // 存储当前显示的诗句ID
        let currentPoemId = 1;
        
        // 诗句ID范围
        const minPoemId = 1;
        const maxPoemId = 18;
        
        const pgUpButton = document.querySelector('.pgUp');
        const pgDownButton = document.querySelector('.pgDown');
        
        if (pgUpButton && pgDownButton) {
            // 更新页面内容的函数
            window.updateDetailPage = function(poemId) {
                try {
                    const foundData = findPoemById(poemId);
                      
                    if (foundData) {
                        console.log(`切换到诗句 ${poemId}:`);
                        console.log('地点键名:', foundData.location);
                        console.log('诗句详细数据:', foundData.poemData);
                          
                        const poemDetail = document.querySelector('.poemDetail');
                        if (poemDetail) {
                            // 重置图片显示状态和gujin文字
                            poemDetail.classList.remove('show-modern');
                            
                            // 重置gujin元素文本为'古'
                            const gujinElement = document.querySelector('.gujin');
                            if (gujinElement) {
                                gujinElement.textContent = '古';
                            }
                            
                            // 1秒后自动切换到现代图，并同步更新gujin文字
                            setTimeout(() => {
                                if (poemDetail) {
                                    poemDetail.classList.add('show-modern');
                                }
                                if (gujinElement) {
                                    gujinElement.textContent = '今';
                                }
                            }, 1500);
                            
                            // 更新页面内容
                            // 设置古代图片
                            const ancientImg = poemDetail.querySelector('.image-container .ancient-img');
                            if (ancientImg && foundData.poemData.images && foundData.poemData.images.ancient) {
                                ancientImg.src = foundData.poemData.images.ancient;
                                ancientImg.alt = `${foundData.poemData.location.name}古代图`;
                            }
                            
                            // 设置现代图片
                            const modernImg = poemDetail.querySelector('.image-container .modern-img');
                            if (modernImg && foundData.poemData.images && foundData.poemData.images.modern) {
                                modernImg.src = foundData.poemData.images.modern;
                                modernImg.alt = `${foundData.poemData.location.name}现代图`;
                            }
                            
                            // 设置完整诗句
                            const fullPoem = poemDetail.querySelector('.fullPoem');
                            if (fullPoem && foundData.poemData.fullText) {
                                fullPoem.innerHTML = foundData.poemData.fullText;
                            }
                            
                            // 设置标题
                            const title = poemDetail.querySelector('.title');
                            if (title && foundData.poemData.title) {
                                // 使用与poem.js相同的逻辑：通过.title-text容器设置标题
                                let titleTextContainer = title.querySelector('.title-text');
                                if (!titleTextContainer) {
                                    titleTextContainer = document.createElement('span');
                                    titleTextContainer.className = 'title-text';
                                    
                                    // 找到poemMusic元素
                                    const poemMusicElement = title.querySelector('.poemMusic');
                                    
                                    if (poemMusicElement) {
                                        // 将标题文本容器插入到poemMusic元素前面
                                        title.insertBefore(titleTextContainer, poemMusicElement);
                                    } else {
                                        title.appendChild(titleTextContainer);
                                    }
                                }
                                
                                // 设置标题文本
                                titleTextContainer.textContent = foundData.poemData.title;
                            }
                            
                            // 设置副标题
                            const subTitle = poemDetail.querySelector('.subTitle');
                            if (subTitle && foundData.poemData.subTitle) {
                                subTitle.textContent = foundData.poemData.subTitle;
                            }
                            
                            // 设置诗人图片
                            const poetImg = poemDetail.querySelector('.leftBottom .poet');
                            if (poetImg && foundData.poemData.images && foundData.poemData.images.poet) {
                                poetImg.src = foundData.poemData.images.poet;
                                poetImg.alt = `${foundData.poemData.subTitle}`;
                            }
                            
                            // 设置地点名称
                            // 获取所有的placeName元素并设置内容
                            const placeNameElements = document.querySelectorAll('.placeName');
                            if (placeNameElements.length > 0 && foundData.poemData.location && foundData.poemData.location.name) {
                                placeNameElements.forEach(function(element, index) {
                                    element.textContent = `${foundData.poemData.location.name}`;
                                     
                                    // 只给poemDetail容器内的placeName添加点击事件
                                    if (index === 0) {
                                        element.onclick = function() {
                                            const pop = document.querySelector('.pop');
                                            if (pop) {
                                                pop.style.display = 'block';
                                            }
                                        };
                                    }
                                });
                            }
                            
                            // 为pop的关闭按钮添加点击事件
                            const closeBtn = document.querySelector('.close');
                            if (closeBtn) {
                                closeBtn.onclick = function() {
                                    const pop = document.querySelector('.pop');
                                    if (pop) {
                                        pop.style.display = 'none';
                                    }
                                };
                            }
                            
                            // 设置现代位置
                            const position = poemDetail.querySelector('.position');
                            if (position && foundData.poemData.location && foundData.poemData.location.modernName) {
                                position.textContent = `位置：${foundData.poemData.location.modernName}`;
                            }
                            
                            // 设置故事内容
                            const story = poemDetail.querySelector('.story');
                            if (story && foundData.poemData.location && foundData.poemData.location.story) {
                                story.innerHTML = foundData.poemData.location.story;
                            }
                            
                            // 设置景点知识信息到弹窗的gushi元素
                            const gushiElement = document.querySelector('.pop .gushi');
                            if (gushiElement && foundData.poemData.knowledge) {
                                gushiElement.innerHTML = foundData.poemData.knowledge;
                            }
                            
                            // 设置place-picture中的4个图片，分别获取p1到p4的数据
                            for (let i = 1; i <= 4; i++) {
                                const imgElement = document.querySelector('.place-picture .p' + i);
                                if (imgElement && foundData.poemData.images && foundData.poemData.images['p' + i]) {
                                    imgElement.src = foundData.poemData.images['p' + i];
                                    imgElement.alt = `${foundData.poemData.location.name}景色${i}`;
                                }
                            }
                        }
                    } else {
                        console.log(`未找到诗句 ${poemId} 对应的详细数据`);
                    }
                } catch (error) {
                    console.error('更新页面时出错:', error);
                }
            };
            
            // 为pgUp按钮添加点击事件（上一页）
            pgUpButton.addEventListener('click', function() {
                // 当前id减1，如果到达最小值则循环到最大值
                currentPoemId = currentPoemId > minPoemId ? currentPoemId - 1 : maxPoemId;
                window.updateDetailPage(currentPoemId);
            });
            
            // 为pgDown按钮添加点击事件（下一页）
            pgDownButton.addEventListener('click', function() {
                // 当前id加1，如果到达最大值则循环到最小值
                currentPoemId = currentPoemId < maxPoemId ? currentPoemId + 1 : minPoemId;
                window.updateDetailPage(currentPoemId);
            });
            
            // 提供一个全局方法来设置当前诗句ID（从poem.js调用）
            window.setCurrentPoemId = function(poemId) {
                if (poemId >= minPoemId && poemId <= maxPoemId) {
                    currentPoemId = poemId;
                }
            };
            
            console.log('pgUp和pgDown按钮点击事件已添加');
        } else {
            console.error('元素未找到: ' + (!pgUpButton ? 'pgUpButton ' : '') + (!pgDownButton ? 'pgDownButton' : ''));
        }
    } catch (e) {
        console.error('添加上下页按钮点击事件时出错:', e);
    }
});