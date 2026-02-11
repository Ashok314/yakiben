<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold mb-4">{{ UI_TEXTS.settings.title }}</h1>

    <div class="tabs flex space-x-4 border-b mb-4">
      <button
        @click="activeTab = 'restaurantInfo'"
        :class="{
          'active-tab text-blue-500 border-blue-500': activeTab === 'restaurantInfo',
          'text-gray-500 hover:text-blue-500': activeTab !== 'restaurantInfo',
        }"
        class="px-4 py-2 border-b-2 font-medium"
      >
        {{ UI_TEXTS.settings.restaurantInfoTab }}
      </button>
      <button
        @click="activeTab = 'settings'"
        :class="{
          'active-tab text-blue-500 border-blue-500': activeTab === 'settings',
          'text-gray-500 hover:text-blue-500': activeTab !== 'settings',
        }"
        class="px-4 py-2 border-b-2 font-medium"
      >
        {{ UI_TEXTS.settings.settingsTab }}
      </button>
    </div>

    <div v-if="activeTab === 'restaurantInfo'">
      <!-- Restaurant Info Section -->
      <div class="border rounded shadow p-4 mb-6">
        <div class="flex justify-between items-center">
          <h2 class="text-lg font-semibold">{{ UI_TEXTS.settings.restaurantInfo.title }}</h2>
          <button @click="toggleEdit('info')" class="text-blue-500 hover:text-blue-700">
            <i class="fas fa-edit"></i> {{ UI_TEXTS.settings.restaurantInfo.editButton }}
          </button>
        </div>
        <div v-show="!editMode.info">
          <p>
            <strong>{{ UI_TEXTS.settings.restaurantInfo.nameLabel }}:</strong>
            {{ restaurantSettingsRef.name }}
          </p>
          <p>
            <strong>{{ UI_TEXTS.settings.restaurantInfo.addressLabel }}:</strong>
            {{ restaurantSettingsRef.address.line1 }}
          </p>
          <p>
            <strong>{{ UI_TEXTS.settings.restaurantInfo.phoneLabel }}:</strong>
            {{ restaurantSettingsRef.phone }}
          </p>
          <p>
            <strong>{{ UI_TEXTS.settings.restaurantInfo.emailLabel }}:</strong>
            {{ restaurantSettingsRef.email }}
          </p>
        </div>
        <form v-show="editMode.info" @submit.prevent="confirmSaveRestaurantInfo">
          <div class="mb-4">
            <label for="name" class="block text-sm font-medium text-gray-700">{{
              UI_TEXTS.settings.restaurantInfo.nameLabel
            }}</label>
            <input
              v-model="restaurantSettingsRef.name"
              type="text"
              id="name"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
              required
            />
          </div>
          <div class="mb-4">
            <label for="address" class="block text-sm font-medium text-gray-700">{{
              UI_TEXTS.settings.restaurantInfo.addressLabel
            }}</label>
            <textarea
              v-model="restaurantSettingsRef.address.line1"
              id="address"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
              required
            ></textarea>
          </div>
          <div class="mb-4">
            <label for="phone" class="block text-sm font-medium text-gray-700">{{
              UI_TEXTS.settings.restaurantInfo.phoneLabel
            }}</label>
            <input
              v-model="restaurantSettingsRef.phone"
              type="text"
              id="phone"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
              required
            />
          </div>
          <div class="mb-4">
            <label for="email" class="block text-sm font-medium text-gray-700">{{
              UI_TEXTS.settings.restaurantInfo.emailLabel
            }}</label>
            <input
              v-model="restaurantSettingsRef.email"
              type="email"
              id="email"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
              required
            />
          </div>
          <button type="submit" class="px-4 py-2 bg-blue-500 text-white rounded">
            {{ UI_TEXTS.settings.restaurantInfo.saveButton }}
          </button>
        </form>
      </div>

      <!-- Restaurant Settings Section -->
      <div class="border rounded shadow p-4 mb-6">
        <div class="flex justify-between items-center">
          <h2 class="text-lg font-semibold">{{ UI_TEXTS.settings.restaurantSettings.title }}</h2>
          <button @click="toggleEdit('settings')" class="text-blue-500 hover:text-blue-700">
            <i class="fas fa-edit"></i> {{ UI_TEXTS.settings.restaurantSettings.editButton }}
          </button>
        </div>
        <div v-show="!editMode.settings">
          <p>
            <strong>{{ UI_TEXTS.settings.restaurantSettings.openingTimeLabel }}:</strong>
            {{ restaurantSettingsRef.hours.open }}
          </p>
          <p>
            <strong>{{ UI_TEXTS.settings.restaurantSettings.closingTimeLabel }}:</strong>
            {{ restaurantSettingsRef.hours.close }}
          </p>
          <p>
            <strong>{{ UI_TEXTS.settings.restaurantSettings.minAdvanceTimeLabel }}:</strong>
            {{ restaurantSettingsRef.hours.minAdvanceTime }} hours
          </p>
          <p>
            <strong>{{ UI_TEXTS.settings.restaurantSettings.maxAdvanceDaysLabel }}:</strong>
            {{ restaurantSettingsRef.hours.maxAdvanceDays }} days
          </p>
          <p>
            <strong>{{ UI_TEXTS.settings.restaurantSettings.businessDaysLabel }}:</strong>
            {{ restaurantSettingsRef.hours.businessDays.join(', ') }}
          </p>
          <div
            v-if="
              restaurantSettingsRef.hours.specialDays &&
              restaurantSettingsRef.hours.specialDays.length > 0
            "
          >
            <strong>{{ UI_TEXTS.settings.restaurantSettings.specialDaysLabel }}:</strong>
            <ul class="list-disc list-inside ml-2">
              <li
                v-for="d in restaurantSettingsRef.hours.specialDays"
                :key="d"
                class="text-blue-600"
              >
                {{ d }}
              </li>
            </ul>
          </div>
          <div
            v-if="
              restaurantSettingsRef.hours.holidays &&
              restaurantSettingsRef.hours.holidays.length > 0
            "
          >
            <strong>{{ UI_TEXTS.settings.restaurantSettings.holidaysLabel }}:</strong>
            <ul class="list-disc list-inside ml-2">
              <li v-for="h in restaurantSettingsRef.hours.holidays" :key="h" class="text-red-600">
                {{ h }}
              </li>
            </ul>
          </div>
        </div>
        <form v-show="editMode.settings" @submit.prevent="confirmSaveRestaurantSettings">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label for="hoursOpen" class="block text-sm font-medium text-gray-700">{{
                UI_TEXTS.settings.restaurantSettings.openingTimeLabel
              }}</label>
              <input
                v-model="restaurantSettingsRef.hours.open"
                type="time"
                id="hoursOpen"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                required
              />
            </div>
            <div>
              <label for="hoursClose" class="block text-sm font-medium text-gray-700">{{
                UI_TEXTS.settings.restaurantSettings.closingTimeLabel
              }}</label>
              <input
                v-model="restaurantSettingsRef.hours.close"
                type="time"
                id="hoursClose"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                required
              />
            </div>
            <div>
              <label for="minAdvanceTime" class="block text-sm font-medium text-gray-700">{{
                UI_TEXTS.settings.restaurantSettings.minAdvanceTimeLabel
              }}</label>
              <input
                v-model="restaurantSettingsRef.hours.minAdvanceTime"
                type="number"
                id="minAdvanceTime"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                required
              />
            </div>
            <div>
              <label for="maxAdvanceDays" class="block text-sm font-medium text-gray-700">{{
                UI_TEXTS.settings.restaurantSettings.maxAdvanceDaysLabel
              }}</label>
              <input
                v-model="restaurantSettingsRef.hours.maxAdvanceDays"
                type="number"
                id="maxAdvanceDays"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                required
              />
            </div>
            <div>
              <label for="businessDays" class="block text-sm font-medium text-gray-700">{{
                UI_TEXTS.settings.restaurantSettings.businessDaysLabel
              }}</label>
              <div class="grid grid-cols-2 gap-2">
                <label
                  v-for="day in [
                    'Monday',
                    'Tuesday',
                    'Wednesday',
                    'Thursday',
                    'Friday',
                    'Saturday',
                    'Sunday',
                  ]"
                  :key="day"
                  class="flex items-center"
                >
                  <input
                    type="checkbox"
                    v-model="restaurantSettingsRef.hours.businessDays"
                    :value="day"
                    class="mr-2"
                  />
                  {{ day }}
                </label>
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">{{
                UI_TEXTS.settings.restaurantSettings.specialDaysLabel
              }}</label>
              <div class="flex gap-2 mb-2">
                <input
                  v-model="newSpecialDay"
                  type="date"
                  class="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                />
                <button
                  @click.prevent="addSpecialDay"
                  class="px-3 py-1 bg-blue-500 text-white rounded text-sm"
                >
                  {{ UI_TEXTS.settings.restaurantSettings.addSpecialDayButton }}
                </button>
              </div>
              <ul class="space-y-1 mb-4">
                <li
                  v-for="(date, index) in restaurantSettingsRef.hours.specialDays"
                  :key="index"
                  class="flex items-center justify-between bg-blue-50 p-2 rounded"
                >
                  <span>{{ date }}</span>
                  <button
                    @click.prevent="removeSpecialDay(index)"
                    class="text-red-500 hover:text-red-700 text-sm"
                  >
                    {{ UI_TEXTS.settings.restaurantSettings.removeSpecialDayButton }}
                  </button>
                </li>
                <li
                  v-if="!restaurantSettingsRef.hours.specialDays?.length"
                  class="text-gray-500 text-sm italic"
                >
                  No special open days set.
                </li>
              </ul>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">{{
                UI_TEXTS.settings.restaurantSettings.holidaysLabel
              }}</label>
              <div class="flex gap-2 mb-2">
                <input
                  v-model="newHoliday"
                  type="date"
                  class="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                />
                <button
                  @click.prevent="addHoliday"
                  class="px-3 py-1 bg-green-500 text-white rounded text-sm"
                >
                  {{ UI_TEXTS.settings.restaurantSettings.addHolidayButton }}
                </button>
              </div>
              <ul class="space-y-1">
                <li
                  v-for="(date, index) in restaurantSettingsRef.hours.holidays"
                  :key="index"
                  class="flex items-center justify-between bg-gray-50 p-2 rounded"
                >
                  <span>{{ date }}</span>
                  <button
                    @click.prevent="removeSpecialDay(index)"
                    class="text-red-500 hover:text-red-700 text-sm"
                  >
                    {{ UI_TEXTS.settings.restaurantSettings.removeHolidayButton }}
                  </button>
                </li>
                <li
                  v-if="!restaurantSettingsRef.hours.holidays?.length"
                  class="text-gray-500 text-sm italic"
                >
                  No special holidays set.
                </li>
              </ul>
            </div>
          </div>
          <button type="submit" class="px-4 py-2 bg-blue-500 text-white rounded">
            {{ UI_TEXTS.settings.restaurantSettings.saveButton }}
          </button>
        </form>
      </div>
    </div>

    <div v-if="activeTab === 'settings'">
      <!-- Settings Form -->
      <div class="border border-green-500 p-4 rounded">
        <h2 class="text-xl font-semibold mb-2">{{ UI_TEXTS.settings.title }}</h2>
        <div class="mb-4">
          <label for="orderingEnabled" class="block text-sm font-medium text-gray-700">{{
            UI_TEXTS.settings.orderingEnabled.label
          }}</label>
          <button
            @click="confirmOrderingEnabledChange"
            :class="sensitiveSettingsRef.orderingEnabled ? 'bg-green-500' : 'bg-red-500'"
            class="px-4 py-2 text-white rounded"
          >
            {{
              sensitiveSettingsRef.orderingEnabled
                ? UI_TEXTS.settings.orderingEnabled.disableButton
                : UI_TEXTS.settings.orderingEnabled.enableButton
            }}
          </button>
        </div>
      </div>
    </div>

    <ConfirmDialog
      :isOpen="showConfirmDialog"
      :title="UI_TEXTS.settings.confirmDialogs.saveRestaurantInfo.title"
      :message="UI_TEXTS.settings.confirmDialogs.saveRestaurantInfo.message"
      @confirm="saveRestaurantInfo"
      @cancel="handleCancel"
    />

    <ConfirmDialog
      :isOpen="showSettingsConfirmDialog"
      :title="UI_TEXTS.settings.confirmDialogs.saveRestaurantSettings.title"
      :message="UI_TEXTS.settings.confirmDialogs.saveRestaurantSettings.message"
      @confirm="saveRestaurantSettings"
      @cancel="handleCancel"
    />

    <ConfirmDialog
      :isOpen="showOrderingConfirmDialog"
      :title="UI_TEXTS.settings.confirmDialogs.changeOrderingStatus.title"
      :message="
        sensitiveSettingsRef.orderingEnabled
          ? UI_TEXTS.settings.confirmDialogs.changeOrderingStatus.disableMessage
          : UI_TEXTS.settings.confirmDialogs.changeOrderingStatus.enableMessage
      "
      @confirm="handleOrderingConfirm"
      @cancel="handleCancel"
    />
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import ConfirmDialog from '../components/ConfirmDialog.vue';
import { UI_TEXTS } from '../constants/ui-texts';
import { settingsApi } from '../api/settings';

