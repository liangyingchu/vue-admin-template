<template>
    <el-dialog
        :title="title"
        :visible.sync="dialogVisible"
    >
        <el-form
            ref="roleForm"
            :rules="formRules"
            :model="model"
            label-position="right"
            label-width="100px"
        >
            <el-form-item v-if="dialogStatus === 'update'" label="ID">
                <span>{{ model.roleId }}</span>
            </el-form-item>
            <el-form-item label="状态">
                <el-radio-group v-model="model.status">
                    <el-radio :label="1">激活</el-radio>
                    <el-radio :label="0" :disabled="true">禁用</el-radio>
                </el-radio-group>
            </el-form-item>

            <el-form-item label="地区">
                <el-checkbox-group v-model="model.regionId">
                    <el-checkbox
                        v-for="item in regions"
                        :key="item.id"
                        :label="item.id"
                    >{{ item.regionName }}</el-checkbox>
                </el-checkbox-group>
            </el-form-item>

            <el-form-item label="角色名称" prop="roleName">
                <el-input v-model="model.roleName"/>
            </el-form-item>
            <el-form-item label="描述">
                <el-input v-model="model.remark" type="textarea"/>
            </el-form-item>
        </el-form>
        <div slot="footer">
            <el-button @click.native="dialogVisible = false">取消</el-button>
            <el-button type="primary" @click.native="dialogStatus === 'create' ? createRole() : updateRole()">确定</el-button>
        </div>
    </el-dialog>
</template>

<script>
    import { parseTime } from '@/utils/index'
    import {
        fetchRegionList, saveRole, updateRole
    } from '@/api/authority'

    export default {
        name: 'RoleFormDialog',
        props: {
            visible: {
                required: true,
                type: Boolean
            },
            dialogStatus: {
                type: String,
                default: 'create'
            },
            model: {
                required: true,
                type: Object
            }
        },
        created() {
            this.fetchRegionData()
        },
        data() {
            return {
                regions: [],
                formRules: {
                    roleName: [{ required:true, message: '请输入角色名称', trigger: 'blur' }]
                }
            }
        },
        computed: {
            dialogVisible: {
                get() {
                    return this.visible
                },
                set(val) {
                    this.$emit('update:visible', val)
                }
            },
            title() {
                const textMap = {
                    update: '编辑角色',
                    create: '创建角色'
                }
                return textMap[this.dialogStatus]
            }
        },

        methods: {
            fetchRegionData() {
                fetchRegionList().then(response => this.regions = response.regions)
            },

            saveRole() {
                this.$refs['roleForm'].validate(valid => {
                    if(valid) {
                        const createTime = parseTime(new Date(), '{y}-{m}-{d} {h}:{i}:{s}')
                        const body = Object.assign(this.model, {createTime})
                        saveRole(body).then(data => {
                            console.log(data)
                            this.$message({
                                type: 'success',
                                message: 'success',
                                duration: 5 * 1000
                            })
                            this.$emit('refresh')
                            this.dialogVisible = false
                        })
                    }
                })
            },
            updateRole() {
                this.$refs['roleForm'].validate(valid => {
                    if(valid) {
                        const createTime = parseTime(new Date(), '{y}-{m}-{d} {h}:{i}:{s}')
                        const body = Object.assign(this.model, {createTime})
                        updateRole(body).then(data => {
                            console.log(data)
                            this.$message({
                                type: 'success',
                                message: 'success',
                                duration: 5 * 1000
                            })
                            this.$emit('refresh')
                            this.dialogVisible = false
                        })
                    }
                })
            },

            resetModel() {
                this.$emit('update:model', {
                    roleId: 0,
                    roleName: '',
                    remark: '',
                    status: 1,
                    regionId: []
                })
            },
            resetValidate() {
                this.$refs['roleForm'].clearValidate()
            }
        }
    }
</script>

<style scoped>
</style>
