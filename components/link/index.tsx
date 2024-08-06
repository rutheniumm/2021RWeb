import { JSX } from 'preact';

type LinkProps = {
  href: string;
  children: JSX.IntrinsicElements['a']['children'];
};

const Link = ({ href, children }: LinkProps) => {
  return (
    <a href={href} class="text-blue-500 hover:underline">
      {children}
    </a>
  );
};

export default Link;