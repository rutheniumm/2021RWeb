import { useEffect } from "preact/hooks";
import { createUseStyles } from "preact-jss-tiny";
import NotFoundPage from "../../pages/404.tsx";
import AuthenticationStore from "../../stores/authentication/index.tsx";
import AdBanner from "../ad/adBanner.tsx";
import Avatar from "./components/avatar.tsx";
import Collections from "./components/collections.tsx";
import Creations from "./components/creation.tsx";
import Description from "./components/description.tsx";
import Friends from "./components/friends.tsx";
import Groups from "./components/groups.tsx";
import ProfileHeader from "../profileHeader.tsx";
import RobloxBadges from "./components/robloxBadges.tsx";
import Statistics from "./components/stats.tsx";
import Tabs from "./components/tabs.tsx";
import TabSection from "./components/tabSection.tsx";
import UserProfileStore from "./stores/UserProfileStore.tsx";
import Favorites from "./components/favorites.tsx";

// Define an interface for the props
interface UserProfileProps {
  userId: number;
}

const useStyles = createUseStyles({
  profileContainer: {
    background: '#e3e3e3',
  },
})

const UserProfile = (props: UserProfileProps) => {
  const s = useStyles();

  const store = UserProfileStore.useContainer();
  const auth = AuthenticationStore.useContainer();

  useEffect(() => {
    store.setUserId(props.userId);
  }, [props.userId]);

  useEffect(() => {
    if (auth.isPending || !auth.userId || !store.userId) return;
    store.getFriendStatus(auth.userId);
  }, [store.userId, auth.userId, auth.isPending]);

  if (!store.userId || !store.userInfo || auth.isPending) {
    return null;
  }
  if (store.userInfo.isBanned) {
    return <NotFoundPage />;
  }
  
  return (
    <div className='container'>
      <AdBanner />
      <div className={s.profileContainer}>
        <ProfileHeader />
        <Tabs />
        <TabSection tab="About">
          <Description />
          <Avatar userId={store.userId} />
          <Friends />
          <Collections userId={store.userId} />
          <Groups />
          <Favorites userId={store.userId} />
          <RobloxBadges userId={store.userId} />
          <Statistics />
        </TabSection>
        <TabSection tab="Creations">
          <Creations />
        </TabSection>
      </div>
    </div>
  );
}

export default UserProfile;
