import Vue from 'vue';
import Vuetify from 'vuetify/lib';

Vue.use(Vuetify);

export default new Vuetify({
    theme: {
        themes: {
            light: {
                primary: '#FF9800',
                secondary: '#FB8C00',
                accent: '#f44336',
            },
            dark: {
                primary: '#FF9800',
                secondary: '#FB8C00',
                accent: '#f44336',
            },
        },
    },
});
