### vue custom components for some Management System


#### Demo

[script tag demo](https://hdpfe.github.io/examples/standalone.html)
[npm install demo](https://hdpfe.github.io/examples/index.html)


#### Usage

```
<script src="hdp-vue-components.js"></script>
```

```
Vue.use(hdpVueComponents.components);
```

Or

```
npm install hdp-vue-components
```

```
import Vue from 'vue';
import hdpVueComponents from 'hdp-vue-components';
Vue.use(hdpVueComponents.components);
```

then

```
<hdp-alert :show.sync="showAlert" class-name="am-modal-sm" :msg="alertMsg" @alert.ok="clickAlertOK"></hdp-alert>
<hdp-ta-text :input-data.sync="textInput2" :config="textConfig"></hdp-ta-text><span>{{textInput2}}</span>
```

component objects can be invoked through hdpVueComponents as well,you can extend them as you wish.
just see `./src/main.js`


#### develop

```
npm run dev
```