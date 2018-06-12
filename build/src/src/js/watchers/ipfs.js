import autobahn from 'autobahn';
import * as AppActions from 'Action';
import ipfsAPI from 'ipfs-api'

const IPFS = 'my.ipfs.dnp.dappnode.eth'
const ipfs = ipfsAPI(IPFS, '5001', { protocol: 'http' });


// initialize
AppActions.updateStatus({pkg: 'ipfs', item: 'connected', on: 0, msg: 'verifying...'})
AppActions.updateStatus({pkg: 'ipfs', item: 'working', on: 0, msg: 'verifying...'})

check()

async function check() {

  let connectionError = await isIPFSconnected()
  AppActions.updateStatus({
    pkg: 'ipfs',
    item: 'connected',
    on: connectionError ? -1 : 1,
    msg: connectionError ? JSON.stringify(connectionError) : 'ok'
  })

  let workingError = await isIPFSworking()
  AppActions.updateStatus({
    pkg: 'ipfs',
    item: 'working',
    on: workingError ? -1 : 1,
    msg: workingError ? JSON.stringify(workingError) : 'ok'
  })

}


function isIPFSconnected() {
  return new Promise((resolve) => {
    ipfs.id(function (err, identity) {
      resolve(err)
    })
  })
}


function isIPFSworking() {
  return new Promise((resolve) => {
    const ipfsReadmePath = '/ipfs/QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG/readme'
    ipfs.files.cat(ipfsReadmePath, function (err, file) {
      if (err) return resolve(err)
      if (!file.toString('utf8').includes('Hello and Welcome to IPFS!')) return resolve('Error parsing file')
      else return resolve(null)
    })
  })
}


async function crossbarPackageCheck(packageName, session) {

  const call = 'ping.'+packageName+'.dnp.dappnode.eth'

  try {
    let res = await session.call(call, ['ping'])
    AppActions.updateStatus({pkg: packageName, item: 'crossbar', on: 1, msg: 'ok'})
  } catch(e) {
    AppActions.updateStatus({pkg: packageName, item: 'crossbar', on: -1, msg: e.message})
  }

}


async function wampCheck() {
  const url = 'ws://my.wamp.dnp.dappnode.eth:8080/ws'
  const realm = 'dappnode_admin'
  let timeout

  try {
    let session = await conntectToWamp(url, realm)
    AppActions.updateStatus({pkg: 'wamp', item: 'connection', on: 1, msg: 'ok'})
    return session

  } catch(reason) {
    AppActions.updateStatus({pkg: 'wamp', item: 'connection', on: -1, msg: reason, nonAdmin: reason.includes(NON_ADMIN_RESPONSE)})
    AppActions.updateStatus({pkg: 'dappmanager', item: 'crossbar', on: -1, msg: 'can\'t connect to WAMP'})
    AppActions.updateStatus({pkg: 'vpn', item: 'crossbar', on: -1, msg: 'can\'t connect to WAMP'})
  }
}


function conntectToWamp(url, realm) {

  const connection = new autobahn.Connection({ url, realm })

  return new Promise((resolve, reject) => {
    let timeout = setTimeout(function() { reject('timeout expired') }, 60 * 1000);
    connection.onclose = (reason, details) => {
      clearTimeout(timeout)
      if (details && details.message && details.message.includes('could not authenticate session')) {
        reject(NON_ADMIN_RESPONSE)
      } else if (details && details.message) {
        reject(reason + ', ' + details.message)
      } else {
        reject(reason)
      }
    }
    connection.onopen = session => {
      clearTimeout(timeout)
      resolve(session)
    }
    connection.open();
  })
}
