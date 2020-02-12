<template>
  <div class="container-fluid" style="padding: 0px;">
    <Header :user="user"/>
    <template v-if="this.isactive == 'create'">
      <CreateReceipt />
    </template>
    <template v-else>
      <ViewReceipts />
    </template>
  </div>
</template>
<script>
import Header from './Header';
import CreateReceipt from './CreateReceipt';
import ViewReceipts from './ViewReceipts';
export default {
  name: 'Dashboard',
  components: {
    Header,
    CreateReceipt,
    ViewReceipts,
  },
  data() {
    return {
      isactive: 'create',
      title: 'Receipt Management',
      user: (this.$route.params.user) ? this.$route.params.user : null
    };
  }
};
</script>
