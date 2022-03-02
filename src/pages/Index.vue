<template>
  <q-page v-if="this.applicationState == ApplicationStates.STATE_WAITING_FOR_LOGIN">
    <div class="q-pa-md" style="max-width: 400px">
      <q-form
        class="q-gutter-md"
        @submit="onSubmitPhoneNumber"
      >
        <q-input
          filled
          v-model="phoneNumberInput"
          label="Телефон (в международном формате)"
        />

        <q-input
          filled
          v-model="apiIdInput"
          label="API ID"
        />

        <q-input
          filled
          v-model="apiHashInput"
          label="API hash"
        />

        <q-btn
          type="submit"
          color="primary"
          label="Старт"
        />
      </q-form>
    </div>
  </q-page>

  <q-page v-if="this.applicationState == ApplicationStates.STATE_WAITING_FOR_SIGNIN_CODE">
    <div class="q-pa-md" style="max-width: 400px">
      <div class="q-pa-md">
        На ваш номер в Telegram отправлен одноразовый код, введите его в поле ниже
      </div>
      <q-form
        class="q-gutter-md"
        @submit="onSubmitAuthorizationCode"
      >
        <q-input
          filled
          v-model="codeInput"
          label="Code"
        />

        <q-btn
          type="submit"
          color="primary"
          label="Подтвердить"
        />
      </q-form>
    </div>
  </q-page>

  <q-page v-if="this.applicationState == ApplicationStates.STATE_WAITING_FOR_CHANNELS_INPUT">
    <div class="q-pa-md" style="max-width: 400px">
      <div class="q-pa-md">
        Введите список каналов, на которые надо пожаловаться (одна строка - один канал):
      </div>
      <q-form
        class="q-gutter-md"
        @submit="onSubmitReportChannels"
      >
        <q-input
          filled
          type="textarea"
          v-model="channelsInput"
        />

        <q-btn
          type="submit"
          color="primary"
          label="Запуск"
        />
      </q-form>
    </div>
  </q-page>

  <q-page v-if="this.applicationState == ApplicationStates.STATE_WORK_DONE">
    <div class="q-pa-md" style="max-width: 400px">
      <div v-for="reportResult in this.reportResults" :key="reportResult.channel">
        <b>{{ reportResult.channel }}:</b>&nbsp;
        <span v-if="reportResult.status" style="color: #00ff00"><b>OK</b></span>
        <span v-else style="color: #ff0000"><b>Error</b></span>
      </div>
    </div>
    <div class="q-pa-md">
      <q-btn
        color="primary"
        label="Вернуться"
        @click="onBackToReportChannels"
      />
    </div>
  </q-page>

</template>

<script>
import { defineComponent, ref, onMounted } from 'vue'
import { useStore, mapGetters } from 'vuex'
import { ApplicationStates } from 'src/boot/values'

export default defineComponent({
  name: 'PageIndex',

  setup () {
    const phoneNumberInput = ref('')
    const apiIdInput = ref('')
    const apiHashInput = ref('')
    const codeInput = ref('')
    const channelsInput = ref('')

    onMounted(() => {
      const $store = useStore()

      if (localStorage.getItem('isAuthorized') === 'true') {
        $store.commit('application/setApplicationState', ApplicationStates.STATE_WAITING_FOR_CHANNELS_INPUT)
        $store.commit('telegram/setIsAuthorized', true)
        $store.commit('telegram/setPhoneNumber', localStorage.getItem('phoneNumber'))
        $store.commit('telegram/setApiId', localStorage.getItem('apiId'))
        $store.commit('telegram/setApiHash', localStorage.getItem('apiHash'))
      } else {
        $store.commit('application/setApplicationState', ApplicationStates.STATE_WAITING_FOR_LOGIN)
      }
    })

    return {
      ApplicationStates,

      phoneNumberInput,
      apiIdInput,
      apiHashInput,
      codeInput,
      channelsInput
    }
  },

  computed: {
    ...mapGetters({
      applicationState: 'application/getApplicationState',
      phoneNumber: 'telegram/getPhoneNumber',
      isAuthorized: 'telegram/isAuthorized',
      reportResults: 'telegram/getReportResults'
    })
  },

  methods: {
    async onSubmitPhoneNumber () {
      this.$store.commit('telegram/setPhoneNumber', this.phoneNumberInput)
      this.$store.commit('telegram/setApiId', this.apiIdInput)
      this.$store.commit('telegram/setApiHash', this.apiHashInput)

      await this.$store.dispatch('telegram/isAuthorizedCheck')
      if (this.isAuthorized) {
        this.$store.commit('application/setApplicationState', ApplicationStates.STATE_WAITING_FOR_CHANNELS_INPUT)
      } else {
        if (await this.$store.dispatch('telegram/sendSigninCode')) {
          this.$store.commit('application/setApplicationState', ApplicationStates.STATE_WAITING_FOR_SIGNIN_CODE)
        }
      }
    },

    async onSubmitAuthorizationCode () {
      this.$store.commit('telegram/setCode', this.codeInput)

      await this.$store.dispatch('telegram/signin')
      console.log(this.isAuthorized)
      if (this.isAuthorized) {
        this.$store.commit('application/setApplicationState', ApplicationStates.STATE_WAITING_FOR_CHANNELS_INPUT)
      } else {
        this.$store.commit('application/setApplicationState', ApplicationStates.STATE_WAITING_FOR_SIGNIN_CODE)
      }
    },

    async onSubmitReportChannels () {
      this.$store.commit('telegram/setChannels', this.channelsInput)

      console.log(await this.$store.dispatch('telegram/reportChannels'))

      this.$store.commit('application/setApplicationState', ApplicationStates.STATE_WORK_DONE)
    },

    onBackToReportChannels () {
      this.$store.commit('application/setApplicationState', ApplicationStates.STATE_WAITING_FOR_CHANNELS_INPUT)
    }
  }
})
</script>
