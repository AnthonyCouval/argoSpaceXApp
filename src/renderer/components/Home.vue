<template>
    <v-app
            height="415px"
            id="e3"
            standalone
    >
        <v-navigation-drawer
                class="pb-0"
                persistent
                permanent
                absolute
                height="100%"
                clipped
                enable-resize-watcher
                v-model="drawer"
        >
            <img src="~@/assets/spacex-logo.png">
            <v-divider></v-divider>
            <v-list dense>
                <v-list-tile v-for="item in items" :key="item.text">
                    <v-list-tile-action>
                        <v-icon>{{ item.icon }}</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title>
                            {{ item.text }}
                        </v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
            </v-list>
            <v-divider></v-divider>

            <v-card>
                <v-card-text class="custom-card" @click="logout">
                    <v-icon class="custom-icon">exit_to_app</v-icon>
                    <span>Logout</span>
                </v-card-text>
            </v-card>
        </v-navigation-drawer>
        <main>
            <div>
                <v-alert success dismissible v-model="alertSuccess">
                    {{ messageSuccess }}
                </v-alert>
                <v-alert error  dismissible v-model="alertError">
                    {{ messageError}}
                </v-alert>
            </div>
            <lightbox :images="images" :showThumbs="showThumbs" ref="lightbox" class="lightbox"></lightbox>
            <v-card class="group-custom-home">
                <v-card-title>
                    <div class="text-xs-center">
                        <v-btn
                                flat
                                class="blue--text text--darken-4"
                                @click.native="dialog = true"
                                slot="activator"
                        >
                            Add
                        </v-btn>
                        <v-btn
                                flat
                                class="blue--text text--darken-4"
                                :disabled="disabled"
                                @click="removeShip"
                        >
                            Remove
                        </v-btn>
                    </div>
                    <v-spacer></v-spacer>
                    <v-text-field
                            append-icon="search"
                            label="Search"
                            single-line
                            hide-details
                            v-model="search"
                    ></v-text-field>
                </v-card-title>
                <v-data-table
                        v-bind:headers="headers"
                        v-bind:items="ships"
                        v-bind:search="search"
                        v-model="selected"
                        selected-key="name"
                        select-all="blue darken-4"
                        class="elevation-1"
                >
                    <template slot="headerCell" scope="props">
                        <span v-tooltip:bottom="{ 'html': props.header.text }">
                        {{ props.header.shortText || props.header.text }}
                        </span>
                    </template>
                    <template slot="items" scope="props">
                        <td>
                            <v-checkbox
                                    color="blue darken-4"
                                    primary
                                    hide-details
                                    v-model="props.selected"
                            ></v-checkbox>
                        </td>
                        <td>
                            <v-edit-dialog
                                    @open="props.item.newName = props.item.name"
                                    @cancel="putValue(props.item)"
                                    lazy
                            > {{ props.item.name }}
                                <v-text-field
                                        slot="input"
                                        label="Edit"
                                        v-model="props.item.name"
                                        single-line
                                        counter="counter"
                                        :rules="[max25chars]"
                                ></v-text-field>
                            </v-edit-dialog>
                        </td>
                        <td class="text-xs-right">{{ props.item.active }}</td>
                        <td class="text-xs-right">{{ props.item.stages }}</td>
                        <td class="text-xs-right">{{ props.item.costPerLaunch }}</td>
                        <td class="text-xs-right">{{ props.item.successRatePct }}</td>
                        <td class="text-xs-right">{{ props.item.firstFlight }}</td>
                        <td class="text-xs-right">{{ props.item.launchpad }}</td>
                        <td class="text-xs-right">{{ props.item.country }}</td>
                        <td class="text-xs-right">{{ props.item.company }}</td>
                        <td class="text-xs-right">{{ props.item.description }}</td>
                        <td class="text-xs-right">
                            <v-icon class="icon-touch" @click="showImg(props.item.coverUrl)">visibility</v-icon>
                        </td>

                    </template>
                    <template slot="pageText" scope="{ pageStart, pageStop }">
                        From {{ pageStart }} to {{ pageStop }}
                    </template>
                </v-data-table>
            </v-card>
            <v-layout row justify-center>
                <v-dialog v-model="dialog" persistent>
                    <v-card>
                        <AddShipForm></AddShipForm>
                    </v-card>
                </v-dialog>
            </v-layout>
        </main>
    </v-app>
