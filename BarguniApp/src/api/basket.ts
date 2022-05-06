import {LoginApiInstance} from './instance';
import {Item} from './item';

export interface Basket {
  id: number;
  user_id: number;
  bkt_id: number;
  authority: string;
  bkt_name: string;
}

async function registerBasket(
  basketName: string,
  basketImg?: string,
): Promise<void> {
  const axios = LoginApiInstance();
  await axios.post(`/basket/?name=${encodeURI(basketName)}`, {
    basketImg: basketImg,
  });
}

async function getBasketInfo(basketId: number) {
  const axios = LoginApiInstance();
  return (await axios.get(`/basket/${basketId}`)).data.data;
}

export {registerBasket, getBasketInfo};