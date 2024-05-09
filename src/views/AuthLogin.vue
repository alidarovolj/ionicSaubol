<script setup>
import {useRouter} from "vue-router";
import {
  IonPage,
  IonContent,
  IonCol,
  IonImg,
  IonInput,
  IonButton,
  toastController,
  IonRow,
  IonText,
  IonCard,
  IonGrid
} from "@ionic/vue";
import {useUserStore} from "@/stores/user.js";
import {Form, ErrorMessage, Field} from "vee-validate";
import * as yup from 'yup';
import axios from "@/utils/axios";

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

const setOpen = async (state, text) => {
  const toast = await toastController.create({
    message: text,
    duration: 1500,
    position: 'bottom',
  });

  await toast.present();
};

const sendForm = async (values) => {
  axios.post("/auth/staff-login", values)
      .then(async response => {
        console.log(response);

        if (response.status === 200) {
          localStorage.setItem("token", "Bearer " + response.data.access_token);
          localStorage.setItem("token_exp", response.data.expires_in);
          await user.getProfile()
          await router.push('/my-profile/data')
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
    <ion-content
        ref="content"
        class="ion-padding">
      <ion-col
          size="12"
          class="center-content">
        <ion-card
            color="light"
            style="width: 100%"
            class="ion-padding">
          <ion-grid>
            <ion-row
                style="gap: 10px; width: max-content; margin: 0 auto;"
                class="ion-align-items-center">
              <ion-img
                  style="width: 35%"
                  src="./assets/img/logo.png"
                  alt="Logo"
              ></ion-img>
              <ion-text style="font-size: 30px; font-weight: 600">
                Saubol
              </ion-text>
            </ion-row>
          </ion-grid>
          <Form
              style="width: 100%"
              @submit="sendForm"
              :validation-schema="schema">
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
        </ion-card>
      </ion-col>
    </ion-content>
  </ion-page>
</template>