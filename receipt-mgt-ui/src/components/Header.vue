<template>
  <nav class="navbar navbar-dark bg-light">
    <template v-if="user != null">
      <SideNav :name="user.name"/>
    </template>
    <span class="navbar-brand mb-0 h1">{{ title }}</span>
  </nav>
</template>
<script>
import Navigation from './Navigation'
export default {
  name: 'Header',
  props: ['user'],
  components: {
    Navigation
  },
  data() {
    return {
      title: 'Receipt Management'
    };
  }
};
</script>
