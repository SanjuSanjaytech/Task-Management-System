import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';

export default function Home() {
  const router = useRouter();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    } else {
      router.push('/intro');
    }
  }, [user, router]);

  return <div>Loading...</div>;
}