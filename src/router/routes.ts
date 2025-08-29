import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
      { path: 'home', component: () => import('pages/IndexPage.vue') },

      { path: 'cart', component: () => import('pages/CartPage.vue') },
      { path: 'checkout', component: () => import('pages/CheckoutPage.vue') },
      { path: 'products', component: () => import('pages/CategoryPage.vue') },
      {
        path: 'products/category/:categoryId', // E.g., /products/category/123 (menggunakan ID numerik)
        name: 'products-by-category',
        component: () => import('pages/CategoryPage.vue') // Halaman yang sama untuk kategori spesifik
      },
      {
        path: 'about', // Path relatif
        name: 'PublicAbout',
        component: () => import('pages/others/AboutPage.vue'),
      },
      {
        path: 'career', // Path relatif
        name: 'PublicCareer',
        component: () => import('pages/others/CareerPage.vue'),
      },
      // {
      //   path: 'doc', // Path relatif
      //   name: 'PublicBlog',
      //   component: () => import('pages/others/DocPage.vue'),
      // },
      {
        path: 'documentation', // Path relatif
        name: 'PublicLearn',
        component: () => import('pages/others/LearnPage.vue'),
      },
      {
        path: 'alltutorials', // Path relatif
        name: 'AllTutorials',
        component: () => import('pages/others/AllTutorials.vue'),
      },

      {
        path: 'support', // Base path for help and support
        name: 'help-support',
        component: () => import('pages/HelpSupportPage.vue'), // Your HelpSupportPage.vue
      },
      {
        path: 'support/:Helpsupportid', // Dynamic route for individual topics
        name: 'help-support-detail', // <-- THIS NAME MUST MATCH EXACTLY
        component: () => import('pages/HelpSupportPage.vue'), // Reuses the same component
        props: true, // This is good practice, though useRoute also works
      },
      {
        path: 'personalaccount', // Path relatif
        name: 'PersonalAccount', // Digunakan di DashboardLayout
        component: () => import('pages/others/helppage/personalaccount/PersonalAccount.vue'),
      },
      {
        path: 'ordereditem', // Path relatif
        name: 'OrderedItem', // Digunakan di DashboardLayout
        component: () => import('pages/others/helppage/ordereditem/OrderedItem.vue'),
      },
      {
        path: 'payment', // Path relatif
        name: 'PaymentPage', // Digunakan di DashboardLayout
        component: () => import('pages/others/helppage/payment/PaymentPage.vue'),
      },
      {
        path: 'delivery', // Path relatif
        name: 'DeliveryPage', // Digunakan di DashboardLayout
        component: () => import('pages/others/helppage/delivery/DeliveryPage.vue'),
      },
      {
        path: 'refund', // Path relatif
        name: 'RefundPage', // Digunakan di DashboardLayout
        component: () => import('pages/others/helppage/refund/RefundPage.vue'),
      },
      {
        path: 'ordercomplaint', // Path relatif
        name: 'OrderComplaint', // Digunakan di DashboardLayout
        component: () => import('pages/others/helppage/ordercomplaint/OrderComplaint.vue'),
      },
      {
        path: 'howtomake', // Path relatif
        name: 'HowToMake', // Digunakan di DashboardLayout
        component: () => import('pages/others/helppage/ordercomplaint/OrderComplaint.vue'),
      },
      {
        path: 'other', // Path relatif
        name: 'OtherPage', // Digunakan di DashboardLayout
        component: () => import('pages/others/helppage/other/OtherPage.vue'),
      },
      {
        path: 'videos', // Path relatif
        name: 'VideosPage', // Digunakan di DashboardLayout
        component: () => import('pages/others/VideosPage.vue'),

      }

    ],
  },

  {
    path: '/profile',
    component: () => import('layouts/ProfileLayout.vue'),
    children: [
      { path: 'Data', component: () => import('pages/ProfilePage.vue') },
      { path: 'Transaksi', component: () => import('pages/TransactionPage.vue') },
      { path: 'SystemNotif', component: () => import('pages/SystemNotif.vue') },
      { path: 'PromotionalNotif', component: () => import('pages/PromoteOffers.vue') },
    ],
  },
  {
    path: '/second',
    component: () => import('layouts/SecondLayout.vue'),
    children: [
      { path: 'pembayaran', component: () => import('pages/PaymentPage.vue') },
       { path: 'create-akun', component: () => import('pages/CreateAccount.vue') },
      { path: 'login-akun', component: () => import('pages/LoginPage.vue') },
    ]
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },

   {
    path: '/', // Kelompokkan rute login/signup di bawah /auth
    component: () => import('layouts/HelpLayout.vue'), // ⏬ Menggunakan layout
    children: [
      // {
      //   path: 'help', // Path relatif
      //   name: 'DashboardHelp', // Digunakan di DashboardLayout
      //   component: () => import('pages/others/HelpPage.vue'),
      // },
      // {
      //   path: 'personalaccount', // Path relatif
      //   name: 'PersonalAccount', // Digunakan di DashboardLayout
      //   component: () => import('pages/others/helppage/personalaccount/PersonalAccount.vue'),
      // },
      // {
      //   path: 'ordereditem', // Path relatif
      //   name: 'OrderedItem', // Digunakan di DashboardLayout
      //   component: () => import('pages/others/helppage/ordereditem/OrderedItem.vue'),
      // },
      // {
      //   path: 'payment', // Path relatif
      //   name: 'PaymentPage', // Digunakan di DashboardLayout
      //   component: () => import('pages/others/helppage/payment/PaymentPage.vue'),
      // },
      // {
      //   path: 'delivery', // Path relatif
      //   name: 'DeliveryPage', // Digunakan di DashboardLayout
      //   component: () => import('pages/others/helppage/delivery/DeliveryPage.vue'),
      // },
      // {
      //   path: 'refund', // Path relatif
      //   name: 'RefundPage', // Digunakan di DashboardLayout
      //   component: () => import('pages/others/helppage/refund/RefundPage.vue'),
      // },
      // {
      //   path: 'ordercomplaint', // Path relatif
      //   name: 'OrderComplaint', // Digunakan di DashboardLayout
      //   component: () => import('pages/others/helppage/ordercomplaint/OrderComplaint.vue'),
      // },
      // {
      //   path: 'howtomake', // Path relatif
      //   name: 'HowToMake', // Digunakan di DashboardLayout
      //   component: () => import('pages/others/helppage/ordercomplaint/OrderComplaint.vue'),
      // },
      // {
      //   path: 'other', // Path relatif
      //   name: 'OtherPage', // Digunakan di DashboardLayout
      //   component: () => import('pages/others/helppage/other/OtherPage.vue'),
      // },
    ],
    },

    {
    path: '/admin',
    component: () => import('layouts/AdminLayout.vue'),
    // meta: { requiresAuth: true, requiresAdmin: true }, // Tambahkan jika perlu role admin
    children: [
      { path: '', redirect: { name: 'AdminDashboard' } },
      { path: 'dashboard', name: 'AdminDashboard', component: () => import('pages/Admin/AdminDashboard.vue') },
      { path: 'products', name: 'AdminProducts', component: () => import('pages/Admin/AdminProducts.vue') },
      { path: 'category', name: 'AdminCategory', component: () => import('pages/Admin/AdminCategory.vue') },
],
    },
];
export default routes;
