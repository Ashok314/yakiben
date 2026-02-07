<template>
  <div class="min-h-screen bg-gray-50 pb-32">
    <header class="sticky top-0 bg-white shadow z-50">
      <div class="container mx-auto px-4 py-4 flex items-center justify-between">
        <div class="flex items-center">
          <router-link to="/" class="text-gray-600 hover:text-gray-900">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </router-link>
          <h1 class="text-xl font-bold ml-4">注文内容</h1>
        </div>

        <!-- Help Button -->
        <button @click="showHelp = true" class="p-2 text-gray-600 hover:text-gray-900 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>
      </div>
    </header>

    <main class="container mx-auto px-4 py-6">
      <div v-if="!cartItems.length" class="text-center py-12">
        <p class="text-gray-600 mb-4">カートが空です</p>
        <router-link to="/"
          class="inline-block bg-primary text-white px-6 py-2 rounded-full font-medium hover:bg-primary-dark transition-colors">
          メニューに戻る
        </router-link>
      </div>

      <div v-else class="space-y-6">
        <!-- Order Summary Section -->
        <div class="bg-white rounded-lg shadow-sm">
          <div class="p-4 border-b">
            <h2 class="text-lg font-bold">注文内容</h2>
          </div>
          <div class="divide-y">
            <CartItem v-for="item in cartItems" :key="item.item.id + JSON.stringify(item.customizations)"
              :cartItem="item" />
          </div>
          <div class="p-4 border-t bg-gray-50">
            <div class="flex justify-between items-center text-xl font-bold">
              <span>合計金額</span>
              <span class="text-primary">¥{{ cartTotal }}</span>
            </div>
          </div>
        </div>

        <!-- Customer Information Section -->
        <form @submit.prevent="submitOrder" class="space-y-6">
          <div class="bg-white rounded-lg shadow-sm">
            <div class="p-4 border-b">
              <h2 class="text-lg font-bold">お客様情報</h2>
            </div>
            <div class="p-4 space-y-4">
              <!-- Name Fields -->
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">姓<span
                      class="text-red-500">*</span></label>
                  <input v-model="orderForm.lastName" type="text" required placeholder="山田" :class="[
                    'w-full rounded-lg focus:ring-primary transition-colors',
                    validationErrors.lastName
                      ? 'border-red-300 focus:border-red-500 bg-red-50'
                      : 'border-gray-300 focus:border-primary'
                  ]" @input="saveCustomerInfo" />
                  <p v-if="validationErrors.lastName" class="mt-1 text-sm text-red-500">
                    {{ validationErrors.lastName }}
                  </p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">名<span
                      class="text-red-500">*</span></label>
                  <input v-model="orderForm.firstName" type="text" required placeholder="太郎"
                    class="w-full rounded-lg border-gray-300 focus:border-primary focus:ring-primary"
                    @input="saveCustomerInfo" />
                  <p v-if="validationErrors.firstName" class="mt-1 text-sm text-red-500">
                    {{ validationErrors.firstName }}
                  </p>
                </div>
              </div>

              <!-- Address Fields -->
              <div class="space-y-3">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">郵便番号<span
                      class="text-red-500">*</span></label>
                  <input v-model="orderForm.postalCode" type="text" required placeholder="100-0005"
                    pattern="^\d{3}-?\d{4}$"
                    class="w-full rounded-lg border-gray-300 focus:border-primary focus:ring-primary"
                    @input="saveCustomerInfo" />
                  <p v-if="validationErrors.postalCode" class="mt-1 text-sm text-red-500">
                    {{ validationErrors.postalCode }}
                  </p>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">都道府県<span
                      class="text-red-500">*</span></label>
                  <input v-model="orderForm.prefecture" type="text" required placeholder="東京都"
                    class="w-full rounded-lg border-gray-300 focus:border-primary focus:ring-primary"
                    @input="saveCustomerInfo" />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">市区町村<span
                      class="text-red-500">*</span></label>
                  <input v-model="orderForm.city" type="text" required placeholder="千代田区"
                    class="w-full rounded-lg border-gray-300 focus:border-primary focus:ring-primary"
                    @input="saveCustomerInfo" />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">番地・建物名<span
                      class="text-red-500">*</span></label>
                  <input v-model="orderForm.addressLine" type="text" required placeholder="丸の内1-1-1"
                    class="w-full rounded-lg border-gray-300 focus:border-primary focus:ring-primary"
                    @input="saveCustomerInfo" />
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">会社電話番号<span
                    class="text-red-500">*</span></label>
                <input v-model="orderForm.companyContact" type="tel" required pattern="^[0-9]{10,11}$"
                  title="10桁または11桁の電話番号を入力してください" placeholder="0312345678"
                  class="w-full rounded-lg border-gray-300 focus:border-primary focus:ring-primary"
                  @input="saveCustomerInfo" />
                <p v-if="validationErrors.companyContact" class="mt-1 text-sm text-red-500">
                  {{ validationErrors.companyContact }}
                </p>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">受け取り時間<span
                    class="text-red-500">*</span></label>
                <input v-model="orderForm.deliveryTime" type="datetime-local" required :min="minDeliveryTime"
                  :max="maxDeliveryTime"
                  class="w-full rounded-lg border-gray-300 focus:border-primary focus:ring-primary peer" />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">備考</label>
                <textarea v-model="orderForm.notes" rows="2" placeholder="アレルギーなどの注意事項があればご記入ください"
                  class="w-full rounded-lg border-gray-300 focus:border-primary focus:ring-primary"></textarea>
              </div>
            </div>
          </div>

          <!-- Payment Method Section -->
          <div class="bg-white rounded-lg shadow-sm">
            <div class="p-4 border-b">
              <h2 class="text-lg font-bold">お支払い方法</h2>
            </div>
            <div class="p-4 space-y-3">
              <label class="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                :class="{ 'border-primary bg-primary/5': orderForm.paymentMethod === 'cash' }">
                <input type="radio" v-model="orderForm.paymentMethod" value="cash"
                  class="w-4 h-4 text-primary border-gray-300 focus:ring-primary" />
                <span class="ml-3">現金</span>
              </label>

              <label class="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                :class="{ 'border-primary bg-primary/5': orderForm.paymentMethod === 'paypay' }">
                <input type="radio" v-model="orderForm.paymentMethod" value="paypay"
                  class="w-4 h-4 text-primary border-gray-300 focus:ring-primary" />
                <div class="ml-3">
                  <span class="font-bold text-[#0095EE]">PayPay</span>
                  <span class="text-sm text-gray-500 ml-2">(受け取り時に決済)</span>
                </div>
              </label>

              <!-- Tax Receipt Checkbox -->
              <div class="pt-3 border-t">
                <label class="flex items-center cursor-pointer">
                  <input type="checkbox" v-model="orderForm.needReceipt"
                    class="w-4 h-4 rounded text-primary border-gray-300 focus:ring-primary"
                    @change="saveCustomerInfo" />
                  <span class="ml-3">領収書が必要</span>
                </label>
              </div>
            </div>
          </div>

          <!-- Submit Button -->
          <div class="space-y-3">
            <button type="submit" :disabled="!isFormValid || isSubmitting" class="w-full bg-primary text-white py-4 rounded-xl font-bold shadow-lg 
                     hover:bg-primary-dark transition-all duration-300 transform 
                     hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5
                     disabled:opacity-50 disabled:cursor-not-allowed 
                     disabled:transform-none disabled:shadow-none
                     flex items-center justify-center">
              <span v-if="isSubmitting" class="inline-block animate-spin mr-2">
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                  </path>
                </svg>
              </span>
              {{ isSubmitting ? '処理中...' : `注文を確定する (¥${cartTotal})` }}
            </button>

            <!-- Validation Summary -->
            <div v-if="hasValidationErrors" class="bg-red-50 border border-red-100 rounded-lg p-4">
              <h3 class="font-medium text-red-800 mb-2">以下の項目を確認してください：</h3>
              <ul class="text-sm text-red-600 space-y-1 list-disc list-inside">
                <li v-if="validationErrors.firstName || validationErrors.lastName">
                  お名前を正しく入力してください（漢字、ひらがな、カタカナ、アルファベットのみ）
                </li>
                <li v-if="validationErrors.postalCode">
                  郵便番号は半角数字7桁で入力してください（例：100-0005）
                </li>
                <li v-if="validationErrors.prefecture || validationErrors.city || validationErrors.addressLine">
                  住所を正しく入力してください（都道府県、市区町村、番地・建物名）
                </li>
                <li v-if="validationErrors.companyContact">
                  電話番号は半角数字10桁または11桁で入力してください（例：0312345678）
                </li>
                <li v-if="validationErrors.deliveryTime && restaurantInfo">
                  受け取り時間は{{ restaurantInfo.hours.open }}:00〜{{ restaurantInfo.hours.orderDeadline }}:00の間で、
                  {{ restaurantInfo.hours.minAdvanceTime }}分以上前、
                  {{ restaurantInfo.hours.maxAdvanceDays }}営業日以内を選択してください
                </li>
                <li v-else-if="validationErrors.deliveryTime">
                  有効な受け取り時間を選択してください
                </li>
              </ul>
            </div>
          </div>
        </form>
      </div>
    </main>

    <!-- Help Modal -->
    <div v-if="showHelp" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      @click.self="showHelp = false">
      <div class="bg-white rounded-xl p-6 max-w-md w-full">
        <div class="flex justify-between items-start mb-4">
          <h3 class="text-lg font-bold">お問い合わせ</h3>
          <button @click="showHelp = false" class="text-gray-500 hover:text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div v-if="restaurantInfo" class="space-y-4">
          <div>
            <h4 class="font-medium mb-2">ご注文について</h4>
            <ul class="space-y-2 text-sm">
              <li>ご注文は{{ restaurantInfo.hours.minAdvanceTime }}分前までにお願いいたします</li>
              <li>受け取り時間は{{ restaurantInfo.hours.open }}:00〜{{ restaurantInfo.hours.orderDeadline }}:00の間でご指定ください</li>
              <li>{{ restaurantInfo.hours.maxAdvanceDays }}営業日先までご予約可能です</li>
              <li>土日祝日は営業しておりません</li>
            </ul>
          </div>
          <div class="bg-gray-50 rounded-lg p-4 space-y-2">
            <p>電話番号：<a :href="`tel:${restaurantInfo.support.phone}`" class="text-primary">{{
              restaurantInfo.support.phone }}</a></p>
            <p>受付時間：{{ restaurantInfo.support.hours }}</p>
            <p>メール：<a :href="`mailto:${restaurantInfo.support.email}`" class="text-primary">{{
              restaurantInfo.support.email }}</a></p>
          </div>
        </div>
        <div v-else class="text-center py-12 text-gray-400">
          読み込み中...
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import CartItem from '../components/CartItem.vue';
import { generateTrackingId } from '../data/menu';
import { STORAGE_KEYS } from '../constants';
import { ordersApi } from '../data/api/orders';
import { useCart } from '../stores/cart';
import { useRestaurantStore } from '../stores/restaurant';
import type { Order, OrderStatus, PaymentStatus, PaymentMethod } from '../types';

