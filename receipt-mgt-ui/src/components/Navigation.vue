<template>
  <div>
    <span style="font-size:25px;cursor:pointer"
          @click="openNav">&#9776;</span>
    <div id="leftsidenav" class="nav">
      <p style="font-size:12px;cursor:pointer"
         @click="closeNav"><em>Close Nav</em></p>
      <h3>Welcome {{ name }}</h3>
      <p class="clickable"
         @click="setActivate('create')">Create Receipt</p>
      <p class="clickable"
         @click="setActivate('view')">View Receipts</p>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Navigation',
  props: ['name'],
  methods: {
    setActivate(option){
      this.$parent.$parent.isactive = option;
    },
    openNav(){
      document.getElemntById("leftsidenav").style.width = "20%";
    },
    closeNav(){
    document.getElemntById("leftsidenav").style.width = "0%";
    }
  }
};
</script>
