<template>
  <div>
    <div class="container">
      <div class="tab-pane fade show active">
        <div class="row">
          <div class="col-md-12">
            <h3>Enter details below to create a receipt</h3>
            <form @submit.prevent="onSubmit">
              <div class="form-group">
                <label for="">Receipt Name</label>
                <input type="text" required class="form-control"
                       placeholder="e.g. Grocery Receipt"
                       v-model="receipt.name">
              </div>
              <div class="form-group">
                <label for="">Amount:</label><span>${{ receipt.amount }}</span>
              </div>
              <hr />
              <h3>Transactions</h3>
              <div class="form-group">
                <label for="">Add Transaction</label>
                <button type="button" class="btn btn-primary"
                        data-toggle="modal"
                        data-target="#transactionModal">
                        +
                </button>

                <div class="modal" id="transactionModal"
                     tabindex="-1" role="dialog"
                     aria-labelledby="transactionModalLabel"
                     aria-hidden="true">
                  <div class="modal-dialog role="document">
                    <div class="modal-content">
                      <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">Add Transaction</h5>
                        <button type="button" class="close" data-dismiss="modal"
                                aria-label="Close">x</button>
                      </div>
                      <div class="modal-body">
                        <div class="form-group">
                          <label for="">Transaction Name</label>
                          <input type="text" id="txn_name_modal"
                                 class="form-contol">
                        </div>
                        <div class="form-group">
                          <label for="">$$ Price $$ </label>
                          <input type="text" id="txn_price_modal"
                                 class="form-contol">
                        </div>
                        <div class="modal-footer">
                          <button type="button" class="btn btn-secondary"
                                  data-dismiss="modal">Discard Transaction</button>
                          <button type="button" class="btn btn-primary"
                                  data-dismiss="modal"
                                  @click="saveTransaction()">Save transaction</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-md-12">
                  <table class="table">
                    <thead>
                      <tr>
                        <th scope="col">#</th>
                        <th scope="col">Transaction Name</th>
                        <th scope="col">Price $$</th>
                        <th scope="col"></th>
                      </tr>
                    </thead>
                    <tbody>
                      <template v-for="txn in transactions">
                        <tr :key="txn.id">
                          <th>{{ txn.id }}</th>
                          <td>{{ txn.name }}</td>
                          <td>{{ txn.price }}</td>
                          <td><button type="button" class="btn btn-danger"
                                      @click="deleteTransaction(txn.id)">X</button></td>
                        </tr>
                      </template>
                    </tbody>
                  </table>
                </div>

                <div class="form-group">
                  <button class="btn btn-primary">Create Receipt</button>
                  {{ loading }}
                  {{ status }}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  <script>
  import axios from 'axios';
  export default {
    name: 'CreateReceipt',
    data() {
      return {
        receipt: {
          name: "",
          amount: 0,
        },
        transactions: [],
        nextTxnId: 1,
        loading: "",
        status: ""
      };
    },
    methods: {
      saveTransaction() {
        let name = document.getElementById("txn_name_modal").value;
        let price = document.getElementById("txn_price_modal").value;

        if(name.length != 0 && price > 0){
          this.transactions.push({
            id: this.nextTxnId,
            name: name,
            price: price
          });
          this.nextTxnId++;
          this.calcTotal();
          document.getElementById("txn_name_modal").value = "";
          document.getElementById("txn_price_modal").value = 0;
        }
      },
      deleteTransaction(id) {
        let newList = this.transactions.filter(function(el){
          return el.id != id;
        });
        this.nextTxnId--;
        this.transactions = newList;
        this.calcTotal();
      },
      calcTotal() {
        let total = 0;
        this.transactions.forEach(element => {
          total += parseInt(element.price);
        });
        this.receipt.amount = total;
      },
      onSubmit() {
        const formData = new FormData();
        let txn_names = [];
        let txn_prices = [];
        this.transactions.forEach(element => {
          txn_names.push(element.name);
          txn_prices.push(element.price);
        });

        formData.append("name", this.receipt.name);
        formData.append("txn_names", txn_names);
        formData.append("txn_prices", txn_prices);
        //formData.append("user_id", this.$route.params.user.id);
        this.loading = "Creating Receipt, please wait ...";

        axios.post("http://localhost:5000/receipt", formData).then(res => {
          this.loading = "";
          if(res.data.status == true){
            this.status = res.data.message;
          } else {
            this.status = res.data.message;
          }
        });
      }
    }
  };
  </script>
  <style scoped>
  h1,
  h2 {
    font-weight: normal;
  }
  ul {
    list-style-type: none;
    padding: 0;
  }
  li {
    display: inline-block;
    margin: 0 10px;
  }
  a {
    color: #426cb9;
  }
  .tab-pane {
    margin-top: 20px;
  }
  </style>
