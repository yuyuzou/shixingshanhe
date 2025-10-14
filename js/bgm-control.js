// BGM控制逻辑
document.addEventListener('DOMContentLoaded', function() {
  const bgm = document.getElementById('bgm');
  const bgmControl = document.getElementById('bgmControl');
  const bgmOn = document.querySelector('.BGMon');
  const bgmOff = document.querySelector('.BGMoff');
  
  // 设置音量为30%
  bgm.volume = 0.3;
  
  // 点击切换播放/暂停状态
  bgmControl.addEventListener('click', function() {
    if (bgm.paused) {
      // 播放BGM
      bgm.play().then(() => {
        console.log('BGM播放成功');
        // 添加旋转动画到BGMon图标
        bgmOn.classList.add('rotating');
        bgmOn.style.display = 'block';
        bgmOff.style.display = 'none';
      }).catch(error => {
        console.error('BGM播放失败:', error);
        alert('BGM播放失败，请检查浏览器音频设置和网络连接');
      });
    } else {
      // 暂停BGM
      bgm.pause();
      console.log('BGM已暂停');
      // 移除旋转动画
      bgmOn.classList.remove('rotating');
      bgmOn.style.display = 'none';
      bgmOff.style.display = 'block';
    }
  });
});