import { useEffect, useRef, useState } from 'react';
import { useStore } from '../store/useStore';
import toast from 'react-hot-toast';

export function OrderNotificationListener() {
  const { isAdminAuthenticated, orders, fetchOrders } = useStore();
  const [previousOrdersCount, setPreviousOrdersCount] = useState<number>(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize previous orders count on first load
  useEffect(() => {
    if (isAdminAuthenticated && !isInitialized) {
      setPreviousOrdersCount(orders.length);
      setIsInitialized(true);
    }
  }, [isAdminAuthenticated, orders.length, isInitialized]);

  // Auto-refresh orders for authenticated admins
  useEffect(() => {
    if (!isAdminAuthenticated) {
      setIsInitialized(false);
      return;
    }

    const checkForNewOrders = async () => {
      await fetchOrders();
    };

    // Poll for new orders every 15 seconds
    const interval = setInterval(checkForNewOrders, 15000);

    return () => clearInterval(interval);
  }, [isAdminAuthenticated, fetchOrders]);

  // Detect new orders and play sound
  useEffect(() => {
    if (!isAdminAuthenticated || !isInitialized) return;

    const currentCount = orders.length;

    // Skip if no change
    if (currentCount <= previousOrdersCount) return;

    // New orders detected
    const newOrders = currentCount - previousOrdersCount;

    // Play notification sound
    playNotificationSound();

    // Show toast notification
    toast.success(
      `🛍️ Новая заявка в магазине!\nВсего новых: ${newOrders}`,
      {
        duration: 10000,
        icon: '🔔',
        style: {
          fontSize: '16px',
          fontWeight: '600',
          minWidth: '350px',
          padding: '20px 24px',
        },
      }
    );

    setPreviousOrdersCount(currentCount);
  }, [orders.length, isAdminAuthenticated, previousOrdersCount, isInitialized]);

  // Play notification sound
  const playNotificationSound = () => {
    // Create audio element if it doesn't exist
    if (!audioRef.current) {
      audioRef.current = new Audio();
      // Using a simple notification sound (data URI)
      audioRef.current.src = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjeL0fLTgjMGHm7A7+OZTR0SU6zn77dfFgs+muDyvHEjCDV7w/HLdjwJG2a36+WXUBwPS6Xj77RhGws6k9X0xHguBSZ1w/HRgDkJF2Kz6+mrWBcLPZnb8r52JQY8iM7w04k5CRZmsOnpsV4dDkqk4O+zYh0LOY/T8sZ8MAUocLzv2I9CDBNZrOXwrF4XCz2Q0/S9cyQIO4LG8NSBOAkTYLLl67RiHAxKo+Htsl0bCjmP0/LGfTAFKG+87tiQQwwTWazl8KtfFws9j9Pzu3UlBjuCxfDTgTcJE12y5eq0Yx0MSqPg7bJdGwo5jtLyxn0wBSdvu+7Yj0MLFV2s5fCsYBcLPZDT87x1JQY7gcTwz4A2CRRasOjrt2MeDEmj4O2yXRsKOY7S8sZ9MAUmb7zv2I9DCxVdrOXwrGAXCz2P0/O8dSUGO4HE8M+ANgkUWrDp67djHgxJo+DtsV4bCjmO0vLGfDAFJm+87tiPQwsVXazl8KxgFws9jtPzvHUlBjuBxPDPgDYJFFqw6eq3Yx4MSaLg7bJeGwo5jdPyxn4wBSduu+/Yj0MLFV2s5fCsYBcLPY7T871zJAY7gcXwz4A2CRRasOnqt2MdDEmj4O2yXRsKOY3S8sZ+MAUnbrvw2I9DCxVdrOXwrGAXCz2P0/O9cyQGO4HF8M+ANgkUWrDp6rZjHQxJo+Dssl0bCjmO0vLGfTAFJ2+77tiPQwsVXa3l8KtgFws9j9PzvXQkBjuBxfDPgDYJFFqw6eq2Yx0MSaPg7bJdGwo5jtLyxn0wBSdvu+7Yj0MLFV2t5fCrYBcLPY7T871zJAY7gcXwz4A2CRRasOnqtmMdDEmj4O2yXRsKOY7S8sZ9MAUnbrvv2I9CCxVdrOXwq2AXCz2O0/O8dCQGO4HF8M+ANgkUWrDp6rZjHQxJo+Dssl0bCjmO0vLGfTAFJ2677tiPQgsVXa3l8KtgFws9jtPzvHQkBjuBxfDPgDYJFFqw6eq2Yx0MSaPg7bJdGwo5jtLyxn0wBSdvu+7Yj0ILFV2t5fCrYBcLPY7T87x0JAY7gcXwz4A2CRRasOnqtmMdDEmj4O2yXRsKOY7S8sZ9MAUnbrvv2I9CCxVdrOXwq2AXCz2O0/O8dCQGO4HF8M+ANgkUWrDp6rZjHQxJo+Dssl0bCjmO0vLGfTAFJ2677tiPQgsVXa3l8KxgFws9jtPzvHQkBjuBxfDPgDYJFFqw6eq2Yx0MSaPg7bJdGwo5jtLyxn0wBSduu+/Yj0ILFV2t5fCrYBcLPY7T87x0JAY7gcXwz4A2CRRasOnqtmMdDEmj4O2yXRsKOY7S8sZ9MAUnbrvv2I9CCxVdrOXwq2AXCz2O0/O8dCQGO4HF8M+ANgkUWrDp6rZjHQxJo+Dssl0bCjmO0vLGfTAFJ2677tiPQgsVXa3l8KtgFws9jtPzvHQkBjuBxfDPgDYJFFqw6eq2Yx0MSaPg7bJdGwo5jtLyxn0wBSduu+/Yj0ILFV2t5fCrYBcLPY7T87x0JAY7gcXwz4A2CRRasOnqtmMdDEmj4O2yXRsKOY7S8sZ9MAUnbrvv2I9CCxVdrOXwq2AXCz2O0/O8dCQGO4HF8M+ANgkUWrDp6rZjHQxJo+Dssl0bCjmO0vLGfTAFJ2677tiPQgsVXa3l8KtgFws9jtPzvHQkBjuBxfDPgDYJFFqw6eq2Yx0MSaPg7bJdGwo5jtLyxn0wBSduu+/Yj0ILFV2t5fCrYBcLPY7T87x0JAY7gcXwz4A2CRRasOnqtmMdDEmj4O2yXRsK';
    }

    audioRef.current.volume = 0.7;
    audioRef.current.play().catch((err) => {
      console.log('Could not play notification sound:', err);
    });
  };

  // This component doesn't render anything
  return null;
}
