// Styles
import '@mdi/font/css/materialdesignicons.css';
import 'vuetify/dist/vuetify.min.css';

// Vuetify
import { createVuetify } from 'vuetify';

export default createVuetify({
  defaults: {
    VTextarea: {
      density: 'compact'
    },
    VSelect: {
      density: 'compact'
    },
    VTextField: {
      density: 'compact'
    },
   
  },

});
