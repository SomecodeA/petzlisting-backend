interface Attributes {
  trait_type: string;
  value: string | number;
}

interface MetadataItem {
  description: string;
  image: string;
  tokenId: number;
  name: string;
  attributes: Attributes[];
  animation_url: string;
  _tier: number;
  _locked: number;
  _staked: number;
}

export interface PointInfo {
  pointNFT: number;
  pointNFTFrozen: number;
  pointNFTRedeemable: number;
  isFrozen: boolean;
  tier: number;
  lastDist: number;
  limboEnd: number;
  lsa: any; // Assuming this could be of any type
}

interface InvalidBoostNFT {
  collection: string;
  tokenId: number;
}

interface Metadata {
  [tokenId: number]: MetadataItem;
}

interface BoostNFTs {
  [tokenId: number]: any[]; // Assuming this could be of any type
}

interface InvalidBoostNFTs {
  [tokenId: number]: InvalidBoostNFT[];
}

interface PointInfoMap {
  [tokenId: number]: PointInfo;
}

interface PointsPerDay {
  [tokenId: number]: number;
}

interface RevealInfo {
  [tokenId: number]: {
    lsa: any; // Assuming this could be of any type
    holdingSince: number;
    owner: string;
    canReveal: boolean;
    canCantReason: string;
    revealedType: string;
    revealTx: string;
  };
}

interface TotalPoints {
  [tokenId: number]: number;
}

interface Listings {
  [tokenId: number]: string;
}

interface LastStakedAt {
  [tokenId: number]: number;
}

export interface BlurData {
  metadata: Metadata;
  layerInfo: any; // Assuming this could be of any type
  boostNFTs: BoostNFTs;
  invalidBoostNFTs: InvalidBoostNFTs;
  pointInfo: PointInfoMap;
  pointsPerDay: PointsPerDay;
  revealInfo: RevealInfo;
  totalPoints: TotalPoints;
  nftSlashLogs: any; // Assuming this could be of any type
  listings: Listings;
  lastStakedAt: LastStakedAt;
}

export interface NFTDetails {
  tokenId: number;
  name: string;
  image: string;
  pointNFT: number;
  tier?: string;
  type?: string;
  resort?: string;
  price?: number;
}

export interface Price {
  tokenId: number;
  price: {
    amount: number;
  }
}
