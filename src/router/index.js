import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

// 页面组件
const home = (resolve) => require(['@/pages/home.vue'], resolve)
const my = (resolve) => require(['@/pages/home/my.vue'], resolve)
const register = (resolve) => require(['@/pages/register.vue'], resolve)
const oauth2Callback = (resolve) => require(['@/pages/oauth2-callback.vue'], resolve)
const login = (resolve) => require(['@/pages/login.vue'], resolve)
const notesList = (resolve) => require(['@/pages/home/notes-list.vue'], resolve) 
const notesRemoveList = (resolve) => require(['@/pages/home/notes-remove-list.vue'], resolve) 
const categoryList = (resolve) => require(['@/pages/home/category-list.vue'], resolve)
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

const router = new VueRouter({
	mode: 'history',
    routes 
})

export default router