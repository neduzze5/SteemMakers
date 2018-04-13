import Vue from "vue";
import VueRouter from 'vue-router';

Vue.use(VueRouter);

import HelloComponent from "./components/hello.vue";
import {createPostHtml} from "./utils/utils";

var router = new VueRouter({
	mode: 'history',
	routes: []
});

let v = new Vue({
	router,
	el: "#app",
	template: `
		<div v-html="HTMLcontent">
		</div>
	`,
	data: function ()
	{
		return {
			HTMLcontent: '<p>Loading...<p>'
		}
	},
	created: function ()
	{
		this.ProcessLogin();
	},
	methods: {
		ProcessLogin()
		{
			createPostHtml(this.$route.query.author, this.$route.query.permlink, (error, body) =>
			{
				this.HTMLcontent = body;
			});
		}
	}
});