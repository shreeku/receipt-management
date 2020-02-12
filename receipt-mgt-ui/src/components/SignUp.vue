<template>
  <div>
    <Header />

    <div class="container">

    <ul class="nav nav-pills nav-fill mb-3" id="tab" role="tablist">
        <li class="nav-item">
            <a class="nav-link active" id="login-tab" data-toggle="pill" href="#login" role="tab" aria-controls="pills-upload" aria-selected="true">Log in</a>
        </li>
        <li class="nav-item">
            <a class="nav-link" id="register-tab" data-toggle="pill" href="#register" role="tab" aria-controls="pills-verify" aria-selected="false">Register</a>
        </li>
    </ul>

    <div class="tab-content" id="tabContent">
        <div class="tab-pane fade show active" id="login" role="tabpanel" aria-labelledby="login-tab">
            <div class="row">
                <div class="col-md-12">
                    <form @submit.prevent="login">
                        <div class="form-group">
                            <label for="">Email:</label>
                            <input type="email" required class="form-control" placeholder="e.g. abc@world.com" v-model="model.email">
                        </div>

                        <div class="form-group">
                            <label for="">Password:</label>
                            <input type="password" required class="form-control" placeholder="Enter Password" v-model="model.password">
                        </div>

                        <div class="form-group">
                            <button class="btn btn-success btn-light btn-large" >Login</button>
                            {{ loading }}
                            {{ status }}
                        </div>
                    </form>
                </div>
            </div>
        </div>
        <div class="tab-pane fade" id="register" role="tabpanel" aria-labelledby="register-tab">
            <div class="row">
                <div class="col-md-12">
                    <form @submit.prevent="register">
                        <div class="form-group">
                            <label for="">Name:</label>
                            <input type="text" required class="form-control" placeholder="e.g. Shreeku" v-model="model.name">
                        </div>

                        <div class="form-group">
                            <label for="">Email:</label>
                            <input type="email" required class="form-control" placeholder="e.g. abc@world.com" v-model="model.email">
                        </div>

                        <div class="form-group">
                            <label for="">Password:</label>
                            <input type="password" required class="form-control" placeholder="Enter Password" v-model="model.password">
                        </div>
                        <div class="form-group">
                            <label for="">Confirm Password:</label>
                            <input type="password" required class="form-control" placeholder="Confirm Passowrd" v-model="model.c_password">
                        </div>

                        <div class="form-group">
                            <button class="btn btn-primary" >Register</button>
                            {{ loading }}
                            {{ status }}
                        </div>
                    </form>
                </div>
            </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Header from './Header';
import axios from 'axios';
export default {
  name: 'SignUp',
  components: {
    Header
  },
  data() {
    return {
      model: {
        name: "",
        email: "",
        password: "",
        c_password: ""
      },
      loading: "",
      status: ""
    };
  },
  methods: {
    validate() {
      if(this.model.password != this.model.c_password){
        return false;
      }
      return true;
    },
    register() {
      const formData = new FormData();
      let valid = this.validate();
      if(valid){
        formData.append("name", this.model.name);
        formData.append("email", this.model.email);
        formData.append("password", this.model.password);
        //formData.append("confirm password", this.model.c_password);

        for(var pair of formData.entries()){
          console.log(pair[0]+ ' '+ pair[1]);
        }
        console.log(this.model.name + ' ' + this.model.email + ' ' + this.model.password)

        this.loading = "One Moment please, Registeing . . .";
        axios.post("http://localhost:5000/register", formData).then(res => {
          this.loading = "";
          if(res.data.status == true){
            this.$router.push({
              name: "Dashboard",
              params: { user: res.data.user }
            });
          } else{
            this.status = res.data.message;
          }
        }).catch(console.error);
      } else {
        alert("Password Incorrect !!!");
      }
    },
    login() {
      const formData = new FormData();
      formData.append("email", this.model.email);
      formData.append("password", this.model.password);
      this.loading = "Signing you in . . .";
      axios.post("hhtp://localhost:5000/login", formData).then(res => {
        this.loading = "";
        if(res.data.status == true){
          this.$router.push({
            name: "Dashboard",
            params: { user: res.data.user }
          });
        } else {
          this.status = res.data.message;
        }
      });
    }
  }
};
</script>
