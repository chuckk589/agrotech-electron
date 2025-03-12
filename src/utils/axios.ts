// import axios from 'axios';
// // import emitter from '../eventBus';
// // import { useAuthStore } from '../stores/auth';

// const axiosInstance = axios.create({
//   withCredentials: true,
//   baseURL: `http://localhost:3000/`,
// });

// // axiosInstance.interceptors.response.use(
// //   function (response: Response) {
// //     return response;
// //   },
// //   function (error) {
// //     const { user, logout } = useAuthStore();
// //     if (!error.response.config.url.startsWith('/auth')) {
// //       if ([401, 403].includes(error.response.status) && user) {
// //         logout();
// //       } else {
// //         emitter.emit('alert', {
// //           header: error.message,
// //           color: 'error',
// //           text:
// //             typeof error.response.data.message == 'object'
// //               ? error.response.data.message.join('\n')
// //               : error.response.data.message,
// //         });
// //       }
// //     }
// //     return Promise.reject(error);
// //   },
// // );

// export default axiosInstance;
