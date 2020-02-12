<template>
  <div>
    <div class="container">
      <div class="tab-pane fade show active">
        <div class="row">
          <div class="col-md-12">
            <h3>List of Receipts</h3>
            <table class="table">
              <thead>
                <tr>
                  <th scope="col">Receipt#</th>
                  <th scope="col">Receipt Name</th>
                  <th scope="col">Status</th>
                  <th scope="col"></th>
                </tr>
              </thead>
              <tbody>
                <template v-for="receipt in receipts">
                  <tr>
                    <th scope="row">{{ receipt.id }}</th>
                    <td>{{ receipt.name }}</td>
                    <td v-if="receipt.amount == 0">Unpaid</td>
                    <td v-else>Paid</td>
                    <td><a href="#" class="btn btn-success">TO RECEIPT</a></td>
                  </tr>
                </template>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import axios from 'axios';
export default {
  name: 'ViewReceipts',
  data() {
    return {
      receipts: [],
      user: this.$route.params.user
    };
  },
  mounted() {
    axios
      .get(`http://localhost:5000/receipt/user/${this.user.id}`)
      .then(res => {
        if(res.data.status == true){
          this.receipts = res.data.receipts;
        }
      });
  }
}
</script>
