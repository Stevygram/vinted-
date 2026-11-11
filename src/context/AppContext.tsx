import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Article,
  Conversation,
  Order,
  OrderStatus,
  RelayPoint,
  UserProfile,
  WalletTransaction,
  ChatMessage,
  ChatOffer,
} from '../types';
import {
  CURRENT_USER,
  INITIAL_CONVERSATIONS,
  INITIAL_ORDERS,
  INITIAL_TRANSACTIONS,
  MOCK_ARTICLES,
  MOCK_RELAY_POINTS,
} from '../data/mockData';
import confetti from 'canvas-confetti';

interface AppContextType {
  // Theme
  isDark: boolean;
  toggleTheme: () => void;

  // Data
  currentUser: UserProfile;
  articles: Article[];
  favorites: string[];
  orders: Order[];
  conversations: Conversation[];
  transactions: WalletTransaction[];
  relayPoints: RelayPoint[];

  // Active UI states & modals
  activeView: 'home' | 'messages' | 'orders' | 'wallet';
  setActiveView: (view: 'home' | 'messages' | 'orders' | 'wallet') => void;
  selectedArticle: Article | null;
  setSelectedArticle: (article: Article | null) => void;
  selectedOrder: Order | null;
  setSelectedOrder: (order: Order | null) => void;
  selectedConversation: Conversation | null;
  setSelectedConversation: (conv: Conversation | null) => void;

  modal: 'article' | 'checkout' | 'tracking' | 'shipping_label' | 'chat' | 'sell' | 'ai_stylist' | 'wallet' | null;
  openModal: (modal: 'article' | 'checkout' | 'tracking' | 'shipping_label' | 'chat' | 'sell' | 'ai_stylist' | 'wallet') => void;
  closeModal: () => void;

  // Actions
  toggleFavorite: (articleId: string) => void;
  createOrder: (params: {
    article: Article;
    paymentMethod: 'card' | 'apple_pay' | 'wallet';
    relayPoint: RelayPoint;
    carrierName: string;
    shippingFee: number;
    protectionFee: number;
    total: number;
  }) => Order;
  advanceOrderStatus: (orderId: string) => void;
  confirmOrderReceived: (orderId: string) => void;
  sendMessage: (conversationId: string, text: string, offer?: ChatOffer) => void;
  sendOffer: (article: Article, offerPrice: number) => void;
  handleOfferDecision: (conversationId: string, messageId: string, decision: 'accepted' | 'declined') => void;
  addNewArticle: (newArticle: Partial<Article>) => void;
  withdrawToBank: (amount: number) => boolean;

  // Notification Toast
  toast: { message: string; type: 'success' | 'info' | 'warning' } | null;
  showToast: (message: string, type?: 'success' | 'info' | 'warning') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Dark mode init
  const [isDark, setIsDark] = useState<boolean>(() => {
    const saved = localStorage.getItem('vinted_theme');
    if (saved) return saved === 'dark';
    return true; // Default sleek dark theme
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('vinted_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('vinted_theme', 'light');
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark((prev) => !prev);

  // User & listings
  const [currentUser, setCurrentUser] = useState<UserProfile>(CURRENT_USER);
  const [articles, setArticles] = useState<Article[]>(MOCK_ARTICLES);
  const [favorites, setFavorites] = useState<string[]>(['art_2', 'art_3']);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [conversations, setConversations] = useState<Conversation[]>(INITIAL_CONVERSATIONS);
  const [transactions, setTransactions] = useState<WalletTransaction[]>(INITIAL_TRANSACTIONS);
  const [relayPoints] = useState<RelayPoint[]>(MOCK_RELAY_POINTS);

  // Modals and selections
  const [activeView, setActiveView] = useState<'home' | 'messages' | 'orders' | 'wallet'>('home');
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [modal, setModal] = useState<AppContextType['modal']>(null);

  // Toast
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'warning' } | null>(null);

  const showToast = (message: string, type: 'success' | 'info' | 'warning' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast((current) => (current?.message === message ? null : current));
    }, 4000);
  };

  const openModal = (m: AppContextType['modal']) => setModal(m);
  const closeModal = () => setModal(null);

  const toggleFavorite = (articleId: string) => {
    setFavorites((prev) => {
      const isFav = prev.includes(articleId);
      const next = isFav ? prev.filter((id) => id !== articleId) : [...prev, articleId];
      // update like count in articles
      setArticles((artList) =>
        artList.map((a) => (a.id === articleId ? { ...a, likes: a.likes + (isFav ? -1 : 1) } : a))
      );
      showToast(isFav ? 'Retiré de vos favoris' : 'Ajouté à vos favoris avec succès !', 'info');
      return next;
    });
  };

