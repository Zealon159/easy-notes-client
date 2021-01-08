import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

// 页面组件
const home = r => require.ensure([], () => r(require('@/pages/home')), 'home');
const my = r => require.ensure([], () => r(require('@/pages/home/my')), 'my');
const register = r => require.ensure([], () => r(require('@/pages/register')), 'register');
const oauth2Callback = r => require.ensure([], () => r(require('@/pages/oauth2-callback')), 'oauth2Callback');
const login = r => require.ensure([], () => r(require('@/pages/login')), 'login');
const notesList = r => require.ensure([], () => r(require('@/pages/home/notes-list')), 'notesList');
const notesRemoveList = r => require.ensure([], () => r(require('@/pages/home/notes-remove-list')), 'notesRemoveList');
const categoryList = r => require.ensure([], () => r(require('@/pages/home/category-list')), 'categoryList');
// 路由配置
const routes = [
	{
		path: '/',
		name: '主页',
		component: home,
		children:[
			{
				path: '/home/my',
				name: '我的账户',
				component: my
			},{
				path: '/home/notes-list/:id',
				name: '笔记列表',
				component: notesList
			},
			{
				path: '/home/category-list',
				name: '分类列表',
				component: categoryList
			},
			{
				path: '/home/notes-remove-list',
				name: '废纸篓列表',
				component: notesRemoveList
			}
		]
	},
	{
		path: '/register',
		name: '注册',
		component: register
	},
	{
		path: '/login/oauth2/callback/:clientId',
		name: 'Oauth2回调注册',
		component: oauth2Callback
	},
	{
		path: '/login',
		name: '登录',
		component: login
	}
]

const router = new Router({
	mode: 'history',
    routes 
})

export default router