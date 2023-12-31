import { LocalWallet, useChainSuffix, useLocalWallet } from '@terra-money/apps/hooks';
import { useCallback, useMemo } from 'react';
import { warp_resolver } from '@terra-money/warp-sdk';
import { useLocalStorage } from 'usehooks-ts';
import { variableName } from 'utils/variable';

type VariablesStorage = {
  [key: string]: warp_resolver.Variable[];
};

const storageKey = (localWallet: LocalWallet) => `${localWallet.chainId}--${localWallet.walletAddress}`;

export const useVariableStorage = () => {
  const localWallet = useLocalWallet();

  const initialValue = useMemo(() => {
    return {};
  }, []);

  const storedVariablesKey = useChainSuffix('__warp_stored_variables');
  const [storedVariables, setStoredVariables] = useLocalStorage<VariablesStorage>(storedVariablesKey, initialValue);

  const setVariables = useCallback(
    (variables: warp_resolver.Variable[]) => {
      if (!localWallet.connectedWallet) {
        return;
      }

      setStoredVariables((storedVariables) => {
        return {
          ...storedVariables,
          [storageKey(localWallet)]: variables,
        };
      });
    },
    [localWallet, setStoredVariables]
  );

  const variables = useMemo(() => {
    if (!localWallet.connectedWallet) {
      return [];
    }

    return storedVariables[storageKey(localWallet)] ?? [];
  }, [storedVariables, localWallet]);

  const saveAll = useCallback(
    (variables: warp_resolver.Variable[]) => {
      setVariables(variables);
    },
    [setVariables]
  );

  const updateVariable = useCallback(
    (variable: warp_resolver.Variable, prev: warp_resolver.Variable) => {
      const variableExists = Boolean(variables.find((v) => variableName(v) === variableName(prev)));
      let updatedVariables: warp_resolver.Variable[] = [...variables];

      if (variableExists) {
        const newVariables = [...variables];
        newVariables[variables.findIndex((v) => variableName(v) === variableName(prev))] = variable;
        updatedVariables = newVariables;
      }

      setVariables(updatedVariables);
    },
    [setVariables, variables]
  );

  const saveVariable = useCallback(
    (variable: warp_resolver.Variable) => {
      const variableExists = Boolean(variables.find((v) => variableName(v) === variableName(variable)));
      let updatedVariables: warp_resolver.Variable[] = [...variables];

      if (!variableExists) {
        updatedVariables = [...variables, variable];
      }

      setVariables(updatedVariables);
    },
    [setVariables, variables]
  );

  const removeVariable = useCallback(
    (name: string) => {
      return setVariables(variables.filter((v) => variableName(v) !== name));
    },
    [setVariables, variables]
  );

  return useMemo(
    () => ({
      variables,
      saveVariable,
      removeVariable,
      updateVariable,
      saveAll,
    }),
    [variables, saveVariable, removeVariable, saveAll, updateVariable]
  );
};
