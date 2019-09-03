# data-table

## Table Attributes

<table>
    <tr>
        <th>参数</th>
        <th>说明</th>
        <th>类型</th>
        <th>可选值</th>  
        <th>默认值</th>  
    </tr>
    <tr>
        <td>data</td>
        <td>要显示的数据</td>
        <td>Array</td>
        <td>—</td>
        <td>—</td>
    </tr>
    <tr>
        <td>loading</td>
        <td>加载</td>
        <td>Boolean</td>
        <td>—</td>
        <td>false</td>
    </tr>
    <tr>
        <td>getSummaries</td>
        <td>表位合计行</td>
        <td>Function</td>
        <td>—</td>
        <td>—</td>
    </tr>
    <tr>
        <td>option</td>
        <td>table属性</td>
        <td>Object</td>
        <td>—</td>
        <td>—</td>
    </tr>
    <tr>
        <td>operBut</td>
        <td>操作按钮</td>
        <td>Array</td>
        <td>—</td>
        <td>—</td>
    </tr>
    <tr>
        <td>pagination</td>
        <td>分页插件</td>
        <td>Object</td>
        <td>—</td>
        <td>—</td>
    </tr>
    <tr>
        <td>objectSpanMethod</td>
        <td>合并行或列的计算方法</td>
        <td>Function({ row, column, rowIndex, columnIndex })</td>
        <td>—</td>
        <td>—</td>
    </tr>
</table>

## option Attributes

<table>
    <tr>
        <th>参数</th>
        <th>说明</th>
        <th>类型</th>
        <th>可选值</th>  
        <th>默认值</th>  
    </tr>
    <tr>
        <td>hasMergeRowOrColumn</td>
        <td>是否合并单元格</td>
        <td>Boolean</td>
        <td>—</td>
        <td>false</td>
    </tr>
    <tr>
        <td>hasShowSummary</td>
        <td>是否显示表位合计行</td>
        <td>Boolean</td>
        <td>—</td>
        <td>false</td>
    </tr>
    <tr>
        <td>border</td>
        <td>是否带有纵向边框，默认为false</td>
        <td>Boolean</td>
        <td>—</td>
        <td>false</td>
    </tr>
    <tr>
        <td>hasIndex</td>
        <td>有无行数</td>
        <td>Boolean</td>
        <td>—</td>
        <td>false</td>
    </tr>
    <tr>
        <td>hasSelect</td>
        <td>有无选中功能</td>
        <td>Boolean</td>
        <td>—</td>
        <td>false</td>
    </tr>
    <tr>
        <td>hasOperation</td>
        <td>有无操作功能</td>
        <td>Boolean</td>
        <td>—</td>
        <td>false</td>
    </tr>
    <tr>
        <td>hasExpand</td>
        <td>有无展开行功能</td>
        <td>Boolean</td>
        <td>—</td>
        <td>false</td>
    </tr>
    <tr>
        <td>rowKey</td>
        <td>行数据的 Key，用来优化 Table 的渲染；在使用 reserve-selection 功能与显示树形数据时，该属性是必填的。类型为 String 时，支持多层访问：user.info.id，但不支持 user.info[0].id，此种情况请使用 Function。</td>
        <td>Function(row)/String</td>
        <td>—</td>
        <td>—</td>
    </tr>
    <tr>
        <td>defaultExpandAll</td>
        <td>是否默认展开所有行，当 Table 包含展开行存在或者为树形表格时有效</td>
        <td>Boolean</td>
        <td>—</td>
        <td>false</td>
    </tr>
    <tr>
        <td>lazy</td>
        <td>是否懒加载子节点数据</td>
        <td>Boolean</td>
        <td>—</td>
        <td>false</td>
    </tr>
    <tr>
        <td>load</td>
        <td>加载子节点数据的函数，lazy 为 true 时生效，函数第二个参数包含了节点的层级信息</td>
        <td>Function(row, treeNode, resolve)</td>
        <td>—</td>
        <td>—td>
    </tr>
    <tr>
        <td>treeProps</td>
        <td>渲染嵌套数据的配置选项</td>
        <td>Object</td>
        <td>—</td>
        <td>{ hasChildren: 'hasChildren', children: 'children' }</td>
    </tr>
    <tr>
        <td>column</td>
        <td>table 列</td>
        <td>Array</td>
        <td>—</td>
        <td>—</td>
    </tr>
    <tr>
        <td>operation</td>
        <td>操作列</td>
        <td>Object</td>
        <td>—</td>
        <td>—</td>
    </tr>
     <tr>
         <td>expands</td>
         <td>展开行的内容</td>
         <td>Array</td>
         <td>—</td>
         <td>{id: '1',label: 'label',prop: 'prop'}</td>
     </tr>
</table>

### option column Attributes

