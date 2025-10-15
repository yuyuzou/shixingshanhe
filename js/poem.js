// 诗句管理模块
const poemManager = {
    // 所有诗句数据
    allPoems: [
        { text: "风急天高猿啸哀，渚清沙白鸟飞回。", opacity: 0.8, y: 15 },
        { text: "两岸猿声啼不住，轻舟已过万重山。", opacity: 0.8, y: -10 },
        { text: "峨眉山月半轮秋，影入平羌江水流。", opacity: 0.75, y: 5 },
        { text: "水光潋滟晴方好，山色空蒙雨亦奇。", opacity: 0.85, y: 8 },
        { text: "接天莲叶无穷碧，映日荷花别样红。", opacity: 0.9, y: -12 },
        { text: "月落乌啼霜满天，江枫渔火对愁眠。", opacity: 0.75, y: 12 },
        { text: "会当凌绝顶，一览众山小。", opacity: 0.8, y: 9 },
        { text: "黄河远上白云间，一片孤城万仞山。", opacity: 0.75, y: -7 },
        { text: "秦时明月汉时关，万里长征人未还。", opacity: 0.8, y: 6 },
        { text: "飞流直下三千尺，疑是银河落九天。", opacity: 0.85, y: 14 },
        { text: "昔人已乘黄鹤去，此地空余黄鹤楼。", opacity: 0.8, y: -8 },
        { text: "滕王高阁临江渚，佩玉鸣鸾罢歌舞。", opacity: 0.75, y: -6 },
        { text: "湖光秋月两相和，潭面无风镜未磨。", opacity: 0.8, y: 7 },
        { text: "北风卷地白草折，胡天八月即飞雪。", opacity: 0.7, y: 11 },
        { text: "停车坐爱枫林晚，霜叶红于二月花。", opacity: 0.8, y: -5 },
        { text: "桂林山水甲天下，玉碧罗青意可参。", opacity: 0.85, y: 6 },
        { text: "大漠沙如雪，燕山月似钩。", opacity: 0.75, y: -7 },
        { text: "天苍苍，野茫茫，风吹草低见牛羊。", opacity: 0.8, y: 8 }
    ],

    // 获取特定数量的随机诗句
    getRandomPoems: function(count) {
        const shuffled = [...this.allPoems].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    },

    // 获取所有诗句
    getAllPoems: function() {
        return [...this.allPoems];
    },

    // 按透明度过滤诗句
    getPoemsByOpacity: function(minOpacity, maxOpacity) {
        return this.allPoems.filter(poem => 
            poem.opacity >= minOpacity && poem.opacity <= maxOpacity
        );
    },

    // 渲染诗句到指定容器
    renderPoems: function(containerId, poems, templateId = 'poemTemplate') {
        const container = document.getElementById(containerId);
        const template = document.getElementById(templateId);
        
        if (!container || !template) {
            console.error('容器或模板不存在');
            return;
        }
        
        // 清空容器
        container.innerHTML = '';
        
        poems.forEach(item => {
            const clone = document.importNode(template.content, true);
            const line = clone.querySelector(".poem-line");
            line.textContent = item.text;
            line.style.opacity = item.opacity;
            line.style.transform = `translateY(${item.y}px)`;
            container.appendChild(clone);
        });
    },

    // 创建一个带滚动效果的诗句展示容器
    createScrollingPoems: function(containerId, poems = this.allPoems) {
        // 首先渲染诗句
        this.renderPoems(containerId, poems);
        
        // 添加滚动效果
        const container = document.getElementById(containerId);
        let scrollPosition = 0;
        const scrollSpeed = 0.5;
        
        function scrollPoems() {
            scrollPosition += scrollSpeed;
            if (scrollPosition > container.scrollHeight) {
                scrollPosition = 0;
            }
            container.scrollTop = scrollPosition;
            requestAnimationFrame(scrollPoems);
        }
        
        // 启动滚动动画
        scrollPoems();
    },
    
    // 创建首尾相连循环滚动的诗句展示
    createLoopScrollingPoems: function(containerId, poems = this.allPoems) {
        const container = document.getElementById(containerId);
        
        if (!container) {
            console.error('容器不存在');
            return;
        }
        
        // 清空容器
        container.innerHTML = '';
        
        // 创建展示容器
        const displayContainer = document.createElement('div');
        displayContainer.className = 'shiju-container';
        container.appendChild(displayContainer);
        
        // 创建所有诗句元素，不复制
        const spans = [];
        poems.forEach((item, index) => {
            const span = document.createElement('span');
            span.textContent = item.text;
            span.style.opacity = item.opacity;
            
            // 设置诗句高低错落 - 使用CSS变量替代直接设置transform
            span.style.setProperty('--vertical-offset', `${item.y}px`);
            
            // 为所有诗句添加id（从1开始）
            span.id = `poem-${index + 1}`;
            
            // 添加点击事件 - 当用户点击诗句时触发
            span.addEventListener('click', function() {
                try {
                    // 获取诗句的编号
                    const poemNum = index + 1;
                       
                    // 使用places.js中定义的全局函数查找诗句数据
                    // 彻底避免AJAX请求，解决CORS问题
                    const foundData = findPoemById(poemNum);
                       
                    // 在控制台打印结果 - 显示找到的数据
                        if (foundData) {
                            console.log(`点击了诗句 ${poemNum}:`);
                            // locationKey的含义：表示诗句关联的地点标识符（如'baidicheng'对应'白帝城'）
                            console.log('地点键名:', foundData.location);
                            // poem的含义：包含诗句所有详细信息的对象（标题、作者、全文、地点故事等）
                            console.log('诗句详细数据:', foundData.poemData);
                                
                            // 更新当前诗句ID，以便上下页按钮能从正确的ID开始切换
                            if (typeof window.setCurrentPoemId === 'function') {
                                window.setCurrentPoemId(poemNum);
                            }
                                
                            // 切换到详情页面
                            const poemPage = document.getElementById('poem-page');
                            const detailPage = document.getElementById('detail-page');
                            const poemDetail = document.querySelector('.poemDetail');
                            if (poemPage && detailPage) {
                                // 使用直接的display属性切换，确保页面正确显示/隐藏
                                poemPage.style.display = 'none';
                                poemPage.classList.remove('active');
                                detailPage.style.display = 'block';
                                detailPage.classList.add('active');
                        
                                // 初始化页面内容，确保初次加载时所有数据包括诗人图片都能显示
                                if (typeof window.updateDetailPage === 'function') {
                                    window.updateDetailPage(poemNum);
                                }
                        
                            // 重置图片显示状态和gujin文字
                            if (poemDetail) {
                                poemDetail.classList.remove('show-modern');
                            }
                            
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
                            }, 1000);
                            
                            // 更新poemDetail元素的内容
                            if (poemDetail) {
                                // 设置古代图片
                                const ancientImg = poemDetail.querySelector('.image-container .ancient-img');
                                if (ancientImg && foundData.poemData.images && foundData.poemData.images.ancient) {
                                    console.log('设置古代图片路径:', foundData.poemData.images.ancient);
                                    ancientImg.src = foundData.poemData.images.ancient;
                                    ancientImg.alt = `${foundData.poemData.location.name}古代图`;
                                } else {
                                    console.log('未找到古代图片数据');
                                }
                                
                                // 设置现代图片
                                const modernImg = poemDetail.querySelector('.image-container .modern-img');
                                if (modernImg && foundData.poemData.images && foundData.poemData.images.modern) {
                                    console.log('设置现代图片路径:', foundData.poemData.images.modern);
                                    modernImg.src = foundData.poemData.images.modern;
                                    modernImg.alt = `${foundData.poemData.location.name}现代图`;
                                } else {
                                    console.log('未找到现代图片数据');
                                }
                                   
                                // 设置完整诗句
                                const fullPoem = poemDetail.querySelector('.fullPoem');
                                if (fullPoem && foundData.poemData.fullText) {
                                    fullPoem.innerHTML = foundData.poemData.fullText;
                                }
                                   
                                // 设置标题
                                const title = poemDetail.querySelector('.title');
                                if (title && foundData.poemData.title) {
                                    // 先检查是否已有标题文本容器
                                    let titleTextContainer = title.querySelector('.title-text');
                                    if (!titleTextContainer) {
                                        // 创建一个新的容器来存放标题文本
                                        titleTextContainer = document.createElement('span');
                                        titleTextContainer.className = 'title-text';
                                        
                                        // 找到poemMusic元素
                                        const poemMusicElement = title.querySelector('.poemMusic');
                                        
                                        if (poemMusicElement) {
                                            // 如果存在poemMusic元素，将标题文本容器插入到它前面
                                            title.insertBefore(titleTextContainer, poemMusicElement);
                                        } else {
                                            // 否则直接添加到title末尾
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
                                   
                                // 设置地点名称
                                const placeName = poemDetail.querySelector('.placeName');
                                if (placeName && foundData.poemData.location && foundData.poemData.location.name) {
                                    placeName.textContent = `${foundData.poemData.location.name}`;
                                }
                                   
                                // 设置现代位置
                                const position = poemDetail.querySelector('.position');
                                if (position && foundData.poemData.location && foundData.poemData.location.modernName) {
                                    position.textContent = `位置：${foundData.poemData.location.modernName}`;
                                }
                                   
                                // 设置故事内容
                                const story = poemDetail.querySelector('.story');
                                if (story && foundData.poemData.location && foundData.poemData.location.story) {
                                    console.log('设置故事内容:', foundData.poemData.location.story);
                                    story.innerHTML = foundData.poemData.location.story; // 使用innerHTML以支持<br>标签
                                } else {
                                    console.log('未找到故事内容');
                                }
                            }
                        }
                    } else {
                        console.log(`未找到诗句 ${poemNum} 对应的详细数据`);
                    }
                } catch (error) {
                    console.error('处理点击事件时出错:', error);
                }
            });
            
            // 添加鼠标样式，提示可点击
            // span.style.cursor = 'pointer';
            
            spans.push(span);
            displayContainer.appendChild(span);
            
            // 移除可能导致滚动卡死的JS鼠标事件处理
            // 悬浮效果已在CSS中通过.shiju span:hover定义
        });
        
        // 移除可能导致滚动卡死的容器鼠标事件
        // 使用CSS的:hover效果统一控制交互体验
    }
};

// 导出模块以便在其他文件中使用
if (typeof module !== 'undefined') {
    module.exports = poemManager;
}