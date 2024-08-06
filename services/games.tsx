import getFlag from "../lib/getFlag.tsx";
import request, { getBaseUrl, getFullUrl } from "../lib/request.tsx";
import { itemNameToEncodedName } from "./catalog.tsx";

const gamePage2015Enabled = getFlag('2015GameDetailsPageEnabled', false);
const csrEnabled = getFlag('clientSideRenderingEnabled', false);

export const getGameUrl = ({ placeId, name }: { placeId: string; name: string }): string => {
  return `/games/${placeId}/${itemNameToEncodedName(name)}`;
}

export const getUserGames = async ({ userId, cursor }: { userId: string; cursor?: string }) => {
  const response = await request({
    method: 'GET',
    url: getFullUrl('games', `/v2/users/${userId}/games?cursor=${encodeURIComponent(cursor || '')}`)
  });
  return response.data;
}

export const getGroupGames = async ({ groupId, cursor }: { groupId: string; cursor?: string }) => {
  const response = await request({
    method: 'GET',
    url: getFullUrl('games', `/v2/groups/${groupId}/games?cursor=${encodeURIComponent(cursor || '')}`)
  });
  return response.data;
}

export const getGameSorts = async ({ gameSortsContext }: { gameSortsContext?: string }) => {
  const response = await request({
    method: 'GET',
    url: getFullUrl('games', `/v1/games/sorts?gameSortsContext=${encodeURIComponent(gameSortsContext || '')}`)
  });
  return response.data;
}

export const getGameList = async ({ sortToken, limit, genre = 0, keyword }: { sortToken: string; limit: number; genre?: number; keyword?: string }) => {
  const response = await request({
    method: 'GET',
    url: getFullUrl('games', `/v1/games/list?sortToken=${encodeURIComponent(sortToken)}&maxRows=${limit}&genre=${genre}&keyword=${encodeURIComponent(keyword || '')}`)
  });
  return response.data;
}

export const getGameMedia = async ({ universeId }: { universeId: string }) => {
  const response = await request({
    method: 'GET',
    url: getFullUrl('games', `/v2/games/${universeId}/media`)
  });
  return response.data.data;
}

export const launchGame = async ({ placeId }: { placeId: string }) => {
  const result = await request({
    method: 'GET',
    url: getBaseUrl() + '/game/get-join-script?placeId=' + encodeURIComponent(placeId)
  });
  const toClick = result.data.joinUrl;
  const aTag = document.createElement('a');
  aTag.setAttribute('href', result.data.prefix + '' + result.data.joinScriptUrl);
  document.body.appendChild(aTag);
  aTag.click();
  // delay before deletion is required on some browsers, not sure why
  setTimeout(() => {
    aTag.remove();
  }, 1000);
}

export const multiGetPlaceDetails = async ({ placeIds }: { placeIds: string[] }) => {
  const response = await request({
    method: 'GET',
    url: getFullUrl('games', `/v1/games/multiget-place-details?placeIds=${encodeURIComponent(placeIds.join(','))}`)
  });
  return response.data;
}

export const multiGetUniverseDetails = async ({ universeIds }: { universeIds: string[] }) => {
  const response = await request({
    method: 'GET',
    url: getFullUrl('games', `/v1/games?universeIds=${encodeURIComponent(universeIds.join(','))}`)
  });
  return response.data.data;
}

export const getServers = async ({ placeId, offset }: { placeId: string; offset: number }) => {
  const response = await request({
    method: 'GET',
    url: getBaseUrl() + `/games/getgameinstancesjson?placeId=${placeId}&startIndex=${offset}`
  });
  return response.data;
}

export const multiGetGameVotes = async ({ universeIds }: { universeIds: string[] }) => {
  const response = await request({
    method: 'GET',
    url: getFullUrl('games', '/v1/games/votes?universeIds=' + encodeURIComponent(universeIds.join(',')))
  });
  return response.data.data;
}

export const voteOnGame = async ({ universeId, isUpvote }: { universeId: string; isUpvote: boolean }) => {
  const response = await request({
    method: 'PATCH',
    url: getFullUrl('games', '/v1/games/' + universeId + '/user-votes'),
    data: {
      vote: isUpvote,
    }
  });
  return response.data.data;
}
