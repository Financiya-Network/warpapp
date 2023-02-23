import { ConnectType, useConnectedWallet } from '@terra-money/wallet-provider';
import { cloneElement, MouseEventHandler, useCallback } from 'react';
import { useConnectWalletDialog } from '../dialog/connect-wallet';
import { sleep } from 'utils';
import { useWarpAccount } from 'queries/useWarpAccount';
import { useCreateAccountDialog } from 'components/dialog/connect-wallet/CreateAccountDialog';

export type ActionElementProps = {
  action: JSX.Element;
};

export const ActionElement = (props: ActionElementProps) => {
  const { action } = props;
  const connectedWallet = useConnectedWallet();
  const openConnectDialog = useConnectWalletDialog();

  const { data: warpAccount, isFetching: accountFetching } = useWarpAccount();

  const openCreateAccountDialog = useCreateAccountDialog();

  const handleClick: MouseEventHandler<HTMLButtonElement> = useCallback(
    async (event) => {
      let connectionType: ConnectType | undefined;
      let accountReady: boolean | undefined = Boolean(warpAccount) && !accountFetching;

      // If wallet is not connected, open connect dialog and wait for connection
      if (!connectedWallet) {
        connectionType = await openConnectDialog({
          title: 'Hold up!',
          subtitle: 'You need to connect your terra wallet to perform this action.',
        });

        // Sometimes the balance calculation is wrong
        // So we wait for a bit to make sure the balance is fetched correctly
        await sleep(200);
      } else if (!accountReady) {
        accountReady = await openCreateAccountDialog({});
      }

      // If the user was already connected or just connected via extension:
      // Connections with extension are instant, so we can call onClick immediately
      // If another connection type was selected, disregard the original action
      // The user will have to press the button again after connecting
      if ((connectedWallet || connectionType === ConnectType.EXTENSION) && accountReady) {
        action.props.onClick?.(event);
      }
    },
    [action, connectedWallet, openConnectDialog, warpAccount, accountFetching, openCreateAccountDialog]
  );

  return cloneElement(action, {
    onClick: handleClick,
  });
};
