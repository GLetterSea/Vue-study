<template>
  <div id="shoppingCar">
    <div v-if="books.length">
      <table>
        <thead>
          <tr>
            <th></th>
            <th>书籍名称</th>
            <th>出版日期</th>
            <th>价格</th>
            <th>购买数量</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in books" :key="item.id">
            <td>{{ item.id }}</td>
            <td>{{ item.name }}</td>
            <td>{{ item.date }}</td>
            <td>
              <!-- 1. 关于保留后两位小数和'￥' 
                    + 1.1 这种方法也可以, 但不够通用
                      - <td>{{ '￥' + item.price.toFixed(2) }}</td>
                    + 1.2 定义方法
                      - <td>{{ getPrice(item.price) }}</td>
                    + 1.3* 过滤器, 这种方法会更加合适点
                      - <td>{{ item.price | 过滤器 }}</td>
                        过滤器其实是有参数的, 参数就是要过滤的数据, 会自动把'|'前的数据作为参数传入
              -->
              {{ item.price | showPrice }}
              </td>
            <td>
              <button @click="decrement(index)" :disabled="item.count <= 1">-</button>
              {{ item.count }}
              <button @click="increment(index)">+</button>
            </td>
            <td><button @click="removeHandle(index)">移除</button></td>
          </tr>
        </tbody>
      </table>
      <h2>总价格: {{ totalPrice | showPrice }}</h2>
    </div>
    <h2 v-else>购物车为空</h2>
  </div>
</template>

<script>
export default {
  name: 'ShoppingCar',
  data() {
    return {
      books: [
        {
          id: 1,
          name: '《算法导论》',
          date: '2006-9',
          price: 85.00,
          count: 1
        },
        {
          id: 2,
          name: '《UNIX编程艺术》',
          date: '2006-2',
          price: 59.00,
          count: 1
        },
        {
          id: 3,
          name: '《编程珠玑》',
          date: '2008-10',
          price: 39.00,
          count: 1
        },
        {
          id: 4,
          name: '《代码大全》',
          date: '2006-3',
          price: 128.00,
          count: 1
        },
      ]
    }
  },
  methods: {
    getPrice(price) {
      return '￥' + price.toFixed(2)
    },
    decrement(index) {
      this.books[index].count--
    },
    increment(index) {
      this.books[index].count++
    },
    removeHandle(index) {
      this.books.splice(index, 1)
    }
  },
  computed: {
    totalPrice() {
      let totalPrice = 0
      for(let i=0; i<this.books.length; i++) {
        totalPrice += this.books[i].price * this.books[i].count
      }
      return totalPrice
    }
  },
  filters: {
    showPrice(price) {
      return '￥' + price.toFixed(2)
    }
  }
}
</script>

<style>
table {
  border: 1px solid #e9e9e9;
  border-collapse: collapse;
  border-spacing: 0;
}
th, td {
  padding: 8px 16px;
  border: 1px solid #e9e9e9;
  text-align: left;
}
th {
  background-color: #f7f7f7;
  color: #5c6b77;
  font-weight: 600;
}
</style>