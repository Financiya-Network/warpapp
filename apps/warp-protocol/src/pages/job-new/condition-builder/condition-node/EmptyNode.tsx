import { UIElementProps } from '@terra-money/apps/components';
import classNames from 'classnames';
import { ReactComponent as Plus } from 'components/assets/Plus.svg';
import { forwardRef } from 'react';
import { Button } from 'components/primitives';

import styles from './ConditionNode.module.sass';
import { MenuAction } from 'components/menu-button/MenuAction';
import { DropdownMenu } from 'components/dropdown-menu/DropdownMenu';
import { warp_resolver } from '@terra-money/warp-sdk';

type EmptyNodeProps = UIElementProps & { setCond: (cond: warp_resolver.Condition) => void };

export const EmptyNode = forwardRef((props: EmptyNodeProps, ref: React.Ref<HTMLButtonElement>) => {
  const { setCond } = props;

  return (
    <DropdownMenu
      className={classNames(styles.node, styles.empty_node)}
      action={<Button ref={ref} icon={<Plus />} iconGap="none" />}
    >
      <MenuAction onClick={() => setCond({ and: [] })}>And</MenuAction>
      <MenuAction onClick={() => setCond({ or: [] })}>Or</MenuAction>
      <MenuAction onClick={() => setCond({ not: {} as warp_resolver.Condition })}>Not</MenuAction>
      <DropdownMenu menuClass={styles.expr_submenu} action={<MenuAction subMenu={true}>Expression</MenuAction>}>
        <MenuAction
          onClick={() =>
            setCond({
              expr: {
                bool: '',
              },
            })
          }
        >
          Boolean
        </MenuAction>
        <MenuAction
          onClick={() =>
            setCond({
              expr: {
                decimal: {
                  left: { simple: '' },
                  right: { simple: '' },
                  op: 'eq',
                },
              },
            })
          }
        >
          Decimal
        </MenuAction>
        <MenuAction
          onClick={() =>
            setCond({
              expr: {
                uint: {
                  left: { simple: '' },
                  right: { simple: '' },
                  op: 'eq',
                },
              },
            })
          }
        >
          Uint
        </MenuAction>
        <MenuAction
          onClick={() =>
            setCond({
              expr: {
                int: {
                  left: { simple: '' as any },
                  right: { simple: '' as any },
                  op: 'eq',
                },
              },
            })
          }
        >
          Int
        </MenuAction>
        <MenuAction
          onClick={() =>
            setCond({
              expr: {
                string: {
                  left: { simple: '' },
                  right: { simple: '' },
                  op: 'eq',
                },
              },
            })
          }
        >
          String
        </MenuAction>
      </DropdownMenu>
    </DropdownMenu>
  );
});
