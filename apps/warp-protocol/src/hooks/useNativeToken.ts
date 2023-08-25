import { useChainSelector } from '@terra-money/apps/hooks';
import { INJ, LUNA, NativeToken, NEUTRON } from '@terra-money/apps/types';
import { useMemo } from 'react';

export const useNativeToken = (): NativeToken => {
  const { selectedChain } = useChainSelector();

  return useMemo(() => {
    switch (selectedChain.name) {
      case 'terra':
        return LUNA;
      case 'injective':
        return INJ;
      case 'neutron':
        return NEUTRON;
    }
  }, [selectedChain.name]);
};