  // Secure checkout & escrow creation
  const createOrder = (params: {
    article: Article;
    paymentMethod: 'card' | 'apple_pay' | 'wallet';
    relayPoint: RelayPoint;
    carrierName: string;
    shippingFee: number;
    protectionFee: number;
    total: number;
  }): Order => {
    const trackingCode = `MR-${Math.floor(10000000 + Math.random() * 90000000)}-FR`;
    const lockerPin = `${Math.floor(1000 + Math.random() * 9000)}#`;

    const newOrder: Order = {
      id: `cmd_${Date.now()}`,
      article: params.article,
      buyerId: currentUser.id,
      sellerId: params.article.seller.id,
      price: params.article.price,
      buyerProtectionFee: params.protectionFee,
      shippingFee: params.shippingFee,
      total: params.total,
      paymentMethod: params.paymentMethod,
      relayPoint: params.relayPoint,
      carrier: params.carrierName,
      trackingNumber: trackingCode,
      lockerPin,
      qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${trackingCode}`,
      status: 'etiquette_creee',
      escrowStatus: 'held_in_escrow',
      createdAt: 'À l\'instant',
      estimatedDelivery: 'Dans 48h à 72h',
      events: [
        {
          id: `ev_${Date.now()}_1`,
          status: 'etiquette_creee',
          label: 'Commande confirmée & Paiement sous séquestre',
          description: `Fonds de ${params.total.toFixed(2)} € sécurisés par l'assurance Vinted Plus. L'étiquette de transport a été générée.`,
          date: 'À l\'instant',
          location: 'Système Sécurisé Vinted Plus',
          completed: true,
        },
        {
          id: `ev_${Date.now()}_2`,
          status: 'depose_relais',
          label: 'En attente de dépôt par le vendeur',
          description: `${params.article.seller.name} a reçu le bordereau officiel pour le dépôt.`,
          date: 'En attente',
          location: params.relayPoint.city,
          completed: false,
        },
      ],
    };

    // If paid by wallet, deduct from available balance
    if (params.paymentMethod === 'wallet') {
      setCurrentUser((prev) => ({
        ...prev,
        balanceAvailable: Math.max(0, prev.balanceAvailable - params.total),
      }));
      setTransactions((prev) => [
        {
          id: `tx_${Date.now()}`,
          type: 'purchase_escrow',
          amount: -params.total,
          description: `Achat sécurisé : ${params.article.title} (Fonds placés sous séquestre)`,
          date: 'À l\'instant',
          status: 'in_escrow',
        },
        ...prev,
      ]);
    }

    setOrders((prev) => [newOrder, ...prev]);
    setSelectedOrder(newOrder);

    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 },
      });
    } catch {
      // ignore
    }

    showToast('Paiement validé avec succès ! Fonds sécurisés sous séquestre.', 'success');
    return newOrder;
  };

  // Real-time tracking simulator: Advance order through stages
  const advanceOrderStatus = (orderId: string) => {
    setOrders((prevOrders) =>
      prevOrders.map((ord) => {
        if (ord.id !== orderId) return ord;

        const currentStatus = ord.status;
        let nextStatus: OrderStatus = currentStatus;
        let newEventLabel = '';
        let newEventDesc = '';
        let newEventLocation = ord.relayPoint.city;

        if (currentStatus === 'etiquette_creee') {
          nextStatus = 'depose_relais';
          newEventLabel = 'Colis déposé au Point Relais';
          newEventDesc = `${ord.article.seller.name} a scanné le colis au guichet du relais partenaire.`;
          newEventLocation = `${ord.article.seller.city} (Point de départ)`;
        } else if (currentStatus === 'depose_relais') {
          nextStatus = 'en_transit';
          newEventLabel = 'Prise en charge par le transporteur - En transit';
          newEventDesc = 'Le camion de livraison achemine le colis vers le hub régional de tri logistique.';
          newEventLocation = 'Hub Central de Tri Logistique';
        } else if (currentStatus === 'en_transit') {
          nextStatus = 'en_livraison';
          newEventLabel = 'En cours d\'acheminement vers le point de retrait';
          newEventDesc = 'Le colis est en tournée de livraison finale vers votre relais.';
          newEventLocation = ord.relayPoint.name;
        } else if (currentStatus === 'en_livraison') {
          nextStatus = 'livre';
          newEventLabel = 'Arrivé au point de retrait - Prêt pour retrait !';
          newEventDesc = `Disponible au ${ord.relayPoint.name}. Code de retrait : ${ord.lockerPin || '9120#'}.`;
          newEventLocation = ord.relayPoint.address;
        } else {
          return ord;
        }

        const newEvents = [
          ...ord.events,
          {
            id: `ev_${Date.now()}`,
            status: nextStatus,
            label: newEventLabel,
            description: newEventDesc,
            date: 'À l\'instant (Mise à jour en temps réel)',
            location: newEventLocation,
            completed: true,
          },
        ];

        showToast(`Suivi mis à jour : ${newEventLabel}`, 'info');

        const updatedOrder = {
          ...ord,
          status: nextStatus,
          events: newEvents,
        };

        if (selectedOrder?.id === orderId) {
          setSelectedOrder(updatedOrder);
        }

        return updatedOrder;
      })
    );
  };

  // Confirm order received: Releases escrow to seller
  const confirmOrderReceived = (orderId: string) => {
    setOrders((prevOrders) =>
      prevOrders.map((ord) => {
        if (ord.id !== orderId) return ord;

        const updated: Order = {
          ...ord,
          status: 'valide',
          escrowStatus: 'released_to_seller',
          events: [
            ...ord.events,
            {
              id: `ev_confirm_${Date.now()}`,
              status: 'valide',
              label: 'Commande validée par l\'acheteur',
              description: 'Article conforme et en parfait état. Les fonds sous séquestre ont été transférés au vendeur !',
              date: 'À l\'instant',
              location: 'Système Sécurisé Vinted Plus',
              completed: true,
            },
          ],
        };

        // If the current user was the seller, release the escrow to available balance
        if (ord.sellerId === currentUser.id) {
          setCurrentUser((u) => ({
            ...u,
            balanceInEscrow: Math.max(0, u.balanceInEscrow - ord.price),
            balanceAvailable: u.balanceAvailable + ord.price,
          }));
          setTransactions((prev) => [
            {
              id: `tx_rel_${Date.now()}`,
              type: 'escrow_release',
              amount: ord.price,
              description: `Fonds libérés pour la vente : ${ord.article.title} (Acheteur satisfait)`,
              date: 'À l\'instant',
              status: 'completed',
            },
            ...prev,
          ]);
        }

        if (selectedOrder?.id === orderId) {
          setSelectedOrder(updated);
        }

        showToast('Commande validée ! Fonds débloqués sous séquestre.', 'success');
        try {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
          });
        } catch {
          // ignore
        }

        return updated;
      })
    );
  };

  // Instant Messaging
  const sendMessage = (conversationId: string, text: string, offer?: ChatOffer) => {
    const newMessage: ChatMessage = {
      id: `m_${Date.now()}`,
      senderId: currentUser.id,
      senderName: currentUser.name,
      text,
      timestamp: 'À l\'instant',
      offer,
    };

    setConversations((prev) =>
      prev.map((c) => {
        if (c.id !== conversationId) return c;
        const updated = {
          ...c,
          lastMessage: offer ? `Offre de prix : ${offer.price} €` : text,
          lastMessageTime: 'À l\'instant',
          messages: [...c.messages, newMessage],
        };
        if (selectedConversation?.id === conversationId) {
          setSelectedConversation(updated);
        }
        return updated;
      })
    );

    // Realistic seller automated response after 2 seconds
    setTimeout(() => {
      const autoResponses = [
        'Merci pour votre message ! L\'article est très bien emballé et je peux le déposer en relais dès demain matin.',
        'Avec plaisir ! Si vous avez d\'autres questions sur la coupe ou les dimensions, n\'hésitez pas.',
        'Parfait ! Dès que vous validez, j\'imprime l\'étiquette immédiatement.',
      ];
      const randomReply = autoResponses[Math.floor(Math.random() * autoResponses.length)];
      const sellerReply: ChatMessage = {
        id: `m_rep_${Date.now()}`,
        senderId: 'seller',
        senderName: selectedConversation?.participant.name || 'Vendeur',
        text: randomReply,
        timestamp: 'À l\'instant',
      };

      setConversations((prev) =>
        prev.map((c) => {
          if (c.id !== conversationId) return c;
          const updated = {
            ...c,
            lastMessage: randomReply,
            lastMessageTime: 'À l\'instant',
            messages: [...c.messages, sellerReply],
          };
          if (selectedConversation?.id === conversationId) {
            setSelectedConversation(updated);
          }
          return updated;
        })
      );
    }, 2000);
  };

  // Send an offer from article modal or chat
  const sendOffer = (article: Article, offerPrice: number) => {
    let existingConv = conversations.find((c) => c.articleId === article.id);

    const offer: ChatOffer = {
      id: `off_${Date.now()}`,
      price: offerPrice,
      originalPrice: article.price,
      senderId: currentUser.id,
      status: 'pending',
      createdAt: 'À l\'instant',
    };

    const offerMessage: ChatMessage = {
      id: `msg_off_${Date.now()}`,
      senderId: currentUser.id,
      senderName: currentUser.name,
      text: `J'ai soumis une offre officielle à ${offerPrice.toFixed(2)} € (Prix de départ: ${article.price.toFixed(2)} €)`,
      timestamp: 'À l\'instant',
      offer,
    };

    if (existingConv) {
      sendMessage(existingConv.id, offerMessage.text, offer);
      setSelectedConversation(existingConv);
    } else {
      const newConv: Conversation = {
        id: `conv_${Date.now()}`,
        articleId: article.id,
        article,
        participant: article.seller,
        lastMessage: `Offre envoyée : ${offerPrice} €`,
        lastMessageTime: 'À l\'instant',
        unreadCount: 0,
        messages: [offerMessage],
      };
      setConversations((prev) => [newConv, ...prev]);
      setSelectedConversation(newConv);
    }

    openModal('chat');
    showToast(`Offre de ${offerPrice} € envoyée au vendeur !`, 'success');
  };