const router = useRouter();
const { cartItems, cartTotal, clearCart } = useCart();
const { info: restaurantInfo } = useRestaurantStore();
const showHelp = ref(false);
const isSubmitting = ref(false); // Add loading state

onMounted(() => {
  console.log('[CartView] Mounted. Items:', cartItems.value);
});

interface ValidationErrors {
  firstName: string;
  lastName: string;
  postalCode: string;
  prefecture: string;
  city: string;
  addressLine: string;
  companyContact: string;
  deliveryTime: string;
}

const orderForm = ref({
  firstName: '',
  lastName: '',
  postalCode: '',
  prefecture: '',
  city: '',
  addressLine: '',
  companyContact: '',
  deliveryTime: '',
  notes: '',
  paymentMethod: 'cash' as PaymentMethod,
  needReceipt: false
});

const validationErrors = ref<ValidationErrors>({
  firstName: '',
  lastName: '',
  postalCode: '',
  prefecture: '',
  city: '',
  addressLine: '',
  companyContact: '',
  deliveryTime: ''
});

// Reactive validation
watch(orderForm, (_newValue) => {
  validateForm();
}, { deep: true });

function validateForm() {
  validationErrors.value = {
    firstName: '',
    lastName: '',
    postalCode: '',
    prefecture: '',
    city: '',
    addressLine: '',
    companyContact: '',
    deliveryTime: ''
  };

  // Name validation (allow Japanese or English)
  const namePattern = /^[A-Za-zぁ-んァ-ン一-龥々]+$/;
  if (!orderForm.value.firstName) {
    validationErrors.value.firstName = '名前を入力してください';
  } else if (!namePattern.test(orderForm.value.firstName)) {
    validationErrors.value.firstName = '有効な名前を入力してください';
  }

  if (!orderForm.value.lastName) {
    validationErrors.value.lastName = '姓を入力してください';
  } else if (!namePattern.test(orderForm.value.lastName)) {
    validationErrors.value.lastName = '有効な姓を入力してください';
  }

  // Postal code validation
  const postalPattern = /^\d{3}-?\d{4}$/;
  if (!orderForm.value.postalCode) {
    validationErrors.value.postalCode = '郵便番号を入力してください';
  } else if (!postalPattern.test(orderForm.value.postalCode)) {
    validationErrors.value.postalCode = '正しい郵便番号を入力してください（例：100-0005）';
  }

  // Prefecture validation
  if (!orderForm.value.prefecture) {
    validationErrors.value.prefecture = '都道府県を入力してください';
  }

  // City validation
  if (!orderForm.value.city) {
    validationErrors.value.city = '市区町村を入力してください';
  }

  // Address line validation
  if (!orderForm.value.addressLine) {
    validationErrors.value.addressLine = '番地・建物名を入力してください';
  }

  // Phone validation
  const phonePattern = /^[0-9]{10,11}$/;
  if (!orderForm.value.companyContact) {
    validationErrors.value.companyContact = '電話番号を入力してください';
  } else if (!phonePattern.test(orderForm.value.companyContact)) {
    validationErrors.value.companyContact = '有効な電話番号を入力してください（10桁または11桁）';
  }

  // Pickup time validation
  if (!orderForm.value.deliveryTime) {
    validationErrors.value.deliveryTime = '受け取り時間を選択してください';
  } else if (!isDeliveryTimeValid.value) {
    const openTime = restaurantInfo.value?.hours.open || 10;
    const deadline = restaurantInfo.value?.hours.orderDeadline || 15;
    validationErrors.value.deliveryTime = `有効な受け取り時間を選択してください（${openTime}:00-${deadline}:00）`;
  }
}

