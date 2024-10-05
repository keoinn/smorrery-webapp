<!-- src/components/NEOIntroduction.vue -->
<!-- src/components/NEOIntroduction.vue -->
<template>
  <div class="container">
    <div class="text-center">
      <!-- <h2>NEO Lookup</h2> -->
    </div>
    <div class="container d-flex flex-wrap justify-center event-container">
      <div class="event-selector" style="flex: 1;">
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

      <div class="event-details d-flex flex-wrap" style="flex: 3; margin-left: 20px;">
        <div class="event-card" style="flex: 1; margin-right: 20px;">
          <!-- 這裡可以添加其他的內容或功能 -->
        </div>
        <div class="event-card" style="flex: 2;">
          <div id="event-content">
              <h2>{{ neo.des || 'No Data' }}</h2>
              <h3>{{ neo.cd || 'No Data' }}</h3>
              <p>{{ neo.description || 'No description available' }}</p>
          </div>
          <div id="event-table">
            <h3>Close-Approach Data</h3>
            <table v-if="selectedEvent !== null">
                <tbody>
                    <tr v-for="field in otherFields" :key="field">
                    <th>{{ field }}</th>
                    <td>{{ neo[field] }}</td>
                    </tr>
                </tbody>
            </table>
            <p v-else>No data for this event.</p>
          </div>
          <div id="event-links">
                <a
                v-for="link in neo.links || []"
                :key="link.text"
                :href="link.url"
                class="event-link"
                target="_blank"
                >{{ link.text }}</a
                >
          </div>
        </div>
      </div>
    </div>

    <div class="timeline">
      <v-timeline class="neo-timeline" direction="horizontal" line-thickness="5" line-color="rgba(255, 255, 255, 0.3)" size="small" hide-opposite="true">
        <v-timeline-item
          v-for="day in timelineDays"
          :key="day.date"
          :title="day.title"
          @click="onDateSelect(day.date)"
        >
          <template v-slot:default>
            <div>{{ day.title }}</div>
          </template>
        </v-timeline-item>
      </v-timeline>
    </div>
    <div class="timeline-controls d-flex flex-column align-items-center mb-4">
      <div class="d-flex justify-center align-items-center mb-2">
        <button class="timeline-btn" @click="prevMonth">
          <span class="mdi mdi-menu-left" style="font-size: 70px; color: white;"></span> Previous
        </button>

        <button class="calendar-btn mx-10" @click="openCalendar">
          <span class="mdi mdi-calendar-month-outline" style="font-size: 40px; color: white;"></span>
        </button>

        <button class="timeline-btn" @click="nextMonth">
          Next <span class="mdi mdi-menu-right" style="font-size: 70px; color: white;"></span>
        </button>
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
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { fetchCADApi } from '@/utils/APIRequests/apis/event.js';

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

// 解析日期字串，格式為 'YYYY-MMM-DD'，轉換為 'YYYY-MM-DD'
const parseDate = (dateStr) => {
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
    const dateStr = obj.cd.split(' ')[0]; // 取得日期部分，例如 '2024-Oct-10'
    const formattedDate = parseDate(dateStr);
    if (!dataByDate[formattedDate]) {
      dataByDate[formattedDate] = [];
    }
    dataByDate[formattedDate].push(obj);
  });

  neoDataByDate.value = dataByDate;
  dataFetched.value = true;
};

// 選擇事件
const selectEvent = (item) => {
  selectedEvent.value = item.id;
  const event = neoObjects.value.find((neo) => neo.cd === item.name.split(' for ')[1]);
  if (event) {
    neo.value = event;
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

// 當前選定日期的 NEO 資料
const neosForSelectedDate = computed(() => {
  if (!dataFetched.value || !selectedDate.value) return [];
  const formattedDate = parseDate(formatDateToDataFormat(selectedDate.value));
  return neoDataByDate.value[formattedDate] || [];
});

// 生成時間軸
const generateTimeline = () => {
  timelineDays.value = [];
  for (let i = -10; i <= 10; i++) {
    const date = new Date(currentDate.value);
    date.setDate(currentDate.value.getDate() + i);
    const dayTitle = `${Object.keys(monthMap).find(
      (key) => monthMap[key] === String(date.getMonth() + 1).padStart(2, '0')
    )} ${date.getDate()}`;
    timelineDays.value.push({ date, title: dayTitle });
  }
};

// 更新事件列表，只包含當天的資料
const updateEventList = () => {
  const formattedDate = parseDate(formatDateToDataFormat(selectedDate.value));
  eventList.value = neoDataByDate.value[formattedDate]?.map((item, index) => ({
    id: index,
    name: `Event for ${item.cd}`,
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
  isCalendarOpen.value = false;
  generateTimeline();
  updateEventList();
};

// 當組件掛載時取得資料並初始化時間軸
onMounted(async () => {
  generateTimeline();
  try {
    const NEO_data = await fetchCADApi('2024-10-10', '2024-10-20', 0.2);
    processData(NEO_data.data);
    updateEventList();
  } catch (error) {
    console.error('Error fetching NEO data:', error);
    dataFetched.value = true; // 即使出錯也需要設置為 true，以防止載入狀態一直存在
  }
});
</script>

<style scoped>
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
  gap: 30px;
}

.event-card {
  flex: 1;
  min-width: 300px;
  height: 100%;
  background: rgba(68, 68, 68, 0.5);
  padding: 15px;
  border-radius: 20px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.timeline-controls {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 20px 0;
}

.timeline-btn {
  background-color: transparent;
  font-size: 20px;
  font-weight: bold;
  border: none;
  cursor: pointer;
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
</style>
