import {Client, Account} from 'appwrite';
const client = new Client();
client 
  .setEndpoint('https://cloud.appwrite.io/v1')
  .setProject('67f39a440025dedaf66c');

const account = new Account(client);
export  { client, account};  