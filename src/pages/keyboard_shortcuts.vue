<template>
    <div class="keyboard-shortcuts-container">
      <div class="keyboard-shortcuts">
        <h2>Keyboard Shortcuts</h2>
        <div class="shortcuts-list">
          <ul class="column">
            <li><strong>ArrowUp:</strong> Move camera forward</li>
            <li><strong>ArrowDown:</strong> Move camera backward</li>
            <li><strong>ArrowLeft:</strong> Rotate camera counter-clockwise</li>
            <li><strong>ArrowRight:</strong> Rotate camera clockwise</li>
            <li><strong>L:</strong> Toggle label visibility</li>
            <li><strong>P:</strong> Toggle play/pause animation</li>
          </ul>
          <ul class="column">
            <li><strong>J:</strong> Decrease playback speed (0.1x)</li>
            <li><strong>K:</strong> Increase playback speed (0.1x)</li>
            <li><strong>H:</strong> Jump to today's date</li>
            <li><strong>G:</strong> Jump to J2000 date</li>
            <li><strong>T:</strong> Toggle orbit tracing</li>
            <li><strong>F:</strong> Toggle forward/backward animation</li>
          </ul>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  </script>
  
  <style scoped>
  .keyboard-shortcuts-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;  /* 讓容器占滿整個視窗 */
    background-color: rgba(0, 0, 0, 0.9); /* 深色背景 */
    z-index: 100;
  }
  
  .keyboard-shortcuts {
    padding: 10px;
    max-width: 90%;
    background-color: rgba(50, 50, 50, 0.95);  /* 深色背景 */
    border-radius: 10px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.5);  /* 添加陰影效果 */
    color: white;  /* 白色字體 */
  }
  
  h2 {
    text-align: center;
    color: white;
    margin-bottom: 20px;
    font-family: 'Arial', sans-serif;
  }
  
  /* 清單容器的佈局 */
  .shortcuts-list {
    display: flex;
    justify-content: space-between;
  }
  
  /* 每一欄的樣式 */
  .column {
    list-style: none;
    padding: 0;
    margin: 0;
    width: 45%;
  }
  
  /* 清單項目樣式 */
  li {
    margin-bottom: 15px;
    font-size: 16px;
    font-family: 'Arial', sans-serif;
  }
  
  li strong {
    color: #4CAF50; /* 給快捷鍵加上不同顏色 */
  }
  </style>
  