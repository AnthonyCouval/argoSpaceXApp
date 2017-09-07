<template>
    <v-app
            height="415px"
            class="app"
    >
        <v-navigation-drawer
                class="pb-0 indigo-custom"
                persistent
                permanent
                absolute
                height="100%"
                v-model="drawer"
        >
            <img src="~@/assets/spacex-logo-trans.png">
            <v-divider></v-divider>
            <v-list dark dense class="indigo-custom">
                <v-list-tile v-for="item in items" :key="item.text">
                    <v-list-tile-action>
                        <v-icon dark>{{ item.icon }}</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title white class="custom-opacity">
                            {{ item.text }}
                        </v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
            </v-list>
            <v-divider></v-divider>
            <v-card dark class="custom-card indigo-custom">
                <v-card-text @click="logout">
                    <v-icon dark class="custom-icon">exit_to_app</v-icon>
                    <span class="custom-opacity">Logout</span>
                </v-card-text>
            </v-card>
        </v-navigation-drawer>
        <v-toolbar class="white">
            <v-toolbar-title>Manage Ship</v-toolbar-title>
        </v-toolbar>
        <main>
            <div>
                <v-alert success dismissible v-model="alertSuccess">
                    {{ messageSuccess }}
                </v-alert>
                <v-alert error dismissible v-model="alertError">
                    {{ messageError}}
                </v-alert>
            </div>
            <lightbox :images="images" :showThumbs="showThumbs" ref="lightbox" class="lightbox"></lightbox>
            <v-container>
                <v-layout column>
                    <v-flex xs12>
                        <v-container fluid grid-list-md>
                            <v-layout row wrap>
                                <v-flex
                                        v-bind="{ [`xs${card.flex}`]: true }"
                                        v-for="card in cards"
                                        :key="card.title"
                                >
                                    <v-card>
                                        <v-card-media
                                                :src="card.src"
                                        >
                                            <v-container fill-height fluid>
                                                <v-layout fill-height>
                                                    <v-flex d-flex xs12 sm2 child-flex>
                                                        <v-card tile flat>
                                                            <v-icon x-large light :class="card.iconColor">{{ card.icon }}</v-icon>
                                                        </v-card>
                                                    </v-flex>
                                                    <v-flex d-flex xs12 flexbox>
                                                        <v-layout row wrap>
                                                            <v-flex xs12>
                                                        <p class="black--text margin-text" v-text="card.title"></p>
                                                        <p class="black--text margin-text small-text"
                                                           v-text="card.subtitle"></p>
                                                            </v-flex>
                                                            </v-layout>
                                                    </v-flex>
                                                </v-layout>
                                            </v-container>
                                        </v-card-media>
                                    </v-card>
                                </v-flex>
                            </v-layout>
                        </v-container>
                    </v-flex>
                </v-layout>
                <v-layout column>
                    <v-flex xs12>
                        <v-container fluid grid-list-md>
                            <v-card class="datatable-card">
                                <v-card-title>
                                    <div class="text-xs-center">
                                        <v-btn
                                                flat
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
                                            <v-icon class="icon-touch" @click="showImg(props.item.coverUrl)">
                                                visibility
                                            </v-icon>
                                        </td>
                                    </template>
                                    <template slot="pageText" scope="{ pageStart, pageStop }">
                                        From {{ pageStart }} to {{ pageStop }}
                                    </template>
                                </v-data-table>
                            </v-card>
                        </v-container>
                    </v-flex>
                </v-layout>
            </v-container>
            <v-layout row justify-center>
                <AddShipForm
                        :dialog="dialog"
                        @closeDialog="(state) => dialog = state "
                        @newShipAdded="pushNewShip"
                ></AddShipForm>
            </v-layout>
        </main>
    </v-app>
</template>
<style>

    .application, .application > main > .container {
        min-height: 100% !important;
    }

    .app, .application--light {
        background-color: #f0f0f0 !important;
    }

    .indigo-custom {
        background-color: #2e3e4e !important;
    }

    .custom-opacity {
        opacity: 0.75;
    }

    .custom-opacity:hover {
        opacity: 1;
    }

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
        color: rgba(0, 0, 0, .26) !important;
    }

    .custom-card {
        box-shadow: none !important;
    }

    .custom-card, .icon-touch {
        cursor: pointer;
    }

    .custom-card:hover {
        background-color: rgba(0, 0, 0, .12);
    }

    .custom-icon {
        width: 52px;
        justify-content: flex-start !important;
        font-size: 21px !important;
    }

    .custom-icon + span {
        font-size: 13px !important;
    }

    .vue-lb-footer-count {
        display: none !important;
    }

    .lightbox > .vue-lb-container {
        padding-left: 300px;
    }

    ul li:hover {
        cursor: pointer;
        background-color: rgba(0, 0, 0, .065);
    }

    .toolbar__title {
        color: #373a3c;
    }

    .margin-text {
        font-size: 16px;
        margin: 0 0 1px 10px;
    }

    .small-text {
        color: #818a91!important;
        font-size: 13px;
    }

    .margin-text.small-text {
        margin-bottom: 0;
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
                cards: [],
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
            refreshCard() {
                const shipsActive = this.ships.filter(e => e.active === false);
                const nbShipsPercent = this.ships.filter(e => e.successRatePct !== null);
                const bestShip = this.ships.filter(e => e.successRatePct > 90 && e.stages >= 2);

                const shipsSRPTotal = this.ships.reduce((sum, value) => {
                    if (value.successRatePct !== null) {
                        return sum + value.successRatePct;
                    }
                    return sum;
                }, 0);
                const totalPercent = parseInt(shipsSRPTotal, 10) / parseInt(nbShipsPercent.length, 10);
                const nullShip = this.ships.length - nbShipsPercent.length;

                this.cards = [
                    {
                        title: `${this.ships.length} ships listed`,
                        subtitle: `${shipsActive.length} active`,
                        icon: 'flight',
                        flex: 4,
                        iconColor: 'indigo--text text--lighten-2'
                    },
                    {
                        title: `${totalPercent} % total of success`,
                        subtitle: `${nullShip} null`,
                        icon: 'build',
                        flex: 4,
                        iconColor: 'yellow--text text--darken-1'
                    },
                    {
                        title: 'Best ship',
                        subtitle: `${bestShip[0].name} from ${bestShip[0].country} `,
                        icon: 'thumb_up',
                        iconColor: 'green--text text--lighten-1',
                        flex: 4
                    }
                ];
            },
            pushNewShip(e) {
                if (e.data) {
                    delete e.data._id;
                    this.ships.push(e.data);
                    this.refreshCard();
                } else {
                    this.alertError = true;
                    if (e.code === 11000) {
                        this.messageError = 'A ship with this name already exists !';
                    } else {
                        this.messageError = e.errmsg;
                    }
                }
            },
            getAllShip() {
                axios({
                    method: 'get',
                    url: `${config.apiUrl}/ship`
                }).then((response) => {
                    this.ships = response.data;
                    this.refreshCard();
                }).catch((e) => {
                    this.alertError = true;
                    this.messageError = e.response;
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
                        this.alertError = true;
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
                    this.alertError = true;
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
                        this.disabled = true;
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
                        this.alertError = true;
                        this.messageError = e.response;
                    });
                }
            }
        }
    };
</script>
