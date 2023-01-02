import { useMemo } from 'react';
import { Text } from 'components/primitives';
import { FixedSizeList } from 'react-window';
import { DialogProps, useDialog } from '@terra-money/apps/hooks';
import classNames from 'classnames';
import { Dialog, DialogBody, DialogHeader } from 'components/dialog';
import { ListData } from './ListData';
import { ListItem } from './ListItem';
import styles from './SelectVariableDialog.module.sass';
import { pluralize } from '@terra-money/apps/utils';
import { Container } from '@terra-money/apps/components';
import { Variable } from 'pages/variables/useVariableStorage';
import { useCachedVariables } from 'pages/job-new/useCachedVariables';

type SelectVariableProps = {
  selectedVariable?: Variable;
};

const SelectVariableDialog = (props: DialogProps<SelectVariableProps, Variable>) => {
  const { closeDialog, selectedVariable } = props;

  const { variables } = useCachedVariables();

  const listData = useMemo<ListData>(() => {
    const onSelectionChanged = (variable: Variable) => {
      closeDialog(variable);
    };

    return {
      selectedVariable,
      variables,
      onSelectionChanged,
    };
  }, [variables, closeDialog, selectedVariable]);

  return (
    <Dialog>
      <DialogHeader title="Select variable" onClose={() => closeDialog(undefined)} />
      <DialogBody className={styles.container}>
        <Container className={classNames(styles.columns)} direction="row">
          <Text variant="label">{`Displaying ${listData.variables.length} ${pluralize(
            'variable',
            listData.variables.length
          )}`}</Text>
        </Container>
        <FixedSizeList<ListData>
          className={styles.list}
          itemData={listData}
          height={300}
          width={520}
          itemSize={60}
          itemCount={listData.variables.length}
          overscanCount={5}
        >
          {ListItem}
        </FixedSizeList>
      </DialogBody>
    </Dialog>
  );
};

export const useSelectVariableDialog = () => {
  return useDialog<SelectVariableProps, Variable>(SelectVariableDialog);
};