<template>
  <div class="task">
    <basic-container>
      <el-row>
        <Search 
          :tableSearch="tableSearch"
          @handleSearch="handleSearch"
        />
      </el-row>
      <data-table 
        :data="table.data"
        :loading="table.loading" 
        :option="table.option"
        :pagination="table.page"
        @onHandleSelectionChange="onHandleSelectionChange"
        @handleSearch="handleSearch">
      </data-table>
      <el-dialog
        :title="title"
        :close-on-click-modal="false"
        :visible.sync="dialogVisible"
        width="45%">
          <el-form :model="form" :label-position="right" ref="form" label-width="100px">
            <el-row>
               <el-col span="12">
                <el-form-item label="作业名称"
                          prop="jobName">
                  <el-input v-model="form.jobName"
                            disabled ></el-input>
                </el-form-item>
               </el-col>
               <el-col span="12">
                 <el-form-item label="任务名称"
                          prop="taskId">
                  <el-input v-model="form.taskId"
                            disabled ></el-input>
                </el-form-item>
               </el-col>
            </el-row>
            <el-row>
               <el-col span="12">
                 <el-form-item label="服务器IP"
                          prop="slaveId">
                  <el-input v-model="form.slaveId"
                            disabled ></el-input>
                </el-form-item>
               </el-col>
               <el-col span="12">
                 <el-form-item label="分片项"
                          prop="shardingItem">
                  <el-input v-model="form.shardingItem"
                            disabled ></el-input>
                </el-form-item>
               </el-col>
            </el-row>
            <el-row>
               <el-col span="12">
                 <el-form-item label="状态"
                          prop="state">
                  <el-input v-if="form.state == 'TASK_STAGING'" value="准备中"
                            disabled ></el-input>
                  <el-input v-if="form.state == 'TASK_RUNNING'" value="执行中"
                            disabled ></el-input>
                  <el-input v-if="form.state == 'TASK_FINISHED'" value="任务完成"
                            disabled ></el-input>
                  <el-input v-if="form.state == 'TASK_KILLED'" value="任务杀死"
                            disabled ></el-input>
                  <el-input v-if="form.state == 'TASK_LOST'" value="任务丢失"
                            disabled ></el-input>
                  <el-input v-if="form.state == 'TASK_FAILED'" value="执行失败"
                            disabled ></el-input>
                  <el-input v-if="form.state == 'TASK_ERROR'" value="任务错误"
                            disabled ></el-input>
                </el-form-item>
               </el-col>
               <el-col span="12">
                 <el-form-item label="创建时间"
                          prop="creationTime">
                  <el-input v-model="form.creationTime"
                            disabled ></el-input>
                </el-form-item>
               </el-col>
            </el-row>
            <el-row>
               <el-col span="24">
                 <el-form-item label="相关信息"
                          prop="message">
                  <el-input v-model="form.message"
                            disabled ></el-input>
                </el-form-item>
               </el-col>
            </el-row>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">确 定</el-button>
          </span>
        </el-dialog>
    </basic-container>
  </div>
</template>

<script>
  import Search from '@/components/search/search'
  import DataTable from '@/components/table/data-table'
  import {delTrace, queryTracePage} from '@/api/monitor/task'

  export default {
    name: 'task_log_page',
    components: {
      Search,
      DataTable
    },
    data() {
      return {
        title: '',
        dialogVisible: false,
        form: {
          jobName: undefined,
          slaveId: undefined,
          source: undefined,
          originalTaskId: undefined,
          taskId: undefined,
          shardingItem: undefined,
          executionType: undefined,
          state: undefined,
          message: undefined,
          creationTime: undefined
        },
        checkedData: [],
        searchForm: {
          jobName: '',
          state: '',
        },
        tableSearch: [
          {
            label: '作业名称',
            value: 'jobName'
          },
          {
            type: 'select',
            label: '状态',
            value: 'state',
            children: [{
              label: '准备中',
              value: 'TASK_STAGING'
            },{
              label: '执行中',
              value: 'TASK_RUNNING'
            },{
              label: '任务完成',
              value: 'TASK_FINISHED'
            },{
              label: '任务杀死',
              value: 'TASK_KILLED'
            },{
              label: '任务丢失',
              value: 'TASK_LOST'
            },{
              label: '执行失败',
              value: 'TASK_FAILED'
            },{
              label: '任务错误',
              value: 'TASK_ERROR'
            }]
          }
        ],
        table: {
          loading: true,
          option: {
            hasIndex: true,
            hasSelect: true,
            hasOperation: true,
            border: true,
            rowKey: 'id',
            column: [
              {
                label: '作业名称',
                prop: 'jobName',
                // width: '180',
                align: 'center'
              },{
                label: '服务器IP',
                prop: 'slaveId',
                // width: '300',
                align: 'center'
              },{
                label: '分片项',
                prop: 'shardingItem',
                width: '150',
                align: 'center'
              },{
                label: '状态',
                prop: 'state',
                width: '150',
                align: 'center',
                formatter: function(row, column, cellValue, index) {
                  if(row.state == 'TASK_STAGING') {
                    return '准备中'
                  }
                  if(row.state == 'TASK_RUNNING') {
                    return '执行中'
                  }
                  if(row.state == 'TASK_FINISHED') {
                    return '任务完成'
                  }
                  if(row.state == 'TASK_KILLED') {
                    return '任务杀死'
                  }
                  if(row.state == 'TASK_LOST') {
                    return '任务丢失'
                  }
                  if(row.state == 'TASK_FAILED') {
                    return '执行失败'
                  }
                  if(row.state == 'TASK_ERROR') {
                    return '任务错误'
                  }
                  return row.state
                }
              },{
                label: '创建时间',
                prop: 'creationTime',
                width: '200',
                align: 'center'
              }
            ],
            operation: {            
              label: '操作',               
              width: '180',               
              align: 'center',     
              data: [
                {
                  type: 'primary',
                  hasPermit: 'task_trace_info',
                  label: '详情',
                  method: this.handleInfo,  
                  id: '2'                     
                }, {
                  type: 'danger',
                  hasPermit: 'task_trace_del',
                  label: '删除',
                  method: this.handleDelete,  
                  id: '2'                     
                }
              ]
            }
          },
          data: [],
          page: {
            total: 0, 
            currentPage: 1, 
            pageSize: 20, 
          }
        }
      }
    },
    created() {
      this.getList()
    },
    methods: {
      getList() {
        this.table.loading = true
        let data = {
          current: this.table.page.currentPage,
          size: this.table.page.pageSize
        }
        data = Object.assign({}, data, this.searchForm)
        queryTracePage(data).then(response => {
          this.table.data = response.data.data.records
          this.table.page.total = response.data.data.total
          this.checkedData = []
          this.table.loading = false
        }).catch(err => {
          this.checkedData = []
          this.table.loading = false
        })
      },
      handleSearch(page) {
        if (page) {
          this.searchForm = page
          if(page.pageNum) {
            this.table.page.currentPage = page.pageNum
            this.table.page.pageSize = page.pageSize
          }
        }
        this.getList()
      },
      handleInfo(row, index) {
        this.title = '详情'
        this.form = row
        this.dialogVisible = true
      },
      handleDelete(row, index) {
        this.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delTrace(row.id).then(() => {
            this.getList()
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 2000
            })
          })
        })
      },
      onHandleSelectionChange(data) {
        this.checkedData = data
      }
    }
  }
</script>
<style lang="scss">
  .task {
    height: 100%;
  }
</style>
