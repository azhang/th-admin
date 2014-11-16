import load from 'load-script'
import Promise from 'bluebird'
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
    GADataStore.set('auth', true);
    gapi.client.load('analytics', 'v3', gapiProfileInit)
  }
}


/**
 * Retrieve all data necessary for actual core api usage
 * @return {Object} Promise
 */
function gapiProfileInit() {
  return queryAccounts()
  .then(queryWebproperties)
  .then(queryProfiles)
  .then(function() {
    setInterval(rtActiveUsers, 5000)
  })
  .error(function(error) {
    GADataStore.emit('error', error)
  })
}



function queryAccounts() {
  return new Promise(function(resolve, reject) {
    gapi.client.analytics.management.accounts
      .list()
      .execute(function(results) {
        if (results.code)
          reject('There was an error querying accounts: ' + results.message)
        else if (!results || !results.items || !results.items.length)
          reject('error', 'No accounts found for this user.')
        else {
          GADataStore.set('accounts', results.items)

          var i = GADataStore.get('selectedAccountIndex');
          resolve({accountId: results.items[i].id})
        }
      })
  })
}

function queryWebproperties() {
  var i = GADataStore.get('selectedAccountIndex');
  var accountId = GADataStore.get('accounts')[i].id;

  return new Promise(function(resolve, reject) {
    gapi.client.analytics.management.webproperties
      .list({'accountId': accountId})
      .execute(function(results) {
        if (results.code)
          reject('There was an error querying webproperties: ' + results.message)
        else if (!results || !results.items || !results.items.length)
          reject('error', 'No webproperties found for this user.')
        else {
          GADataStore.set('webproperties', results.items)

          var i = GADataStore.get('selectedWebPropertyIndex');
          resolve({
            accountId: results.items[i].accountId, 
            webpropertyId: results.items[i].id
          });
        }
      })
  })
}


function queryProfiles() {
  var ai = GADataStore.get('selectedAccountIndex');
  var accountId = GADataStore.get('webproperties')[ai].accountId;

  var wpi = GADataStore.get('selectedWebPropertyIndex');
  var webpropertyId = GADataStore.get('webproperties')[wpi].id;

  return new Promise(function(resolve, reject) {
    gapi.client.analytics.management.profiles
      .list({
        'accountId': accountId,
        'webPropertyId': webpropertyId
      })
      .execute(function(results) {
        if (results.code)
          reject('There was an error querying profiles: ' + results.message)
        else if (!results || !results.items || !results.items.length)
          reject('error', 'No profiles found for this user.')
        else {
          GADataStore.set('profiles', results.items)

          var i = GADataStore.get('selectedProfileIndex');
          resolve(results.items[i].id);
        }
      })
  })
}


function rtActiveUsers() {
  var i = GADataStore.get('selectedProfileIndex');
  var profileId = GADataStore.get('profiles')[i].id;

  return new Promise(function(resolve, reject) {
    gapi.client.analytics.data.realtime.get({
      ids: 'ga:' + profileId,
      metrics:'rt:activeUsers'
    })
    .execute(function(results) {
      if (results.error)
        reject('There was an error querying core realtime API: ' + results.message)
      else {
        var newValue = results.totalResults ? +results.rows[0][0] : 0;
        var oldValue = GADataStore.get('activeUsers')

        GADataStore.set('activeUsers', newValue)

        if (newValue != oldValue) {
          GADataStore.emit((0 < newValue - oldValue) ? 'activeUsers:increase': 'activeUsers:decrease');
        }

        resolve(newValue);
      }
    })
  })
}

function gaSessions() {
  var i = GADataStore.get('selectedProfileIndex');
  var profileId = GADataStore.get('profiles')[i].id;

  return new Promise(function(resolve, reject) {
    gapi.client.analytics.data.ga.get({
      'ids': 'ga:' + profileId,
      'start-date': '2014-10-01',
      'end-date': '2014-11-15',
      'metrics': 'ga:sessions'
    })
    .execute(function(results) {
      if (results.error)
        reject('There was an error querying core reporting API: ' + results.message)
      else {
        if (results.rows && results.rows.length) {
          console.log('View (Profile) Name: ', results.profileInfo.profileName);
          console.log('Total Sessions: ', results.rows[0][0]);
        } else {
          console.log('No results found');
        }
        
        resolve(newValue);
      }
    })
  })
}