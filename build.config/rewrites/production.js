module.exports = [
  { source: '/api/:path*', destination: 'https://www.pixiepoints.io/api/:path*' },
  { source: '/cms/:path*', destination: 'https://www.pixiepoints.io/cms/:path*' },
  { source: '/connect/:path*', destination: 'https://www.pixiepoints.io/connect/:path*' },
  {
    source: '/AElfIndexer_DApp/PortKeyIndexerCASchema/:path*',
    destination: 'https://dapp-portkey.portkey.finance/Portkey_DID/PortKeyIndexerCASchema/:path*',
  },
  { source: '/portkey/api/:path*', destination: 'https://did-portkey.portkey.finance/api/:path*' },
];
