"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface UserProfile {
    name: string;
    email: string;
    country: string;
    city: string; // Added city
    phone: string;
    isPremium: boolean;
    avatar?: string;
}

interface UserContextType {
    user: UserProfile | null;
    login: (profile: UserProfile) => void;
    logout: () => void;
    updateProfile: (updates: Partial<UserProfile>) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<UserProfile | null>(null);

    // Initial load from localStorage (demo purpose)
    useEffect(() => {
        const savedUser = localStorage.getItem("audiofilo_user");
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
    }, []);

    const login = (profile: UserProfile) => {
        setUser(profile);
        localStorage.setItem("audiofilo_user", JSON.stringify(profile));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("audiofilo_user");
    };

    const updateProfile = (updates: Partial<UserProfile>) => {
        if (!user) return;
        const newUser = { ...user, ...updates };
        setUser(newUser);
        localStorage.setItem("audiofilo_user", JSON.stringify(newUser));
    };

    return (
        <UserContext.Provider value={{ user, login, logout, updateProfile }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error("useUser must be used within a UserProvider");
    }
    return context;
}
