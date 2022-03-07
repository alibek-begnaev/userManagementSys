import { Icon } from '@iconify/react';
import pieChart2Fill from '@iconify/icons-eva/pie-chart-2-fill';
import peopleFill from '@iconify/icons-eva/people-fill';
import shoppingBagFill from '@iconify/icons-eva/shopping-bag-fill';
import fileTextFill from '@iconify/icons-eva/file-text-fill';
import lockFill from '@iconify/icons-eva/lock-fill';
import personAddFill from '@iconify/icons-eva/person-add-fill';
import alertTriangleFill from '@iconify/icons-eva/alert-triangle-fill';

// ----------------------------------------------------------------------

const isAdmin = window.localStorage.getItem('role') === 'Administrator';
const getIcon = (name) => <Icon icon={name} width={22} height={22} />;

const sidebarConfig = [
  {
    title: 'person',
    path: '/dashboard/person',
    icon: getIcon(peopleFill),
    role: 'Client'
  },

  {
    title: 'profile',
    path: '/dashboard/app',
    icon: getIcon(pieChart2Fill),
    role: 'Administrator'
  },
  {
    title: 'workers',
    path: '/dashboard/worker',
    icon: getIcon(peopleFill),
    role: 'Administrator'
  },
  {
    title: 'users',
    path: '/dashboard/user',
    icon: getIcon(peopleFill),
    role: 'Administrator'
  },
  {
    title: 'profile',
    path: '/dashboard/app',
    icon: getIcon(pieChart2Fill),
    role: 'Manager'
  },
  {
    title: 'workers',
    path: '/dashboard/worker',
    icon: getIcon(peopleFill),
    role: 'Manager'
  },
  {
    title: 'users',
    path: '/dashboard/user',
    icon: getIcon(peopleFill),
    role: 'Manager'
  }
  // {
  //   title: 'product',
  //   path: '/dashboard/products',
  //   icon: getIcon(shoppingBagFill)
  // },
  // {
  //   title: 'blog',
  //   path: '/dashboard/blog',
  //   icon: getIcon(fileTextFill)
  // }
  // {
  //   title: 'login',
  //   path: '/login',
  //   icon: getIcon(lockFill)
  // },
  // {
  //   title: 'register',
  //   path: '/register',
  //   icon: getIcon(personAddFill)
  // }
  // {
  //   title: 'Not found',
  //   path: '/404',
  //   icon: getIcon(alertTriangleFill)
  // }
];

export default sidebarConfig;
