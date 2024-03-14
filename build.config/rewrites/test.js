module.exports = [
  { source: '/api/:path*', destination: 'http://test.pixiepoints.io/api/:path*' },
  { source: '/cms/:path*', destination: 'http://test.pixiepoints.io/cms/:path*' },
  { source: '/connect/:path*', destination: 'http://test.pixiepoints.io/connect/:path*' },
  {
    source: '/AElfIndexer_DApp/PortKeyIndexerCASchema/:path*',
    destination: 'https://dapp-portkey-test.portkey.finance/Portkey_DID/PortKeyIndexerCASchema/:path*',
  },
  { source: '/portkey/api/:path*', destination: 'https://did-portkey-test.portkey.finance/api/:path*' },
];
