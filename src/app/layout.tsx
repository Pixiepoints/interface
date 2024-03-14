import 'styles/tailwindBase.css';

import 'aelf-design/css';
import '@portkey/did-ui-react/dist/assets/index.css';
import 'aelf-web-login/dist/assets/index.css';

import Layout from 'pageComponents/layout';

import 'styles/global.css';
import 'styles/theme.css';

import Provider from 'provider';
import { appName } from 'constants/common';

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
      <body>
        <Provider>
          <Layout>{children}</Layout>
        </Provider>
      </body>
    </html>
  );
};

export default RootLayout;