// Load saved customer info and reorder pickup time from localStorage
onMounted(() => {
  const savedInfo = localStorage.getItem(STORAGE_KEYS.CUSTOMER_INFO);
  if (savedInfo) {
    const info = JSON.parse(savedInfo);
    orderForm.value.firstName = info.firstName || '';
    orderForm.value.lastName = info.lastName || '';
    orderForm.value.postalCode = info.postalCode || '';
    orderForm.value.prefecture = info.prefecture || '';
    orderForm.value.city = info.city || '';
    orderForm.value.addressLine = info.addressLine || '';
    orderForm.value.companyContact = info.companyContact || '';
    orderForm.value.needReceipt = info.needReceipt || false;
  }

  // Check for preserved pickup time from reorder
  const savedDeliveryTime = localStorage.getItem(STORAGE_KEYS.REORDER_PICKUP_TIME);
  if (savedDeliveryTime) {
    const deliveryTime = new Date(savedDeliveryTime);
    // Final validation before using the preserved time
    const min = new Date(minDeliveryTime.value);
    const max = new Date(maxDeliveryTime.value);

    if (deliveryTime >= min &&
      deliveryTime <= max &&
      (restaurantInfo.value?.hours.businessDays || []).includes(deliveryTime.getDay()) &&
      deliveryTime.getHours() >= (restaurantInfo.value?.hours.open || 0) &&
      deliveryTime.getHours() < (restaurantInfo.value?.hours.orderDeadline || 24)) {
      orderForm.value.deliveryTime = deliveryTime.toISOString().slice(0, 16);
    }
    // Remove the saved pickup time
    localStorage.removeItem(STORAGE_KEYS.REORDER_PICKUP_TIME);
  }

  validateForm();
});

