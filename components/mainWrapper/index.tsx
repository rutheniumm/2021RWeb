import {createUseStyles} from  "preact-jss-tiny"
import { JSX } from 'preact';

const useStyles = createUseStyles({
  main: {
    minHeight: '95vh',
  },
});

type MainWrapperProps = {
  children: JSX.IntrinsicElements['div']['children'];
};

const MainWrapper = ({ children }: MainWrapperProps) => {
  const s = useStyles();
  return <div className={s.main}>{children}</div>;
};

export default MainWrapper;