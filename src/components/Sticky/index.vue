<template>
    <div :style="{height: height + 'px', zIndex}">
        <div
            :class="className"
            :style="{
                top: stickyTop + 'px',
                zIndex,
                position,
                width,
                height: height + 'px'
            }"
        >
            <slot>
                <div>sticky</div>
            </slot>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'Sticky',
        props: {
            zIndex: {
                type: Number,
                default: 1
            },
            className: {
                type: String,
                default: ''
            },
            stickyTop: {
                type: Number,
                default: 0
            }
        },
        data() {
            return {
                width: undefined,
                height: undefined,
                position: '',
                active: false,
                isSticky: false
            }
        },
        mounted() {
            // getBoundingClientRect 返回元素的大小及其相对于视口的位置
            this.height = this.$el.getBoundingClientRect().height
            window.addEventListener('scroll', this.handleScroll)
            window.addEventListener('resize', this.handleResize)
        },
        // keep-alive 组件激活时调用
        activated() {
            this.handleScroll()
        },
        destroyed() {
            window.removeEventListener('scroll', this.handleScroll)
            window.removeEventListener('resize', this.handleResize)
        },
        methods: {
            // 粘住固定
            sticky() {
                if(this.active) return
                this.position = 'fixed'
                this.active = true
                this.width = this.width + 'px'
                this.isSticky = true
            },
            // 重置默认（不固定）
            reset() {
                if(!this.active) return
                this.position = ''
                this.active = false
                this.width = 'auto'
                this.isSticky = false
            },
            handleScroll() {
                this.width = this.$el.getBoundingClientRect().width
                const offsetTop = this.$el.getBoundingClientRect().top
                if(offsetTop < this.stickyTop) {
                    this.sticky()
                    return
                }
                this.reset()
            },
            handleResize() {
                if(this.isSticky) {
                    this.width = this.$el.getBoundingClientRect().width + 'px'
                }
            }
        }
    }
</script>

<style scoped>
</style>