// Save customer info to localStorage
function saveCustomerInfo() {
  localStorage.setItem(STORAGE_KEYS.CUSTOMER_INFO, JSON.stringify({
    firstName: orderForm.value.firstName,
    lastName: orderForm.value.lastName,
    postalCode: orderForm.value.postalCode,
    prefecture: orderForm.value.prefecture,
    city: orderForm.value.city,
    addressLine: orderForm.value.addressLine,
    companyContact: orderForm.value.companyContact,
    needReceipt: orderForm.value.needReceipt
  }));
  validateForm();
}

const minDeliveryTime = computed(() => {
  const now = new Date();
  now.setMinutes(now.getMinutes() + (restaurantInfo.value?.hours.minAdvanceTime || 30));

  // If after closing time, set to next business day at 12:00
  if (now.getHours() >= (restaurantInfo.value?.hours.close || 21)) {
    do {
      now.setDate(now.getDate() + 1);
    } while (!(restaurantInfo.value?.hours.businessDays || []).includes(now.getDay()));
    now.setHours(12, 0, 0, 0);
  } else if (now.getHours() < (restaurantInfo.value?.hours.open || 10)) {
    // If before opening time, set to today's 12:00
    now.setHours(12, 0, 0, 0);
  } else if (now.getHours() < 12) {
    // If before noon, set minutes to current + minAdvanceTime but hour to 12
    now.setHours(12, Math.max(0, now.getMinutes()), 0, 0);
  }

  // If current day is not a business day, find next business day
  while (!(restaurantInfo.value?.hours.businessDays || []).includes(now.getDay())) {
    now.setDate(now.getDate() + 1);
    now.setHours(12, 0, 0, 0);
  }

  return now.toISOString().slice(0, 16);
});

