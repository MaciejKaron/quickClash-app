<template>
   <div class="col-md-12 main-register-box">
    <div class="card card-container">
      <Form @submit="handleRegister" :validation-schema="schema">
        <div v-if="!successful">
          <div class="form-group">
            <label for="username">Username</label>
            <Field name="username" type="text" class="form-control field-input" />
            <ErrorMessage name="username" class="error-feedback" />
          </div>
          <div class="form-group">
            <label for="email">Email</label>
            <Field name="email" type="email" class="form-control field-input" />
            <ErrorMessage name="email" class="error-feedback" />
          </div>
          <div class="form-group">
            <label for="password">Password</label>
            <Field name="password" type="password" class="form-control field-input" />
            <ErrorMessage name="password" class="error-feedback" />
          </div>
          <div class="form-group">
            <label for="repeatPassword">Repeat password</label>
            <Field name="repeatPassword" type="password" class="form-control field-input" />
            <ErrorMessage name="repeatPassword" class="error-feedback" />
          </div>

          <div class="form-group">
            <button class="btn btn-primary btn-block register-button" :disabled="loading">
              <span
                v-show="loading"
                class="spinner-border spinner-border-sm"
              ></span>
              Sign Up
            </button>
          </div>
        </div>
      </Form>

      <div class="succes-register" v-if="message">
        <font-awesome-icon class="faa-wrench animated faa-slow" id="thumb-icon" icon="thumbs-up" />
        <div class="success-txt">
        {{ message }}
        </div>
      </div>
      <div class="error-register" v-if="errorMessage && !message">
        <div class="error-txt">
        {{ errorMessage }}
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { Form, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";

export default {
    name: "Register-comp",
    components: {
        Form,
        Field,
        ErrorMessage,
    },
    data() {
        const schema = yup.object().shape({
      username: yup
        .string()
        .required("Username is required!")
        .min(3, "Must be at least 3 characters!")
        .max(20, "Must be maximum 20 characters!"),
      email: yup
        .string()
        .required("Email is required!")
        .email("Email is invalid!")
        .max(50, "Must be maximum 50 characters!"),
      password: yup
        .string()
        .required("Password is required!")
        .min(6, "Must be at least 6 characters!")
        .max(40, "Must be maximum 40 characters!"),   
      repeatPassword: yup
            .string()
            .required("Repeat your password")
            .oneOf([yup.ref('password'), null], 'Password must match')
        })
        return {
            successful: false,
            loading: false,
            message: "",
            errorMessage: "",
            schema,
        }
    },
    computed: {
        loggedIn() {
            return this.$store.state.auth.status.loggedIn;
        },
    },
    mounted() {
        if (this.loggedIn) {
            this.$router.push("/profile");
        }
  },
  created() {
    var test = document.body;
    test.style.backgroundImage = `url(${require('@/assets/backgroundTT2.jpg')})`
        test.style.backgroundPosition = "right"
    },
    methods: {
        handleRegister(user) {
            this.message = ""
            this.successful = false
            this.loading = true
            this.$store.dispatch("auth/register", user).then(
                (data) => {
                    this.message = data.message
                    this.successful = true
                    this.loading = false
                },
                (error) => {
                    this.errorMessage = 
                        (error.response &&
                        error.response.data &&
                            error.response.data.message) ||
                        error.message ||
                        error.toString()
                    this.successful = false
                    this.loading = false
                }
            )
        }
    }
}
</script>
<style scoped>

.main-register-box{
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
  height: 34em;
  padding: 40px 40px;
  background-color: rgb(26,26,29, 0.5);
  color: white;
  box-shadow:0px 0px 12px 1px #c3073f;
}

label {
  display: block;
  margin-top: 10px;
}

.field-input {
  background-color: #141417;
  color: white;
}

.error-feedback {
  color: red;
}

.register-button {
  background-color: #6f2232;
  color: white;
  border: 2px solid #950740;
  border-radius:5px;
  cursor: pointer;
  filter: drop-shadow(0 0 4px #c3073f) drop-shadow(0 0 8px #c3073f) ;
  transition: .5s;
}

.register-button:hover {
  color: white;
  background-color: #c3073f;
  filter: drop-shadow(0 0 6px #950740);
}

.succes-register{
  color: green;
  display: flex;
  align-items: center;
  justify-content: center;
  display: block;
}

.success-txt{
  text-align: center;
  font-size: 28px;
  display: block;
}

.error-txt{
  text-align: center;
  font-size: 28px;
  display: block;
  color: red;
}

#thumb-icon{
  width: 8em;
  height: 8em;
  margin-bottom: 4em;
}
</style>