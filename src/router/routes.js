var routes = [
    {
        path: '/',
        component: function () { return import('layouts/MainLayout.vue'); },
        children: [
            { path: '', component: function () { return import('pages/IndexPage.vue'); } },
            { path: 'home', component: function () { return import('pages/IndexPage.vue'); } },
            { path: 'keranjang', component: function () { return import('pages/CartPage.vue'); } },
            { path: 'checkout', component: function () { return import('pages/CheckoutPage.vue'); } },
            { path: 'products', component: function () { return import('pages/CategoryPage.vue'); } },
            {
                path: 'products/category/:categoryId', // E.g., /products/category/123 (menggunakan ID numerik)
                name: 'products-by-category',
                component: function () { return import('pages/CategoryPage.vue'); } // Halaman yang sama untuk kategori spesifik
            },
            {
                path: 'about', // Path relatif
                name: 'PublicAbout',
                component: function () { return import('pages/others/AboutPage.vue'); },
            },
            {
                path: 'career', // Path relatif
                name: 'PublicCareer',
                component: function () { return import('pages/others/CareerPage.vue'); },
            },
            {
                path: 'blog', // Path relatif
                name: 'PublicBlog',
                component: function () { return import('pages/others/BlogPage.vue'); },
            },
            {
                path: 'documentation', // Path relatif
                name: 'PublicLearn',
                component: function () { return import('pages/others/DocumentationPage.vue'); },
            },
            {
                path: 'alltutorials', // Path relatif
                name: 'AllTutorials',
                component: function () { return import('pages/others/AllTutorials.vue'); },
            },
            {
                path: 'support', // Base path for help and support
                name: 'help-support',
                component: function () { return import('pages/HelpSupportPage.vue'); }, // Your HelpSupportPage.vue
            },
            {
                path: 'support/:Helpsupportid', // Dynamic route for individual topics
                name: 'help-support-detail', // <-- THIS NAME MUST MATCH EXACTLY
                component: function () { return import('pages/HelpSupportPage.vue'); }, // Reuses the same component
                props: true, // This is good practice, though useRoute also works
            },
            {
                path: 'personalaccount', // Path relatif
                name: 'PersonalAccount', // Digunakan di DashboardLayout
                component: function () { return import('pages/others/helppage/personalaccount/PersonalAccount.vue'); },
            },
            {
                path: 'ordereditem', // Path relatif
                name: 'OrderedItem', // Digunakan di DashboardLayout
                component: function () { return import('pages/others/helppage/ordereditem/OrderedItem.vue'); },
            },
            {
                path: 'payment', // Path relatif
                name: 'PaymentPage', // Digunakan di DashboardLayout
                component: function () { return import('pages/others/helppage/payment/PaymentPage.vue'); },
            },
            {
                path: 'delivery', // Path relatif
                name: 'DeliveryPage', // Digunakan di DashboardLayout
                component: function () { return import('pages/others/helppage/delivery/DeliveryPage.vue'); },
            },
            {
                path: 'refund', // Path relatif
                name: 'RefundPage', // Digunakan di DashboardLayout
                component: function () { return import('pages/others/helppage/refund/RefundPage.vue'); },
            },
            {
                path: 'ordercomplaint', // Path relatif
                name: 'OrderComplaint', // Digunakan di DashboardLayout
                component: function () { return import('pages/others/helppage/ordercomplaint/OrderComplaint.vue'); },
            },
            {
                path: 'howtomake', // Path relatif
                name: 'HowToMake', // Digunakan di DashboardLayout
                component: function () { return import('pages/others/helppage/ordercomplaint/OrderComplaint.vue'); },
            },
            {
                path: 'other', // Path relatif
                name: 'OtherPage', // Digunakan di DashboardLayout
                component: function () { return import('pages/others/helppage/other/OtherPage.vue'); },
            },
        ],
    },
    {
        path: '/profile',
        component: function () { return import('layouts/ProfileLayout.vue'); },
        children: [
            { path: 'Data', component: function () { return import('pages/ProfilePage.vue'); } },
            { path: 'Transaksi', component: function () { return import('pages/TransactionPage.vue'); } }
        ],
    },
    {
        path: '/second',
        component: function () { return import('layouts/SecondLayout.vue'); },
        children: [
            { path: 'pembayaran', component: function () { return import('pages/PaymentPage.vue'); } },
            { path: 'create-akun', component: function () { return import('pages/CreateAccount.vue'); } },
            { path: 'login-akun', component: function () { return import('pages/LoginPage.vue'); } },
        ]
    },
    {
        path: '/:catchAll(.*)*',
        component: function () { return import('pages/ErrorNotFound.vue'); },
    },
    {
        path: '/', // Kelompokkan rute login/signup di bawah /auth
        component: function () { return import('layouts/HelpLayout.vue'); }, // ⏬ Menggunakan layout
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
        component: function () { return import('layouts/AdminLayout.vue'); },
        // meta: { requiresAuth: true, requiresAdmin: true }, // Tambahkan jika perlu role admin
        children: [
            { path: '', redirect: { name: 'AdminDashboard' } },
            { path: 'dashboard', name: 'AdminDashboard', component: function () { return import('pages/Admin/AdminDashboard.vue'); } },
            { path: 'products', name: 'AdminProducts', component: function () { return import('pages/Admin/AdminProducts.vue'); } },
            { path: 'category', name: 'AdminCategory', component: function () { return import('pages/Admin/AdminCategory.vue'); } },
           ],
    },
];
export default routes;
