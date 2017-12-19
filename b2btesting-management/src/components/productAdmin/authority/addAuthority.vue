<template>
  <div>
    <el-tree
      :data="data2"
      :props="defaultProps"
      show-checkbox
      node-key="id"
      default-expand-all
      ref="tree"
      :expand-on-click-node="false"
      :render-content="renderContent">
    </el-tree>
    <el-dialog title="编辑节点" v-model="dialogFormVisible" >
      <el-form :model="form">
        <el-form-item label="图标" :label-width="formLabelWidth" class="authIcon">
          <el-radio class="radio" v-model="form.icon" label="el-icon-menu"><i class="el-icon-menu"></i></el-radio>
          <el-radio class="radio" v-model="form.icon" label="el-icon-plus"><i class="el-icon-plus"></i></el-radio>
          <el-radio class="radio" v-model="form.icon" label="el-icon-setting"><i class="el-icon-setting"></i></el-radio>
          <el-radio class="radio" v-model="form.icon" label="el-icon-star-on"><i class="el-icon-star-on"></i></el-radio>
          <el-radio class="radio" v-model="form.icon" label="el-icon-view"><i class="el-icon-view"></i></el-radio>
          <el-radio class="radio" v-model="form.icon" label="el-icon-date"><i class="el-icon-date"></i></el-radio>
          <el-radio class="radio" v-model="form.icon" label="el-icon-edit"><i class="el-icon-edit"></i></el-radio>
        </el-form-item>
        <el-form-item label="名称" :label-width="formLabelWidth">
          <el-input v-model="form.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="路由地址" :label-width="formLabelWidth">
          <el-input v-model="form.url" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  let id = 1000;

  export default {
    data() {
      return {
        data2: [
          {
            id: 1,
            icon: 'el-icon-setting',
            name: '学生管理',
            url: 'proAdminStuMange',
            hasChild: 0,
            children: []
          },
          {
            id: 2,
            icon: 'el-icon-setting',
            name: '教师管理',
            url: 'proAdminTeaMange',
            hasChild: 0,
            children: []
          },
          {
            id: 3,
            icon: 'el-icon-menu',
            name: '学生管理',
            url: '',
            hasChild: 1,
            children: [
              {
                id: 4,
                icon: 'el-icon-setting',
                name: '学校管理',
                url: 'schoolMange',
                hasChild: 0,
                children: []
              },
              {
                id: 5,
                icon: 'el-icon-setting',
                name: '添加学校',
                url: 'addSchool',
                hasChild: 0,
                children: []
              }
            ]
          }
        ],
        defaultProps: {
          children: 'children',
          label: 'name'
        },
        dialogFormVisible: false,
        form: {
          icon: '',
          name: '',
          url: '',
        },
        formLabelWidth: '120px',
        radio: 'el-icon-menu',
        submitDate:[]
      }
    },

    methods: {
      append(store, data) {
        console.log(data);
        store.append({id: id++, icon: 'el-icon-setting', name: '请编辑节点信息', url:'', hasChild: 0, children: []}, data);
      },

      remove(store, data) {
        store.remove(data);
      },
      edit(store, data) {
        console.log(this.$refs.tree.children);
        this.form.icon = data.icon
        this.form.name = data.name
        this.form.url = data.url
        this.dialogFormVisible = true
      },
      renderContent(h, { node, data, store }) {
        return (
          <span>
          <span>
          <span>{node.label}</span>
        </span>
        <span style="float: right; margin-right: 20px">
          <el-button size="mini" on-click={ () => this.edit(store, data) }>编辑</el-button>
          <el-button size="mini" on-click={ () => this.append(store, data) }>添加</el-button>
        <el-button size="mini" on-click={ () => this.remove(store, data) }>删除</el-button>
        </span>
        </span>);
      },
    }
  };
</script>
<style>
  .authIcon .radio{
    margin-left: 20px;
  }
</style>
