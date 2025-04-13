// Styles
import '@mdi/font/css/materialdesignicons.css';
import 'vuetify/dist/vuetify.min.css';

// Vuetify
import { createVuetify } from 'vuetify';
import { ThemeDefinition } from 'vuetify/lib/types';
const agrotechsim: ThemeDefinition = {
    dark: false,
    colors: {
        "primary-base": "#38c793",
        "primary-base-dark": "#38c793",
        "on-background": "#FFFFFF",
        "on-surface": "#FFFFFF",
    },
    variables: {
        'high-emphasis-opacity': 1,
    }
}

const droneverse: ThemeDefinition = {
    dark: false,
    colors: {
        "primary-base": "#f17b2c",
        "primary-base-dark": "#f17b2c",
        "on-background": "#FFFFFF",
        "on-surface": "#FFFFFF",
    },
    variables: {
        'high-emphasis-opacity': 1,
    }
}
export default createVuetify({
    defaults: {
        VBtn: {
            variant: 'tonal'
        }
    },
    theme: {
        defaultTheme: 'agrotechsim',
        themes: {
            agrotechsim,
            droneverse,
        },
    },
});
