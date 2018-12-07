// import store from "../store";

export default function initialCalls(session) {
  // Execute initial calls

    requestChainData()
    // Request chainData recursively
    function requestChainData() {
        session.call('requestChainData.dappmanager.dnp.dappnode.eth')
        .then(JSON.parse)
        .catch(e => ({success: false, message: e.message}))
        .then(res => {
            if (!res.success) console.error(`Error requesting chain data: ${res.message}`)
            else setTimeout(requestChainData, 5*60*1000)
        })
    }
  

    //   Execute subscriptions. Dispatch to store example
    // 
    //   session.subscribe(
    //     "logUserAction.dappmanager.dnp.dappnode.eth",
    //     (_, userActionLog) => {
    //       store.dispatch({
    //         type: "NEW_USER_ACTION_LOG",
    //         userActionLog
    //       });
    //     }
    //   ); 
}
