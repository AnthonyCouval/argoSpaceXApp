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
            <lightbox :images="images" :showThumbs="showThumbs" ref="lightbox"></lightbox>
            <v-card class="group-custom-home">
                <v-card-title>
                    <div>
                        <v-alert success dismissible v-model="alertSuccess">
                            {{ messageSucces }}
                        </v-alert>
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
                                        v-bind:value="props.item.name"
                                        v-on:change="e => props.item.name = e.target.value"
                                        single-line counter="counter"
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

    .group-custom-home .input-group__details:after {
        background-color: #0D47A1 !important;
    }

    .custom-card, .icon-touch {
        cursor: pointer;
    }
    .custom-card:hover {
        background-color: rgba(0,0,0,.12);
    }
        .custom-icon {
            width: 54px;
            justify-content: flex-start!important;
            font-size: 21px!important;
        }

        .custom-icon + span {
            font-size: 13px!important;
        }

    .vue-lb-footer-count {
        display:none!important;
    }
</style>
<script>
    import axios from 'axios';
    import Lightbox from 'vue-image-lightbox';

    export default {
        components: {
            Lightbox
        },
        data() {
            return {
                search: '',
                pagination: {},
                alertSuccess: false,
                messageSucces: '',
                drawer: true,
                selected: [],
                images: [],
                showThumbs: false,
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
        methods: {
            getAllShip() {
                axios({
                    method: 'get',
                    url: 'https://xjifswdgii.localtunnel.me/ship'
                }).then((response) => {
                    this.ships = response.data;
                }).catch((e) => {
                });
            },
            putValue(item) {
                if (item.newName !== item.name) {
                    axios({
                        method: 'put',
                        url: `https://xjifswdgii.localtunnel.me/ship/${item._id}`,
                        data: item
                    }).then((response) => {
                        if (response.data.status === 'success') {
                            this.alertSuccess = true;
                            this.messageSucces = response.data.message;
                        }
                    }).catch((e) => {
                        console.log(e);
                    });
                }
            },
            logout() {
                axios({
                    method: 'get',
                    url: 'https://xjifswdgii.localtunnel.me/user/logout'
                }).then((response) => {
                    if (response.data.status === 'success') {
                        this.$router.push('/login');
                    }
                }).catch((e) => {
                    console.log(e);
                });
            },
            showImg(url) {
                if (url !== 'undefined') {
                    this.images = [{
                        thumb: url,
                        src: url
                    }];
                    this.$refs.lightbox.lightBoxOn = true;
                }
            }
        }
    };
</script>
