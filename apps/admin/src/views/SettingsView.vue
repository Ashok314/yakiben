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
          <p><strong>{{ UI_TEXTS.settings.restaurantInfo.nameLabel }}:</strong> {{ restaurantSettingsRef.name }}</p>
          <p><strong>{{ UI_TEXTS.settings.restaurantInfo.addressLabel }}:</strong> {{ restaurantSettingsRef.address.line1 }}</p>
          <p><strong>{{ UI_TEXTS.settings.restaurantInfo.phoneLabel }}:</strong> {{ restaurantSettingsRef.phone }}</p>
          <p><strong>{{ UI_TEXTS.settings.restaurantInfo.emailLabel }}:</strong> {{ restaurantSettingsRef.email }}</p>
        </div>
        <form v-show="editMode.info" @submit.prevent="confirmSaveRestaurantInfo">
          <div class="mb-4">
            <label for="name" class="block text-sm font-medium text-gray-700">{{ UI_TEXTS.settings.restaurantInfo.nameLabel }}</label>
            <input v-model="restaurantSettingsRef.name" type="text" id="name" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50" required />
          </div>
          <div class="mb-4">
            <label for="address" class="block text-sm font-medium text-gray-700">{{ UI_TEXTS.settings.restaurantInfo.addressLabel }}</label>
            <textarea v-model="restaurantSettingsRef.address.line1" id="address" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50" required></textarea>
          </div>
          <div class="mb-4">
            <label for="phone" class="block text-sm font-medium text-gray-700">{{ UI_TEXTS.settings.restaurantInfo.phoneLabel }}</label>
            <input v-model="restaurantSettingsRef.phone" type="text" id="phone" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50" required />
          </div>
          <div class="mb-4">
            <label for="email" class="block text-sm font-medium text-gray-700">{{ UI_TEXTS.settings.restaurantInfo.emailLabel }}</label>
            <input v-model="restaurantSettingsRef.email" type="email" id="email" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50" required />
          </div>
          <button type="submit" class="px-4 py-2 bg-blue-500 text-white rounded">{{ UI_TEXTS.settings.restaurantInfo.saveButton }}</button>
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
          <p><strong>{{ UI_TEXTS.settings.restaurantSettings.openingTimeLabel }}:</strong> {{ restaurantSettingsRef.hours.open }}</p>
          <p><strong>{{ UI_TEXTS.settings.restaurantSettings.closingTimeLabel }}:</strong> {{ restaurantSettingsRef.hours.close }}</p>
          <p><strong>{{ UI_TEXTS.settings.restaurantSettings.minAdvanceTimeLabel }}:</strong> {{ restaurantSettingsRef.hours.minAdvanceTime }} hours</p>
          <p><strong>{{ UI_TEXTS.settings.restaurantSettings.maxAdvanceDaysLabel }}:</strong> {{ restaurantSettingsRef.hours.maxAdvanceDays }} days</p>
          <p><strong>{{ UI_TEXTS.settings.restaurantSettings.businessDaysLabel }}:</strong> {{ restaurantSettingsRef.hours.businessDays.join(', ') }}</p>
        </div>
        <form v-show="editMode.settings" @submit.prevent="confirmSaveRestaurantSettings">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label for="hoursOpen" class="block text-sm font-medium text-gray-700">{{ UI_TEXTS.settings.restaurantSettings.openingTimeLabel }}</label>
              <input v-model="restaurantSettingsRef.hours.open" type="time" id="hoursOpen" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50" required />
            </div>
            <div>
              <label for="hoursClose" class="block text-sm font-medium text-gray-700">{{ UI_TEXTS.settings.restaurantSettings.closingTimeLabel }}</label>
              <input v-model="restaurantSettingsRef.hours.close" type="time" id="hoursClose" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50" required />
            </div>
            <div>
              <label for="minAdvanceTime" class="block text-sm font-medium text-gray-700">{{ UI_TEXTS.settings.restaurantSettings.minAdvanceTimeLabel }}</label>
              <input v-model="restaurantSettingsRef.hours.minAdvanceTime" type="number" id="minAdvanceTime" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50" required />
            </div>
            <div>
              <label for="maxAdvanceDays" class="block text-sm font-medium text-gray-700">{{ UI_TEXTS.settings.restaurantSettings.maxAdvanceDaysLabel }}</label>
              <input v-model="restaurantSettingsRef.hours.maxAdvanceDays" type="number" id="maxAdvanceDays" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50" required />
            </div>
            <div>
              <label for="businessDays" class="block text-sm font-medium text-gray-700">{{ UI_TEXTS.settings.restaurantSettings.businessDaysLabel }}</label>
              <div class="grid grid-cols-2 gap-2">
                <label v-for="day in ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']" :key="day" class="flex items-center">
                  <input type="checkbox" v-model="restaurantSettingsRef.hours.businessDays" :value="day" class="mr-2" />
                  {{ day }}
                </label>
              </div>
            </div>
          </div>
          <button type="submit" class="px-4 py-2 bg-blue-500 text-white rounded">{{ UI_TEXTS.settings.restaurantSettings.saveButton }}</button>
        </form>
      </div>
    </div>

    <div v-if="activeTab === 'settings'">
      <!-- Settings Form -->
      <div class="border border-green-500 p-4 rounded">
        <h2 class="text-xl font-semibold mb-2">{{ UI_TEXTS.settings.title }}</h2>
        <div class="mb-4">
          <label for="orderingEnabled" class="block text-sm font-medium text-gray-700">{{ UI_TEXTS.settings.orderingEnabled.label }}</label>
          <button @click="confirmOrderingEnabledChange" :class="sensitiveSettingsRef.orderingEnabled ? 'bg-green-500' : 'bg-red-500'" class="px-4 py-2 text-white rounded">
            {{ sensitiveSettingsRef.orderingEnabled ? UI_TEXTS.settings.orderingEnabled.disableButton : UI_TEXTS.settings.orderingEnabled.enableButton }}
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
      :message="sensitiveSettingsRef.orderingEnabled ? UI_TEXTS.settings.confirmDialogs.changeOrderingStatus.disableMessage : UI_TEXTS.settings.confirmDialogs.changeOrderingStatus.enableMessage" 
      @confirm="handleOrderingConfirm" 
      @cancel="handleCancel" 
    />
  </div>
