import { Button, Text } from 'components/primitives';
import { useDialog, DialogProps } from '@terra-money/apps/hooks';
import { Dialog, DialogBody, DialogHeader } from 'components/dialog';
import styles from './VariableDialog.module.sass';
import { useStaticVariableDialog } from './static/StaticVariableDialog';
import { useQueryVariableDialog } from './query/QueryVariableDialog';
import { useExternalVariableDialog } from './external/ExternalVariableDialog';
import { useCallback } from 'react';
import { Container } from '@terra-money/apps/components';
import { warp_resolver } from '@terra-money/warp-sdk';

type VariableDialogProps = {};

export const VariableDialog = (props: DialogProps<VariableDialogProps, warp_resolver.Variable>) => {
  const { closeDialog } = props;

  const openStaticVariableDialog = useStaticVariableDialog();
  const openQueryVariableDialog = useQueryVariableDialog();
  const openExternalVariableDialog = useExternalVariableDialog();

  return (
    <Dialog className={styles.root}>
      <DialogHeader title="Select variable type" onClose={() => closeDialog(undefined)} />
      <DialogBody className={styles.body}>
        <Text variant="label" className={styles.description}>
          Use variables to extend jobs or templates with dynamic behavior at time of job execution.
        </Text>
        <Button
          variant="secondary"
          className={styles.btn}
          onClick={async () => {
            const v = await openStaticVariableDialog({});
            if (v) {
              closeDialog({ static: v });
            }
          }}
        >
          <Container direction="column" className={styles.txt_container}>
            <Text className={styles.text} variant="text">
              Static
            </Text>
            <Text className={styles.label} variant="label">
              Hardcoded information provided by user.
            </Text>
          </Container>
        </Button>
        <Button
          variant="secondary"
          className={styles.btn}
          onClick={async () => {
            const v = await openQueryVariableDialog({});
            if (v) {
              closeDialog({ query: v });
            }
          }}
        >
          <Container direction="column" className={styles.txt_container}>
            <Text className={styles.text} variant="text">
              Query
            </Text>
            <Text className={styles.label} variant="label">
              Query smart contract data. Executed on-chain, via smart contracts.
            </Text>
          </Container>
        </Button>
        <Button
          variant="secondary"
          className={styles.btn}
          onClick={async () => {
            const v = await openExternalVariableDialog({});
            if (v) {
              closeDialog({ external: v });
            }
          }}
        >
          <Container direction="column" className={styles.txt_container}>
            <Text className={styles.text} variant="text">
              External
            </Text>
            <Text className={styles.label} variant="label">
              Fetch data from a HTTP endpoint. Executed off-chain, via keepers.
            </Text>
          </Container>
        </Button>
      </DialogBody>
    </Dialog>
  );
};

export const useNewVariableDialog = () => {
  return useDialog<VariableDialogProps, warp_resolver.Variable>(VariableDialog);
};

export const useEditVariableDialog = () => {
  const openStaticVariableDialog = useStaticVariableDialog();
  const openQueryVariableDialog = useQueryVariableDialog();
  const openExternalVariableDialog = useExternalVariableDialog();

  return useCallback(
    async (v: warp_resolver.Variable): Promise<warp_resolver.Variable | undefined> => {
      if ('static' in v) {
        const resp = await openStaticVariableDialog({ variable: v.static });

        if (resp) {
          return { static: resp };
        }
      }

      if ('query' in v) {
        const resp = await openQueryVariableDialog({ variable: v.query });

        if (resp) {
          return { query: resp };
        }
      }

      if ('external' in v) {
        const resp = await openExternalVariableDialog({ variable: v.external });

        if (resp) {
          return { external: resp };
        }
      }

      return undefined;
    },
    [openExternalVariableDialog, openQueryVariableDialog, openStaticVariableDialog]
  );
};
