// src/services/catalogService.ts

import request, { getBaseUrl, getFullUrl } from "../lib/request.tsx";
import getFlag from "../lib/getFlag.tsx";

// Define types for function parameters
interface ItemNameToEncodedNameParams {
  str: string;
}

interface GetItemUrlParams {
  assetId: string | number;
  name: string;
}

interface SearchCatalogParams {
  category: string;
  subCategory?: string;
  query?: string;
  limit: number;
  cursor?: string;
  sort?: string;
  creatorType?: string;
  creatorId?: string;
}

interface GetProductInfoLegacyParams {
  assetId: number;
}

interface GetItemDetailsParams {
  assetIdArray: number[];
}

interface GetRecommendationsParams {
  assetId: string | number;
  assetTypeId: string | number;
  limit: number;
}

interface GetCommentsParams {
  assetId: string | number;
  offset: number;
}

interface CreateCommentParams {
  assetId: string | number;
  comment: string;
}

interface AddOrRemoveFromCollectionsParams {
  assetId: string | number;
  addToProfile: boolean;
}

interface IsFavoritedParams {
  assetId: string | number;
  userId: string | number;
}

interface CreateFavoriteParams {
  assetId: string | number;
  userId: string | number;
}

interface DeleteFavoriteParams {
  assetId: string | number;
  userId: string | number;
}

export const itemNameToEncodedName = (str: string): string => {
  // https://stackoverflow.com/questions/987105/asp-net-mvc-routing-vs-reserved-filenames-in-windows
  const seoName = str.replace(/'/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/^(COM\d|LPT\d|AUX|PRT|NUL|CON|BIN)$/i, "") || "unnamed";
  return seoName;
}

const itemPageLate2016Enabled = getFlag('itemPageLate2016Enabled', false);
const csrEnabled = getFlag('clientSideRenderingEnabled', false);

export const getItemUrl = ({ assetId, name }: GetItemUrlParams): string => {
  return `/catalog/${assetId}/${itemNameToEncodedName(name)}`;
}

export const searchCatalog = async (params: SearchCatalogParams): Promise<any> => {
  const { category, subCategory, query, limit, cursor, sort, creatorType, creatorId } = params;
  let url = `/v1/search/items?category=${category}&limit=${limit}&sortType=${sort}`;
  
  if (cursor) {
    url += `&cursor=${encodeURIComponent(cursor)}`;
  }
  if (query) {
    url += `&keyword=${encodeURIComponent(query)}`;
  }
  if (subCategory) {
    url += `&subcategory=${encodeURIComponent(subCategory)}`;
  }
  if (creatorType && creatorId) {
    url += `&creatorTargetId=${creatorId}&creatorType=${creatorType}`;
  }
  
  const response = await request({ method: 'GET', url: getFullUrl('catalog', url) });
  return response.data;
}

export const getProductInfoLegacy = async ({ assetId }: GetProductInfoLegacyParams): Promise<any> => {
  const response = await request({ method: 'GET', url: getFullUrl('api', `/marketplace/productinfo?assetId=${assetId}`) });
  return response.data;
}

export const getItemDetails = async ({ assetIdArray }: GetItemDetailsParams): Promise<any> => {
  if (assetIdArray.length === 0) return { data: { data: [] } };
  
  while (true) {
    try {
      const response = await request({
        method: 'POST',
        url: getFullUrl('catalog', '/v1/catalog/items/details'),
        data: {
          items: assetIdArray.map(id => ({ itemType: 'Asset', id }))
        }
      });
      
      for (const item of response.data.data) {
        if (typeof item.isForSale === 'undefined') {
          item.isForSale = (item.unitsAvailableForConsumption !== 0 && typeof item.price === 'number' && typeof item.lowestPrice === 'undefined');
        }
      }
      
      return response;
    } catch (e) {
      if (e.response && e.response.status === 429 && typeof window !== 'undefined') {
        await new Promise(res => setTimeout(res, 2500));
        continue;
      }
      throw e;
    }
  }
}

export const getRecommendations = async ({ assetId, assetTypeId, limit }: GetRecommendationsParams): Promise<any> => {
  const url = `/v1/recommendations/asset/${assetTypeId}?contextAssetId=${assetId}&numItems=${limit}`;
  const response = await request({ method: 'GET', url: getFullUrl('catalog', url) });
  return response.data;
}

export const getComments = async ({ assetId, offset }: GetCommentsParams): Promise<any> => {
  const url = `${getBaseUrl()}/comments/get-json?assetId=${assetId}&startIndex=${offset}&thumbnailWidth=100&thumbnailHeight=100&thumbnailFormat=PNG&cachebuster=${Math.random()}`;
  const response = await request({ method: 'GET', url });
  return response.data;
}

export const createComment = async ({ assetId, comment }: CreateCommentParams): Promise<any> => {
  const response = await request({
    method: 'POST',
    url: `${getBaseUrl()}/comments/post`,
    data: {
      text: comment,
      assetId
    }
  });
  if (typeof response.data.ErrorCode === 'string') {
    throw new Error(response.data.ErrorCode);
  }
  return response.data;
}

export const addOrRemoveFromCollections = async ({ assetId, addToProfile }: AddOrRemoveFromCollectionsParams): Promise<any> => {
  const response = await request({
    method: 'POST',
    url: `${getBaseUrl()}/asset/toggle-profile`,
    data: {
      assetId,
      addToProfile
    }
  });
  return response.data;
}

// Example of updated function calls:

export const createFavorite = async ({ assetId, userId }: CreateFavoriteParams): Promise<any> => {
    const response = await request({
      method: 'POST',
      url: getFullUrl('catalog', `/v1/favorites/users/${userId}/assets/${assetId}/favorite`)
    });
    return response.data;
  }
  
  export const deleteFavorite = async ({ assetId, userId }: DeleteFavoriteParams): Promise<any> => {
    const response = await request({
      method: 'DELETE',
      url: getFullUrl('catalog', `/v1/favorites/users/${userId}/assets/${assetId}/favorite`)
    });
    return response.data;
  }
  