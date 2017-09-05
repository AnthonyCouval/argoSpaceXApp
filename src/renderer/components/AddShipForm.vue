<template id="addShipForm">
    <v-dialog v-model="dialog" persistent>
        <v-card>
            <v-form ref="addShip">
                <v-card-title>
                    <span class="headline">Add a ship</span>
                </v-card-title>
                <v-card-text>
                    <v-text-field
                            label="Name"
                            v-model="name"
                            required
                            :rules="requiredRules"
                    ></v-text-field>
                    <v-select
                            label="Active"
                            v-model="active"
                            required
                            :items="['True', 'False']"
                            :rules="requiredRules"
                    ></v-select>
                    <v-text-field label="Stages" v-model="stages"></v-text-field>
                    <v-text-field label="Cost per launch" v-model="cpl" prefix="$"></v-text-field>
                    <v-text-field label="Success rate pourcent" v-model="srp" suffix="%"></v-text-field>
                    <v-menu
                            lazy
                            :close-on-content-click="false"
                            v-model="menu"
                            transition="scale-transition"
                            offset-y
                            full-width
                            :nudge-left="40"
                            max-width="290px"
                    >
                        <v-text-field
                                slot="activator"
                                label="First flight"
                                v-model="firstFlight"
                                prepend-icon="event"
                                readonly
                        ></v-text-field>
                        <v-date-picker v-model="firstFlight" no-title scrollable actions>
                            <template scope="{ save, cancel }">
                                <v-card-actions>
                                    <v-btn flat primary @click.native="cancel()">Cancel</v-btn>
                                    <v-btn flat primary @click.native="save()">Save</v-btn>
                                </v-card-actions>
                            </template>
                        </v-date-picker>
                    </v-menu>
                    <v-text-field label="Launchpad" v-model="launchpad"></v-text-field>
                    <v-text-field label="Country" v-model="country"></v-text-field>
                    <v-text-field label="Company" v-model="company"></v-text-field>
                    <v-text-field label="Description" v-model="description" multi-line></v-text-field>
                    <v-text-field label="Url picture" v-model="urlPicture"></v-text-field>
                    <small>*indicates required field</small>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn class="blue--text text--darken-4" flat @click.native="closeDialog">Close
                    </v-btn>
                    <v-btn class="blue--text text--darken-4" flat @click="submitShip" type="submit">Submit
                    </v-btn>
                </v-card-actions>
            </v-form>
        </v-card>
    </v-dialog>
</template>

<script>
    import axios from 'axios';
    import config from '../../main/config';

    export default {
        props: ['dialog'],
        data() {
            return {
                requiredRules: [
                    v => !!v || 'Required'
                ],
                name: '',
                active: '',
                stages: '',
                cpl: '',
                srp: '',
                firstFlight: null,
                launchpad: '',
                country: '',
                company: '',
                description: '',
                urlPicture: '',
                menu: false,
                valid: false
            };
        },
        methods: {
            closeDialog() {
                this.$emit('closeDialog', false);
            },
            submitShip() {
                this.$refs.addShip.validate();
                const data = {
                    name: this.name,
                    active: this.active,
                    stages: this.stages,
                    costPerLaunch: this.cpl,
                    successRatePct: this.srp,
                    firstFlight: this.firstFlight,
                    launchpad: this.launchpad,
                    country: this.country,
                    company: this.company,
                    description: this.description,
                    coverUrl: this.urlPicture
                };
                axios({
                    method: 'post',
                    url: `${config.apiUrl}/ship`,
                    data
                }).then((response) => {
                    this.data = response.data;
                }).catch((e) => {
                    this.messageError = e.response;
                });
            }
        }
    };
</script>