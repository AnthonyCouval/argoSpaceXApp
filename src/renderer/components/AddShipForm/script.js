import axios from 'axios';
import config from '../../../main/config';

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
                this.$emit('newShipAdded', response.data);
                this.$emit('closeDialog', false);
            }).catch((e) => {
                this.messageError = e.response;
            });
        }
    }
};