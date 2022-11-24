import classNames from 'classnames';
import { Container, UIElementProps } from 'shared/components';
import styles from './DialogBody.module.sass';

export const DialogBody = (props: UIElementProps) => {
  const { className, children } = props;
  return (
    <Container className={classNames(className, styles.root)} direction="column">
      {children}
    </Container>
  );
};
