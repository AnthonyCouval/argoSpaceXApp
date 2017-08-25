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
                                :rules="rules"
                        ></v-text-field>
                        <v-text-field
                                type="password"
                                name="password"
                                v-model="password"
                                label="Password"
                                id="password"
                                :rules="rules"
                        ></v-text-field>
                        <v-flex>
                        <v-alert error dismissible transition="scale-transition" v-model="alert">
                            Wrong username or password.
                        </v-alert>
                        </v-flex>
                        <v-flex offset-sm9>
                            <v-btn type="submit" @click.native="validate" flat class="teal--text">Login</v-btn>
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
                rules: [],
                isValidate: false,
                username: '',
                password: '',
                alert: false
            };
        },
        watch: {
            username() {
                if (this.username.length > 0) {
                    this.isValidate = true;
                    this.rules = [() => !!this.username || 'Required'];
                } else {
                    this.isValidate = false;
                    this.rules = [];
                }
            }
        },
        methods: {
            validate() {
                this.rules = [() => !!this.username || 'Required'];
            },
            signIn() {
                if (this.isValidate === true) {
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
                        if (e.response.statusText === 'Unauthorized') {
                           this.alert = true;
                        }
                    });
                }
            }
        }
    };
</script>