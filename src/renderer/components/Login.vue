<template>
    <v-layout>
        <v-flex xs5 offset-sm3>
            <form @submit.prevent="signIn">
                <v-card>
                    <v-flex xs12 sm6 offset-sm3>
                        <img src="~@/assets/argolight-logo.png" width="100%">
                        <v-text-field
                                name="username"
                                v-model="username"
                                label="Username"
                                id="username"
                        ></v-text-field>
                        <v-text-field
                                name="password"
                                v-model="password"
                                label="Password"
                                id="password"
                        ></v-text-field>
                        <v-flex offset-sm9>
                            <v-btn type="submit" flat class="teal--text">Login</v-btn>
                        </v-flex>
                    </v-flex>
                </v-card>
            </form>
        </v-flex>
    </v-layout>
</template>
<style>
    .input-group__details:after {
        background-color: #009688 !important;
    }

    .input-group--focused.input-group--text-field:not(.input-group--single-line):not(.input-group--error) label {
        color: #009688 !important;
    }

    img {
        display: block;
        margin: 20px auto 20px auto;
        padding-top: 20px;
    }
</style>
<script>
    import axios from 'axios';

    export default {
        data() {
            return {
                username: '',
                password: ''
            };
        },
        computed: {
            formIsValid() {
                return this.username !== ''
                    && this.password !== '';
            }
        },
        methods: {
            signIn() {
                if (!this.formIsValid) {
                    return; // @TODO message d'erreur
                }
                const userData = {
                    username: this.username,
                    password: this.password
                };
                axios({
                    method: 'post',
                    url: 'http://localhost:3000/user/login',
                    data: userData
                }).then((response) => {
                    if (response.data.status === 'success') {
                        this.$router.push('/home');
                    }
                }).catch((e) => {
                    console.log(e);
                });

               /* this.$store.dispatch('createMeetup', meetupData);
                this.$router.push('/meetups');*/
            }
        }
    };
</script>