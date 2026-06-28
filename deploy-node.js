#!/usr/bin/env node
/**
 * Deploy Salesforce flows using jsforce
 * Usage: SF_TOKEN='your_session_id' node deploy-node.js
 */
const jsforce = require('jsforce');
const fs = require('fs');

const sessionId = process.env.SF_TOKEN;
const instanceUrl = 'https://enmish42-dev-ed.develop.my.salesforce.com';

if (!sessionId) {
  console.error('ERROR: Set SF_TOKEN environment variable');
  console.error("Usage: SF_TOKEN='00Dxxxx!...' node deploy-node.js");
  process.exit(1);
}

const conn = new jsforce.Connection({
  sessionId: sessionId,
  serverUrl: instanceUrl + '/services/Soap/u/62.0',
  instanceUrl: instanceUrl
});

async function deploy() {
  console.log('Deploying flows to', instanceUrl);
  console.log('Using flows-deploy.zip...\n');

  const zipData = fs.readFileSync('./flows-deploy.zip');

  try {
    const result = await conn.metadata.deploy(zipData, {
      rollbackOnError: true,
      singlePackage: true
    }).complete(true);

    console.log('Deploy result:', JSON.stringify(result, null, 2));

    if (result.success || result.status === 'Succeeded') {
      console.log('\n✅ Deploy successful!');
    } else {
      console.error('\n❌ Deploy failed. Status:', result.status);
      const failures = result.details && result.details.componentFailures;
      if (failures) {
        const list = Array.isArray(failures) ? failures : [failures];
        list.forEach(f => console.error(' -', f.fullName, ':', f.problem));
      }
    }
  } catch (err) {
    console.error('\n❌ Error:', err.message || err);
    if (err.message && err.message.includes('INVALID_SESSION_ID')) {
      console.error('Session token expired. Get a fresh token from the Salesforce browser DevTools.');
      console.error('Application tab > Cookies > enmish42-dev-ed... > sid value');
    }
  }
}

deploy();
