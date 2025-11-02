// SDK利用準備
import type {
  MicroCMSQueries,
  MicroCMSListContent,
  MicroCMSImage,
} from 'microcms-js-sdk';
import { createClient } from 'microcms-js-sdk';

const client = createClient({
  serviceDomain: import.meta.env.MICROCMS_SERVICE_DOMAIN,
  apiKey: import.meta.env.MICROCMS_API_KEY,
});

// 型定義
export type Blog = {
  title: string;
  body: string;
  thumbnail: MicroCMSImage;
} & MicroCMSListContent;

// APIの呼び出し
export const getBlogList = async (queries?: MicroCMSQueries) => {
  return await client.getList<Blog>({ endpoint: 'blog', queries });
};

export const getBlogDetail = async (
  contentId: string,
  queries?: MicroCMSQueries
) => {
  return await client.getListDetail<Blog>({
    endpoint: 'blog',
    contentId,
    queries,
  });
};