</template>

<script>
import { restaurantSettings, sensitiveSettings } from "../mocks/settings";
import { ref } from "vue";
import ConfirmDialog from "../components/ConfirmDialog.vue";
import { UI_TEXTS } from "../constants/ui-texts";

export default {
  components: {
    ConfirmDialog,
  },
  setup() {
    const activeTab = ref("restaurantInfo");
    const restaurantSettingsRef = ref({
      name: "",
      address: { line1: "" },
      phone: "",
      email: "",
      hours: {
        open: "",
        close: "",
        minAdvanceTime: 0,
        maxAdvanceDays: 0,
        businessDays: [],
      },
    });
    const sensitiveSettingsRef = ref(sensitiveSettings);
    const showConfirmDialog = ref(false);
    const showSettingsConfirmDialog = ref(false);
    const showOrderingConfirmDialog = ref(false);
    const editMode = ref({ info: false, settings: false });

    // FIXME: Replace mock data with actual API call
    restaurantSettingsRef.value = {
      name: restaurantSettings.name,
      address: { line1: restaurantSettings.address },
      phone: restaurantSettings.phone,
      email: restaurantSettings.email,
      hours: {
        open: restaurantSettings.hours.open,
        close: restaurantSettings.hours.close,
        minAdvanceTime: restaurantSettings.hours.minAdvanceTime,
        maxAdvanceDays: restaurantSettings.hours.maxAdvanceDays,
        businessDays: restaurantSettings.hours.businessDays,
      },
    };

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
        // FIXME: Replace with actual API call to update ordering status
        sensitiveSettingsRef.value.orderingEnabled = !sensitiveSettingsRef.value.orderingEnabled;
      } catch (error) {
        console.error("Failed to change ordering status:", error);
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
        // FIXME: Replace with actual API call to save restaurant info
        const index = restaurantSettingsRef.value;
        await new Promise((resolve) => setTimeout(resolve, 1000));
        console.log("Restaurant info saved successfully:", index);
      } catch (error) {
        console.error("Failed to save restaurant info:", error);
      } finally {
        showConfirmDialog.value = false;
      }
    };

    const saveRestaurantSettings = async () => {
      try {
        // FIXME: Replace with actual API call to save restaurant settings
        const index = restaurantSettingsRef.value;
        await new Promise((resolve) => setTimeout(resolve, 1000));
        console.log("Restaurant settings saved successfully:", index);
      } catch (error) {
        console.error("Failed to save restaurant settings:", error);
      } finally {
        showSettingsConfirmDialog.value = false;
      }
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
      UI_TEXTS,
    };
  },
};
</script>
