const {createApp} = Vue;
const { defineRule, Form, Field, ErrorMessage, configure } = VeeValidate;
const { required, email, min, max } = VeeValidateRules;
const { localize, loadLocaleFromURL } = VeeValidateI18n;

defineRule('required', required);
defineRule('email', email);
defineRule('min', min);
defineRule('max', max);

loadLocaleFromURL('https://unpkg.com/@vee-validate/i18n@4.1.0/dist/locale/zh_TW.json');

configure({
  generateMessage: localize('zh_TW'),
});

const apiUrl = 'https://vue3-course-api.hexschool.io/v2';
const apiPath = 'pororo03-api';

const prodcutModal ={
  props:['id','addToCart','openModal'],
  data(){
    return{
      modal:{},
      tempProduct:{},
      qty:1
    };
  },
  methods:{
    hide(){
      this.modal.hide();
    }
  },
  template: '#userProductModal',
  watch:{
    id(){
      if(this.id == ''){return;}
      axios.get(`${apiUrl}/api/${apiPath}/product/${this.id}`)
      .then(res =>{
        console.log('單一',res);
        this.tempProduct = res.data.product;
        this.modal.show();
      })
    }
  },
  mounted(){
    this.modal = new bootstrap.Modal(this.$refs.modal);
    // this.modal.show()
    this.$refs.modal.addEventListener('hidden.bs.modal' , (event)=>{
      this.openModal('')
    })
  }
}

const app = createApp({
  data() {
    return {
      products:[],
      productId:'',
      cart:{},
      loadingItem: '',
      isLoading:true,
      fullPage:true
    };
  },
  methods: {
    getProducts(){
      axios.get(`${apiUrl}/api/${apiPath}/products/all`)
      .then(res =>{
        console.log(res);
        this.products = res.data.products
        setTimeout(() => this.isLoading = false, 800)
      })
    },
    openModal(id){
      this.productId = id;
      console.log(id)
    },
    addToCart(product_id , qty){
      const data = {
        product_id,
        qty
      };
      axios.post(`${apiUrl}/api/${apiPath}/cart` , {data})
      .then(res =>{
        console.log(res);
        this.$refs.productModal.hide();
        this.getCarts();
      })
    },
    getCarts(){
      axios.get(`${apiUrl}/api/${apiPath}/cart`)
      .then(res =>{
        console.log(res);
        this.cart = res.data.data;

      })
    },
    updateCartProduct(item){
      const data = { 
          product_id: item.product.id,
          qty: item.qty
      };
      this.loadingItem = item.id;
      axios.put(`${apiUrl}/api/${apiPath}/cart/${item.id}`,{data})
      .then(res =>{
        console.log(res);
        this.getCarts();
        this.loadingItem ='';

      })
    },
    deleteCartProduct(item){
      this.loadingItem = item.id;
      axios.delete(`${apiUrl}/api/${apiPath}/cart/${item.id}`)
      .then(res =>{
        console.log(res);
        this.getCarts();
        this.loadingItem ='';
      })
    },
    deleteCartAll(){
      axios.delete(`${apiUrl}/api/${apiPath}/carts`)
      .then(res =>{
        this.getCarts();
      })
    },
    onSubmit(values){
      const data = {
          "user": {
            "name": values['姓名'],
            "email": values['email'],
            "tel": values['電話'],
            "address": values['地址']
          },
          "message": values['留言'] ? values['留言'] : ''
      }

      axios.post(`${apiUrl}/api/${apiPath}/order`, {data})
      .then(res => {
        this.getCarts();
        
        alert(`成功建立訂單，訂單編號：${res.data.orderId}`)
      })
    },
  },
  components:{
    prodcutModal,
  },
  mounted() {
    this.getProducts();
    this.getCarts();
  },
});
app.use(VueLoading.LoadingPlugin);
app.component('loading', VueLoading.Component);
app.component('VForm', VeeValidate.Form);
app.component('VField', VeeValidate.Field);
app.component('ErrorMessage', VeeValidate.ErrorMessage);
app.mount('#app');


