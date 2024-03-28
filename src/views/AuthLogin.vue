<script setup lang="ts">
import {useRouter} from "vue-router";
import {IonPage, IonContent, IonGrid, IonCol, IonImg, IonInput, IonButton, toastController} from "@ionic/vue";
import axios from "@/utils/axios";
import {useUserStore} from "@/stores/user.js";
import * as yup from 'yup';
import {Form, ErrorMessage, Field} from "vee-validate";

const user = useUserStore();
const router = useRouter();

const schema = yup.object().shape({
  login: yup
      .string()
      .email('Пожалуйста, введите правильный email')
      .required('Пожалуйста, введите email или номер телефона'),
  password: yup
      .string()
      .min(5, (data) => `Минимальная длина ${data.label} - 5 символов`)
      .required('Пожалуйста, введите пароль'),
})

const setOpen = async (state: boolean, text: string) => {
  const toast = await toastController.create({
    message: text,
    duration: 1500,
    position: 'bottom',
  });

  await toast.present();
};

const sendForm = async (values: any) => {
  axios.post("/auth/staff-login", values)
      .then(async response => {
        console.log(response);

        if (response.status === 200) {
          localStorage.setItem("token", "Bearer " + response.data.access_token);
          localStorage.setItem("token_exp", response.data.expires_in);
          await user.getProfile()
          await router.push('/main')
        }
      })
      .catch(error => {
        console.log(error.message);
        setOpen(true, "Неверный логин или пароль");
      });
}
</script>

<template>
  <ion-page>
    <ion-content class="ion-padding">
      <ion-col class="center-content">
        <Form
            style="width: 100%"
            @submit="sendForm"
            :validation-schema="schema">
          <ion-img
              src="./assets/img/main-color-logo.svg"
              alt="Ionic Vue logo"
              class="center-content"
              style="width: 50%; margin: 0 auto; display: block;"
          />
          <ion-col>
            <Field v-slot="{ handleChange, value }" name="login">
              <ion-input
                  @change="handleChange"
                  :value="value"
                  label="Номер телефона или email"
                  name="login"
                  id="login"
                  type="text"
                  label-placement="floating"
                  placeholder="Введите номер телефона или email">
              </ion-input>
            </Field>
            <ErrorMessage
                class="error-text"
                name="login"
            />
          </ion-col>
          <ion-col>
            <Field v-slot="{ handleChange, value }" name="password">
              <ion-input
                  @change="handleChange"
                  :value="value"
                  label="Пароль"
                  name="password"
                  id="password"
                  type="password"
                  label-placement="floating"
                  placeholder="Введите пароль">
              </ion-input>
            </Field>
            <ErrorMessage
                class="error-text"
                name="password"
            />
          </ion-col>
          <ion-button
              type="submit"
              style="color: #fff"
              fill="solid"
              shape="round"
              expand="full">
            Войти
          </ion-button>
        </Form>
      </ion-col>
    </ion-content>
  </ion-page>
</template>