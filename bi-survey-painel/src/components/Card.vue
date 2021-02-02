<template>
  <q-list bordered class="q-card sombra rounded-borders">
    <q-expansion-item header-class="text-weight-bold text-primary card-header" expand-icon-toggle expand-separator default-opened>
      <template v-slot:header>
        <q-item-section avatar>
            <slot name="header"></slot>
        </q-item-section>

        <q-space />

        <q-item-section side style="display:none">
          <div class="col-auto">
            <q-btn color="grey-7" round flat icon="more_vert">
              <q-menu cover auto-close>
                <q-list>
                  <q-item clickable>
                    <q-item-section>Remove Card</q-item-section>
                  </q-item>
                  <q-item clickable>
                    <q-item-section>Send Feedback</q-item-section>
                  </q-item>
                  <q-item clickable>
                    <q-item-section>Share</q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-btn>
          </div>
        </q-item-section>
      </template>

      <q-card>
        <q-card-section style="min-height: 10em;" >
          <slot name="body"></slot>
        </q-card-section>
        <q-card-section>
          <slot name="footer"></slot>
        </q-card-section>
      </q-card>
    </q-expansion-item>
  </q-list>
</template>

<style>
  .card-header {
    background-color: #f8f9fc;
  }
</style>
