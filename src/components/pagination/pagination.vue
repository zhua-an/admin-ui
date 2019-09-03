<!--
第一步：
  import pagination from '@/components/pagination/pagination'
  components: { 
    pagination 
  }
第二步：
  <pagination
    :total="page.total"
    @search="search"
  ></pagination>
第三步：
  page: {
    total: 0, // 总页数
    currentPage: 1, // 当前页数
    pageSize: 20, // 每页显示多少条
  }
-->
<template>
  <div class="pagination">
    <el-pagination
        layout="total, sizes, prev, pager, next, slot, jumper"
        :page-sizes="[10, 20, 50, 100, 500]"
        :current-page="currentPage"
        :page-size="pageSize"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        style="margin-top: 20px;text-align: right">
        <el-button :disabled="firstPageBtnDisabled" type="text"  @click="toFirstPage">首页</el-button>
        <el-button :disabled="lastPageBtnDisabled" type="text" class="last-pager" @click="toLastPage">末页</el-button>
    </el-pagination>
    
  </div>
</template>
<script>
  export default {
    name: 'pagination',
    data() {
      return {
        firstPageBtnDisabled: true,
        lastPageBtnDisabled: true,
        lastPageNum: Math.ceil(this.total / this.pageSize)
      }
    },
    props: {
      total: {
        type: Number,
        default: 0
      },
      currentPage: {
        type: Number,
        default: 1
      },
      pageSize: {
        type: Number,
        default: 10
      }
    },
    methods: {
      handleSizeChange(val) {
        this.$emit('handleSearch',{pageNum:this.currentPage,pageSize: val});
      },
      handleCurrentChange(val) {
        this.$emit('handleSearch',{pageNum:val,pageSize: this.pageSize});
      },
      toFirstPage() {
        this.handleCurrentChange(1);
      },
      toLastPage() {
        this.currentPage = this.lastPageNum;
        this.handleCurrentChange(this.lastPageNum);
      }
    }
  }
</script>
<style lang="scss" scoped>
  .pagination {
    padding: 7px;
    border: 1px solid #ebeef5;
    background: #fff;
    text-align: right;
    .first-pager {
      float: left;
    }
    .last-pager {
      float: right;
    }
  }
  
</style>