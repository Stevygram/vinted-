export type Category = 'Femmes' | 'Hommes' | 'Enfants' | 'Luxe & Vintage' | 'Streetwear' | 'Maison' | 'Tech';

export type Condition = 'Neuf avec étiquette' | 'Neuf sans étiquette' | 'Très bon état' | 'Bon état' | 'Satisfaisant';

export type ParcelSize = 'S' | 'M' | 'L';

export interface Seller {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  reviewCount: number;
  verified: boolean;
  city: string;
  responseRate: string;
  fastShipper: boolean;
}

export interface Article {
  id: string;
  title: string;
  brand: string;
  size: string;
  condition: Condition;
  price: number;
  originalPrice?: number;
  category: Category;
  description: string;
  images: string[];
  seller: Seller;
  likes: number;
  createdAt: string;
  views: number;
  parcelSize: ParcelSize;
  isFeatured?: boolean;
}

export interface RelayPoint {
  id: string;
  name: string;
  carrier: 'Mondial Relay' | 'Chronopost Shop2Shop' | 'Colissimo Relais' | 'Locker 24/7';
  address: string;
  city: string;
  distance: string;
  openingHours: string;
  hasLocker: boolean;
}

export type OrderStatus =
  | 'etiquette_creee'
  | 'depose_relais'
  | 'en_transit'
  | 'en_livraison'
  | 'livre'
  | 'valide';

export interface TrackingEvent {
  id: string;
  status: OrderStatus;
  label: string;
  description: string;
  date: string;
  location: string;
  completed: boolean;
}

export interface Order {
  id: string;
  article: Article;
  buyerId: string;
  sellerId: string;
  price: number;
  buyerProtectionFee: number;
  shippingFee: number;
  total: number;
  paymentMethod: 'card' | 'apple_pay' | 'wallet';
  relayPoint: RelayPoint;
  carrier: string;
  trackingNumber: string;
  lockerPin?: string;
  qrCodeUrl?: string;
  status: OrderStatus;
  escrowStatus: 'held_in_escrow' | 'released_to_seller' | 'refunded';
  createdAt: string;
  estimatedDelivery: string;
  events: TrackingEvent[];
}

export interface ChatOffer {
  id: string;
  price: number;
  originalPrice: number;
  senderId: string;
  status: 'pending' | 'accepted' | 'declined' | 'countered';
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
  isAiSuggested?: boolean;
  offer?: ChatOffer;
}

export interface Conversation {
  id: string;
  articleId: string;
  article: Article;
  participant: Seller;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  messages: ChatMessage[];
}

export interface WalletTransaction {
  id: string;
  type: 'sale_payout' | 'purchase_escrow' | 'escrow_release' | 'bank_withdrawal' | 'deposit';
  amount: number;
  description: string;
  date: string;
  status: 'completed' | 'in_escrow';
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  rating: number;
  reviewCount: number;
  balanceAvailable: number;
  balanceInEscrow: number;
  city: string;
  ibanMasked: string;
}
