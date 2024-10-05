<template>
  <div class="container">
    <!-- 時間軸標題及搜尋欄位 -->
    <header id="header">
      <h1>NEO Close-Approach Events</h1>
      <div id="search-container">
        <input
          type="text"
          id="search-box"
          placeholder="Search for objects, events..."
          v-model="searchQuery"
          @input="onSearch"
        />
      </div>
    </header>

       <!-- 事件卡片 -->
       <div class="event-details">
      <div class="event-card img-card" id="event-image">
        <img :src="selectedEvent?.imageUrl || ''" alt="Event Image" />
      </div>
      <div class="event-card">
        <div id="event-content">
          <h2>{{ selectedEvent?.des || 'No Data' }}</h2>
          <h3>{{ selectedEvent?.cd || 'No Data' }}</h3>
          <p>{{ selectedEvent?.description || 'No description available' }}</p>
        </div>
        <div id="event-table">
          <h3>Close-Approach Data</h3>
          <table v-if="selectedEvent">
            <tbody>
              <tr v-for="field in otherFields" :key="field">
                <th>{{ field }}</th>
                <td>{{ selectedEvent[field] }}</td>
              </tr>
            </tbody>
          </table>
          <p v-else>No data for this event.</p>
        </div>
        <div id="event-links">
          <a
            v-for="link in selectedEvent?.links || []"
            :key="link.text"
            :href="link.url"
            class="event-link"
            target="_blank"
            >{{ link.text }}</a
          >
        </div>
      </div>
    </div>

    <!-- 時間軸結構 -->
    <div id="timeline-container" @wheel="onWheelScroll" @mousedown="onMouseDown">
      <div id="timeline" :style="{ transform: `translateX(${timelineOffset}px)` }">
        <div
          v-for="(date, index) in filteredTimelineDays"
          :key="index"
          class="date-marker"
          :class="{ event: date.hasEvent }"
          :data-date="date.title"
          @click="onDateSelect(date.date)"
          @mouseover="showEvent(date)"
        ></div>
      </div>
    </div>

    <!-- 時間軸控制按鈕 -->
    <div id="timeline-controls">
      <button class="timeline-button" @click="prevMonth">&lt; Previous</button>
      <button id="today-button" @click="resetToToday">Today</button>
      <button class="timeline-button" @click="nextMonth">Next &gt;</button>
    </div>

    <!-- 當前年份顯示 -->
    <div id="year-display">{{ currentDate.getFullYear() }}</div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { fetchCADApi } from '@/utils/APIRequests/apis/event.js';

const searchQuery = ref('');
const neoObjects = ref([]);
const neoDataByDate = ref({});
const selectedDate = ref(new Date());
const selectedEvent = ref(null);
const currentDate = ref(new Date());
const timelineDays = ref([]);
const fields = ref([]);
const timelineOffset = ref(0); // 追蹤時間軸偏移量
const isDragging = ref(false); // 追蹤是否正在拖曳
let startX = 0; // 滑鼠起始位置
let initialTimelineOffset = 0; 

