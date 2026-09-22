export interface Product {
    id?: string;
    title: string;
    affiliateLink: string;
    asin?: string;
    category: string;
    whyLike: string;
    imageUrl: string;
    topPick: boolean;
    editorsChoice: boolean;
    published: boolean;
    clicks: number;
    isDemo: boolean;
    createdAt: any;
}
