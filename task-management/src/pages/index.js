import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';

export default function Home() {
  const router = useRouter();
  const { user, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    if (loading) return;
    if (user) {
      router.push('/dashboard');
    } else {
      router.push('/intro');
    }
  }, [user, loading, router]);

  return <div>Loading...</div>;
}
