import autobahn from 'autobahn';
import * as AppActions from 'Action';

check()

async function check() {

  // VPN

  // WAMP
  let session = await wampCheck()

  if (session) {
    await crossbarPackageCheck('dappmanager', session)
    await crossbarPackageCheck('vpn', session)
  }
  // PING THROUGH
}


async function crossbarPackageCheck(packageName, session) {

  const call = 'ping.'+packageName+'.dnp.dappnode.eth'

  try {
    let res = await session.call(call, ['ping'])
    AppActions.updateStatus(packageName, 'crossbar', true, '')
  } catch(e) {
    AppActions.updateStatus(packageName, 'crossbar', false, e.message)
  }

}


async function wampCheck() {
  const url = 'ws://my.wamp.dnp.dappnode.eth:8080/ws'
  const realm = 'dappnode_admin'

  try {
    let session = conntectToWamp(url, realm)
    AppActions.updateStatus('wamp', 'connection', true, '')
    return session

  } catch(reason) {
    AppActions.updateStatus('wamp', 'connection', false, reason)
  }
}


function conntectToWamp(url, realm) {

  const connection = new autobahn.Connection({ url, realm })

  return new Promise((resolve, reject) => {
    connection.onclose = reason => reject(reason)
    connection.onopen = session => resolve(session)
    connection.open();
  })
}
