<!-- @/components/NEOIntroduction.vue -->`
<template>
  <div class="container">
    <div class="text-center">
      <!-- <h2>NEO Lookup</h2> -->
    </div>
    <div class="container d-flex flex-wrap justify-center event-container">
      <div class="event-selector" style="flex: 1; ">
        <h3>Select an Event</h3>
        <v-card class="mx-auto" max-width="300">
          <v-list>
            <template v-if="eventList.length">
              <v-list-item-group v-model="selectedEvent">
                <v-list-item
                  v-for="item in eventList"
                  :key="item.id"
                  :value="item.id"
                  @click="selectEvent(item)"
                >
                  <v-list-item-title>{{ item.name }}</v-list-item-title>
                </v-list-item>
              </v-list-item-group>
            </template>
            <template v-else>
              <v-list-item disabled>
                <v-list-item-title>No Events</v-list-item-title>
              </v-list-item>
            </template>
          </v-list>
        </v-card>
      </div>

      <div class="event-details d-flex flex-wrap" style="flex: 5; margin: 30px;">
        <div class="event-card d-flex flex-column" style="flex: 3; height: 100%; max-height: 100%;">
          <h2>Distance Comparison</h2>
          <div class="canvas-container" style="flex-grow: 1; overflow: hidden;">
            <div>
              <h4>Earth to Moon ( &#x2248 0.00257 AU )</h4>
              <canvas class="comparison-canvas" ref="comparisonCanvas1" width="600" height="100"></canvas>
            </div>
            <div>
              <h4>Earth to NEO</h4>
              <canvas class="comparison-canvas" ref="comparisonCanvas2" width="600" height="100"></canvas>
            </div>
            <div>
              <h4>1,000,000 km</h4>
              <canvas class="comparison-canvas" ref="comparisonCanvas3" width="600" height="100"></canvas>
            </div>
          </div>
        </div>
        <div class="event-card" style="flex: 2;">
          <div id="event-content">
              <h2>
                {{ selectedEvent?.des  || 'No Data' }} <span class="mdi mdi-creation-outline"></span> </h2>
              <h3>{{ selectedEvent?.cd || 'No Data' }}</h3>
          </div>
          <div id="event-table" class="scrollable">
            <h3>Close-Approach Data</h3>
            <table v-if="selectedEvent !== null">
                <thead>
                  <th>Field</th>
                  <th>Value</th>
                  <th>Unit</th>
                </thead>
                <tbody>
                    <tr v-for="field in otherFields" :key="field">
                    <th>{{ field }}</th>
                    <td>
                      <span v-if="field === 't_sigma_f'">
                          {{ formatFieldTime(selectedEvent[field]) }} <!-- 调用 formatTime 方法 -->
                      </span>
                      <span v-else>
                          {{ parseFloat(selectedEvent[field]).toFixed(6) }}
                      </span>
                    </td>
                    <td>{{ units[field] }}</td>
                    </tr>
                </tbody>
            </table>
            <p v-else>No data for this event.</p>
          </div>
          <div v-if="selectedEvent?.links && selectedEvent?.links.length > 0" id="event-links">
            <button
              v-for="link in selectedEvent.links"
              :key="link.text"
              class="link-button"
              @click="openLink(link.url)"
            >
              {{ link.text }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <v-dialog v-model="isCalendarOpen" width="350">
      <v-date-picker
        :model-value="currentDate"
        @update:modelValue="onDateSelect"
        color="black"
        font-size="20px"
      />
    </v-dialog>
    
  <!-- 時間軸結構 -->
  <div id="timeline-container" @wheel="onWheelScroll" @mousedown="onMouseDown">
      <div id="timeline" :style="{ width: `${timelineWidth}px`, transform: `translateX(${timelineOffset}px)` }">
        <div
          v-for="(date, index) in filteredTimelineDays"
          :key="index"
          class="date-marker"
          :class="{ 'event yellow': date.eventCount > 0 && date.eventCount <= 5, 'event red': date.eventCount > 5 }"
          :data-date="date.title"
          @click="onDateSelect(date.date)"
          @mouseover="showEvent(date)"
        >
        </div>
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
const fields = ref([]);
const selectedDate = ref(new Date());
const dataFetched = ref(false);
const eventList = ref([]);
const selectedEvent = ref(null);
const currentDate = ref(new Date());
const timelineDays = ref([]);
const isCalendarOpen = ref(false);
const neo = ref({});
const timelineOffset = ref(0);
const isDragging = ref(false); 
let startX = 0; // 滑鼠起始位置
let initialTimelineOffset = 0; 
const comparisonCanvas1 = ref(null);
const comparisonCanvas2 = ref(null);
const comparisonCanvas3 = ref(null);
// const comparisonCanvas4 = ref(null);

const markerWidth = 82;

const timelineWidth = computed(() => {
  return timelineDays.value.length * markerWidth;
});


// 根據搜尋字串動態過濾 timelineDays 資料
const filteredTimelineDays = computed(() => {
  return timelineDays.value.filter(date =>
    date.title.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

// 處理滑鼠滾輪滾動
const onWheelScroll = (event) => {
  event.preventDefault();
  const delta = Math.sign(event.deltaY);
  currentDate.value.setDate(currentDate.value.getDate() + delta);
  generateTimeline();
  scrollToCentralDate(currentDate.value);
  updateEventList();
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
  const daysDiff = Math.round(-totalMovement / markerWidth); 

  currentDate.value.setDate(currentDate.value.getDate() + daysDiff);
  generateTimeline();
  scrollToCentralDate(currentDate.value);
  updateEventList();

  document.removeEventListener('mousemove', onMouseMove);
  document.removeEventListener('mouseup', onMouseUp);
};



// 清除事件監聽器（當組件卸載時）
onBeforeUnmount(() => {
  document.removeEventListener('mousemove', onMouseMove);
  document.removeEventListener('mouseup', onMouseUp);
});


// 月份映射表
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

const units = {
  orbit_id: '', 
  jd: 'JD Ephemeris Time',
  dist: 'AU',
  dist_min: 'AU',
  dist_max: 'AU',
  v_rel: 'km/s',
  v_inf: 'km/s', 
  t_sigma_f: 'days hours minutes',
  h: 'mag',
}

// 解析日期字串，格式為 'YYYY-MMM-DD'，轉換為 'YYYY-MM-DD'
const parseDate = (dateStr) => {
  const [year, monthName, day] = dateStr.split('-');
  const month = monthMap[monthName];
  return `${year}-${month}-${day}`;
};


const processData = (NEO_data) => {
  console.log("Received NEO Data: ", NEO_data);
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
  dataFetched.value = true;
};


const generateTimeline = () => {
  timelineDays.value = [];
  const daysBefore = 15;
  const daysAfter = 15;

  for (let i = -daysBefore; i <= daysAfter; i++) {
    const date = new Date(currentDate.value);
    date.setDate(currentDate.value.getDate() + i);

    const formattedDate = date.toISOString().split('T')[0];
    const eventsForDate = neoDataByDate.value[formattedDate] || [];
    const eventCount = eventsForDate.length;

    timelineDays.value.push({
      date,
      title: formattedDate.slice(5), 
      hasEvent: eventCount > 0,
      eventCount,
    });
  }
};

// 選擇事件
const selectEvent = (item) => {
  const event = neoObjects.value.find((selectedEvent) => selectedEvent.des === item.name);

  if (event) {
    selectedEvent.value = event;
    drawEventComparison(event.dist);
  }
};


const formatDateToDataFormat = (dateObj) => {
  const year = dateObj.getFullYear();
  const monthNumber = dateObj.getMonth() + 1;
  const monthName = Object.keys(monthMap).find(
    (key) => parseInt(monthMap[key]) === monthNumber
  );
  const day = String(dateObj.getDate()).padStart(2, '0');
  return `${year}-${monthName}-${day}`;
};

const otherFields = computed(() => {
  return fields.value
    ? fields.value.filter(
        (field) => !['des', 'cd', 'description', 'links'].includes(field)
      )
    : [];
});


// 更新事件列表，只包含當天的資料
const updateEventList = () => {
  const formattedDate = parseDate(formatDateToDataFormat(selectedDate.value));
  console.log('Formatted date:', formattedDate);
  eventList.value = neoDataByDate.value[formattedDate]?.map((item, index) => ({
    id: index,
    name: item.des,
  })) || [];
};

// 切換至上個月
const prevMonth = () => {
  currentDate.value.setMonth(currentDate.value.getMonth() - 1);
  generateTimeline();
  updateEventList();
};

// 切換至下個月
const nextMonth = () => {
  currentDate.value.setMonth(currentDate.value.getMonth() + 1);
  generateTimeline();
  updateEventList();
};

// 重置到今天
const resetToToday = () => {
  currentDate.value = new Date();
  generateTimeline();
  scrollToCentralDate(currentDate.value); 
  updateEventList();
};

// 開啟日曆選擇
const openCalendar = () => {
  isCalendarOpen.value = true;
};

// 選擇日期
const onDateSelect = (date) => {
  currentDate.value = date;
  selectedDate.value = date;

  scrollToCentralDate(date);
  updateEventList();
};


onMounted(async () => {
  try {
    const NEO_data = await fetchCADApi('2020-10-10', '2030-10-10', 0.05);
    processData(NEO_data.data);
    generateTimeline();
    scrollToCentralDate(currentDate.value);
  } catch (error) {
    console.error('Error fetching NEO data:', error);
  }
});
const showEvent = (date) => {
  const formattedDate = date.date.toISOString().split('T')[0];
  selectedEvent.value = neoDataByDate.value[formattedDate]?.[0] || null;
};

window.addEventListener('resize', () => {
  scrollToCentralDate(currentDate.value);
});


const openLink = (url) => {
  if (url) {
    window.open(url, '_blank');
  } else {
    console.error('URL is undefined');
  }
};

const formatFieldTime = (timeString) => {
  let days = 0;
  let hours = 0;
  let minutes = 0;
  
  if (timeString.includes('_')) {
      const [dayPart, hourMinutePart] = timeString.split('_');
      days = parseInt(dayPart);

      const [hourPart, minutePart] = hourMinutePart.split(':');
      hours = parseInt(hourPart);
      minutes = parseInt(minutePart);
  } else {
      const [hourPart, minutePart] = timeString.split(':');
      hours = parseInt(hourPart);
      minutes = parseInt(minutePart);
  }

  // 返回格式化字符串
  return `${days} d ${hours} h ${minutes} m`;
};


const scrollToCentralDate = (date) => {
  const container = document.getElementById('timeline-container');
  const index = timelineDays.value.findIndex(d => d.date.toISOString() === date.toISOString());

  if (index >= 0) {
    const markerOffset = index * markerWidth;
    const containerWidth = container.offsetWidth;
    let scrollToPosition = markerOffset - (containerWidth / 2) + (markerWidth / 2);

    // 防止滚动超出左边界
    if (scrollToPosition < 0) {
      scrollToPosition = 0;
    }

    // 防止滚动超出右边界
    const maxScrollPosition = (timelineDays.value.length * markerWidth) - containerWidth;
    if (scrollToPosition > maxScrollPosition) {
      scrollToPosition = maxScrollPosition;
    }

    timelineOffset.value = -scrollToPosition;
  }
};

const km = 1000000/149597871
const drawEventComparison = (distance) => {
  // 1 AU = 149597871 km
  const divideBy = 0.05;

  const canvas1 = comparisonCanvas1.value;
  const ctx1 = canvas1.getContext('2d');
  drawComparisonLine(ctx1,  0.00257/divideBy);

  const canvas2 = comparisonCanvas2.value;
  const ctx2 = canvas2.getContext('2d');
  drawComparisonLine(ctx2, distance/divideBy);

  // const canvas3 = comparisonCanvas3.value;
  // const ctx3 = canvas3.getContext('2d');
  // drawComparisonLine(ctx3, 'Earth to Sun (1AU)',  1);
  const canvas3 = comparisonCanvas3.value;
  const ctx3 = canvas3.getContext('2d');
  drawComparisonLine(ctx3, km/divideBy);
}


const drawComparisonLine = (ctx, length) => {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  const startX = 5;
  const startY = 40;
  const offsetY = 30;
  const scale = ctx.canvas.width - 10

  ctx.beginPath();
  ctx.moveTo(startX, startY);
  ctx.lineTo(startX + length*scale, startY);
  ctx.strokeStyle = '#fca7a7';
  ctx.lineWidth = 5;
  ctx.stroke();
  ctx.fillStyle = "white";
  // ctx.fillText(label, startX, startY - 20);
};


</script>

<style scoped>


.date-marker {
  min-width: 2px;
  height: 20px;
  background: var(--marker-color, #ffffff);
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

.date-marker.event.yellow {
  background: yellow;
}

.date-marker.event.red {
  background: red;
}


.date-marker:hover {
  height: 30px;
  transform: scaleY(1.2);
}

.date-marker:hover::before {
  opacity: 1;
}

#year-display {
        position: absolute;
        bottom: 40px;
        left: 120px;
        font-size: 28px;
        opacity: 0.7;
    }


#timeline-controls {
  display: flex;
  justify-content: center;
  margin-top: 10px;
  gap: 20px;
}


#timeline-container {
  position: relative;
  height: 120px;
  overflow: hidden;
}



#timeline {
  position: absolute;
  bottom: 20px;
  left: 0;
  width: 100%;
  height: 80px;
  display: flex;
  align-items: center;
  transition: transform 1s cubic-bezier(0.25, 1, 0.5, 1); 
}

.container {
  margin: 20px 5%;
}

.event-selector {
  justify-content: center;
  align-items: center;
  text-align: center;
  font: 30px normal;
}

.event-details {
  display: flex;
  justify-content: space-between;
  height: 550px;
  gap: 20px;
}

.event-card {
  flex: 1;
  min-width: 300px;
  height: 100%;
  background: rgba(68, 68, 68, 0.5);
  padding: 30px 40px;
  border-radius: 20px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.canvas-container {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  height: 100%;
}

.comparison-canvas {
  flex: 1;
  width: 100%;
  height: auto;
  object-fit: contain;
}

.scrollable {
    max-height: 70%; /* Adjust height as needed */
    overflow-y: auto; /* Enable vertical scrolling */
    scrollbar-width: thin; /* For Firefox */
    scrollbar-color: gray transparent; /* For Firefox */
}

/* For Chrome, Safari, and Edge */
.scrollable::-webkit-scrollbar {
    width: 8px; /* Width of the scrollbar */
}

.scrollable::-webkit-scrollbar-track {
    background: transparent; /* Background of the scrollbar track */
}

.scrollable::-webkit-scrollbar-thumb {
    background-color: gray; /* Color of the scrollbar thumb */
    border-radius: 10px; /* Rounded corners for the scrollbar thumb */
}

/* Optional: Add hover effect for scrollbar thumb */
.scrollable::-webkit-scrollbar-thumb:hover {
    background-color: darkgray; /* Change color on hover */
}

#event-content {
  font: 20px blod;
  line-height: 1.8;
}

#event-content .h2 .h3{
  color: rgb(255, 255, 255);
}

#event-content .p{
  color: rgb(100, 100, 100);
}

#event-table {
  line-height: 1.8;
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
}

#event-table th, #event-table td {
    padding: 10px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    text-align: left;
}

#event-table th {
    background-color: rgba(255, 255, 255, 0.05);
}

.link-button {
  padding: 10px 15px;
  margin: 5px;
  border: none;
  background-color: #8b8b8b; /* Bootstrap primary color */
  color: white;
  cursor: pointer;
  border-radius: 5px;
  font-size: 16px;
}

.link-button:hover {
  background-color: #0056b3; /* Darker shade for hover effect */
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

.calendar-btn {
  height: 80px;
  width: 80px;
  background-color: transparent; 
  border: 2px solid white;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: black;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

/* .today-btn {
  background-color: white;
  border: 2px solid white;
  color: black;
  padding: 10px 20px;
  font-size: 20px;
  cursor: pointer;
  border-radius: 20px;
  transition: background-color 0.3s ease;
} */

.today-btn:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

.calendar-btn:hover {
  background-color: rgba(255, 255, 255, 0.2);
}


.year-label {
  display: flex;
  justify-content: right;
  margin: 0px 5%;
  padding-left: 10px;
  margin-bottom: 20px;
  font-size: 24px;
  font-weight: bold;
}

.timeline-btn {
  display: flex;
  flex-direction: row; 
  justify-content: center;
  text-align: center;
  align-items: center;
  background-color: transparent;
  font: 30px bold;
  width: 150px;
}

.timeline {
  display: flex;
  justify-content: space-between;
  margin: 0px 5%;
}

/* .simple-line {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  width: 100%;
  height: 2px;
  background-color: #ffffff;
  z-index: 1;
  transform: translateY(-50%);
} */

.neo-timeline .v-timeline-item {
  flex: 1;
  text-align: center;
}


.v-list {
  max-height: 500px;
  overflow-y: auto;
}

/* 控制垂直滾動條樣式 */
.v-list::-webkit-scrollbar {
  width: 8px;
}



.v-list::-webkit-scrollbar-thumb {
  background-color: #888;  
  border-radius: 10px;   
}

.v-list::-webkit-scrollbar-thumb:hover {
  background-color: #555; 
}

</style>