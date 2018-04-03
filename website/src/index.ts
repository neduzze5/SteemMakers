// src/index.ts

import Vue from "vue";
import HelloComponent from "./components/hello.vue";
import {createPostHtml} from "./utils";

let v = new Vue({
    el: "#app",
    template: `
    <div>
        Name: <input v-model="name" type="text">
        <hello-component :name="name" :initialEnthusiasm="5" />
    </div>
    `,
    data: { name: "World" },
	created: function () {
		console.log('koekoek');
		createPostHtml('jefpatat', 'the-blockchain-truth-about-steem-and-dtube');
},
    components: {
        HelloComponent
    }
});