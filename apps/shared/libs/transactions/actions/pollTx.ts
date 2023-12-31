import { LCDClient, TxInfo } from '@terra-money/feather.js';
import { sleep } from '../../../utils';
import { CancellationToken, None } from '../../cancellation';
import { TerraTxError } from './terraTxError';

export class TxTimeoutError extends Error {
  constructor(message: string, readonly txhash: string) {
    super(message);
    this.name = 'PollingTimeout';
  }

  toString = () => {
    return `[${this.name} txhash="${this.txhash}" message="${this.message}"]`;
  };
}

export const pollTx = async function (
  lcdRef: React.MutableRefObject<LCDClient>,
  txHash: string,
  cancellationToken: CancellationToken = None,
  chainIdRef: React.MutableRefObject<string>
): Promise<TxInfo | Error> {
  const timeout = Date.now() + 20 * 1000;

  while (Date.now() < timeout && cancellationToken.cancelled() === false) {
    try {
      const lcd = lcdRef.current;
      const chainId = chainIdRef.current;

      const resp = await lcd.tx.txInfo(txHash, chainId);

      if (resp.code !== 0) {
        throw new TerraTxError(resp);
      }

      return resp;
    } catch (error: any) {
      if (error instanceof TerraTxError) {
        return error;
      }

      if ([400, 404].includes(error?.response?.status)) {
        // the tx was not yet found so try again after a delay
        await sleep(500, cancellationToken);
        continue;
      }
      return new Error(error);
    }
  }

  return new TxTimeoutError(
    `Transaction queued. To verify the status, please check the transaction hash below.`,
    txHash
  );
};
