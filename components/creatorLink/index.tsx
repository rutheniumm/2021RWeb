import { JSX } from "preact";
import Link from "../link/index.tsx";

// Define an interface for the props
interface CreatorLinkProps {
  type: string | number;
  id: number;
  name: string;
}

/**
 * Creator link
 * @param {CreatorLinkProps} props 
 * @returns JSX.Element
 */
const CreatorLink = (props: CreatorLinkProps): JSX.Element => {
  // Construct the URL based on the type
  const url = (props.type === 'User' || props.type === 1) 
    ? `/User.aspx?ID=${props.id}` 
    : `/My/Groups.aspx?gid=${props.id}`;
  
  return (
    <Link href={url}>
      <a>
        {props.name}
      </a>
    </Link>
  );
}

export default CreatorLink;
