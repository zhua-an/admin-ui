<!-- 
使用：
<data-table 
  :data="table.data" 
  :loading="table.loading" 
  :option="table.option"
  :pagination="table.page"
  @onHandleSelectionChange="onHandleSelectionChange"
  @search="search">
</data-table>
import data-table from '@/components/table/data-table'
components: { data-table }
data() {
   return {
       table: {
         loading: true,
         option: {         // 表格属性
          column: []       // 表格行数据
         },
         data: [],         // 表格内容数据
         page: {
          total: 0, // 总页数
          currentPage: 1, // 当前页数
          pageSize: 20, // 每页显示多少条
        }
       }
   }
}

1、复选框功能 option.hasSelect；默认为false，false为无，true为有，当为true时，通过监听自定义事件'onHandleSelectionChange'并传参来执行复选框更改选中项后的回调函数

2、表格折行功能：option.hasExpand；默认为false，false为无，true为有，当为true时，需要设置table.expands，里面是需要折行显示的数据
  expands: [
    {
      label: '收款人姓名：',
      prop: 'gather_name'
    },
    {
      label: '银行卡号：',
      prop: 'bank_card'
    },
    {
      label: '户行：',
      prop: 'bank'
    }
  ]
 
3、按钮列功能：option.hasOperation；默认为false，false为无，true为有，当为true时，需要设置option.operation，里面是按钮属性数据
  operation: {                    // 操作功能
    label: '操作',                // 操作列的行首文字
    width: '80',                  // 操作列的宽度
    className: '',               // 操作列的class名
    data: [                      // 操作列数据
      {
        label: '删除',                // 按钮文字
        Fun: handleDelete,           // 点击按钮后触发的父组件事件 或者 Fun: (row, index) => { this.handleDelete(row, index) }
        size: 'mini',                // 按钮大小
        id: '1'                     // 按钮循环组件的key值
      }
    ]
  }
只需监听'handleDelete'事件即可执行按钮回调函数，label是按钮名称，size是element-ui中button组件控制按钮大小的属性

4、自定义列功能：option.column[index].show；默认为true，show有三个值，true时，是普通表格列展示，false时，此列不展示，template时是自定义列。为template时，使用如下例：

    <v1-table :table="dataList" @onHandleSelectionChange="handleSelectionChange" @handleSync="handleSync" @handleoperate="handleoperate">
      <template slot-scope="props" slot="username">
        <a class="template-username" :href="'/#/bombscreen?mobile=' + props.obj.row.id" target="_blank">{{ props.obj.row.username }}</a>
      </template>
    </v1-table>

  {
    id: '1',
    label: '用户名',
    prop: 'username',
    show: 'template',
    className: 'username'
  }

4、表位合计行：option.hasShowSummary：默认为false，false为无，true为有，当为true时，需要设置table.getSummaries属性，此属性值为函数，可传一个参数，参数为当前表格的列组成的数组，此属性最中return一个数组，即为合计行最终显示的数据，使用例子如下
data() {
     return {
         option: {
              column: [],
              hasShowSummary: true
         },
         data: [],
         getSummaries() {
              return ['合计', 'N/A', '2', '41']
        }
     }
}

5、点击表格行事件：在父组件监听rowClick事件即可，此函数接受一个参数，包含三个属性，分别是：row：当前点击行数据，column：当前点击单元格所在列的列数据，event：原生事件对象


6、自定义行类名，列类名：在option中设置的className为列类名，在data中设置的class为行类名，行类名的class是一个数组，列类名的className是一个字符串，通过这两个类名，可实现表格中单独某些单元格样式或功能的调整，注意：行类名可在通过ajax获取表格数据成功后的回调函数中去赋值。
7、自定义列宽度，最小宽度：width，minWidth；直接写字符串形式的数字即可，不需要单位

8、加载动画：loading；默认为false，false时为无，true时为有

9、自定义表格边框：border；默认为false，false是为无，true时为有

10、合并单元格：hasMergeRowOrColumn；默认为false，false时为无，true时为有，当为true时，还需要监听自定义事件'onMergeRowOrColumn'，此方法接受一个参数，包含四个属性row，column，rowIndex，columnIndex

