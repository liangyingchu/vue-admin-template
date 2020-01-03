<template>
    <transition :name="transitionName">
        <div
            v-show="visible"
            :style="customStyle"
            class="back-to-ceiling"
            @click="backToTop"
        >
            <svg-icon
                icon-class="arrow-up"
                class-name="svg-icon-arrow-up"
            />
        </div>
    </transition>
</template>

<script>
    export default {
        name: 'BackToTop',
        props: {
            visibilityHeight: {
                type: Number,
                default: 400
            },
            backPosition: {
                type: Number,
                default: 0
            },
            transitionName: {
                type: String,
                default: 'fade'
            },
            customStyle: {
                type: Object,
                default: function() {
                    return {
                        width: '40px',
                        height: '40px',
                        'line-height': '45px',
                        right: '50px',
                        bottom: '50px',
                        'border-radius': '4px',
                        background: '#e7eaf1'
                    }
                }
            }
        },
        data() {
            return {
                visible: false,
                interval: null,
                isMoving: false
            }
        },
        mounted() {
            window.addEventListener('scroll', this.handleScroll)
        },
        beforeDestroy() {
            window.removeEventListener('scroll', this.handleScroll)
            if(this.interval) {
                clearInterval(this.interval)
            }
        },
        methods: {
            easeInOutQuad(t, b, c, d) {
                if ((t /= d / 2) < 1) return c / 2 * t * t + b
                return -c / 2 * (--t * (t - 2) - 1) + b
            },
            backToTop() {
                if (this.isMoving) return
                const start = window.pageYOffset
                let i = 0
                this.isMoving = true
                this.interval = setInterval(() => {
                    const next = Math.floor(this.easeInOutQuad(10 * i, start, -start, 500))
                    if (next <= this.backPosition) {
                        window.scrollTo(0, this.backPosition)
                        clearInterval(this.interval)
                        this.isMoving = false
                    } else {
                        window.scrollTo(0, next)
                    }
                    i++
                }, 16.7)
            },
            handleScroll() {
                this.visible = window.pageYOffset > this.visibilityHeight
            }
        }
    }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
    .back-to-ceiling {
        position: fixed;
        display: inline-block;
        text-align: center;
        cursor: pointer;
        &:hover {
            background: #d5dbe7;
        }
        & .Icon {
            fill: #9aaabf;
            background: none;
        }
    }

    /*transition*/
    .fade-enter,
    .fade-leave-to {
        opacity: 0;
    }

    .fade-enter-active,
    .fade-leave-active {
        transition: opacity .5s;
    }

    .svg-icon-arrow-up {
        width: 18px;
        height: 18px;
        fill: #9aaabf;
        vertical-align: initial;
    }
</style>