</template>
<style>
    .navigation-drawer--persistent.navigation-drawer--clipped {
        margin-top: 0 !important;
        max-height: 100% !important;
    }

    aside img {
        padding: 20px !important;
    }

    .input-group--focused .icon {
        color: #0D47A1 !important;
    }

    .blue--text.btn--disabled {
        color: rgba(0, 0, 0, .26)!important;
    }

    .group-custom-home .input-group__details:after {
        background-color: #0D47A1 !important;
    }

    .custom-card, .icon-touch {
        cursor: pointer;
    }

    .custom-card:hover {
        background-color: rgba(0, 0, 0, .12);
    }

    .custom-icon {
        width: 54px;
        justify-content: flex-start !important;
        font-size: 21px !important;
    }

    .custom-icon + span {
        font-size: 13px !important;
    }

    .vue-lb-footer-count {
        display: none !important;
    }

    .lightbox > .vue-lb-container{
        padding-left: 300px;
    }
</style>
<script>
    import axios from 'axios';
    import Lightbox from 'vue-image-lightbox';
    import AddShipForm from './AddShipForm.vue';
    import config from '../../main/config';

    export default {
        components: {
            Lightbox,
            AddShipForm
        },
        data() {
            return {
                max25chars: v => v.length <= 25 || 'Input too long!',
                search: '',
                pagination: {},
                alertSuccess: false,
                alertError: false,
                messageSuccess: '',
                messageError: '',
                drawer: true,
                selected: [],
                images: [],
                showThumbs: false,
                disabled: true,
                dialog: false,
                headers: [
                    {
                        text: 'Name',
                        align: 'left',
                        value: 'name'
                    },
                    {text: 'Active', value: 'active'},
                    {text: 'Stages', value: 'stages'},
                    {shortText: 'CPL ($)', text: 'Cost per launch ($)', value: 'costPerLaunch'},
                    {shortText: 'SRP (%)', text: 'Success rate pourcent (%)', value: 'successRatePct'},
                    {text: 'First flight', value: 'firstFlight'},
                    {text: 'Launchpad', value: 'launchpad'},
                    {text: 'Country', value: 'country'},
                    {text: 'Company', value: 'company'},
                    {text: 'Description', value: 'description'},
                    {text: 'Picture', value: 'coverUrl'}
                ],
                items: [
                    {icon: 'home', text: 'Lorem'},
                    {icon: 'build', text: 'Ipsum'},
                    {icon: 'bug_report', text: 'Dolor'},
                    {icon: 'compare_arrows', text: 'Sit'},
                    {icon: 'help', text: 'Amet'}
                ],
                ships: []
            };
        },
        mounted() {
            this.getAllShip();
        },
        watch: {
            selected() {
                this.disabled = this.selected.length < 1;
            }
        },
        methods: {
            getAllShip() {
                axios({
                    method: 'get',
                    url: `${config.apiUrl}/ship`
                }).then((response) => {
                    this.ships = response.data;
                }).catch((e) => {
                });
            },
            putValue(item) {
                if (item.newName !== item.name) {
                    axios({
                        method: 'put',
                        url: `${config.apiUrl}/ship/${item._id}`,
                        data: item
                    }).then((response) => {
                        if (response.data.status === 'success') {
                            this.alertSuccess = true;
                            this.messageSuccess = response.data.message;
                        }
                    }).catch((e) => {
                        this.messageError = e.response;
                    });
                }
            },
            logout() {
                axios({
                    method: 'get',
                    url: `${config.apiUrl}/user/logout`
                }).then((response) => {
                    if (response.data.status === 'success') {
                        this.$router.push('/login');
                    }
                }).catch((e) => {
                    this.messageError = e.response;
                });
            },
            showImg(url) {
                if (url !== undefined) {
                    this.images = [{
                        thumb: url,
                        src: url
                    }];
                    this.$refs.lightbox.lightBoxOn = true;
                }
            },
            removeShip() {
                for (const ship of this.selected) {
                    axios({
                        method: 'delete',
                        url: `${config.apiUrl}/ship/${ship._id}`
                    }).then((response) => {
                        if (response.data.status === 'success') {
                            this.alertSuccess = true;
                            this.messageSuccess = response.data.message;
                            //pour retrouver la row correspondante et l'effacer
                            this.selected.forEach((sRow) => {
                                const idx = this.ships.findIndex(mRow => mRow.name === sRow.name);
                                if (idx !== -1) {
                                    this.ships.splice(idx, 1);
                                }
                            });
                        }
                    }).catch((e) => {
                        this.messageError = e.response;
                    });
                }
            }
        }
    };
</script>
