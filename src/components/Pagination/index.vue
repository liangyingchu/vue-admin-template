<template>
    <div class="pagination-container">
        <el-pagination
            :background="background"
            :current-page.sync="currentPage"
            :page-size.sync="pageSize"
            :layout="layout"
            :total="total"
            v-bind="$attrs"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
        />
    </div>
</template>

<script>
    import { scrollTo } from '@/utils/scrollTo'
    export default {
        name: 'Pagination',
        props: {
            total: {
                required: true,
                type: Number
            },
            page: {
                type: Number,
                default: 1
            },
            background: {
                type: Boolean,
                default: true
            },
            limit: {
                type: Number,
                default: 20
            },
            layout: {
                type: String,
                default: 'total, sizes, prev, pager, next, jumper'
            },
            autoScroll: {
                type: Boolean,
                default: true
            }
        },
        computed: {
            currentPage: {
                get() {
                    return this.page
                },
                set(val) {
                    this.$emit('update:page', val)
                }
            },
            pageSize: {
                get() {
                    return this.limit
                },
                set(val) {
                    this.$emit('update:limit', val)
                }
            }
        },
        methods: {
            handleSizeChange(val) {
                this.$emit('pagination', {
                    page: this.currentPage,
                    limit: val
                })
                if(this.autoScroll) scrollTo(0, 800)
            },
            handleCurrentChange(val) {
                this.$emit('pagination', {
                    page: val,
                    limit: this.pageSize
                })
                if(this.autoScroll) scrollTo(0, 800)
            }
        }
    }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
    .pagination-container {
        background: #fff;
        padding: 32px 16px;
        overflow-x: scroll
    }
</style>
