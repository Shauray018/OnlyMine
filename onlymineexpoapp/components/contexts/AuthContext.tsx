// contexts/AuthContext.tsx
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAccount } from '@reown/appkit-react-native';
import React, { createContext, useContext, useEffect, useState } from 'react';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

interface User {
  id: string;
  walletAddress: string;
  username: string;
  displayName: string;
  avatarUrl?: string;
  bio?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  authenticate: () => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { address, isConnected } = useAccount();

  // Load user from storage on mount
  useEffect(() => {
    loadUserFromStorage();
  }, []);

  // When wallet connects, authenticate the user
  useEffect(() => {
    if (isConnected && address && !user) {
      authenticate();
    } else if (!isConnected && user) {
      // Wallet disconnected, clear user
      handleLogout();
    }
  }, [isConnected, address]);

  const loadUserFromStorage = async () => {
    try {
      const userData = await AsyncStorage.getItem('user');
      const savedAddress = await AsyncStorage.getItem('walletAddress');
      
      if (userData && savedAddress === address) {
        setUser(JSON.parse(userData));
      } else if (savedAddress && savedAddress !== address) {
        // Different wallet connected, clear old data
        await AsyncStorage.multiRemove(['user', 'walletAddress']);
      }
    } catch (error) {
      console.error('Error loading user:', error);
    } finally {
      setLoading(false);
    }
  };

  const authenticate = async () => {
    if (!address) {
      console.log('No address available');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      console.log('Authenticating with wallet address...');
      console.log("address: " + address); 
      console.log("url: " + API_URL)
      // Simple authentication using just the wallet address
      const response = await fetch(`${API_URL}/api/auth/verify-wallet`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          walletAddress: address,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Authentication failed');
      }

      const data = await response.json();

      if (data.success && data.user) {
        // Save user data
        await AsyncStorage.setItem('user', JSON.stringify(data.user));
        await AsyncStorage.setItem('walletAddress', address);
        setUser(data.user);
        console.log('✅ Authentication successful');
      } else {
        throw new Error(data.error || 'Authentication failed');
      }
    } catch (error: any) {
      console.error('Authentication error:', error);
      
      // User-friendly error messages
      if (error.message?.includes('network')) {
        alert('Network error. Please check your connection and try again.');
      } else {
        alert('Failed to authenticate. Please try again.');
      }
      
      // Clear any partial data
      await AsyncStorage.multiRemove(['user', 'walletAddress']);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const refreshUser = async () => {
    if (!user?.id) return;

    try {
      const response = await fetch(
        `${API_URL}/api/user/profile?userId=${user.id}`
      );
      
      if (response.ok) {
        const data = await response.json();
        const updatedUser = data.user;
        
        // Update storage and state
        await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
      }
    } catch (error) {
      console.error('Error refreshing user:', error);
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.multiRemove(['user', 'walletAddress']);
    setUser(null);
  };

  const logout = async () => {
    await handleLogout();
    // Note: Disconnecting wallet is handled by Reown's disconnect button
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        authenticate,
        logout,
        refreshUser,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};