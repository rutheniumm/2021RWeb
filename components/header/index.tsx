import { createUseStyles } from 'preact-jss-tiny';
import { JSX } from 'preact';

const useStyles = createUseStyles({
  header: {
    fontSize: '38px',
    marginBottom: 0,
    fontWeight: 400,
  },
});

type HeaderProps = {
  children: JSX.IntrinsicElements['h1']['children'];
};

const Header = (props: HeaderProps) => {
  const s = useStyles();
  return <h1 className={s.header}>{props.children}</h1>;
};

export default Header;