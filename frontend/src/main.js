// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import App from "./App";
import router from "./router";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";

import mavonEditor from "mavon-editor";
import "mavon-editor/dist/css/index.css";
// use
mavonEditor.markdownIt.renderer.rules.link_open = function(tokens, idx, options, env, self) {
    return self.renderToken(tokens, idx, options);
};
Vue.config.productionTip = false;
Vue.use(ElementUI);
Vue.use(mavonEditor);

/* eslint-disable no-new */
new Vue({
    el: "#app",
    router,
    components: { App },
    template: "<App/>"
});