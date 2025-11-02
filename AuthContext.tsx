import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { User, Recording } from '../types';

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password?: string) => boolean;
  register: (name: string, email: string, password?: string) => boolean;
  logout: () => void;
  updateUser: (updatedUser: User) => void;
  addRecording: (newRecording: Omit<Recording, 'id'>) => void;
  recordings: Recording[];
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [recordings, setRecordings] = useState<Recording[]>([]);

  useEffect(() => {
    const storedUsers = localStorage.getItem('sales_users');
    if (storedUsers) {
      setUsers(JSON.parse(storedUsers));
    }

    const loggedInUserId = localStorage.getItem('loggedInUserId');
    if (loggedInUserId && storedUsers) {
      const allUsers: User[] = JSON.parse(storedUsers);
      const currentUser = allUsers.find(u => u.id === loggedInUserId);
      if (currentUser) {
        setUser(currentUser);
        const userRecordings = localStorage.getItem(`recordings_${currentUser.id}`);
        if(userRecordings) {
            setRecordings(JSON.parse(userRecordings));
        }
      }
    }
  }, []);

  const login = (email: string, password?: string): boolean => {
    const existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existingUser && existingUser.password === password) {
      setUser(existingUser);
      localStorage.setItem('loggedInUserId', existingUser.id);
      const userRecordings = localStorage.getItem(`recordings_${existingUser.id}`);
      setRecordings(userRecordings ? JSON.parse(userRecordings) : []);
      return true;
    }
    return false;
  };

  const register = (name: string, email: string, password?: string): boolean => {
    if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      return false; // User already exists
    }
    const newUser: User = {
      id: `user_${Date.now()}`,
      name,
      email,
      password,
      avatar: `https://api.dicebear.com/8.x/initials/svg?seed=${name}`,
    };
    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    localStorage.setItem('sales_users', JSON.stringify(updatedUsers));
    setUser(newUser);
    localStorage.setItem('loggedInUserId', newUser.id);
    setRecordings([]);
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('loggedInUserId');
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
    const updatedUsers = users.map(u => u.id === updatedUser.id ? updatedUser : u);
    setUsers(updatedUsers);
    localStorage.setItem('sales_users', JSON.stringify(updatedUsers));
  }
  
  const addRecording = useCallback((newRecordingData: Omit<Recording, 'id'>) => {
    if(!user) return;
    const newRecording: Recording = {
      ...newRecordingData,
      id: `rec_${Date.now()}`,
    };
    setRecordings(prev => {
        const updatedRecordings = [newRecording, ...prev];
        localStorage.setItem(`recordings_${user.id}`, JSON.stringify(updatedRecordings));
        return updatedRecordings;
    });
  }, [user]);

  return (
    <AuthContext.Provider value={{ isAuthenticated: !!user, user, login, register, logout, updateUser, addRecording, recordings }}>
      {children}
    </AuthContext.Provider>
  );
};