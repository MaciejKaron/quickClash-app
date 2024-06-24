<template>
 <div class = "col-md-12 main-login-box">
  <div class="card card-container">
      <Form @submit="handleLogin" :validation-schema="schema">
      <div class="form-group">
          <label for="username">Username</label>
          <Field name="username" type="text" class="form-control login-field-input"></Field>
          <ErrorMessage name="username" class="error-feedback"></ErrorMessage>
      </div>
      <div class="form-group">
          <label for="password">Password</label>
          <Field name="password" type="password" class="form-control login-field-input"></Field>
          <ErrorMessage name="password" class="error-feedback"></ErrorMessage>
      </div>
      <div class="form-group">
          <button class="btn btn-primary btn-block login-button" :disabled="loading">
          <span v-show="loading" class="spinner-border spinner-border-sm"></span>
          <span>Login</span>
          </button>
      </div>
      <div class="form-group">
          <div v-if="message">
            <div class="login-succes-txt">
          {{ message }}
            </div>
          </div>
      </div>
      </Form>
  </div>   
 </div>
</template>
<script>
import { Form, Field, ErrorMessage } from 'vee-validate'
import * as yup from 'yup'

export default {
    name: "Login-comp",
    components: {
        Form,
        Field,
        ErrorMessage,
    },
    data() {
        const schema = yup.object().shape({
            username: yup.string().required("Username is required!"),
            password: yup.string().required("Password is required!"),
        })
        return {
            loading: false,
            message: "",
            schema,
        }
    },
    computed: {
        loggedIn() {
            return this.$store.state.auth.status.loggedIn
        },
    },
    created() {
        if (this.loggedIn) {
            this.$router.push('/home')
      }

      var test = document.body;
      test.style.backgroundImage = `url(${require('@/assets/backgroundCT2.jpg')})`
      test.style.backgroundPosition = "left"
    },
    methods: {
        handleLogin(user) {
            this.loading = true
            this.$store.dispatch('auth/login', user).then(
                () => {
                this.$router.push('/home')
                  .then(() => {
                    window.location.reload();
                    })
                },
                (error) => {
                    this.loading = false
                    this.message = (
                        error.response &&
                        error.response.data &&
                        error.response.data.message) ||
                        error.message ||
                        error.toString()
                }
            )
        }
    }
}
</script>
<style scoped>
.main-login-box{
  height: 42em;
display: flex;
align-items: center;
justify-content: center;
  color: white;
  font-family: roboto;
  text-align: center;
}

.card-container.card {
  width: 24em;
  height: 24em;
  padding: 40px 40px;
  background-color: rgb(26,26,29, 0.5);
  color: white;
  box-shadow:0px 0px 12px 1px #c3073f;
}

label {
  display: block;
  margin-top: 10px;
}

.error-feedback {
  color: red;
}

.login-button {
    margin-top: 2em;
  background-color: #6f2232;
  color: white;
  border: 2px solid #950740;
  border-radius:5px;
  cursor: pointer;
  filter: drop-shadow(0 0 4px #c3073f) drop-shadow(0 0 8px #c3073f) ;
  transition: .5s;
}

.login-button:hover {
  color: white;
  background-color: #c3073f;
  filter: drop-shadow(0 0 6px #950740);
}

.login-field-input {
  background-color: #141417;
  color: white;
}
</style>