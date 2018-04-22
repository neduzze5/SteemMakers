<template>
	<div v-html="HTMLcontent">
 	</div>
</template>

<script lang="ts">
	import Vue from "vue";
	import VueRouter from 'vue-router';

	Vue.use(VueRouter);
	import {createPostHtml} from "../utils/utils";

	var router = new VueRouter({
		mode: 'history',
		routes: []
	});

	export default Vue.extend({
		router,
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
</script>