  const handleOfferDecision = (
    conversationId: string,
    messageId: string,
    decision: 'accepted' | 'declined'
  ) => {
    setConversations((prev) =>
      prev.map((conv) => {
        if (conv.id !== conversationId) return conv;
        const updatedMessages = conv.messages.map((m) => {
          if (m.id === messageId && m.offer) {
            return {
              ...m,
              offer: {
                ...m.offer,
                status: decision,
              },
            };
          }
          return m;
        });

        const statusMsg: ChatMessage = {
          id: `m_decision_${Date.now()}`,
          senderId: conv.participant.id,
          senderName: conv.participant.name,
          text:
            decision === 'accepted'
              ? 'Offre acceptée ! Vous pouvez dès à présent finaliser votre achat à ce tarif réduit.'
              : 'Offre refusée. L\'article est déjà proposé à un prix très attractif.',
          timestamp: 'À l\'instant',
        };

        const updated = {
          ...conv,
          lastMessage: statusMsg.text,
          lastMessageTime: 'À l\'instant',
          messages: [...updatedMessages, statusMsg],
        };

        if (selectedConversation?.id === conversationId) {
          setSelectedConversation(updated);
        }

        return updated;
      })
    );

    showToast(
      decision === 'accepted' ? 'L\'offre a été acceptée avec succès !' : 'L\'offre a été déclinée.',
      decision === 'accepted' ? 'success' : 'info'
    );
  };

