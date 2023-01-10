import styles from './SuggestVariablesMenu.module.sass';

import { TextInputProps } from 'components/primitives';
import { DropdownMenu } from 'components/dropdown-menu/DropdownMenu';
import { MenuAction } from 'components/menu-button/MenuAction';

interface BaseProps extends Pick<TextInputProps, 'value'> {
  className?: string;
  style?: React.CSSProperties;
  onChange: (input: string) => void;
  value: string;
  open: boolean;
}

interface SuggestVariablesMenuProps extends BaseProps {
  options: string[];
}

const SuggestVariablesMenu = (props: SuggestVariablesMenuProps) => {
  const { options, style, onChange, value, open } = props;

  const filtered = options.filter((v) => v.startsWith(value));

  return filtered.length > 0 ? (
    <DropdownMenu style={style} menuClass={styles.menu} open={open}>
      {filtered.map((v) => (
        <MenuAction onClick={() => onChange(v)}>{v}</MenuAction>
      ))}
    </DropdownMenu>
  ) : (
    <></>
  );
};

export { SuggestVariablesMenu };
