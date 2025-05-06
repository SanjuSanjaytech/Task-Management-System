// Placeholder for notifications (can be enhanced with WebSockets)
import { useEffect } from 'react';
import { toast } from 'react-toastify';

export default function Notification({ message }) {
  useEffect(() => {
    if (message) {
      toast.info(message);
    }
  }, [message]);

  return null;
}