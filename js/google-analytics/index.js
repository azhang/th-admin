import load from 'load-script'
import GADataStore from '../stores/GADataStore'

load('https://apis.google.com/js/client.js?onload=onGapiLoad')

var CLIENT_ID = '904517978543-b5sguohvcr15f8htpcme2ds34aa3os4d.apps.googleusercontent.com';
var scopes = 'https://www.googleapis.com/auth/analytics.readonly';

window.onGapiLoad = () => {
  gapi.auth.authorize({
    client_id: CLIENT_ID, 
    scope: scopes, 
    immediate: true
  }, _handleAuthResult);
}

export function handleAuthClick(event) {
  gapi.auth.authorize({
    client_id: CLIENT_ID, 
    scope: scopes, 
    immediate: false
  }, _handleAuthResult);
  return false;
}

function _handleAuthResult(authResult) {
  if (authResult && !authResult.error) {
    gapi.client.load('analytics', 'v3')
    GADataStore.set('auth', true);
  } else {
    GADataStore.emit('error', authResult.error || "GA auth error")
  }
}



//----------


export function handleAPIClick() {
  queryAccounts();
}

function queryAccounts() {
  console.log('Querying Accounts.');

  // Get a list of all Google Analytics accounts for this user
  gapi.client.analytics.management.accounts
    .list()
    .execute(handleAccounts);
}

/**
 * Retrieve all GA accounts associated with this user
 * @param  {Object} results JSON response from query
 */
function handleAccounts(results) {
  if (results.code)
    GADataStore.emit('error', 'There was an error querying accounts: ' + results.message)
  else if (!results || !results.items || !results.items.length)
    GADataStore.emit('error', 'No accounts found for this user.')
  else {
    GADataStore.set('accounts', results.items)

    var i = GADataStore.get('selectedAccountIndex');
    if (results.items.length)
      queryWebproperties(results.items[i].id);
  }
}


function queryWebproperties(accountId) {
  console.log("Querying Web Properties");

  // Get a list of all the Web Properties for the account
  gapi.client.analytics.management.webproperties
    .list({'accountId': accountId})
    .execute(handleWebproperties);
}

function handleWebproperties(results) {
  if (results.code)
    GADataStore.emit('error', 'There was an error querying webproperties: ' + results.message)
  else if (!results || !results.items || !results.items.length)
    GADataStore.emit('error', 'No webproperties found for this user.')
  else {
    GADataStore.set('webproperties', results.items)

    var i = GADataStore.get('selectedWebPropertyIndex');
    if (results.items.length)
      queryProfiles(results.items[i].accountId, results.items[i].id);
  }
}


function queryProfiles(accountId, webpropertyId) {
  console.log('Querying Views (Profiles).');

  // Get a list of all Views (Profiles) for the first Web Property of the first Account
  gapi.client.analytics.management.profiles
  .list({
    'accountId': accountId,
    'webPropertyId': webpropertyId
  }).execute(handleProfiles);
}

function handleProfiles(results) {
  if (results.code)
    GADataStore.emit('error', 'There was an error querying profiles: ' + results.message)
  else if (!results || !results.items || !results.items.length)
    GADataStore.emit('error', 'No profiles found for this user.')
  else {
    GADataStore.set('profiles', results.items)

    var i = GADataStore.get('selectedProfileIndex');
    if (results.items.length)
      queryCoreReportingApi(results.items[i].id);
  }
}


function queryCoreReportingApi(profileId) {
  console.log('Querying Core Reporting API.');

  // Use the Analytics Service Object to query the Core Reporting API
  /*gapi.client.analytics.data.ga.get({
    'ids': 'ga:' + profileId,
    'start-date': '2014-10-01',
    'end-date': '2014-11-15',
    'metrics': 'ga:sessions'
  }).execute(handleCoreReportingResults);*/
  gapi.client.analytics.data.realtime.get({
    ids: 'ga:' + profileId,
    metrics:'rt:activeUsers'
  }).execute(function(response) {
    var newValue = response.totalResults ? +response.rows[0][0] : 0;
    console.log(newValue);
  })
}

function handleCoreReportingResults(results) {
  if (results.error) {
    console.log('There was an error querying core reporting API: ' + results.message);
  } else {
    printResults(results);
  }
}

function printResults(results) {
  if (results.rows && results.rows.length) {
    console.log('View (Profile) Name: ', results.profileInfo.profileName);
    console.log('Total Sessions: ', results.rows[0][0]);
  } else {
    console.log('No results found');
  }
}