const maxDeliveryTime = computed(() => {
  const max = new Date();
  // Find the last valid business day within maxAdvanceDays
  let daysChecked = 0;
  let validDaysFound = 0;

  while (validDaysFound < (restaurantInfo.value?.hours.maxAdvanceDays || 30) && daysChecked < 14) {
    if ((restaurantInfo.value?.hours.businessDays || []).includes(max.getDay())) {
      validDaysFound++;
    }
    if (validDaysFound < (restaurantInfo.value?.hours.maxAdvanceDays || 30)) {
      max.setDate(max.getDate() + 1);
    }
    daysChecked++;
  }

  max.setHours(restaurantInfo.value?.hours.orderDeadline || 20, 0, 0, 0);
  return max.toISOString().slice(0, 16);
});

const isDeliveryTimeValid = computed(() => {
  if (!orderForm.value.deliveryTime) return false;
  const pickupDate = new Date(orderForm.value.deliveryTime);
  const min = new Date(minDeliveryTime.value);
  const max = new Date(maxDeliveryTime.value);

  // Check if pickup day is a business day
  if (!(restaurantInfo.value?.hours.businessDays || []).includes(pickupDate.getDay())) {
    return false;
  }

  // Check if pickup time is between open and close
  const hours = pickupDate.getHours();
  if (hours < (restaurantInfo.value?.hours.open || 0) || hours >= (restaurantInfo.value?.hours.orderDeadline || 24)) {
    return false;
  }

  return pickupDate >= min && pickupDate <= max;
});

const hasValidationErrors = computed(() => {
  return Object.values(validationErrors.value).some(error => error !== '');
});

const isFormValid = computed(() => {
  const hasRequiredFields =
    orderForm.value.firstName &&
    orderForm.value.lastName &&
    orderForm.value.postalCode &&
    orderForm.value.prefecture &&
    orderForm.value.city &&
    orderForm.value.addressLine &&
    orderForm.value.companyContact &&
    orderForm.value.deliveryTime &&
    orderForm.value.paymentMethod &&
    cartItems.value.length > 0;

  return hasRequiredFields && !hasValidationErrors.value;
});

async function submitOrder() {
  validateForm();
  if (!isFormValid.value || isSubmitting.value) return;

  isSubmitting.value = true;

  try {
    const trackingId = generateTrackingId();
    const fullAddress = `〒${orderForm.value.postalCode} ${orderForm.value.prefecture}${orderForm.value.city}${orderForm.value.addressLine}`;

    // Construct the payload to match what the Edge Function expects
    // Note: The Edge Function maps 'deliveryTime' to 'delivery_datetime' etc.
    const orderData: Partial<Order> = {
      trackingId,
      items: cartItems.value.map(item => ({
        item: {
          id: item.item.id,
          name: item.item.name,
          price: item.item.price
        },
        quantity: item.quantity,
        subtotal: item.subtotal,
        customizations: item.customizations || []
      })) as any, // Cast to any to avoid strict MenuItem type check for payload
      customer: { // Edge function doesn't use this nested obj yet, but good for local/state
        name: `${orderForm.value.lastName} ${orderForm.value.firstName}`,
        phone: orderForm.value.companyContact,
        address: {
          street: orderForm.value.addressLine,
          city: orderForm.value.city,
          postalCode: orderForm.value.postalCode,
        }
      },
      // Flat properties for the Edge Function mapper
      deliveryTime: new Date(orderForm.value.deliveryTime).toISOString(),
      notes: orderForm.value.notes,
      status: 'pending' as OrderStatus,
      paymentMethod: orderForm.value.paymentMethod,
      paymentStatus: orderForm.value.paymentMethod === 'paypay' ? 'pending' : 'completed' as PaymentStatus,
      total: cartTotal.value,
      // Add other fields if needed by Edge Function logic directly
    };

    // Save order
    const result = await ordersApi.createOrder(orderData);

    // Clear cart
    clearCart();

    // Use the tracking ID returned by the server (in case it was re-generated or normalized)
    const finalTrackingId = result.trackingId || orderData.trackingId;

    // Save the current order ID to ensure it's available immediately
    localStorage.setItem(STORAGE_KEYS.CURRENT_ORDER, finalTrackingId);

    // Redirect to order detail using the server's tracking ID
    await router.push({
      name: 'order',
      params: { trackingId: finalTrackingId }
    });
  } catch (error) {
    console.error('Order submission failed:', error);
  } finally {
    isSubmitting.value = false;
  }
}
</script>
