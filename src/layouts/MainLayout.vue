<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title>
          Report Telegram Channels
        </q-toolbar-title>

        <q-btn
          v-if="isAuthorized"
          flat
          label="Logout"
          @click="logout"
        />
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />

      <q-dialog v-model="showErrorMessage">
        <q-card>
          <q-card-section>
            <div class="text-h6">
              <q-icon name="error" size="md" color="red" />
              Error
            </div>
          </q-card-section>
          <q-card-section class="q-pt-none">
            Произошла ошибка. Введите корректные данные или перезагрузите страницу.
          </q-card-section>
          <q-card-actions align="right">
            <q-btn
              flat
              label="OK"
              color="primary"
              v-close-popup
              @click="closeErrorMessage"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent } from 'vue'
import { mapGetters } from 'vuex'

export default defineComponent({
  name: 'MainLayout',

  components: {
  },

  setup () {
  },

  computed: {
    ...mapGetters({
      isAuthorized: 'telegram/isAuthorized',
      showErrorMessage: 'application/getShowErrorMessage'
    })
  },

  methods: {
    logout () {
      this.$store.dispatch('telegram/logout')
    },

    closeErrorMessage () {
      this.$store.dispatch('application/closeErrorMessage')
    }
  }
})
</script>
