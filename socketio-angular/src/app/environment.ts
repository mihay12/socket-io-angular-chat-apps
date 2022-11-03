// Додамо кінцеву точку сокета в окремий файли, яку ми можемо підключили до інших файлів з environment.ts.
export const environment = {
  production: false,
  SOCKET_ENDPOINT: 'http://localhost:3000'
};
