// src/stores/user-store.ts
import { defineStore } from 'pinia';
import axios from 'axios';
import type { PersistenceOptions } from 'pinia-plugin-persistedstate';

interface User {
    id: number;
    username: string;
    email: string;
    documentId?: string;
    profile?: { url: string } | null;
    no_telp?: string; // Tambahkan no_telp
    addresses?: Address[]; // Tambahkan addresses
}

// Interface untuk Address (sesuai dengan field di Strapi Address Collection Type Anda)
interface Address {
    id: number;
    documentId?: string;
    nama_alamat: string;
    jalan: string;
    no_rumah: string;
    rt_rw: string;
    kecamatan: string;
    kota: string;
    provinsi: string;
    kode_pos: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    users_permissions_user?: any;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
}


interface UserState {
    user: User | null;
    token: string | null;
    loading: boolean;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-redundant-type-constituents
    error: any | null;
}

export const useUserStore = defineStore('user', {
    state: (): UserState => {
        console.log('UserStore: Defining initial state. (Persisted state will hydrate shortly)');
        return {
            user: null,
            token: null,
            loading: false,
            error: null,
        };
    },
    getters: {
        isLoggedIn: (state) => !!state.token && !!state.user?.id,
        userId: (state) => state.user?.id,
        userProfileUrl: (state) => state.user?.profile?.url,
        documentId: (state) => state.user?.documentId,
    },
    actions: {
        async fetchUser() {
            console.log('fetchUser: Attempting to fetch user data...');
            if (!this.token) {
                this.user = null;
                console.warn('fetchUser: Token not found in store.');
                return;
            }
            this.loading = true;
            this.error = null;
            try {
                const baseUrl = import.meta.env.VITE_STRAPI_API_URL || 'http://localhost:1337';

                // ✅ PERBAIKAN: Populate addresses juga saat fetchUser
                const res = await axios.get(`${baseUrl}/api/users/me?populate=profile&populate=addresses`, {
                    headers: { Authorization: `Bearer ${this.token}` },
                });
                this.user = {
                    id: res.data.id,
                    username: res.data.username,
                    email: res.data.email,
                    documentId: res.data.documentId,
                    profile: res.data.profile,
                    no_telp: res.data.no_telp, // Pastikan no_telp juga diambil
                    addresses: res.data.addresses || [] // Pastikan addresses diambil
                };

            } catch (err) {
                console.error('fetchUser: Failed to fetch user data. Error:', err);
                this.error = err;
                this.token = null;
                this.user = null;
            } finally {
                this.loading = false;
            }
            console.log('[UserStore] Loaded user:', this.user);
            console.log('[UserStore] documentId:', this.user?.documentId);
            console.log('[UserStore] Addresses:', this.user?.addresses); // Log addresses
            console.log('fetchUser: Successfully fetched user data:', this.user?.username);
        },
        setToken(token: string | null) {
            this.token = token;
            console.log('setToken: Token updated in store. New token present:', !!token);
        },
        logout() {
            this.setToken(null);
            this.user = null;
            console.log('logout: User logged out from store.');
        },
        initUser() {
            console.log('initUser: Called.');
            console.log('initUser: Current store state (token, user):', this.token, this.user ? 'Loaded' : 'NULL');

            // Memeriksa apakah documentId dan addresses juga ada
            const isUserDataComplete = this.user && this.user.id && this.user.username && this.user.email && this.user.documentId && this.user.addresses;

            if (this.token && !isUserDataComplete) {
                console.log('initUser: Token present, but user data incomplete. Fetching user...');
                void this.fetchUser();
            } else if (!this.token) {
                this.user = null;
                console.log('initUser: No token found in store. User is logged out.');
            } else {
                console.log('initUser: User data already complete. Skipping fetchUser.');
            }
        }
    },
    persist: {
        key: 'my-app-user-store',
        storage: localStorage,
        paths: ['user', 'token'],
    } as PersistenceOptions,
});
