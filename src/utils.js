var config = {
  rootUrl: 'https://ethauth.msroed.io'
}

export const initialize = (options) => {
  config = Object.assign({}, config, options);
}

export const generateChallenge = () =>
  window.fetch(`${config.rootUrl}/sentence`).then(res => res.json())

const toHex = (s) => {
  var hex = '';
  for(var i=0;i<s.length;i++) {
    hex += ''+s.charCodeAt(i).toString(16);
  }
  return `0x${hex}`;
}

export const authenticate = ({ uuid, sentence, provider }) => {
  return new Promise((resolve, reject) => {
    const data = toHex(sentence);
    const params = [web3.eth.accounts[0], data]
    web3.currentProvider.sendAsync({ id: 1, method: 'personal_sign', params }, (err, res) => {
      if (!res.error) {
        const sig = res.result;
        window.fetch(`${config.rootUrl}/auth`, {
          method: 'POST',
          body: JSON.stringify({ owner: params[0], sig, uuid, provider }),
          headers: {
            'Content-Type': 'application/json'
          }
        }).then(res => res.json())
        .then(body => {
          resolve(body)
        }).catch(reject)
      } else {
        reject(err || res.error);
      }
    });
  });
}
