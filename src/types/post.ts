export interface Post {
  userId: string;
  id: string;
  title: string;
  body: string;
}

export interface StorePost extends Post {
  __loadedTimestamp__: number;
}
