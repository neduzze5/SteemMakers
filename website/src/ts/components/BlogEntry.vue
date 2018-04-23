<template>
	<div>
		<div class="post-title">
			<h1>{{Title}}</h1>
		</div>
		<div class="post-meta">
			<span><i>by <a :href="AuthorBlogLink">{{Author}}</a> on {{Created}}</i></span>
		</div>
		<div v-html="HTMLcontent"></div>
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
				Author: '',
				HTMLcontent: '<p>Loading...<p>',
				Title: '',
				Created: '',
			}
		},
		computed:
		{
			AuthorBlogLink() :string
			{
				return 'https://www.steemit.com/@' + this.Author;
			}
		},
		created: function ()
		{
			this.LoadContent();
		},
		methods:
		{
			LoadContent()
			{
				createPostHtml(this.$route.query.author, this.$route.query.permlink, (error, blogEntry) =>
				{
					this.HTMLcontent = blogEntry.body;
					this.Title = blogEntry.title;
					this.Author = blogEntry.author;
					var options = {year: "numeric", month: "long", day: "numeric", hour: '2-digit', minute:'2-digit', hour12: false};
					this.Created = formatDate(blogEntry.created);
				});
			}
		}
	});

	function formatDate(date: Date) :string
	{
		var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];

		var day = date.getDate();
		var monthIndex = date.getMonth();
		var year = date.getFullYear();

		return day + ' ' + monthNames[monthIndex] + ' ' + year + ', ' + date.getHours() + ':' + date.getMinutes();
	}
</script>

<style>
.post-title
{
	padding:20px 10px;
}

.post-meta
{
	border-top: 1px solid #bdbdbd;
	border-bottom: 1px solid #bdbdbd;
	display: block;
	font-size: 13px;
	font-weight: 400;
	line-height: 21px;
	padding: 10px;
	margin-bottom: 10px;
}
</style>