<table>
    <tr>
        <th>参数</th>
        <th>说明</th>
        <th>类型</th>
        <th>可选值</th>  
        <th>默认值</th>  
    </tr>
    <tr>
        <td>id</td>
        <td>—</td>
        <td>String, Number</td>
        <td>—</td>
        <td>1</td>
    </tr>
    <tr>
        <td>label</td>
        <td>显示的标题</td>
        <td>String</td>
        <td>—</td>
        <td>label</td>
    </tr>
    <tr>
        <td>prop</td>
        <td>对应列内容的字段名，也可以使用 property 属性</td>
        <td>String</td>
        <td>—</td>
        <td>—</td>
    </tr>
    <tr>
        <td>className</td>
        <td>当前列标题的自定义类名</td>
        <td>String</td>
        <td>—</td>
        <td>className</td>
    </tr>
    <tr>
        <td>minWidth</td>
        <td>对应列的最小宽度，与 width 的区别是 width 是固定的，min-width 会把剩余宽度按比例分配给设置了 min-width 的列</td>
        <td>String, Number</td>
        <td>—</td>
        <td>80</td>
    </tr>
    <tr>
        <td>align</td>
        <td>对齐方式</td>
        <td>String</td>
        <td>left/center/right</td>
        <td>left</td>
    </tr>
    <tr>
        <td>show</td>
        <td>show有三种值：false隐藏当前列，true常规表格列，template自定义表格列</td>
        <td>Boolean, String</td>
        <td>—</td>
        <td>—</td>
    </tr>
    <tr>
        <td>formatter</td>
        <td>用来格式化内容</td>
        <td>Function(row, column, cellValue, index)</td>
        <td>—</td>
        <td>—</td>
    </tr>
    <tr>
        <td>render</td>
        <td>用来渲染内容</td>
        <td>Function(h, { column, $index })</td>
        <td>—</td>
        <td>—</td>
    </tr>
    <tr>
        <td>newjump</td>
        <td>用来跳转路由</td>
        <td>Function(row, obj, index)</td>
        <td>—</td>
        <td>—</td>
    </tr>
</table>

### option operation Attributes

<table>
    <tr>
        <th>参数</th>
        <th>说明</th>
        <th>类型</th>
        <th>可选值</th>  
        <th>默认值</th>  
    </tr>
    <tr>
        <th>label</th>
        <th>操作列的行首文字</th>
        <th>String</th>
        <th>—</th>  
        <th>操作</th>  
    </tr>
    <tr>
        <th>width</th>
        <th>操作列的宽度</th>
        <th>String, Number</th>
        <th>—</th>  
        <th>200</th>  
    </tr>
    <tr>
        <th>className</th>
        <th>操作列的class名</th>
        <th>String</th>
        <th>—</th>  
        <th>—</th>  
    </tr>
    <tr>
        <th>data</th>
        <th>操作列数据</th>
        <th>Array</th>
        <th>—</th>  
        <th>—</th>  
    </tr>
</table>

#### operation data Attributes

<table>
    <tr>
        <th>参数</th>
        <th>说明</th>
        <th>类型</th>
        <th>可选值</th>  
        <th>默认值</th>  
    </tr>
    <tr>
        <th>id</th>
        <th>按钮循环组件的key值</th>
        <th>String, Number</th>
        <th>—</th>  
        <th>1</th>  
    </tr>
    <tr>
        <th>hasPermit</th>
        <th>是否有权限</th>
        <th>String</th>
        <th>—</th>  
        <th>true</th>  
    </tr>
    <tr>
        <th>disabled</th>
        <th>是否可用</th>
        <th>Function</th>
        <th>disabled(row, index)</th>  
        <th>—</th>  
    </tr>
    <tr>
        <th>type</th>
        <th>类型</th>
        <th>String/Function(row, index)</th>
        <th>—</th>  
        <th>—</th>  
    </tr>
    <tr>
        <th>icon</th>
        <th>图标类名</th>
        <th>String</th>
        <th>—</th>  
        <th>—</th>  
    </tr>
    <tr>
        <th>label</th>
        <th>按钮文字</th>
        <th>String</th>
        <th>—</th>  
        <th>通过</th>  
    </tr>
    <tr>
        <th>method</th>
        <th>点击按钮后触发的父组件事件</th>
        <th>Function</th>
        <th>method(row, index)</th>  
        <th>通过</th>  
    </tr>
    <tr>
        <th>size</th>
        <th>按钮大小</th>
        <th>String</th>
        <th>—</th>  
        <th>mini</th>  
    </tr>
    <tr>
        <th>classname</th>
        <th>按钮的类名</th>
        <th>String</th>
        <th>—</th>  
        <th>show</th>  
    </tr>
</table>

## pagination 分页插件

<table>
    <tr>
        <th>参数</th>
        <th>说明</th>
        <th>类型</th>
        <th>可选值</th>  
        <th>默认值</th>  
    </tr>
    <tr>
        <td>total</td>
        <td>总熟</td>
        <td>Number</td>
        <td>—</td>
        <td>0</td>
    </tr>
    <tr>
        <td>currentPage</td>
        <td>当前页</td>
        <td>Number</td>
        <td>—</td>
        <td>1</td>
    </tr>
    <tr>
        <td>pageSize</td>
        <td>每页显示数量</td>
        <td>Number</td>
        <td>—</td>
        <td>10</td>
    </tr>
</table>
### Events

<table>
    <tr>
        <th>事件名</th>
        <th>说明</th>
        <th>参数</th>  
    </tr>
    <tr>
        <td>handleSearch</td>
        <td>当分页插件改变页数跟每页数量时触发</td>
        <td>pageNum,pageSize</td>
    </tr>   
</table>

### Table Method

<table>
    <tr>
        <th>方法名</th>
        <th>说明</th>
        <th>参数</th>  
    </tr>
</table>

### Table Events

<table>
    <tr>
        <th>事件名</th>
        <th>说明</th>
        <th>参数</th>  
    </tr> 
    <tr>
        <th>onHandleSelectionChange</th>
        <th>当选择项发生变化时会触发该事件</th>
        <th>selection</th>  
    </tr>
    <tr>
        <th>onRowClick</th>
        <th>点击某一行时触发的函数</th>
        <th>{
          row: Row,
          event: Event,
          column: Column
        }</th>  
    </tr>
    <tr>
        <th>handleSearch</th>
        <th>点击某一行时触发的函数</th>
        <th>{pageNum,pageSize}</th>  
    </tr>
</table>
