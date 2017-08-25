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
        </v-navigation-drawer>
        <main>
            <v-card>
                <v-card-title>
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
                >
                    <template slot="headerCell" scope="props">
                        <span v-tooltip:bottom="{ 'html': props.header.text }">
                        {{ props.header.text }}
                        </span>
                    </template>
                    <template slot="items" scope="props">
                        <td class="text-xs-right">{{ props.item.name }}</td>
                        <td class="text-xs-right">{{ props.item.active }}</td>
                        <td class="text-xs-right">{{ props.item.stages }}</td>
                        <td class="text-xs-right">{{ props.item.costPerLaunch }}</td>
                        <td class="text-xs-right">{{ props.item.successRatePct }}</td>
                        <td class="text-xs-right">{{ props.item.firstFlight }}</td>
                        <td class="text-xs-right">{{ props.item.launchpad }}</td>
                        <td class="text-xs-right">{{ props.item.country }}</td>
                        <td class="text-xs-right">{{ props.item.company }}</td>
                        <td class="text-xs-right">{{ props.item.description }}</td>
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
        margin-top:0!important;
    }
    aside img {
        padding:10px 0 10px!important;
    }
</style>
<script>
    import axios from 'axios';

    export default {
        data() {
            return {
                search: '',
                pagination: {},
                drawer: true,
                headers: [
                    {
                        text: 'Name',
                        align: 'left',
                        value: 'name'
                    },
                    {text: 'Active', value: 'active'},
                    {text: 'Stages', value: 'stages'},
                    {text: 'Cost per launch ($)', value: 'costPerLaunch'},
                    {text: 'Success rate pourcent (%)', value: 'successRatePct'},
                    {text: 'First flight', value: 'firstFlight'},
                    {text: 'Launchpad', value: 'launchpad'},
                    {text: 'Country', value: 'country'},
                    {text: 'Company', value: 'company'},
                    {text: 'Description', value: 'description'}
                ],
                items: [
                    { icon: 'home', text: 'Lorem' },
                    { icon: 'build', text: 'Ipsum' },
                    { icon: 'bug_report', text: 'Dolor' },
                    { icon: 'compare_arrows', text: 'Sit' },
                    { icon: 'help', text: 'Amet' }
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
                    url: 'http://localhost:3000/ship'
                }).then((response) => {
                    this.ships = response.data;
                }).catch((e) => {
                });
            }
        }
    };
</script>