// 根據搜尋字串動態過濾 timelineDays 資料
const filteredTimelineDays = computed(() => {
  return timelineDays.value.filter(date =>
    date.title.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

// 處理滑鼠滾輪滾動
const onWheelScroll = (event) => {
  event.preventDefault();
  event.stopPropagation();
  timelineOffset.value -= event.deltaY; // 直接使用 deltaY 調整時間軸偏移
};

// 處理搜尋輸入框變更
const onSearch = () => {
  console.log('Search for:', searchQuery.value);
};

// 處理滑鼠拖曳開始
const onMouseDown = (event) => {
  isDragging.value = true;
  startX = event.clientX;
  initialTimelineOffset = timelineOffset.value;
  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);
};


// 處理滑鼠移動
const onMouseMove = (event) => {
  if (!isDragging.value) return;
  const moveX = event.clientX - startX;
  timelineOffset.value += moveX;
  startX = event.clientX;
};


// 處理滑鼠放開
const onMouseUp = () => {
  isDragging.value = false;
  const totalMovement = timelineOffset.value - initialTimelineOffset;
  const daysDiff = Math.round(totalMovement / 40); // 假設每40像素代表一天
  currentDate.value = new Date(currentDate.value.setDate(currentDate.value.getDate() - daysDiff));

  // 重置時間軸偏移量並重新生成時間軸
  timelineOffset.value = 0;
  generateTimeline(); 
  document.removeEventListener('mousemove', onMouseMove);
  document.removeEventListener('mouseup', onMouseUp);
};


// 清除事件監聽器（當組件卸載時）
onBeforeUnmount(() => {
  document.removeEventListener('mousemove', onMouseMove);
  document.removeEventListener('mouseup', onMouseUp);
});

// 解析日期字串，格式為 'YYYY-MMM-DD'，轉換為 'YYYY-MM-DD'
const parseDate = (dateStr) => {
  const monthMap = {
    Jan: '01',
    Feb: '02',
    Mar: '03',
    Apr: '04',
    May: '05',
    Jun: '06',
    Jul: '07',
    Aug: '08',
    Sep: '09',
    Oct: '10',
    Nov: '11',
    Dec: '12',
  };
  const [year, monthName, day] = dateStr.split('-');
  const month = monthMap[monthName];
  return `${year}-${month}-${day}`;
};

// 處理資料
const processData = (NEO_data) => {
  const fieldsArray = NEO_data.fields;
  fields.value = fieldsArray;
  const data = NEO_data.data;

  const objects = data.map((item) => {
    const obj = {};
    for (let i = 0; i < fieldsArray.length; i++) {
      obj[fieldsArray[i]] = item[i];
    }
    obj.description = 'Just some NEO.';
    obj.links = [
      { text: 'NASA NEO Database', url: 'https://cneos.jpl.nasa.gov/' },
      { text: 'Asteroid Watch', url: 'https://www.nasa.gov/asteroid-and-comet-watch/' },
    ];
    return obj;
  });

  neoObjects.value = objects;

  // 按日期分組
  const dataByDate = {};
  objects.forEach((obj) => {
    const dateStr = obj.cd.split(' ')[0];
    const formattedDate = parseDate(dateStr);
    if (!dataByDate[formattedDate]) {
      dataByDate[formattedDate] = [];
    }
    dataByDate[formattedDate].push(obj);
  });

  neoDataByDate.value = dataByDate;
};


const generateTimeline = () => {
  timelineDays.value = [];
  for (let i = -100; i <= 100; i++) {
    const date = new Date(currentDate.value);
    date.setDate(currentDate.value.getDate() + i);
    
    // 格式化日期，只顯示「月-日」
    const formattedDate = date.toISOString().split('T')[0].slice(5); // "MM-DD"
    
    // 根據日期獲取當天的事件數量
    const eventsForDate = neoDataByDate.value[formattedDate] || [];
    const eventCount = eventsForDate.length;

    // 根據事件數量決定顏色
    let markerColor = '';
    if (eventCount > 5) {
      markerColor = 'red';
    } else if (eventCount > 0) {
      markerColor = 'yellow';
    }

    timelineDays.value.push({
      date,
      title: formattedDate, // 只顯示月和日
      hasEvent: eventCount > 0,
      eventCount,
      markerColor, // 紀錄顏色，稍後在模板中使用
    });
  }
};




const showEvent = (date) => {
  const formattedDate = date.date.toISOString().split('T')[0];
  selectedEvent.value = neoDataByDate.value[formattedDate]?.[0] || null;
};

// 選擇日期
const onDateSelect = (date) => {
  selectedDate.value = date;
  showEvent({ date });
};

// 切換至上個月
const prevMonth = () => {
  currentDate.value.setMonth(currentDate.value.getMonth() - 1);
  generateTimeline();
};

// 切換至下個月
const nextMonth = () => {
  currentDate.value.setMonth(currentDate.value.getMonth() + 1);
  generateTimeline();
};

// 重置到今天
const resetToToday = () => {
  currentDate.value = new Date();
  generateTimeline();
};




// 當組件掛載時取得資料並初始化時間軸
onMounted(async () => {
  try {
    const NEO_data = await fetchCADApi('2024-10-10', '2024-10-30', 0.2);
    processData(NEO_data.data);
    console.log('NEO data:', NEO_data.data);
    generateTimeline();
  } catch (error) {
    console.error('Error fetching NEO data:', error);
  }
});

// 根據資料動態計算欄位
const otherFields = computed(() => {
  return fields.value ? fields.value.filter((field) => !['des', 'cd', 'description', 'links'].includes(field)) : [];
});
</script>

<style scoped>
#timeline-container {
  position: relative;
  height: 120px;
  overflow: hidden;
  cursor: grab; /* 增加手型游標 */
}

#timeline-container:active {
  cursor: grabbing; /* 拖曳時游標變成抓取中狀態 */
}

#timeline {
  position: absolute;
  bottom: 20px;
  left: 0;
  width: 100%;
  height: 80px;
  display: flex;
  align-items: center;
  transition: transform 0.5s cubic-bezier(0.25, 0.1, 0.25, 1);
}

.date-marker {
  min-width: 2px;
  height: 20px;
  background: #ffffff;
  margin: 0 40px;
  position: relative;
  cursor: pointer;
  transition: all 0.3s ease;
}

.date-marker::before {
  content: attr(data-date);
  position: absolute;
  bottom: -25px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 18px;
  white-space: nowrap;
  opacity: 0.7;
  transition: opacity 0.3s ease;
}

.date-marker.event {
  background: #ffd700;
}

.date-marker:hover {
  height: 30px;
  transform: scaleY(1.2);
}

.date-marker:hover::before {
  opacity: 1;
}

#timeline-controls {
  display: flex;
  justify-content: center;
  margin-top: 10px;
  gap: 20px;
}

.timeline-button,
#today-button {
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: #ffffff;
  font-size: 16px;
  cursor: pointer;
  padding: 8px 15px;
  transition: all 0.3s ease;
}

.timeline-button:hover,
#today-button:hover {
  background: rgba(255, 255, 255, 0.2);
}

#year-display {
  position: absolute;
  bottom: 20px;
  left: 20px;
  font-size: 28px;
  opacity: 0.7;
}

    #event-display {
            display: none;
            flex-grow: 1;
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            gap: 20px;
            padding: 20px 0;
            height: 150px;
        }

    .event-card {
        height: 100%;
        overflow-y: auto;
        background: rgba(255, 255, 255, 0.05);
        backdrop-filter: blur(10px);
        border-radius: 15px;
        padding: 20px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        transition: all 0.3s ease;
    }

    #event-image {
        height: 100%;
        width: 29%;
    }

    #event-image img {
        width: 100%;
        height: auto;
        object-fit: cover;
    }

    #event-text {
        height: 100%;
        width: 69%;
        max-height: 60vh;
        overflow-y: auto;
    }

    .event-card h2 {
        font-size: 1.8em;
        margin-top: 0;
        color: #a0a0ff;
    }

    .event-card h3 {
        font-size: 1.4em;
        margin-top: 15px;
        color: #a0a0ff;
    }

    .event-card p {
        font-size: 1em;
        line-height: 1.6;
    }
</style>
