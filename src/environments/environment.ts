const url = 'https://api.2040.chat';
const webUrl = 'https://www.2040.chat/';
const tubeUrl = 'https://dev.tube.freedom.buzz/'

// const url = 'http://localhost:8080';
// const webUrl = 'http://localhost:4200/';

export const environment = {
  production: false,
  hmr: false,
  serverUrl: `${url}/api/v1/`,
  socketUrl: `${url}/`,
  webUrl: webUrl,
  tubeUrl: tubeUrl,
  domain: '.freedom.buzz',
  EncryptIV: 8625401029409790,
  EncryptKey: 8625401029409790,
  siteKey: '0x4AAAAAAAUs_fGBFffjsAnG',
  secretKey: '0x4AAAAAAAUs_eZxakCoOiPrsK4IQ6DBzsE',
};