  // Add new article from Sell modal
  const addNewArticle = (newArticle: Partial<Article>) => {
    const article: Article = {
      id: `art_${Date.now()}`,
      title: newArticle.title || 'Nouvel article',
      brand: newArticle.brand || 'Marque vintage',
      size: newArticle.size || 'M',
      condition: newArticle.condition || 'Très bon état',
      price: newArticle.price || 40,
      originalPrice: newArticle.originalPrice,
      category: newArticle.category || 'Femmes',
      description: newArticle.description || 'Superbe pièce prête à être expédiée.',
      images: newArticle.images && newArticle.images.length > 0
        ? newArticle.images
        : ['https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80'],
      seller: {
        id: currentUser.id,
        name: currentUser.name,
        avatar: currentUser.avatar,
        rating: currentUser.rating,
        reviewCount: currentUser.reviewCount,
        verified: true,
        city: currentUser.city,
        responseRate: '10 min',
        fastShipper: true,
      },
      likes: 1,
      createdAt: 'À l\'instant',
      views: 12,
      parcelSize: newArticle.parcelSize || 'M',
      isFeatured: true,
    };

    setArticles((prev) => [article, ...prev]);
    showToast('Votre article a été publié avec succès sur Vinted Plus !', 'success');
  };

  // Withdraw wallet funds to IBAN
  const withdrawToBank = (amount: number): boolean => {
    if (amount <= 0 || amount > currentUser.balanceAvailable) {
      showToast('Montant invalide ou solde insuffisant.', 'warning');
      return false;
    }

    setCurrentUser((prev) => ({
      ...prev,
      balanceAvailable: prev.balanceAvailable - amount,
    }));

    setTransactions((prev) => [
      {
        id: `tx_${Date.now()}`,
        type: 'bank_withdrawal',
        amount: -amount,
        description: `Virement instantané vers compte ${currentUser.ibanMasked}`,
        date: 'À l\'instant',
        status: 'completed',
      },
      ...prev,
    ]);

    showToast(`Virement de ${amount.toFixed(2)} € envoyé vers votre banque !`, 'success');
    return true;
  };

  return (
    <AppContext.Provider
      value={{
        isDark,
        toggleTheme,
        currentUser,
        articles,
        favorites,
        orders,
        conversations,
        transactions,
        relayPoints,
        activeView,
        setActiveView,
        selectedArticle,
        setSelectedArticle,
        selectedOrder,
        setSelectedOrder,
        selectedConversation,
        setSelectedConversation,
        modal,
        openModal,
        closeModal,
        toggleFavorite,
        createOrder,
        advanceOrderStatus,
        confirmOrderReceived,
        sendMessage,
        sendOffer,
        handleOfferDecision,
        addNewArticle,
        withdrawToBank,
        toast,
        showToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
