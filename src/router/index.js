import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)
export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      redirect: "/login"
    },
    {
      path: "/login",
      name: "login",
      component: () => import('@/views/login/Login.vue'),
      meta: {
        title: "登录",
        roles: ['login']
      }
    },
    {
      path: "/home",
      redirect: "/home/project",
      name: 'home',
      component: () => import('@/views/home/Home.vue'),
      meta: {
        title: "首页",
        roles: ['home'],
        needLogin: false
      },
      children: [
        {
          path: 'project',
          name: 'project',
          component: () => import('@/views/project-manage/project-list/projectList.vue'),
          meta: {
            title: '项目列表',
            roles: ['项目管理', '项目列表'],
            needLogin: true
          }
        },
        {
          path: 'dropPrepare',
          name: 'dropPrepare',
          component: () => import('@/views/project-manage/dropPrepare-info/dropPrepare.vue'),
          meta: {
            title: '退筹确认',
            roles: ['项目管理', '退筹确认'],
            needLogin: true
          }
        },
        {
          path: 'dropHouse',
          name: 'dropHouse',
          component: () => import('@/views/project-manage/dropHouse-info/dropHouse.vue'),
          meta: {
            title: '退房确认',
            roles: ['项目管理', '退房确认'],
            needLogin: true
          }
        },
        {
          path: 'businessInfo',
          name: 'businessInfo',
          component: () => import('@/views/statement-manage/business-list/businessInfo.vue'),
          meta: {
            title: '业务报表',
            roles: ['报表管理', '业务报表'],
            needLogin: true
          }
        },
        {
          path: 'financeInfo',
          name: 'financeInfo',
          component: () => import('@/views/statement-manage/finance-list/financeInfo.vue'),
          meta: {
            title: '财务报表',
            roles: ['报表管理', '财务报表'],
            needLogin: true
          }
        },
        {
          path: 'contractManage',
          name: 'contractManage',
          component: () => import('@/views/finance-manage/contract-manage/contractManage.vue'),
          meta: {
            title: '合同管理',
            roles: ['财务管理', '合同管理'],
            needLogin: true
          }
        },
        {
          path: 'orgFramework',
          name: 'orgFramework',
          component: () => import('@/views/system-setting/org-framework/orgFramework.vue'),
          meta: {
            title: '组织机构',
            roles: ['系统设置', '组织架构'],
            needLogin: true
          }
        },
        {
          path: 'setPermiss',
          name: 'setPermiss',
          component: () => import('@/views/system-setting/org-framework/setPermiss.vue'),
          meta: {
            title: '权限设置',
            roles: ['系统管理员', '权限设置'],
            needLogin: true
          }
        },
        {
          path: 'showAnnounce',
          name: 'showAnnounce',
          component: () => import('@/views/system-setting/announce-manage/showAnnounce.vue'),
          meta: {
            title: '公告详情',
            needLogin: true
            // roles: ['系统管理员', '权限设置']
          }
        },
        {
          path: 'dataDictionary',
          name: 'dataDictionary',
          component: () => import('@/views/system-setting/data-dictionary/dataDictionary.vue'),
          meta: {
            title: '数据字典',
            roles: ['系统设置', '数据字典'],
            needLogin: true
          }
        },
        {
          path: 'bannerManage',
          name: 'bannerManage',
          component: () => import('@/views/system-setting/banner-manage/bannerManage.vue'),
          meta: {
            title: 'banner管理',
            roles: ['系统设置', 'banner管理'],
            needLogin: true
          }
        },
        {
          path: 'announceManage',
          name: 'announceManage',
          component: () => import('@/views/system-setting/announce-manage/announceManage.vue'),
          meta: {
            title: '公告管理',
            roles: ['系统设置', '公告管理'],
            needLogin: true
          }
        },
        {
          path: 'editAvatar',
          name: 'editAvatar',
          component: () => import('@/views/system-setting/edit-avatar/editAvatar.vue'),
          meta: {
            title: '编辑头像',
            roles: ['系统设置', '编辑头像'],
            needLogin: true
          }
        },
        {
          path: 'modifyPhone',
          name: 'modifyPhone',
          component: () => import('@/views/system-setting/modify-phone/modifyPhone.vue'),
          meta: {
            title: '修改电话',
            roles: ['系统设置', '修改电话'],
            needLogin: true
          }
        },
        {
          path: 'exitCompany',
          name: 'exitCompany',
          component: () => import('@/views/system-setting/exit-company/exitCompany.vue'),
          meta: {
            title: '退出企业',
            roles: ['系统设置', '退出企业'],
            needLogin: true
          }
        },
        {
          path: '403errorPage',
          name: '403errorPage',
          component: () => import('@/views/errorPage/403page.vue'),
          meta: {
            title: 403,
            needLogin: false
          }
        }
      ]
    },
    {
      path: '*',
      name: '404errorPage',
      component: () => import('@/views/errorPage/404page.vue'),
      meta: { title: 404, needLogin: false }
    },

    // u+页面
    {
      path: '/passengerSource',
      name: 'passengerSource',
      component: () => import('@/views/passenger-source/passengerSource.vue'),
      meta: { title: "客源列表", needLogin: false }
    },
  ]
})
