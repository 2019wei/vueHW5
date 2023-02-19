const {createApp} = Vue;


const apiUrl = 'https://vue3-course-api.hexschool.io/v2';
const apiPath = 'pororo03-api';

const prodcutModal ={
  props:['id'],
  data(){
    return{
      modal:{},
      tempProduct:{},
    };
  },
  template: '#userProductModal',
  watch:{
    id(){
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
  }
}

const app = createApp({
  data() {
    return {
      products:[],
      productId:''
    };
  },
  methods: {
    getProducts(){
      axios.get(`${apiUrl}/api/${apiPath}/products/all`)
      .then(res =>{
        console.log(res);
        this.products = res.data.products
      })
    },
    openModal(id){
      this.productId = id;
      console.log(id)
    }
  },
  components:{
    prodcutModal,
  },
  mounted() {
    this.getProducts();
  },
});

app.mount('#app');


