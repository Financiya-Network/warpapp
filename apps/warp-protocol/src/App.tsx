import { TransactionsProvider } from '@terra-money/apps/libs/transactions';
import { useTheme } from '@terra-money/apps/themes';
import { WalletProvider } from '@terra-money/wallet-kit';
import { Layout } from 'components/layout/Layout';
// import { NetworkGuard } from 'components/network-guard';
import { SnackbarContainer } from 'components/snackbar';
import { SnackbarProvider } from 'notistack';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Navigate, Route, Routes } from 'react-router';
import { useTransactionSnackbars } from 'hooks';
import { DialogContainer, DialogProvider } from '@terra-money/apps/dialog';
import styles from './App.module.sass';
import { Dashboard } from 'pages/dashboard/Dashboard';
import { Jobs } from 'pages/jobs/Jobs';
import { JobPage } from 'pages/job-page/JobPage';
import { JobNew } from 'pages/job-new/JobNew';
import { BalancesPage } from 'pages/balances';
import { Variables } from 'pages/variables/Variables';
import { TemplateNew } from 'pages/template-new/TemplateNew';
import { TemplatesPage } from 'pages/templates';
import { useWalletDefaultNetworks } from 'hooks/useWalletDefaultNetworks';
import { ChainSelectorProvider } from '@terra-money/apps/hooks';

const queryClient = new QueryClient();

const Main = () => {
  useTransactionSnackbars();

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/balances" element={<BalancesPage />} />
        <Route path="/variables" element={<Variables />} />
        <Route path="/templates" element={<TemplatesPage />} />
        <Route path="/template-new/*" element={<TemplateNew />} />
        <Route path="/job-new/*" element={<JobNew />} />
        <Route path="/jobs/*" element={<Jobs />} />
        <Route path="/jobs/:jobId" element={<JobPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
};

const Inner = () => {
  const [theme] = useTheme();
  const walletDefaultNetworks = useWalletDefaultNetworks();

  // TODO: check later if chainOptions would cause a flicker due to being null for first couple of calls
  return walletDefaultNetworks ? (
    <WalletProvider defaultNetworks={walletDefaultNetworks}>
      <main className={styles.root} data-theme={theme}>
        {/* <NetworkGuard> */}
        <ChainSelectorProvider>
          <TransactionsProvider>
            <SnackbarProvider
              autoHideDuration={null}
              content={(key, message) => <SnackbarContainer id={key} message={message} />}
            >
              <Main />
              <DialogContainer />
            </SnackbarProvider>
          </TransactionsProvider>
        </ChainSelectorProvider>
        {/* </NetworkGuard> */}
      </main>
    </WalletProvider>
  ) : null;
};

const App = () => {
  return (
    <DialogProvider>
      <QueryClientProvider client={queryClient}>
        <Inner />
      </QueryClientProvider>
    </DialogProvider>
  );
};

export default App;
