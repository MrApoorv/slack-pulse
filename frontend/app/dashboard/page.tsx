"use client";
import Dashboard from "../components/Dashboard";
import dynamic from 'next/dynamic';

const ClientRouter = dynamic(() => import('../components/ClientRouter'), { ssr: false });

export default function App() {
  return (
    <ClientRouter>
      <Dashboard />
    </ClientRouter>
  );
}
