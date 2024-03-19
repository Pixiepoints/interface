import 'styles/tailwindBase.css';

import 'aelf-design/css';
import '@portkey/did-ui-react/dist/assets/index.css';
import 'aelf-web-login/dist/assets/index.css';

import Layout from 'pageComponents/layout';

import 'styles/global.css';
import 'styles/theme.css';

import Provider from 'provider';
import { appName } from 'constants/common';
import Script from 'next/script';

export const metadata = {
  title: appName,
  description: appName,
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: 'no',
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <head>
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-87ZFKS0JQH" />
        <Script id="google-analytics">
          {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
 
          gtag('config', 'G-87ZFKS0JQH');
        `}
        </Script>
      </head>
      <body>
        <Provider>
          <Layout>{children}</Layout>
        </Provider>
      </body>
    </html>
  );
};

export default RootLayout;
