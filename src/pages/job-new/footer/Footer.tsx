import classNames from 'classnames';
import { UIElementProps } from 'shared/components';
import styles from './Footer.module.sass';

interface FooterProps extends UIElementProps {}

export const Footer = (props: FooterProps) => {
  const { className, children } = props;
  return <div className={classNames(className, styles.root)}>{children}</div>;
};
