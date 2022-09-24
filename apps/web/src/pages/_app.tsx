import * as React from 'react';
import '../styles/globals.css';
import '@rainbow-me/rainbowkit/styles.css';
import type { AppProps } from 'next/app';
import {
  RainbowKitProvider,
  getDefaultWallets,
  connectorsForWallets,
  wallet,
} from '@rainbow-me/rainbowkit';
import { chain, configureChains, createClient, WagmiConfig } from 'wagmi';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';
import { SessionProvider } from 'next-auth/react';
import {
  RainbowKitSiweNextAuthProvider,
  GetSiweMessageOptions,
} from '@rainbow-me/rainbowkit-siwe-next-auth';
import Head from 'next/head';

const { chains, provider, webSocketProvider } = configureChains(
  [chain.goerli, chain.polygon, chain.optimism, chain.polygonMumbai],
  [alchemyProvider({ apiKey: process.env.ALCHEMY_API_KEY }), publicProvider()]
);

const { wallets } = getDefaultWallets({
  appName: 'Graph Flow',
  chains,
});

const demoAppInfo = {
  appName: 'Graph Flow',
};

const connectors = connectorsForWallets([
  ...wallets,
  {
    groupName: 'Other',
    wallets: [wallet.argent({ chains }), wallet.trust({ chains }), wallet.ledger({ chains })],
  },
]);

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
  webSocketProvider,
});

const getSiweMessageOptions: GetSiweMessageOptions = () => ({
  statement: 'Sign in to Graph Flow',
});

export default function App({ Component, pageProps }: AppProps) {
  const [isSSR, setIsSSR] = React.useState(true);

  React.useEffect(() => {
    setIsSSR(false);
  }, []);

  return (
    !isSSR && (
      <>
        <Head>
          <title>ETH Online Demo</title>
          <meta name="description" content="ETH Online Hackathon 2022 Demo" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <SessionProvider refetchInterval={0} session={(pageProps as any).session}>
          <WagmiConfig client={wagmiClient}>
            <RainbowKitSiweNextAuthProvider getSiweMessageOptions={getSiweMessageOptions}>
              <RainbowKitProvider appInfo={demoAppInfo} chains={chains}>
                <Component {...pageProps} />
              </RainbowKitProvider>
            </RainbowKitSiweNextAuthProvider>
          </WagmiConfig>
        </SessionProvider>
      </>
    )
  );
}
