// src/context/UserProfileContext.tsx
import {JSX, createContext} from "preact"
import {useContext, useEffect, useState } from "preact/hooks";
import getFlag from "../../../lib/getFlag.tsx";
import { getFollowersCount, getFollowingsCount, getFriends, getFriendStatus, isAuthenticatedUserFollowingUserId } from "../../../services/friends.tsx";
import { getUserGames } from "../../../services/games.tsx";
import { getUserGroups } from "../../../services/groups.tsx";
import { getPreviousUsernames, getUserInfo, getUserStatus } from "../../../services/users.tsx";

interface UserProfileContextType {
  userId: number | null;
  setUserId: (id: number | null) => void;
  lastError: string | null;
  setLastError: (error: string | null) => void;
  username: string | null;
  userInfo: any | null;
  status: any | null;
  setStatus: (status: any | null) => void;
  previousNames: any | null;
  setPreviousNames: (names: any | null) => void;
  followersCount: number | null;
  setFollowersCount: (count: number | null) => void;
  followingsCount: number | null;
  setFollowingsCount: (count: number | null) => void;
  friends: any | null;
  setFriends: (friends: any | null) => void;
  friendStatus: any | null;
  setFriendStatus: (status: any | null) => void;
  groups: any | null;
  setGroups: (groups: any | null) => void;
  createdGames: any | null;
  setCreatedGames: (games: any | null) => void;
  tab: string;
  setTab: (tab: string) => void;
  isFollowing: boolean | null;
  setIsFollowing: (following: boolean | null) => void;
  getFriendStatus: (authenticatedUserId: number) => void;
}

const UserProfileContext = createContext<UserProfileContextType | undefined>(undefined);

export const UserProfileProvider = ({ children }: { children: JSX.Element }) => {
  const [userId, setUserId] = useState<number | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [lastError, setLastError] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<any | null>(null);
  const [status, setStatus] = useState<any | null>(null);
  const [previousNames, setPreviousNames] = useState<any | null>(null);
  const [friends, setFriends] = useState<any | null>(null);
  const [followersCount, setFollowersCount] = useState<number | null>(null);
  const [followingsCount, setFollowingsCount] = useState<number | null>(null);
  const [friendStatus, setFriendStatus] = useState<any | null>(null);
  const [groups, setGroups] = useState<any | null>(null);
  const [createdGames, setCreatedGames] = useState<any | null>(null);
  const [tab, setTab] = useState<string>('About');
  const [isFollowing, setIsFollowing] = useState<boolean | null>(null);

  useEffect(() => {
    if (!userId) return;

    const fetchData = async () => {
      try {
        const userInfo = await getUserInfo({ userId });
        setUserInfo(userInfo);
        setUsername(userInfo.name);
        
        const previousNames = await getPreviousUsernames({ userId });
        setPreviousNames(previousNames);
        
        if (getFlag('userProfileUserStatusEnabled', false)) {
          const status = await getUserStatus({ userId });
          setStatus(status);
        }
        
        const followersCount = await getFollowersCount({ userId });
        setFollowersCount(followersCount);
        
        const followingsCount = await getFollowingsCount({ userId });
        setFollowingsCount(followingsCount);
        
        const friends = await getFriends({ userId });
        setFriends(friends);
        
        const groups = await getUserGroups({ userId });
        setGroups(groups);
        
        const createdGames = await getUserGames({ userId, cursor: '' });
        setCreatedGames(createdGames.data);
        
        const isFollowing = await isAuthenticatedUserFollowingUserId({ userId });
        setIsFollowing(isFollowing);
      } catch (error) {
        setLastError('InvalidUserId');
      }
    };

    fetchData();
  }, [userId]);

  const getFriendStatus = async (authenticatedUserId: number) => {
    const status = await getFriendStatus({ authenticatedUserId, userId: userId as number });
    setFriendStatus(status);
  };

  return (
    <UserProfileContext.Provider value={{
      userId, setUserId,
      lastError, setLastError,
      username, userInfo,
      status, setStatus,
      previousNames, setPreviousNames,
      followersCount, setFollowersCount,
      followingsCount, setFollowingsCount,
      friends, setFriends,
      friendStatus, setFriendStatus,
      groups, setGroups,
      createdGames, setCreatedGames,
      tab, setTab,
      isFollowing, setIsFollowing,
      getFriendStatus
    }}>
      {children}
    </UserProfileContext.Provider>
  );
};

export const useUserProfile = () => {
  const context = useContext(UserProfileContext);
  if (context === undefined) {
    throw new Error("useUserProfile must be used within a UserProfileProvider");
  }
  return context;
};
