import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/user'

import Register from '../pages/Register.vue'
import Login from '../pages/Login.vue'
import Home from '@/pages/Home.vue'
import Products from '@/pages/Products.vue'
import ForgotPassword from '@/pages/ForgotPassword.vue'
import ConfirmEmail from '@/pages/ConfirmEmail.vue'
import ResetPassword from '@/pages/resetPassword.vue'
import AdminDashboard from '@/pages/admin_dashboard.vue'
import ProductDetails from '@/pages/ProductDetails.vue'
import Cart from '@/pages/Cart.vue'
import NotFound from '@/pages/NotFound.vue'
import ProfilPage from '@/pages/profil/profilPage.vue'
import SearchResult from '@/components/common/SearchResult.vue'
import Checkout from '@/pages/Checkout.vue'
import Favorites from '@/pages/Favorites.vue'
import Payment from '@/pages/Payment.vue'
import PaymentSuccess from '@/pages/PaymentSuccess.vue'
import PaymentCancel from '@/pages/PaymentCancel.vue'
import { decodeBase64 } from '@/utils/encodage'

const routes = [
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: { requiresAuth: false }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { requiresAuth: false }
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
    meta: { requiresAuth: false }
  },
  {
    path: '/products',
    name: 'Products',
    component: Products,
    meta: { requiresAuth: false }
  },
  {
    path: '/forgot-password',
    name: 'ForgotPassword',
    component: ForgotPassword,
    meta: { requiresAuth: false }
  },
  {
    path: '/confirm-email/:token',
    name: 'ConfirmEmail',
    component: ConfirmEmail,
    meta: { requiresAuth: false }
  },
  {
    path: '/',
    redirect: '/home',
    meta: { requiresAuth: false }
  },
  {
    path: '/reset-password/:resetToken',
    name: 'ResetPassword',
    component: ResetPassword,
    meta: { requiresAuth: false }
  },
  {
    path: '/:catchAll(.*)',
    name: 'NotFound',
    component: NotFound,
    meta: { requiresAuth: false }
  },
  {
    path: '/admin/dashboard',
    name: 'AdminDashboard',
    component: AdminDashboard,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/product/:id',
    name: 'ProductDetails',
    component: ProductDetails,
    meta: { requiresAuth: false },
    props: (route) => ({ id: decodeBase64(route.params.id as string) })
  },
  {
    path: '/cart',
    name: 'Cart',
    component: Cart,
    meta: { requiresAuth: false }
  },
  {
    path: '/profile',
    name: 'ProfilPage',
    component: ProfilPage,
    meta: { requiresAuth: true }
  },
  {
    path: '/search',
    name: 'SearchResults',
    component: SearchResult
  },
  {
    path: '/favorites',
    name: 'Favorites',
    component: Favorites
  },

  {
    path: '/checkout',
    name: 'Checkout',
    component: Checkout
  } /*{
            path: '/admin',
            name: 'AdminLayout',
            component: AdminLayout,
            children: [
              { path: 'products', name: 'ProductManagement', component: ProductManagement },
              { path: 'users', name: 'UserManagement', component: UserManagement },
              { path: 'orders', name: 'OrderManagement', component: OrderManagement },
              { path: 'list', name: 'ListItems', component: ListItems },
            ],
          },*/,

  {
    path: '/payment',
    name: 'payment',
    component: Payment
  },
//   {
//     path: '/paymentCheckout',
//     name: 'paymentCheckout',
//     component: PaymentCommande
//   },
  { path: '/paymentSuccess', name: 'paymentSuccess', component: PaymentSuccess },
  { path: '/paymentCancel', name: 'paymentCancel', component: PaymentCancel }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Garde de navigation pour vérifier l'authentification et les rôles
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'Login' })
  } else if (to.meta.requiresAdmin && authStore.user?.role !== 'admin') {
    next({ name: 'Home' })
  } else {
    next()
  }
})

export default router