11、 column 实例
{
  label: '角色名',
  prop: 'roleName',
  width: '100',
  align: 'center',
  render: (h, params) => {
    return h('el-tag', {
      props: {
        type: params.row.delFlag === 0 ? 'success' : params.row.delFlag === 1 ? 'info' : 'danger'
      }, // 组件的props
      on: {
        click: () => {
          this.a.methods.show(params)
        }
      },
    }, params.row.delFlag === '0' ? '上架' : params.row.delFlag === '1' ? '下架' : '审核中')
  }
},{
  label: '角色名',
  prop: 'roleName',
  width: 200,
  align: 'center',
  formatter: (row, column, index) => {
    return `<span style="white-space: nowrap;color: dodgerblue;">${row.label}</span>`
  }
},{
  label: '角色名',
  prop: 'roleName',
  width: 100,
  align: 'center',
  formatter: (row, column, index) => {
    return `<a href="www.baidu.com">${row.roleName}</a>`
  }
},{
  label: '角色名',
  prop: 'roleName',
  width: 300,
  align: 'center',
  newjump: (row, columns, index) => {
    return `www.baidu.com?name=${row.name}&address=${row.address}`
  }
}
-->

<template>
  <div class="v1-table">
    <template>
      <!-- table中间button eg:导出 -->
      <div v-if="operBut && operBut.length > 0" class="btn-operates">
        <span v-for="(item, index) in operBut" :key="index">
          <a v-if="checkPermission(item.hasPermit)"
            :href="item.href || null"
            @click="item.method()"
          >
            <el-button type="primary">{{item.title}}</el-button>
          </a>
        </span>
      </div>
      <el-table
        ref="v1table"
        v-loading="loading"
        :data="data"
        :border="option.border"
        :show-summary="option.hasShowSummary"
        :summary-method="getSummaries"
        :row-key="option.rowKey"
        :default-expand-all="option.defaultExpandAll"
        :lazy="option.lazy"
        :load="option.lazy ? option.load : undefined"
        :tree-props="option.treeProps"
        tooltip-effect="dark"
        :style="!operBut ? 'width: 100%' : 'width: 100%; margin-top: 10px;'"
        :row-class-name="rowClassName"
        :span-method="objectSpanMethod"
        header-row-class-name="thClassName"
        @selection-change="handleSelectionChange"
        @row-click="rowClick">
        <el-table-column
          v-if="option.hasIndex"
          type="index"
          width="50">
        </el-table-column>
        <el-table-column
          v-if="option.hasSelect"
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column type="expand" v-if="option.hasExpand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item :label="item.label ? item.label : 'label'" v-for="(item,index) in option.expands" :key="index">
                <span>{{ props.row[item.prop] }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <template v-for="(item,index) in option.column">
          <el-table-column
            :label="item.label ? item.label : 'label'"
            :prop="item.prop"
            :class-name="item.className"
            :key="item.id ? item.id : index"
            :align="item.align ? item.align : 'left'"
            :width="item.width"
            :min-width="item.minWidth ? item.minWidth : 80" >
            <template slot-scope="scope">
              <template v-if="item.show !== false">
                <template v-if="item.show === 'template'">
                  <slot :name="item.prop" :obj="scope"></slot>
                </template>
                <template v-else-if="item.render">
                  <render :column="item" :row="scope.row" :render="item.render" :index="index"></render>
                </template>
                <template v-else-if="item.formatter">
                  <span v-html="item.formatter(scope.row, item, scope.$index)"></span>
                </template>
                <template v-else-if="item.newjump">
                  <router-link
                    target="_blank"
                    class="newjump"
                    :to="item.newjump(scope.row, item, scope.$index)"
                  >{{scope.row[item.prop]}}</router-link>
                </template>
                <template v-else>
                  <span>{{scope.row[item.prop]}}</span>
                </template>
              </template>
            </template>
          </el-table-column>
        </template>
        <el-table-column
          column-key="operation"
          v-if="option.hasOperation"
          :label="option.operation.label"
          :align="option.operation.align"
          :width="option.operation.width ? option.operation.width : ''"
          :min-width="option.operation.minWidth ? option.operation.minWidth : ''"
          :class-name="option.operation.className">
          <template slot-scope="scope">
            <span v-for="(item,index) in option.operation.data" :key="item.id ? item.id : index">
              <el-button
                v-if="checkPermission(item.hasPermit)"
                :class="item.classname ? item.classname : ''"
                :type="item.type ? item.type : ''"
                :icon="item.icon ? item.icon : ''"
                :size="item.size ? item.size : 'mini'"
                :disabled="item.disabled && item.disabled(scope.row, scope.$index)"
                @click.native.prevent="item.method(scope.row, scope.$index)">
                {{ getObjType(item.label)  === 'string' ? item.label : item.label(scope.row) }}
              </el-button> {{option.operation.data.length >= 2 ? '&nbsp;' : ''}}
            </span>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-if="pagination"
        :total="pagination.total"
        :currentPage="pagination.currentPage"
        :pageSize="pagination.pageSize"
        @handleSearch="handleSearch"
      ></pagination>
    </template>
  </div>
</template>
 
<script>
  import pagination from '@/components/pagination/pagination'
  export default {
    name: 'recordlist',
    components: { 
      pagination,
      render: {
        functional: true,
        props: {
          row: Object,
          render: Function,
          index: Number,
          column: {
            type: Object,
            default: null
          }
        },
        render: (h, opt) => {
          const params = {
            row: opt.props.row,
            index: opt.props.index
          };
          if (opt.props.column) params.column = opt.props.column;
          return opt.props.render(h, params);
        }
      }
    },
    props: {
      operBut: {                            // table中间button
        type: Array,
        default() {
          return []
        }
      },
      loading: {                              // 加载中动画
        type: Boolean,
        default: false
      },
      option: {
        type: Object,
        default() {
          return {
            hasMergeRowOrColumn: {            // 是否合并单元格
              type: Boolean,
              default: false
            },
            hasShowSummary: {                 // 是否显示表位合计行
              type: Boolean,
              default: false
            },
            border: {                         // 是否带有纵向边框，默认为false
              type: Boolean,
              default: false
            },
            hasIndex: {                       // 有无行数
              type: Boolean,
              default: false
            },
            hasSelect: {                      // 有无选中功能
              type: Boolean,
              default: false
            },
            hasOperation: {                   // 有无操作功能
              type: Boolean,
              default: false
            },
            hasExpand: {                      // 有无展开行功能
              type: Boolean,
              default: false
            },
            rowKey: {                         // 行数据的 Key，用来优化 Table 的渲染；在使用 reserve-selection 功能与显示树形数据时，该属性是必填的。
              type: [Function, String]        // 类型为 String 时，支持多层访问：user.info.id，但不支持 user.info[0].id，此种情况请使用 Function。Function(row)/String
            },
            defaultExpandAll: {               // 是否默认展开所有行，当 Table 包含展开行存在或者为树形表格时有效
              type: Boolean,
              default: false
            },
            lazy: {                           // 是否懒加载子节点数据
              type: Boolean,
              default: false
            },
            load: {                           // 加载子节点数据的函数，lazy 为 true 时生效，函数第二个参数包含了节点的层级信息 Function(row, treeNode, resolve)
              type : Function,
              default: function(row, treeNode, resolve) {
                resolve([])
              }
            },
            treeProps: {                      // 渲染嵌套数据的配置选项	
              type: Object,
              default() {
                return { 
                  hasChildren: 'hasChildren', 
                  children: 'children' 
                }
              }
            },
            column: {
              type: Array,
              default () {
                return [                       // 表头数据 —— className:列的class名
                  {
                    id: {                     
                      type: [String, Number],
                      default: '1' 
                    },
                    label: {                     
                      type: String,
                      default: 'label' 
                    },
                    prop: {                     
                      type: String,
                      default: 'prop' 
                    },
                    className: {                     
                      type: String,
                      default: 'className' 
                    },
                    minWidth: {                     
                      type: [String, Number],
                      default: 80
                    },
                    align: {                     
                      type: String,
                      default: 'left'
                    },
                    show: {
                      type: [Boolean, String],
                      default: true
                    },            
                    // show有三种值：false隐藏当前列，true常规表格列，template自定义表格列
                    //          <template slot-scope="props" slot="example">
                    //                <a class="list-a" target="_blank" :href="'/#/bombscreen?mobile=' + props.obj.row.mobile">{{ props.obj.row.username }}</a>
                    //          </template>
                    formatter: {                            // 	用来格式化内容
                      type : Function,
                      default: function(row, column, cellValue, index) {
                        return cellValue
                      }
                    },
                    newjump: {                              // 用来跳转路由  function(row, obj, index)
                      type : Function,
                      default: function(row, obj, index) {
                        return '#'
                      }
                    }
                  }
                ]
              }
            },
            operation: {
              type: Object,
              default () {
                return {                            // 操作功能
                  label: {                          // 操作列的行首文字
                    type: String,
                    default: '操作' 
                  },                
                  width: {                         // 操作列的宽度
                    type: [String, Number],
                    default: 200
                  },                
                  className: {                     // 操作列的class名
                    type: String, 
                    default: '' 
                  },               
                  data: [                          // 操作列数据
                    {
                      id: {                        // 按钮循环组件的key值
                        type: [String, Number],
                        default: '1' 
                      },                           
                      hasPermit: {                 // 是否有权限
                        type: String,
                        default: ''
                      },
                      disabled: {                  // 是否可用
                        type : Function
                      },        
                      type: {                      // 类型
                        type: String,
                        default: '' 
                      },                    
                      icon: {                      // 图标类名
                        type: String,
                        default: '' 
                      },                          
                      label: {                     // 按钮文字
                        type: [String, Function],
                        default: '通过'
                      },               
                      method: {                    // 点击按钮后触发的父组件事件
                        type : Function
                      },         
                      size: {                      // 按钮大小
                        type: String,
                        default: 'mini'
                      },
                      classname: {                 // 按钮的类名
                        type: String,
                        default: 'show'
                      }           
                    }
                  ]
                }
              }
            },
            expands: {
              type: Array,
              default () {
                return [                            // 展开行数据
                  {
                    id: '1',
                    label: 'label',
                    prop: 'prop'
                  }
                ]
              }
            }
          }
        }
      },
      pagination: {                     // 分页，不传则不显示
        type: Object,
        default() {
          return {
            total: {                      
              type: Number,
              default() {
                return 0
              }
            },
            currentPage: {
              type: Number,
              default() {
                return 1
              }
            },
            pageSize: {
              type: Number,
              default() {
                return 10
              }
            }
          }
        }
      },
      data: {
        type: Array,
        default () {
          return []                    // 表格数据 —— 如需添加行class，处理数据时则需要传入class名， class需为数组
        }
      },
      getSummaries: {
        type: Function,
        default (param) {                    // 自定义表位合计行数据
          // *** 此函数传入param参数
          console.log(param)
          // *** 最后返回一个数组，合计行会显示数组中的内容
          return []
        }
      }
    },
    methods: {
      handleSelectionChange(val) {
        this.$emit('onHandleSelectionChange', val);
      },
      objectSpanMethod({ row, column, rowIndex, columnIndex }) {
        if (!this.hasMergeRowOrColumn) {
          return
        } else {
          this.$emit('onMergeRowOrColumn', { row, column, rowIndex, columnIndex });
        }
      },
      // 点击某一行时触发的函数
          // *** 按下左键然后移动鼠标到其它列放开左键，会有报错 -- 优化：添加点击行参数，
      rowClick(Row, Event, Column) {
        if (!Column || Column.type === 'selection' || Column.columnKey === 'operation' || Column.type === 'expand') {
          return
        }
        const data = {
          row: Row,
          event: Event,
          column: Column
        };
        this.$emit('onRowClick', data)
      },
      // 行类名的回调函数
      // 在表格数据中添加class字段即为表格行类名，配合css可对表格行中的自定义标签进行样式优化
      rowClassName(rowdata) {
        const data = this.data;
        let className = data[rowdata.rowIndex] ? (data[rowdata.rowIndex].class ? data[rowdata.rowIndex].class : '') : '';
        if (className.length === 0) {
          return
        }
        className = className.join(' ');
        return className
      },
      handleSearch(page) {
        this.$emit('handleSearch', page)
      },
      getObjType(obj) {
        var toString = Object.prototype.toString
        var map = {
          '[object Boolean]': 'boolean',
          '[object Number]': 'number',
          '[object String]': 'string',
          '[object Function]': 'function',
          '[object Array]': 'array',
          '[object Date]': 'date',
          '[object RegExp]': 'regExp',
          '[object Undefined]': 'undefined',
          '[object Null]': 'null',
          '[object Object]': 'object'
        }
        if (obj instanceof Element) {
          return 'element'
        }
        return map[toString.call(obj)]
      }
    }
  }
</script>

<style lang="scss">
  .v1-table {
    padding: 10px 0;
    .btn-operates {
      a {
        color: #fff;
        text-decoration: none;
        display: inline-block;
      }
    }
    .newjump {
      text-decoration: none;
      color: dodgerblue;
    }
  }
</style>