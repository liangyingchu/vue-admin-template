<template>
    <el-dialog
        title="权限分配"
        :visible.sync="dialogVisible"
        custom-class="permission-dialog"
    >
        <el-tree
            v-if="visible"
            ref="tree"
            :data="treeData"
            :show-checkbox="true"
            node-key="menuId"
            :props="treeProps"
            :indent="22"
            :default-checked-keys="selectedIds"
            :default-expand-all="true"
            :check-strictly="false"
        />
        <div slot="footer">
            <el-button @click.native="dialogVisible = false">取消</el-button>
            <el-button type="primary" @click.native="savePermission()">确定</el-button>
        </div>

    </el-dialog>
</template>

<script>
    import { fetchNodeList } from '@/api/authority'
    import { recursiveArrFactory } from '@/utils/index'

    export default {
        name: "DispatchPermissionDialog",
        props: {
            visible: {
                required: true,
                type: Boolean
            },
            roleId: {
                required: true,
                type: [Number, String]
            },
            menuIdList: {
                type: Array,
                default() {
                    return []
                }
            }
        },
        data() {
            return {
                dialogVisible: this.visible,
                list: null,
                treeProps: {
                    label: 'name',
                    children: 'children'
                }
            }
        },
        computed: {
            treeData() {
                if(this.list) {
                    return recursiveArrFactory(this.list, 'menuId', 'parentId')
                }
                return null
            },
            selectedIds() {
                if (!this.list)
                    return []

                this.treeData.forEach(item => {
                    if (item.parentId===0){
                        for (let i=0; i<this.menuIdList.length; i++) {
                            if (this.menuIdList[i]===item.menuId){
                                this.menuIdList.splice(i, 1)
                                break
                            }
                        }
                    }
                })

                return this.menuIdList
            }
        },
        watch: {
            visible(val) {
                this.dialogVisible = val
            },
            dialogVisible(val) {
                this.$emit('update:visible', val)
            }
        },
        created() {
            this.fetchData()
        },
        methods: {
            fetchData() {
                fetchNodeList().then(response => {
                    this.list = response.menuList
                })
            },
            // 保存权限分配
            savePermission() {
                const selects = this.$refs['tree'].getCheckedNodes(false, true)
                if(selects.length > 0) {
                    const menuIdList = selects.map(item => item.menuId)
                    // dispatchPermission({
                    //     roleId: this.roleId,
                    //     menuIdList
                    // }).then(response => {
                        this.$message({
                            type: 'success',
                            message: 'success',
                            duration: 5 * 1000
                        })
                        this.$emit('refresh')
                        this.$emit('update:visible', false)
                    // })
                } else {
                    this.$message({
                        type: 'error',
                        message: '请选择权限节点',
                        duration: 5 * 1000
                    })
                }
            }
        }
    }
</script>

<style rel="stylesheet/scss" lang="scss">
    .permission-dialog {
        .el-dialog__body {
            max-height: 500px;
            overflow-y: scroll;
        }
    }
</style>
