// Styles
import '@mdi/font/css/materialdesignicons.css';
import 'vuetify/dist/vuetify.min.css';

// Vuetify
import { createVuetify } from 'vuetify';

export default createVuetify({
    defaults: {
        VTextarea:{
            density: 'compact'
        },
        VSelect: {
            density: 'compact'
        },
        VTextField: {
            density: 'compact'
        },
    },
    moduleOptions: {
        styles: { configFile: '/styles/variables.css' }
      },
    theme: {
        themes: {
          light: {
            colors: {
            //   primary: "#E53935", // #E53935
            //   info:  "#E53935", 
            }
          },
        },
      },
});