export default {
  components: {
    ConfirmDialog,
  },
  setup() {
    const activeTab = ref('restaurantInfo');
    const restaurantSettingsRef = ref({
      name: '',
      address: { line1: '' },
      phone: '',
      email: '',
      hours: {
        open: '',
        close: '',
        minAdvanceTime: 0,
        maxAdvanceDays: 0,
        maxAdvanceDays: 0,
        businessDays: [],
        holidays: [],
      },
      support: {},
    });
    const newHoliday = ref('');
    const sensitiveSettingsRef = ref({ orderingEnabled: true });
    const showConfirmDialog = ref(false);
    const showSettingsConfirmDialog = ref(false);
    const showOrderingConfirmDialog = ref(false);
    const editMode = ref({ info: false, settings: false });

    onMounted(async () => {
      const info = await settingsApi.getRestaurantInfo();
      if (info) {
        restaurantSettingsRef.value = {
          name: info.restaurant_name || '',
          address: info.restaurant_address || { line1: '' },
          phone: info.restaurant_phone || '',
          email: info.restaurant_email || '',
          hours: {
            open: '',
            close: '',
            minAdvanceTime: 0,
            maxAdvanceDays: 0,
            businessDays: [],
            holidays: [],
            specialDays: [],
            ...(info.business_hours || {}),
          },
          support: info.support_info || {},
        };
      }
    });

    const toggleEdit = (section) => {
      editMode.value[section] = !editMode.value[section];
    };

    const confirmSaveRestaurantInfo = () => {
      showConfirmDialog.value = true;
    };

    const confirmSaveRestaurantSettings = () => {
      showSettingsConfirmDialog.value = true;
    };

    const confirmOrderingEnabledChange = () => {
      showOrderingConfirmDialog.value = true;
    };

    const handleOrderingConfirm = async () => {
      try {
        const newValue = !sensitiveSettingsRef.value.orderingEnabled;
        const success = await settingsApi.updateSettings('ordering_enabled', newValue);
        if (success) {
          sensitiveSettingsRef.value.orderingEnabled = newValue;
        }
      } catch (error) {
        console.error('Failed to change ordering status:', error);
      } finally {
        showOrderingConfirmDialog.value = false;
      }
    };

    const handleCancel = () => {
      showConfirmDialog.value = false;
      showSettingsConfirmDialog.value = false;
      showOrderingConfirmDialog.value = false;
    };

    const saveRestaurantInfo = async () => {
      try {
        const info = restaurantSettingsRef.value;
        // The API expects individual updates or a bulk update?
        // handleUpdateSettings takes key, value.
        // Let's preserve the structure.
        const success = await settingsApi.updateSettings('restaurant_name', info.name);
        if (success) {
          await settingsApi.updateSettings('restaurant_address', info.address);
          await settingsApi.updateSettings('restaurant_phone', info.phone);
          await settingsApi.updateSettings('restaurant_email', info.email);
          editMode.value.info = false;
        }
      } catch (error) {
        console.error('Failed to save restaurant info:', error);
      } finally {
        showConfirmDialog.value = false;
      }
    };

    const saveRestaurantSettings = async () => {
      try {
        const info = restaurantSettingsRef.value;
        const success = await settingsApi.updateSettings('business_hours', info.hours);
        if (success) {
          editMode.value.settings = false;
        }
      } catch (error) {
        console.error('Failed to save restaurant settings:', error);
      } finally {
        showSettingsConfirmDialog.value = false;
      }
    };

    const addHoliday = () => {
      if (
        newHoliday.value &&
        !restaurantSettingsRef.value.hours.holidays.includes(newHoliday.value)
      ) {
        if (!restaurantSettingsRef.value.hours.holidays)
          restaurantSettingsRef.value.hours.holidays = [];
        restaurantSettingsRef.value.hours.holidays.push(newHoliday.value);
        restaurantSettingsRef.value.hours.holidays.sort();
        newHoliday.value = '';
      }
    };

    const removeHoliday = (index) => {
      restaurantSettingsRef.value.hours.holidays.splice(index, 1);
    };

    const newSpecialDay = ref('');
    const addSpecialDay = () => {
      if (
        newSpecialDay.value &&
        !restaurantSettingsRef.value.hours.specialDays?.includes(newSpecialDay.value)
      ) {
        if (!restaurantSettingsRef.value.hours.specialDays)
          restaurantSettingsRef.value.hours.specialDays = [];
        restaurantSettingsRef.value.hours.specialDays.push(newSpecialDay.value);
        restaurantSettingsRef.value.hours.specialDays.sort();
        newSpecialDay.value = '';
      }
    };

    const removeSpecialDay = (index) => {
      restaurantSettingsRef.value.hours.specialDays.splice(index, 1);
    };

    return {
      activeTab,
      restaurantSettingsRef,
      sensitiveSettingsRef,
      showConfirmDialog,
      showSettingsConfirmDialog,
      showOrderingConfirmDialog,
      editMode,
      toggleEdit,
      confirmSaveRestaurantInfo,
      confirmSaveRestaurantSettings,
      confirmOrderingEnabledChange,
      handleCancel,
      saveRestaurantInfo,
      saveRestaurantSettings,
      handleOrderingConfirm,
      addHoliday,
      removeHoliday,
      newHoliday,
      addSpecialDay,
      removeSpecialDay,
      newSpecialDay,
      UI_TEXTS,
    };
  },
};
</script>
