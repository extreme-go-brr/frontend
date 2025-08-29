var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
// src/stores/user-store.ts
import { defineStore } from 'pinia';
import axios from 'axios';
export var useUserStore = defineStore('user', {
    state: function () {
        console.log('UserStore: Defining initial state. (Persisted state will hydrate shortly)');
        return {
            user: null,
            token: null,
            loading: false,
            error: null,
        };
    },
    getters: {
        isLoggedIn: function (state) { var _a; return !!state.token && !!((_a = state.user) === null || _a === void 0 ? void 0 : _a.id); },
        userId: function (state) { var _a; return (_a = state.user) === null || _a === void 0 ? void 0 : _a.id; },
        userProfileUrl: function (state) { var _a, _b; return (_b = (_a = state.user) === null || _a === void 0 ? void 0 : _a.profile) === null || _b === void 0 ? void 0 : _b.url; },
        documentId: function (state) { var _a; return (_a = state.user) === null || _a === void 0 ? void 0 : _a.documentId; },
    },
    actions: {
        fetchUser: function () {
            return __awaiter(this, void 0, void 0, function () {
                var baseUrl, res, err_1;
                var _a, _b, _c;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            console.log('fetchUser: Attempting to fetch user data...');
                            if (!this.token) {
                                this.user = null;
                                console.warn('fetchUser: Token not found in store.');
                                return [2 /*return*/];
                            }
                            this.loading = true;
                            this.error = null;
                            _d.label = 1;
                        // eslint-disable-next-line no-fallthrough
                        case 1:
                            _d.trys.push([1, 3, 4, 5]);
                            baseUrl = import.meta.env.VITE_STRAPI_API_URL || 'http://localhost:1337';
                            return [4 /*yield*/, axios.get("".concat(baseUrl, "/api/users/me?populate=profile&populate=addresses"), {
                                    headers: { Authorization: "Bearer ".concat(this.token) },
                                })];
                        case 2:
                            res = _d.sent();
                            this.user = {
                                id: res.data.id,
                                username: res.data.username,
                                email: res.data.email,
                                documentId: res.data.documentId,
                                profile: res.data.profile,
                                no_telp: res.data.no_telp, // Pastikan no_telp juga diambil
                                addresses: res.data.addresses || [] // Pastikan addresses diambil
                            };
                            return [3 /*break*/, 5];

                        case 3:
                            err_1 = _d.sent();
                            console.error('fetchUser: Failed to fetch user data. Error:', err_1);
                            this.error = err_1;
                            this.token = null;
                            this.user = null;
                            return [3 /*break*/, 5];
                        case 4:
                            this.loading = false;
                            return [7 /*endfinally*/];
                        case 5:
                            console.log('[UserStore] Loaded user:', this.user);
                            console.log('[UserStore] documentId:', (_a = this.user) === null || _a === void 0 ? void 0 : _a.documentId);
                            console.log('[UserStore] Addresses:', (_b = this.user) === null || _b === void 0 ? void 0 : _b.addresses); // Log addresses
                            console.log('fetchUser: Successfully fetched user data:', (_c = this.user) === null || _c === void 0 ? void 0 : _c.username);
                            return [2 /*return*/];
                    }
                });
            });
        },
        setToken: function (token) {
            this.token = token;
            console.log('setToken: Token updated in store. New token present:', !!token);
        },
        logout: function () {
            this.setToken(null);
            this.user = null;
            console.log('logout: User logged out from store.');
        },
        initUser: function () {
            console.log('initUser: Called.');
            console.log('initUser: Current store state (token, user):', this.token, this.user ? 'Loaded' : 'NULL');
            // Memeriksa apakah documentId dan addresses juga ada
            var isUserDataComplete = this.user && this.user.id && this.user.username && this.user.email && this.user.documentId && this.user.addresses;
            if (this.token && !isUserDataComplete) {
                console.log('initUser: Token present, but user data incomplete. Fetching user...');
                void this.fetchUser();
            }
            else if (!this.token) {
                this.user = null;
                console.log('initUser: No token found in store. User is logged out.');
            }
            else {
                console.log('initUser: User data already complete. Skipping fetchUser.');
            }
        }
    },
    persist: {
        key: 'my-app-user-store',
        storage: localStorage,
        paths: ['user', 'token'],
    },
});
