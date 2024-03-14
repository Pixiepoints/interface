module.exports = [
  { source: '/api/:path*', destination: 'https://www.pixiepoints.io/api/:path*' },
  { source: '/cms/:path*', destination: 'http://www.pixiepoints.io/cms/:path*' },
  { source: '/connect/:path*', destination: 'http://192.168.10.131:8080/connect/:path*' },
  {
    source: '/AElfIndexer_DApp/PortKeyIndexerCASchema/:path*',
    destination: 'https://dapp-portkey-test.portkey.finance/Portkey_DID/PortKeyIndexerCASchema/:path*',
  },
  { source: '/portkey/api/:path*', destination: 'https://did-portkey-test.portkey.finance/api/:path*' },
];
