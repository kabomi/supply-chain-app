

const apiUrl = import.meta.env.VITE_API_URL as string;
const commonHeaders = new Headers();
commonHeaders.set('Content-Type', 'application/json');

if (import.meta.env.PROD) {
  const username = prompt('Please enter your username:');
  const password = prompt('Please enter your password:');
  if (username && password) commonHeaders.set('Authorization', 'Basic ' + btoa(username + ':' + password));
}


export {
  apiUrl,
  commonHeaders
};