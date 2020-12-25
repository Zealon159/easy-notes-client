import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

// 页面组件
const home = r => require.ensure([], () => r(require('@/pages/home')), 'home');
const hello = r => require.ensure([], () => r(require('@/components/HelloWorld')), 'hello');
const register = r => require.ensure([], () => r(require('@/pages/register')), 'register');
const oauth2Register = r => require.ensure([], () => r(require('@/pages/oauth2-register')), 'oauth2Register');
const oauth2Callback = r => require.ensure([], () => r(require('@/pages/oauth2-callback')), 'oauth2Callback');
const login = r => require.ensure([], () => r(require('@/pages/login')), 'login');

const notesList = r => require.ensure([], () => r(require('@/pages/home/notes-list')), 'notesList');
//const editor = r => require.ensure([], () => r(require('@/pages/editor')), 'editor');

// 路由配置
const routes = [
	{
		path: '/hello',
		name: 'HelloWorld',
		component: hello
	},
	{
		path: '/',
		name: '主页',
		component: home,
		children:[
			{
				path: '/home/notes-list/:id',
				name: '笔记列表',
				component: notesList
			}
		]
	},
	{
		path: '/register',
		name: '注册',
		component: register
	},
	{
		path: '/oauth2-register',
		name: 'Oauth2注册',
		component: oauth2Register
	},
	{
		path: '/login/oauth2/callback/:clientId',
		name: 'oauth2Callback',
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