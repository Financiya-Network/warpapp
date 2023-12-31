import { useVariableStorage } from 'pages/variables/useVariableStorage';
import { ReactNode, useEffect, useRef } from 'react';
import { uniqBy } from 'lodash';
import { useCachedVariables } from './useCachedVariables';
import { variableName } from 'utils/variable';
import { useEventListener } from 'usehooks-ts';
import { warp_resolver } from '@terra-money/warp-sdk';

interface CachedVariablesSessionProps {
  children: ReactNode;
  persist?: boolean;
  input?: warp_resolver.Variable[];
}

export const CachedVariablesSession = (props: CachedVariablesSessionProps) => {
  const { children, input, persist } = props;

  const { variables: storageVars, saveAll } = useVariableStorage();
  const { setVariables: setCachedVariables, variables: cachedVariables, clearAll } = useCachedVariables();

  const refreshingPageRef = useRef<boolean>(false);
  const clearAllRef = useRef<() => void>();

  useEventListener('beforeunload', () => {
    refreshingPageRef.current = true;
  });

  useEffect(() => {
    return () => {
      if (clearAllRef.current && !refreshingPageRef.current) {
        clearAllRef.current();
      }
    };
  }, []);

  useEffect(() => {
    clearAllRef.current = clearAll;
  }, [clearAll]);

  useEffect(() => {
    // TODO: check order
    const newVars = uniqBy([...cachedVariables, ...(input ?? []), ...storageVars], (v) => variableName(v));
    setCachedVariables(newVars);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [input]);

  useEffect(() => {
    if (persist) {
      saveAll(cachedVariables);
    }
  }, [cachedVariables, persist, saveAll]);

  return <>{children}</>;
};
