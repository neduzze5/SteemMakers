import Vue from "vue";
import BlogEntryComponent from "./components/BlogEntry.vue";

let v = new Vue({
    el: "#app",
    template: `
    	<div>
        	<blog-entry-component />
        </div>
    `,
    data: { name: "World" },
    components: {
        BlogEntryComponent
    }
});